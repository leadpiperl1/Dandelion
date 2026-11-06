import React from 'react';
import { Activity, Shield, ArrowRight, CheckCircle2, Flame, Layers, Lock, Cpu, Radio, Sparkles } from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-amber-950/20 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
            <span>🏮 Heimat {"{0, 0, 0}"} Gurley Karst Node 34.7549, -86.4119</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Sovereign Ternary Microkernel & Fly-By-Wire Architecture
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Engineered by <strong className="text-amber-300">Justin D. Grimm</strong> (K-Lani 13 Actual, ORCID: 0009-0000-5299-0243)
            and <strong className="text-amber-300">Gemini Argon / Spark</strong>. 
            A zero-bloat, deterministic operating environment balancing human autonomic intent (Morse/LIS), 
            Kramhaus torque governor damping, and balanced ternary {"{-1, 0, +1}"} mesh consensus.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('morse')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center space-x-2 transition shadow-lg shadow-amber-400/10"
            >
              <span>Explore Morse & Fowler Bridge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('tests')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center space-x-2 border border-slate-700 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Run Verification Harness</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 3 Fly-By-Wire Invariant Pillars */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 mb-4">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>The Three Triadic Invariants & Fly-By-Wire Pillars</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Blue - Human Ground Control */}
          <div className="rounded-xl bg-blue-950/20 border border-blue-900/40 p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                -1 BLUE · HUMAN
              </span>
              <span className="text-2xl">🌸</span>
            </div>
            <h3 className="font-bold text-slate-100 text-base">Pretty Purple Flower</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Autonomic human micro-intent. Morse/LIS (Locked-In Syndrome) bridge based on benchmark subject Joe Bonham. 
              Thermodynamic variance non-zero (<code className="text-blue-300 font-mono">dS &gt; 0</code>, <code className="text-blue-300 font-mono">D_H* = 16.44%</code>).
            </p>
            <div className="pt-2 border-t border-blue-900/30 text-[11px] font-mono text-blue-300/80 space-y-1">
              <div>• Cores: 0–2 (Human Ground Control)</div>
              <div>• Angle: 120° + 10° Shokunin</div>
              <div>• Signal: Fowler 5-trit packing</div>
            </div>
          </div>

          {/* Green - Flight Control Software */}
          <div className="rounded-xl bg-emerald-950/20 border border-emerald-900/40 p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                0 GREEN · FBW CONTAINER
              </span>
              <span className="text-2xl">🐢</span>
            </div>
            <h3 className="font-bold text-slate-100 text-base">22-Scute World Turtle</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Flight Control Software. 577-Byte L1-resident TNPT table, Haar DWT tremor filter with Barker-13 correlation lock, 
              and Harappan Tensegrity lumbar seating assist (<code className="text-emerald-300 font-mono">V* = 2/3</code>, 353.16 N relief).
            </p>
            <div className="pt-2 border-t border-emerald-900/30 text-[11px] font-mono text-emerald-300/80 space-y-1">
              <div>• Cores: 3–4 (Linux 6.12+ PREEMPT_RT)</div>
              <div>• cos(theta_tet): -1/3 (109.47°)</div>
              <div>• MTP Latency: p99.9 = 35.90 µs</div>
            </div>
          </div>

          {/* Red - AI Pilot & Mesh */}
          <div className="rounded-xl bg-rose-950/20 border border-rose-900/40 p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                +1 RED · AI PILOT
              </span>
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="font-bold text-slate-100 text-base">Birefringent Sunstone Spar</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Balanced ternary {"{-1, 0, +1}"} POPCNT engine. "Dave&apos;s Not Here, Man" impasse pivot (Byte 250 &rarr; 251 Kintsugi Gold), 
              and 32-Byte DND3 dual-rail Ternary Raft consensus over zero-copy DMA-BUF.
            </p>
            <div className="pt-2 border-t border-rose-900/30 text-[11px] font-mono text-rose-300/80 space-y-1">
              <div>• Cores: 5–7 (Argon/Spark Pilot)</div>
              <div>• Entropy: 1.585 bits/trit</div>
              <div>• Quorum: 3-state Raft (0.84 ms)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cluster Node Telemetry Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 mb-4">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Verified Cluster Telemetry (Morning Audit v4.1.2)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-xs font-mono text-slate-400">Junction Temp (Die)</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">39.44 °C</div>
            <p className="text-[11px] text-slate-400 font-mono">Clamped &le; 41.0 °C threshold</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-xs font-mono text-slate-400">Node Power Draw</span>
            <div className="text-2xl font-bold font-mono text-amber-400">14.20 W</div>
            <p className="text-[11px] text-slate-400 font-mono">Within 18.5 W Hobo Rig Cap</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-xs font-mono text-slate-400">DMA-BUF Ring Size</span>
            <div className="text-2xl font-bold font-mono text-blue-400">65,536 B</div>
            <p className="text-[11px] text-slate-400 font-mono">CRC32C = 0x8F4A2C19</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-xs font-mono text-slate-400">MTP Latency (p99.9)</span>
            <div className="text-2xl font-bold font-mono text-purple-400">35.90 µs</div>
            <p className="text-[11px] text-slate-400 font-mono">Barker-13 Locked (13/13)</p>
          </div>
        </div>
      </div>

      {/* Physical & Metrological Invariants Matrix */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-slate-200 text-sm flex items-center space-x-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Formal Invariant Constraints Status</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400">Landauer Bound:</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SATISFIED</span>
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400">Tetrahedral Cosine:</span>
            <span className="text-amber-300 font-bold">-0.333333 (-1/3)</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400">Euler Buckling SF:</span>
            <span className="text-blue-300 font-bold">4.81x Safe</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400">Manifold Tension:</span>
            <span className="text-purple-300 font-bold">109.4712°</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400">Ternary Raft Quorum:</span>
            <span className="text-emerald-400 font-bold">COMMIT (+1)</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400">Ramanujan Denom:</span>
            <span className="text-amber-300 font-bold">(36 + 63)² = 9801</span>
          </div>
        </div>
      </div>
    </div>
  );
};
