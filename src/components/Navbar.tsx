import React from 'react';
import { Activity, Cpu, Sparkles, Volume2, VolumeX, ShieldCheck, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  clusterStats: {
    profplumTemp: number;
    profplumPower: number;
    heimatTemp: number;
    heimatPower: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  clusterStats,
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview & Invariants' },
    { id: 'morse', label: 'Morse/LIS & Fowler' },
    { id: 'haar', label: 'Haar DWT & Barker-13' },
    { id: 'tensegrity', label: 'Tensegrity Solver' },
    { id: 'raft', label: 'Ternary Raft & Fox' },
    { id: 'ramanujan', label: 'Ramanujan & 1729' },
    { id: 'tests', label: '6-Suite Verification' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Version */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-inner">
              <span className="text-xl">🌼</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-slate-100">Dandelion OS</span>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                  v4.1.2
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Ursine & Urshwera
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden md:block">
                Sovereign Ternary Microkernel · Heimat {"{0, 0, 0}"}
              </p>
            </div>
          </div>

          {/* Live Telemetry Pill */}
          <div className="hidden lg:flex items-center space-x-3 text-xs font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">profplum:</span>
              <span className="text-emerald-300 font-medium">{clusterStats.profplumTemp}°C</span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-300 font-medium">{clusterStats.profplumPower}W</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">heimat:</span>
              <span className="text-emerald-300 font-medium">{clusterStats.heimatTemp}°C</span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-300 font-medium">{clusterStats.heimatPower}W</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Audio Synthesizer' : 'Enable Audio Synthesizer'}
              className={`p-2 rounded-lg border transition ${
                soundEnabled
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <div className="hidden sm:flex items-center space-x-1 text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>ISO C99 Safe</span>
            </div>
          </div>
        </div>

        {/* Tab navigation bar */}
        <div className="flex space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-900/60 text-xs font-medium">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
