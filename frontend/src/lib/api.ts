import { RecommendationResponse, Standard, QCOItem, TenderParseResult } from "./types";

const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const API_BASE_URL = rawUrl.endsWith("/api/v1") ? rawUrl : `${rawUrl.replace(/\/+$/, "")}/api/v1`;

export async function fetchRecommendations(
  query: string,
  language: string = "en",
  includeAllied: boolean = true
): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      language,
      include_allied: includeAllied,
      limit: 6,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch recommendations from backend.");
  }

  return response.json();
}

export async function uploadTenderDocument(
  file: File,
  department?: string
): Promise<TenderParseResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (department) {
    formData.append("department", department);
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to parse tender document.");
  }

  return response.json();
}

export async function fetchAllStandards(params?: {
  division?: string;
  qco_only?: boolean;
  query?: string;
}): Promise<Standard[]> {
  const url = new URL(`${API_BASE_URL}/standards/`);
  if (params?.division) url.searchParams.append("division", params.division);
  if (params?.qco_only) url.searchParams.append("qco_only", "true");
  if (params?.query) url.searchParams.append("query", params.query);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch standards list.");
  }
  return response.json();
}

export async function fetchStandardByCode(isCode: string): Promise<Standard> {
  const response = await fetch(`${API_BASE_URL}/standards/${encodeURIComponent(isCode)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch standard details for ${isCode}.`);
  }
  return response.json();
}

export async function fetchQCOList(params?: {
  ministry?: string;
  scheme?: string;
}): Promise<QCOItem[]> {
  const url = new URL(`${API_BASE_URL}/qco/`);
  if (params?.ministry) url.searchParams.append("ministry", params.ministry);
  if (params?.scheme) url.searchParams.append("scheme", params.scheme);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch QCO orders.");
  }
  return response.json();
}

export async function fetchGraphData(): Promise<{ nodes: any[]; links: any[] }> {
  const response = await fetch(`${API_BASE_URL}/graph/`);
  if (!response.ok) {
    throw new Error("Failed to fetch knowledge graph data.");
  }
  return response.json();
}

export async function fetchGraphNeighborhood(
  isCode: string,
  depth: number = 1
): Promise<any> {
  const url = new URL(`${API_BASE_URL}/graph/neighborhood`);
  url.searchParams.append("is_code", isCode);
  url.searchParams.append("depth", depth.toString());

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch graph neighborhood for ${isCode}.`);
  }
  return response.json();
}
