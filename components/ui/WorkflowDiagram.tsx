"use client";

import React, { useMemo, useLayoutEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  Position,
  NodeTypes,
  useReactFlow,
  Handle,
  BackgroundVariant,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Diamond Node Component
const DiamondNode = React.memo(({ data }: { data: any }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} id="diamond-top" />
      <Handle type="source" position={Position.Left} id="diamond-left" />
      <Handle type="source" position={Position.Right} id="diamond-right" />
      <div
        className="group relative w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform rotate-45 flex items-center justify-center cursor-pointer"
      >
        <div className="transform -rotate-45 text-orange-800 font-semibold text-xs text-center leading-tight px-2">
          {data.label}
        </div>
        <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2 transition-opacity">
          {data.label}
        </div>
      </div>
    </>
  );
});

// Custom Process Node Component
const ProcessNode = React.memo(({ data }: { data: any }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <div
        className={`group relative w-56 min-h-20 bg-gradient-to-br ${data.backgroundGradient || 'from-blue-50 to-blue-100'} border-2 ${data.borderColor || 'border-blue-600'} rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center text-center p-4 cursor-pointer`}
      >
        <div>
          <div className="font-bold text-sm text-gray-800 mb-2">{data.title}</div>
          {data.description && (
            <div className="text-xs text-gray-600 leading-relaxed">
              {data.description.split(' • ').map((item: string, index: number) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          )}
        </div>
        <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2 transition-opacity">
          {data.title}
        </div>
      </div>
    </>
  );
});

// Set display names for debugging
DiamondNode.displayName = 'DiamondNode';
ProcessNode.displayName = 'ProcessNode';

// Memoize node types
const nodeTypes: NodeTypes = {
  diamond: DiamondNode,
  process: ProcessNode,
};

// Manual layout function
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const layoutPositions: { [key: string]: { x: number; y: number } } = {
    '1': { x: 100, y: 60 },
    '2': { x: 400, y: 50 },
    '3': { x: 700, y: 50 },
    'keputusan': { x: 850, y: 250 }, // Lowered to make arrow from node 3 more visible
    'tidak-sesuai': { x: 570, y: 400 }, // Adjusted to accommodate keputusan
    'sesuai': { x: 1000, y: 400 }, // Adjusted to accommodate keputusan
    'update': { x: 1000, y: 600 }, // Adjusted to accommodate sesuai
  };

  const layoutedNodes = nodes.map((node) => ({
    ...node,
    position: layoutPositions[node.id] || { x: 0, y: 0 },
  }));

  return { nodes: layoutedNodes, edges };
};

// Define props for component
interface WorkflowDiagramProps {
  language?: 'en' | 'id';
}

// Inner component
const WorkflowDiagramInner: React.FC<WorkflowDiagramProps> = ({ language = 'id' }) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Initial nodes with language support
  const initialNodes: Node[] = useMemo(() => {
    const nodesEn = [
      {
        id: '1',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: '1. Application Prerequisites',
          description: 'Prepare letter/signature • Select FSTI service via portal',
          backgroundGradient: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-600',
        },
      },
      {
        id: '2',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: '2. Form Filling & Submission',
          description: 'Complete the form • Press Submit button',
          backgroundGradient: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-600',
        },
      },
      {
        id: '3',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: '3. Form Review by Staff',
          description: 'Staff checks completeness and validity of data',
          backgroundGradient: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-600',
        },
      },
      {
        id: 'keputusan',
        type: 'diamond',
        position: { x: 0, y: 0 },
        data: { label: 'Verification\nDecision' },
      },
      {
        id: 'tidak-sesuai',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: 'Not Compliant',
          description: 'Status: Needs Revision • Return to form filling',
          backgroundGradient: 'from-red-50 to-red-100',
          borderColor: 'border-red-600',
        },
      },
      {
        id: 'sesuai',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: 'Compliant',
          description: 'Status: Completed • The document can be viewed in the Document Tracking Menu',
          backgroundGradient: 'from-green-50 to-green-100',
          borderColor: 'border-green-600',
        },
      },
      {
        id: 'update',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: '5. Update Request (Optional)',
          description: 'If no update within 2×24 working hours, contact via WhatsApp Business',
          backgroundGradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-600 border-dashed',
        },
      },
    ];

    const nodesId = [
      {
        id: '1',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: '1. Prasyarat Permohonan',
          description: 'Menyiapkan surat/tanda tangan • Memilih layanan FSTI via portal',
          backgroundGradient: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-600',
        },
      },
      {
        id: '2',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: '2. Pengisian Formulir & Submit',
          description: 'Mengisi formulir lengkap • Menekan tombol Submit',
          backgroundGradient: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-600',
        },
      },
      {
        id: '3',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: '3. Pemeriksaan Formulir oleh Tendik',
          description: 'Tendik memeriksa kelengkapan dan keabsahan data',
          backgroundGradient: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-600',
        },
      },
      {
        id: 'keputusan',
        type: 'diamond',
        position: { x: 0, y: 0 },
        data: { label: 'Keputusan\nVerifikasi' },
      },
      {
        id: 'tidak-sesuai',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: 'Tidak Sesuai',
          description: 'Status: Perlu Perbaikan • Kembali mengisi formulir',
          backgroundGradient: 'from-red-50 to-red-100',
          borderColor: 'border-red-600',
        },
      },
      {
        id: 'sesuai',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: 'Sesuai',
          description: 'Status: Selesai • Dokumen dapat diliat di Menu Tracking Dokumen',
          backgroundGradient: 'from-green-50 to-green-100',
          borderColor: 'border-green-600',
        },
      },
      {
        id: 'update',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
          title: '5. Permintaan Update (Opsional)',
          description: 'Jika tidak ada update dalam 2×24 jam kerja, hubungi via WhatsApp Business',
          backgroundGradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-600 border-dashed',
        },
      },
    ];

    return language === 'en' ? nodesEn : nodesId;
  }, [language]);

  // Initial edges
  const initialEdges: Edge[] = useMemo(() => [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      sourceHandle: 'right',
      targetHandle: 'left',
      style: { stroke: '#2563EB', strokeWidth: 3, strokeDasharray: '10,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#2563EB', width: 25, height: 25 },
      type: 'smoothstep', 
      animated: true,
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      sourceHandle: 'right',
      targetHandle: 'left',
      style: { stroke: '#2563EB', strokeWidth: 3, strokeDasharray: '10,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#2563EB', width: 25, height: 25 },
      type: 'smoothstep',
      animated: true,
    },
    {
      id: 'e3-keputusan',
      source: '3',
      target: 'keputusan',
      sourceHandle: 'bottom',
      targetHandle: 'diamond-top',
      style: { stroke: '#2563EB', strokeWidth: 3,  strokeDasharray: '10,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#2563EB', width: 25, height: 25 },
      type: 'smoothstep',
      animated: true,
    },
    {
      id: 'e-keputusan-tidak',
      source: 'keputusan',
      target: 'tidak-sesuai',
      sourceHandle: 'diamond-left',
      targetHandle: 'top',
      label: language === 'en' ? 'No' : 'Tidak',
      labelStyle: { fill: '#B91C1C', fontWeight: 'bold', fontSize: '14px' },
      labelBgStyle: { fill: 'white', fillOpacity: 0.9, stroke: '#B91C1C', strokeWidth: 1, borderRadius: 4 },
      style: { stroke: '#B91C1C', strokeWidth: 3 , strokeDasharray: '8,4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#B91C1C', width: 25, height: 25 },
      type: 'smoothstep',
      animated: true,
    },
    {
      id: 'e-keputusan-sesuai',
      source: 'keputusan',
      target: 'sesuai',
      sourceHandle: 'diamond-right',
      targetHandle: 'top',
      label: language === 'en' ? 'Yes' : 'Ya',
      labelStyle: { fill: '#15803D', fontWeight: 'bold', fontSize: '14px' },
      labelBgStyle: { fill: 'white', fillOpacity: 0.9, stroke: '#15803D', strokeWidth: 1, borderRadius: 4 },
      style: { stroke: '#15803D', strokeWidth: 3 , strokeDasharray: '8,4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#15803D', width: 25, height: 25 },
      type: 'smoothstep',
      animated: true,
    },
    {
      id: 'e-tidak-loop',
      source: 'tidak-sesuai',
      target: '2',
      sourceHandle: 'left-source', // Changed from left-source to bottom
      targetHandle: 'bottom', // Changed from left to top
      label: language === 'en' ? 'Refill' : 'Mengisi Ulang',
      labelStyle: { fill: '#B91C1C', fontWeight: 'bold', fontSize: '12px' },
      labelBgStyle: { fill: '#FEF2F2', fillOpacity: 0.9, stroke: '#B91C1C', strokeWidth: 1, borderRadius: 4 },
      style: { stroke: '#B91C1C', strokeWidth: 3, strokeDasharray: '8,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#B91C1C', width: 25, height: 25 },
      type: 'smoothstep',
      animated: true,
    },
    {
      id: 'e-sesuai-update',
      source: 'sesuai',
      target: 'update',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      label: language === 'en' ? 'Optional' : 'Opsional',
      labelStyle: { fill: '#374151', fontWeight: 'bold', fontSize: '12px' },
      labelBgStyle: { fill: '#F3F4F6', fillOpacity: 0.9, stroke: '#374151', strokeWidth: 1, borderRadius: 4 },
      style: { stroke: '#374151', strokeWidth: 3, strokeDasharray: '10,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#374151', width: 25, height: 25 },
      type: 'smoothstep', // Changed from bezier to smoothstep
      animated: true,
    },
  ], [language]);

  useLayoutEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    setTimeout(() => {
      fitView({ padding: 0.2, duration: 800 });
    }, 100);
  }, [initialNodes, initialEdges, fitView]);

  // Debug log to verify import
  console.log({ ReactFlowProvider });

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        minZoom={0.3}
        maxZoom={1.5}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        fitView
        onNodeClick={(_event, node) => console.log('Node clicked:', node.id)}
      >
        <Background color="#94A3B8" gap={12} size={2} variant={BackgroundVariant.Dots} />
        <Controls showInteractive={true} />
      </ReactFlow>
    </div>
  );
};

// Main component
const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ language = 'id' }) => {
  // Debug log to verify import
  console.log({ ReactFlowProvider });

  return (
    <div className="w-full h-[700px] border rounded-xl overflow-hidden bg-white shadow-lg">
      <div className="h-[600px]">
        <ReactFlowProvider>
          <WorkflowDiagramInner language={language} />
        </ReactFlowProvider>
      </div>
      <div className="text-center p-3 text-sm text-gray-500 border-t border-gray-200 bg-gray-50">
        {language === 'en'
          ? 'FSTI Service Application Process Flow - Structured Manual Layout'
          : 'Alur Proses Permohonan Layanan FSTI - Layout Manual Terstruktur'}
      </div>
    </div>
  );
};

export default WorkflowDiagram;