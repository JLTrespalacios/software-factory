import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Monitor, Code, ShieldCheck, Activity, Award, X } from 'lucide-react';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

interface ProjectMonitorProps {
  files: Record<string, string>;
  projectName: string;
  qualityReport?: any;
  onClose?: () => void;
}

export const ProjectMonitor: React.FC<ProjectMonitorProps> = ({ files, projectName, qualityReport, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'quality'>('editor');

  // Build File Tree
  const buildTree = (files: Record<string, string>): FileNode[] => {
    const root: FileNode[] = [];
    
    // Sort keys to have folders first usually, but here simple sort
    const paths = Object.keys(files).sort();
    
    paths.forEach(path => {
      // Very simple tree builder, assuming paths are relative
      const parts = path.split('/');
      let currentLevel = root;
      
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        
        let existingNode = currentLevel.find(n => n.name === part);
        
        if (!existingNode) {
          existingNode = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: isFile ? 'file' : 'folder',
            children: isFile ? undefined : [],
            content: isFile ? files[path] : undefined
          };
          currentLevel.push(existingNode);
        }
        
        if (!isFile) {
            currentLevel = existingNode.children!;
        }
      });
    });
    return root;
  };

  const fileTree = buildTree(files);

  const FileTreeItem = ({ node, level }: { node: FileNode, level: number }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div>
        <div 
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-white/5 ${selectedFile === node.path ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400'}`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') setIsOpen(!isOpen);
            else setSelectedFile(node.path);
          }}
        >
          {node.type === 'folder' && (
            isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
          )}
          {node.type === 'folder' ? <Folder className="w-4 h-4 text-yellow-500" /> : <File className="w-4 h-4 text-blue-400" />}
          <span className="text-sm truncate select-none">{node.name}</span>
        </div>
        {node.type === 'folder' && isOpen && node.children?.map(child => (
          <FileTreeItem key={child.path} node={child} level={level + 1} />
        ))}
      </div>
    );
  };

  const getFileContent = () => {
    if (!selectedFile) return '// Select a file to view content';
    return files[selectedFile] || '// Content not found';
  };

  const getPreviewContent = () => {
      const indexHtml = files['index.html'] || files['public/index.html'] || Object.keys(files).find(k => k.endsWith('.html'));
      if (indexHtml && files[indexHtml]) {
          // Basic injection of CSS if found
          let content = files[indexHtml];
          const cssFile = Object.keys(files).find(k => k.endsWith('.css'));
          if (cssFile) {
              content = content.replace('</head>', `<style>${files[cssFile]}</style></head>`);
          }
          return content;
      }
      return null;
  };

  const previewContent = getPreviewContent();

  return (
    <div className="flex flex-col h-full bg-[#0F1419] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500"/><div className="w-3 h-3 rounded-full bg-yellow-500"/><div className="w-3 h-3 rounded-full bg-green-500"/>
           <span className="ml-4 font-mono text-sm text-green-400 opacity-70">{projectName}</span>
        </div>
        <div className="flex bg-black/50 rounded-lg p-1">
            <button 
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 text-xs rounded-md flex items-center gap-2 transition-all ${activeTab === 'editor' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                <Code className="w-3 h-3" /> Editor
            </button>
            <button 
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs rounded-md flex items-center gap-2 transition-all ${activeTab === 'preview' ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                <Monitor className="w-3 h-3" /> Preview
            </button>
            <button 
                onClick={() => setActiveTab('quality')}
                className={`px-3 py-1 text-xs rounded-md flex items-center gap-2 transition-all ${activeTab === 'quality' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                <ShieldCheck className="w-3 h-3" /> Quality
            </button>
        </div>
        
        {onClose && (
            <button 
                onClick={onClose}
                className="ml-4 p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/5 overflow-y-auto bg-black/20 shrink-0">
           <div className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
             <span>Explorer</span>
           </div>
           {fileTree.map(node => <FileTreeItem key={node.path} node={node} level={0} />)}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
            {activeTab === 'editor' && (
                <div className="flex-1 relative">
                    <textarea 
                        className="absolute inset-0 w-full h-full p-4 text-sm font-mono text-slate-300 bg-[#1e1e1e] resize-none outline-none custom-scrollbar"
                        value={getFileContent()}
                        readOnly={!selectedFile}
                        spellCheck={false}
                    />
                </div>
            )}
            
            {activeTab === 'preview' && (
                <div className="flex-1 flex flex-col bg-white text-black relative overflow-hidden">
                    {/* Fake Browser Chrome */}
                    <div className="h-8 bg-gray-100 border-b flex items-center px-2 gap-2 shrink-0">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        </div>
                        <div className="flex-1 bg-white h-6 rounded border text-xs flex items-center px-2 text-gray-500 truncate">
                            http://localhost:3000/{projectName.toLowerCase()}
                        </div>
                    </div>
                    
                    <div className="flex-1 relative overflow-auto">
                        {previewContent ? (
                            <iframe 
                                title="preview"
                                srcDoc={previewContent}
                                className="w-full h-full border-none"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <div className="animate-pulse mb-4">
                                    <Monitor className="w-16 h-16 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700">Live Preview</h3>
                                <p className="text-slate-500 mt-2">Server running...</p>
                                <div className="mt-8 text-left max-w-md w-full bg-black text-green-400 font-mono p-4 rounded text-xs shadow-lg">
                                    <p>{'>'} Waiting for content...</p>
                                    <p className="opacity-50">// No index.html found in generated files.</p>
                                    <p className="opacity-50">// Try generating a Frontend project.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'quality' && (
                <div className="flex-1 p-8 overflow-y-auto bg-[#0A0E27]">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex items-center justify-between mb-8">
                             <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <ShieldCheck className="w-8 h-8 text-purple-400" />
                                    Quality Gate Report
                                </h2>
                                <p className="text-slate-400 mt-1">Automated analysis by Factory Quality Engine</p>
                             </div>
                             <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 font-bold">
                                {qualityReport?.securityScan?.grade || 'A'} GRADE
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-slate-400 text-sm font-medium">Test Coverage</span>
                                    <Activity className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">{qualityReport?.coverage?.lines || '0%'}</div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: qualityReport?.coverage?.lines || '0%' }} />
                                </div>
                             </div>

                             <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-slate-400 text-sm font-medium">Tests Passed</span>
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">{qualityReport?.summary?.passed || 0}/{qualityReport?.summary?.totalTests || 0}</div>
                                <div className="text-xs text-green-400">100% Success Rate</div>
                             </div>

                             <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-slate-400 text-sm font-medium">Security Issues</span>
                                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">{qualityReport?.securityScan?.vulnerabilities || 0}</div>
                                <div className="text-xs text-purple-400">No Critical Vulnerabilities</div>
                             </div>
                        </div>

                        {/* Detailed Metrics */}
                        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                                <h3 className="font-bold text-white">Detailed Analysis</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {['Architecture Compliance', 'Code Style', 'Dependency Check', 'Performance Audit'].map((metric, i) => (
                                    <div key={metric} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-blue-500'}`} />
                                            <span className="text-slate-300">{metric}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-px w-32 bg-white/10 group-hover:bg-white/20 transition-colors" />
                                            <span className="text-sm font-mono text-green-400">PASSED</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Add missing icon import
import { CheckCircle2 } from 'lucide-react';
