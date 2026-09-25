"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GraphVisualizer from "@/components/GraphVisualizer";
import { Network, Search, Filter, Layers, ShieldCheck, BookOpen, Loader2 } from "lucide-react";
import { fetchGraphData, fetchGraphNeighborhood } from "@/lib/api";

function GraphViewContent() {
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchCode, setSearchCode] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus");

  useEffect(() => {
    loadGraph();
  }, [focusParam]);

  const loadGraph = async () => {
    setIsLoading(true);
    try {
      if (focusParam) {
        setSearchCode(focusParam);
        const res = await fetchGraphNeighborhood(focusParam, 2);
        setGraphData({ nodes: res.nodes || [], links: res.links || [] });
      } else {
        const res = await fetchGraphData();
        setGraphData(res);
      }
    } catch (err) {
      console.error("Failed to load graph data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetchGraphNeighborhood(searchCode.trim(), 2);
      setGraphData({ nodes: res.nodes || [], links: res.links || [] });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFullGraph = async () => {
    setSearchCode("");
    setIsLoading(true);
    try {
      const res = await fetchGraphData();
      setGraphData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar selectedLang={selectedLang} onLangChange={setSelectedLang} />

      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-maroon-950 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b-4 border-maroon-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-maroon-800 text-amber-300 text-xs font-semibold">
              <Network className="w-4 h-4" />
              <span>Bureau of Indian Standards Knowledge Graph</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif">
              Normative Standards & Hierarchy Visualizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Explore interconnected relationships between parent product standards, normative reference codes, mandatory testing protocols, and Central Ministry Quality Control Orders (QCOs).
            </p>
          </div>

          {/* Search Controls */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Search standard (e.g. IS 10322, IS 456)..."
                className="w-full pl-9 pr-3 py-2 bg-slate-800 text-white text-xs rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-maroon-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-maroon-700 hover:bg-maroon-800 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-sm"
            >
              Focus Node
            </button>
            <button
              type="button"
              onClick={handleResetFullGraph}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium whitespace-nowrap"
            >
              Show Full Network
            </button>
          </form>
        </div>
      </section>

      {/* Main Visualizer Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
            <p className="text-xs text-slate-500 font-medium">Computing graph topology & relations...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <GraphVisualizer
              data={graphData}
              focusNodeId={searchCode}
              onSelectNode={(node) => setSelectedNode(node)}
            />

            {/* Selected Node Details Bar */}
            {selectedNode && (
              <div className="bg-white p-6 rounded-2xl border border-maroon-200 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Graph Entity</span>
                    <h3 className="text-lg font-bold font-serif text-slate-900">{selectedNode.id}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                      {selectedNode.type}
                    </span>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${selectedNode.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {selectedNode.status || 'ACTIVE'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-700">{selectedNode.label}</p>
                {selectedNode.division && (
                  <p className="text-xs text-slate-500"><strong>Division:</strong> {selectedNode.division}</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function GraphViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-maroon-700 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading Knowledge Graph...</p>
          </div>
        </div>
      }
    >
      <GraphViewContent />
    </Suspense>
  );
}
