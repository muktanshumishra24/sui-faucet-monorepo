import React, { useState } from 'react';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  estimatedWeeks: number;
  category: string;
}

interface Phase {
  id: string;
  title: string;
  description: string;
  weeks: string;
  steps: RoadmapStep[];
}

const RoadmapModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('phase1');

  const phases: Phase[] = [
    {
      id: 'phase1',
      title: 'Foundation',
      description: 'Core infrastructure and navigation',
      weeks: 'Weeks 1-2',
      steps: [
        {
          id: 'nav-system',
          title: 'Multi-Tool Navigation',
          description: 'Implement tab-based interface for switching between the 4 core tools',
          status: 'pending',
          priority: 'high',
          estimatedWeeks: 1,
          category: 'UI/UX'
        },
        {
          id: 'state-management',
          title: 'Shared State Management',
          description: 'Set up global state for tool data sharing and user preferences',
          status: 'pending',
          priority: 'high',
          estimatedWeeks: 1,
          category: 'Architecture'
        }
      ]
    },
    {
      id: 'phase2',
      title: 'Core Tools',
      description: 'Implement the 4 main developer tools',
      weeks: 'Weeks 3-4',
      steps: [
        {
          id: 'bcs-decoder',
          title: 'BCS Decoder',
          description: 'Parse BCS-encoded bytes into readable Move structs with schema integration',
          status: 'pending',
          priority: 'high',
          estimatedWeeks: 2,
          category: 'Development'
        },
        {
          id: 'converters',
          title: 'Converters',
          description: 'Format transformers: Hex/Base64/UTF8, BCS/JSON, Epoch/Timestamp, SUI units',
          status: 'pending',
          priority: 'high',
          estimatedWeeks: 1,
          category: 'Utilities'
        },
        {
          id: 'storage-inspector',
          title: 'Storage Inspector',
          description: 'Inspect on-chain object fields, Move struct layouts, and dynamic types',
          status: 'pending',
          priority: 'high',
          estimatedWeeks: 2,
          category: 'Blockchain'
        },
        {
          id: 'explorer-hub',
          title: 'Explorer Hub',
          description: 'Unified search across suiexplorer.com, suiscan.xyz, and suivision.xyz',
          status: 'pending',
          priority: 'medium',
          estimatedWeeks: 2,
          category: 'Blockchain'
        }
      ]
    },
    {
      id: 'phase3',
      title: 'Enhancement',
      description: 'Advanced features and error handling',
      weeks: 'Weeks 5-6',
      steps: [
        {
          id: 'advanced-bcs',
          title: 'Advanced BCS Decoding',
          description: 'Error handling, schema validation, and complex struct resolution',
          status: 'pending',
          priority: 'medium',
          estimatedWeeks: 1,
          category: 'Development'
        },
        {
          id: 'real-time-explorer',
          title: 'Real-time Explorer Data',
          description: 'Live data aggregation and caching from multiple explorer APIs',
          status: 'pending',
          priority: 'medium',
          estimatedWeeks: 1,
          category: 'Blockchain'
        },
        {
          id: 'enhanced-storage',
          title: 'Enhanced Storage Inspection',
          description: 'Support for owned/shared objects and module storage introspection',
          status: 'pending',
          priority: 'medium',
          estimatedWeeks: 1,
          category: 'Blockchain'
        }
      ]
    },
    {
      id: 'phase4',
      title: 'Polish',
      description: 'Performance and user experience',
      weeks: 'Weeks 7-8',
      steps: [
        {
          id: 'performance',
          title: 'Performance Optimization',
          description: 'Caching, lazy loading, and sub-2 second tool switching',
          status: 'pending',
          priority: 'medium',
          estimatedWeeks: 1,
          category: 'Performance'
        },
        {
          id: 'mobile-responsive',
          title: 'Mobile Responsiveness',
          description: 'Touch-friendly interfaces and responsive design for all devices',
          status: 'pending',
          priority: 'medium',
          estimatedWeeks: 1,
          category: 'UI/UX'
        },
        {
          id: 'documentation',
          title: 'Documentation & Examples',
          description: 'User guides, examples, and helpful error messages for each tool',
          status: 'pending',
          priority: 'low',
          estimatedWeeks: 1,
          category: 'Documentation'
        }
      ]
    }
  ];



  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const currentPhase = phases.find(phase => phase.id === selectedPhase);
  const currentSteps = currentPhase?.steps || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <h2 className="text-lg font-medium text-white">Development Plan</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(90vh-120px)]">
          {/* Tab Navigation */}
          <div className="bg-black/20 border-b border-white/10">
            <div className="flex space-x-1 p-3">
              {phases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedPhase === phase.id
                      ? 'text-white border-b border-white/40'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {phase.title}
                </button>
              ))}
            </div>
          </div>

          {/* Phase Description */}
          <div className="bg-black/10 px-6 py-3 border-b border-white/5">
            <p className="text-sm text-gray-400">{currentPhase?.description}</p>
          </div>

          {/* Steps List */}
          <div className="flex-1 overflow-y-auto p-6 bg-transparent">
            <div className="space-y-4">
              {currentSteps.map((step) => (
                <div
                  key={step.id}
                  className="bg-black/20 rounded-lg border border-white/10 p-4 hover:border-white/20 transition-colors backdrop-blur-sm"
                >
                                      <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                        <span className={`text-xs font-medium ${getPriorityColor(step.priority)}`}>
                          {step.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{step.description}</p>

                    </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default RoadmapModal; 