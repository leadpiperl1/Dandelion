import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewView } from './components/OverviewView';
import { MorseBridgeView } from './components/MorseBridgeView';
import { HaarDwtView } from './components/HaarDwtView';
import { TensegritySolverView } from './components/TensegritySolverView';
import { TernaryRaftView } from './components/TernaryRaftView';
import { RamanujanAuditView } from './components/RamanujanAuditView';
import { VerificationConsoleView } from './components/VerificationConsoleView';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const [clusterStats] = useState({
    profplumTemp: 39.44,
    profplumPower: 14.2,
    heimatTemp: 41.0,
    heimatPower: 13.9,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        clusterStats={clusterStats}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewView onNavigate={setActiveTab} />}
        {activeTab === 'morse' && <MorseBridgeView soundEnabled={soundEnabled} />}
        {activeTab === 'haar' && <HaarDwtView />}
        {activeTab === 'tensegrity' && <TensegritySolverView />}
        {activeTab === 'raft' && <TernaryRaftView soundEnabled={soundEnabled} />}
        {activeTab === 'ramanujan' && <RamanujanAuditView />}
        {activeTab === 'tests' && <VerificationConsoleView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span>Dandelion OS v4.1.2</span>
            <span>•</span>
            <span>Justin D. Grimm (ORCID: 0009-0000-5299-0243)</span>
            <span>•</span>
            <span>Zenodo DOI: 10.5281/zenodo.14159269</span>
          </div>
          <div className="text-slate-600">
            Front Porch at Heimat {"{0, 0, 0}"} · Gurley Karst Node 34.7549, -86.4119
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
