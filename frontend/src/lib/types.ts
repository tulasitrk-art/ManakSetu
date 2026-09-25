export interface NormativeReference {
  is_code: string;
  title: string;
  type?: string;
}

export interface TestMethod {
  is_code: string;
  title: string;
}

export interface QCODetails {
  order_name: string;
  gazette_notification: string;
  enforcement_date: string;
  certification_scheme: string;
  ministry: string;
  penal_action: string;
}

export interface Standard {
  is_code: string;
  standard_number: string;
  part_section?: string;
  title: string;
  year_published?: number;
  reaffirm_year?: number;
  status: 'ACTIVE' | 'SUPERSEDED' | 'WITHDRAWN' | 'REVISED';
  amendments_count: number;
  latest_amendment_date?: string;
  department_division: string;
  section_committee?: string;
  ics_code?: string;
  scope_description: string;
  technical_keywords: string[];
  normative_references: NormativeReference[];
  test_methods: TestMethod[];
  supersedes?: string | null;
  superseded_by?: string | null;
  qco_status: 'MANDATORY_QCO' | 'CRS_COMPULSORY' | 'HALLMARKING' | 'VOLUNTARY' | 'SUPERSEDED';
  qco_details?: QCODetails | null;
  mandatory_cert_scheme?: string | null;
  testing_parameters: string[];
  recommended_tender_clause?: string | null;
}

export interface LifecycleWarning {
  is_code_detected: string;
  status: string;
  superseded_by?: string | null;
  warning_message: string;
  action_required: string;
}

export interface PrimaryRecommendation {
  standard: Standard;
  confidence_score: number;
  relevance_rationale: string;
  exact_code_match: boolean;
  semantic_similarity: number;
  mandatory_order_applied: boolean;
  allied_standards: NormativeReference[];
  test_methods: TestMethod[];
}

export interface RecommendationResponse {
  query_processed: string;
  detected_language: string;
  translated_query?: string | null;
  primary_recommendations: PrimaryRecommendation[];
  lifecycle_warnings: LifecycleWarning[];
  mandatory_qco_flag: boolean;
  mandatory_schemes: string[];
  recommended_tender_clauses: string[];
  knowledge_graph_summary: {
    root_is_code?: string;
    nodes?: Array<{
      id: string;
      label: string;
      type: string;
      status?: string;
      division?: string;
      qco_status?: string;
      mandatory_scheme?: string;
    }>;
    links?: Array<{
      source: string;
      target: string;
      type: string;
      relation_label: string;
    }>;
    edges?: Array<{
      source: string;
      target: string;
      type: string;
      relation_label: string;
    }>;
    total_nodes?: number;
    total_edges?: number;
  };
  processing_time_ms: number;
}

export interface QCOItem {
  qco_id: string;
  order_title: string;
  issuing_ministry: string;
  gazette_number: string;
  notification_date: string;
  effective_date: string;
  certification_scheme: string;
  applicable_standards: Array<{ is_code: string; product_name: string }>;
  exemption_criteria?: string;
  penalty_clause?: string;
}

export interface TenderParseResult {
  filename: string;
  department: string;
  parsed_metadata: {
    tender_reference: string;
    char_count: number;
    word_count: number;
    detected_is_codes: string[];
    extracted_parameters: string[];
    key_clauses_count: number;
    sample_snippet: string;
  };
  lifecycle_warnings: LifecycleWarning[];
  gap_analysis: {
    tender_readiness_score: number;
    readiness_status: 'EXCELLENT' | 'MODERATE_RISK' | 'HIGH_DISPUTE_RISK';
    missing_normative_standards: string[];
    recommended_mandatory_tests: string[];
    statutory_compliance_notices: string[];
  };
  recommended_standards: Array<{
    standard: Standard;
    confidence_score: number;
    exact_code_match: boolean;
    semantic_similarity: number;
  }>;
  compliant_tender_clauses: string[];
  knowledge_graph: any;
  processing_time_ms: number;
}
