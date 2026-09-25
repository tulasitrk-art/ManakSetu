"use client";

import React, { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Filter, Info, ShieldCheck, Layers } from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: string;
  status?: string;
  division?: string;
  qco_status?: string;
  mandatory_scheme?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  type: string;
  relation_label?: string;
}

interface GraphVisualizerProps {
  data: {
    nodes: Node[];
    links: Link[];
  };
  focusNodeId?: string;
  onSelectNode?: (node: Node) => void;
}

export default function GraphVisualizer({
  data,
  focusNodeId,
  onSelectNode,
}: GraphVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<Node | null>(null);
  const [filterType, setFilterType] = useState<string>("ALL");

  const nodesRef = useRef<Node[]>([]);
  const linksRef = useRef<Link[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!data || !data.nodes || data.nodes.length === 0) return;

    // Clone and layout initial positions
    const width = 800;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    const nodes: Node[] = data.nodes.map((n, i) => {
      const angle = (i / data.nodes.length) * 2 * Math.PI;
      const radius = i === 0 ? 0 : 160 + (i % 3) * 60;
      return {
        ...n,
        x: centerX + radius * Math.cos(angle) + (Math.random() - 0.5) * 40,
        y: centerY + radius * Math.sin(angle) + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
      };
    });

    const links: Link[] = data.links.map((l) => ({ ...l }));

    nodesRef.current = nodes;
    linksRef.current = links;

    if (focusNodeId) {
      const focused = nodes.find((n) => n.id === focusNodeId);
      if (focused) {
        setSelectedNode(focused);
      }
    } else if (nodes.length > 0) {
      setSelectedNode(nodes[0]);
    }

    // Force simulation loop
    let ticks = 0;
    const simulate = () => {
      const currentNodes = nodesRef.current;
      const currentLinks = linksRef.current;

      // Center force
      for (const node of currentNodes) {
        if (node === draggedNode) continue;
        const dx = centerX - (node.x || centerX);
        const dy = centerY - (node.y || centerY);
        node.vx = (node.vx || 0) + dx * 0.003;
        node.vy = (node.vy || 0) + dy * 0.003;
      }

      // Repulsion between nodes
      for (let i = 0; i < currentNodes.length; i++) {
        for (let j = i + 1; j < currentNodes.length; j++) {
          const n1 = currentNodes[i];
          const n2 = currentNodes[j];
          const dx = (n2.x || 0) - (n1.x || 0);
          const dy = (n2.y || 0) - (n1.y || 0);
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          const force = 1200 / (distSq + 200);

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (n1 !== draggedNode) {
            n1.vx = (n1.vx || 0) - fx;
            n1.vy = (n1.vy || 0) - fy;
          }
          if (n2 !== draggedNode) {
            n2.vx = (n2.vx || 0) + fx;
            n2.vy = (n2.vy || 0) + fy;
          }
        }
      }

      // Link spring attraction
      for (const link of currentLinks) {
        const sourceId = typeof link.source === "string" ? link.source : link.source.id;
        const targetId = typeof link.target === "string" ? link.target : link.target.id;
        const sNode = currentNodes.find((n) => n.id === sourceId);
        const tNode = currentNodes.find((n) => n.id === targetId);

        if (sNode && tNode) {
          const dx = (tNode.x || 0) - (sNode.x || 0);
          const dy = (tNode.y || 0) - (sNode.y || 0);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = link.type === "MANDATED_BY" ? 140 : 180;
          const force = (dist - targetDist) * 0.035;

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (sNode !== draggedNode) {
            sNode.vx = (sNode.vx || 0) + fx;
            sNode.vy = (sNode.vy || 0) + fy;
          }
          if (tNode !== draggedNode) {
            tNode.vx = (tNode.vx || 0) - fx;
            tNode.vy = (tNode.vy || 0) - fy;
          }
        }
      }

      // Apply damping & update position
      for (const node of currentNodes) {
        if (node === draggedNode) continue;
        node.vx = (node.vx || 0) * 0.85;
        node.vy = (node.vy || 0) * 0.85;
        node.x = (node.x || 0) + (node.vx || 0);
        node.y = (node.y || 0) + (node.vy || 0);
      }

      draw();
      ticks++;
      if (ticks < 300 || isDragging || draggedNode) {
        animationFrameRef.current = requestAnimationFrame(simulate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [data, focusNodeId, isDragging, draggedNode]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    const currentNodes = nodesRef.current;
    const currentLinks = linksRef.current;

    // Draw Links
    for (const link of currentLinks) {
      const sourceId = typeof link.source === "string" ? link.source : link.source.id;
      const targetId = typeof link.target === "string" ? link.target : link.target.id;
      const sNode = currentNodes.find((n) => n.id === sourceId);
      const tNode = currentNodes.find((n) => n.id === targetId);

      if (!sNode || !tNode) continue;

      ctx.beginPath();
      ctx.moveTo(sNode.x || 0, sNode.y || 0);
      ctx.lineTo(tNode.x || 0, tNode.y || 0);

      if (link.type === "SUPERSEDED_BY") {
        ctx.strokeStyle = "#E11D48";
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2.5;
      } else if (link.type === "MANDATED_BY") {
        ctx.strokeStyle = "#D97706";
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
      } else if (link.type === "TEST_METHOD") {
        ctx.strokeStyle = "#059669";
        ctx.setLineDash([]);
        ctx.lineWidth = 1.5;
      } else {
        ctx.strokeStyle = "#94A3B8";
        ctx.setLineDash([]);
        ctx.lineWidth = 1.5;
      }

      ctx.stroke();
      ctx.setLineDash([]);

      // Draw relation label
      if (link.relation_label) {
        const midX = ((sNode.x || 0) + (tNode.x || 0)) / 2;
        const midY = ((sNode.y || 0) + (tNode.y || 0)) / 2;
        ctx.font = "9px Inter, sans-serif";
        ctx.fillStyle = "#64748B";
        ctx.textAlign = "center";
        ctx.fillText(link.relation_label, midX, midY - 4);
      }
    }

    // Draw Nodes
    for (const node of currentNodes) {
      const isSelected = selectedNode?.id === node.id;
      const x = node.x || 0;
      const y = node.y || 0;

      let radius = 24;
      let fillColor = "#7B1113"; // Primary Maroon

      if (node.type === "MANDATORY_QCO") {
        fillColor = "#D97706"; // Amber
        radius = 28;
      } else if (node.type === "TEST_METHOD") {
        fillColor = "#059669"; // Emerald
        radius = 20;
      } else if (node.type === "ALLIED_STANDARD") {
        fillColor = "#2563EB"; // Blue
        radius = 22;
      } else if (node.status === "SUPERSEDED") {
        fillColor = "#E11D48"; // Rose
        radius = 24;
      }

      // Glow if selected
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 7, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(123, 17, 19, 0.25)";
        ctx.fill();
      }

      // Main Circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeStyle = isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)";
      ctx.stroke();

      // Node text label
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillStyle = "#1E293B";
      ctx.textAlign = "center";
      
      // Truncate label for clean display
      const labelText = node.id.length > 22 ? node.id.substring(0, 20) + "..." : node.id;
      ctx.fillText(labelText, x, y + radius + 15);
    }

    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - offset.x) / zoom;
    const mouseY = (e.clientY - rect.top - offset.y) / zoom;

    // Check if a node was clicked
    for (const node of nodesRef.current) {
      const dx = mouseX - (node.x || 0);
      const dy = mouseY - (node.y || 0);
      if (dx * dx + dy * dy <= 30 * 30) {
        setDraggedNode(node);
        setSelectedNode(node);
        if (onSelectNode) onSelectNode(node);
        return;
      }
    }

    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (draggedNode) {
      draggedNode.x = (e.clientX - rect.left - offset.x) / zoom;
      draggedNode.y = (e.clientY - rect.top - offset.y) / zoom;
      draw();
    } else if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      draw();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  return (
    <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-maroon-700" />
          Interactive Knowledge Graph
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-500 font-mono text-[11px]">
          {data.nodes.length} Nodes • {data.links.length} Relations
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5 bg-white/90 backdrop-blur p-1 rounded-lg border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + 0.15, 2.5))}
          className="p-1.5 text-slate-600 hover:text-maroon-700 hover:bg-slate-100 rounded"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
          className="p-1.5 text-slate-600 hover:text-maroon-700 hover:bg-slate-100 rounded"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          }}
          className="p-1.5 text-slate-600 hover:text-maroon-700 hover:bg-slate-100 rounded"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        width={900}
        height={560}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[560px] cursor-grab active:cursor-grabbing bg-radial from-slate-50/50 to-slate-100/40"
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur p-3 rounded-lg border border-slate-200 shadow-md text-xs space-y-1.5">
        <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
          Graph Legend
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-maroon-700"></span>
          <span className="text-slate-700">Primary Indian Standard</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span className="text-slate-700">Normative / Allied Reference</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
          <span className="text-slate-700">Test Method Protocol</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-600"></span>
          <span className="text-slate-700">Mandatory QCO Gazette Order</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-600"></span>
          <span className="text-slate-700">Superseded / Outdated Version</span>
        </div>
      </div>

      {/* Selected Node Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 z-10 w-80 bg-white/95 backdrop-blur p-4 rounded-xl border border-maroon-200 shadow-xl text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-900 font-serif line-clamp-1">
              {selectedNode.id}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedNode.status === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {selectedNode.status || "ACTIVE"}
            </span>
          </div>
          <p className="text-slate-700 font-medium line-clamp-2">
            {selectedNode.label}
          </p>
          {selectedNode.division && (
            <div className="text-slate-500 text-[11px]">
              <strong>Division:</strong> {selectedNode.division}
            </div>
          )}
          {selectedNode.qco_status && selectedNode.qco_status !== "VOLUNTARY" && (
            <div className="flex items-center gap-1.5 text-maroon-800 font-semibold bg-maroon-50 p-1.5 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-maroon-700" />
              <span>{selectedNode.qco_status}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
