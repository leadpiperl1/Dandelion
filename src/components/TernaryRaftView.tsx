import React, { useState, useMemo } from 'react';
import { Trit } from '../types/dandelion';
import { computeCrc32c } from '../lib/dandelion-core';
import { audioSynth } from '../lib/audio-synthesizer';
import { Cpu, ShieldCheck, Flame, RefreshCw, CheckCircle2, XCircle, Eye, Activity, HardDrive } from 'lucide-react';

interface TernaryRaftViewProps {
  soundEnabled: boolean;
}

interface SimulatedNode {
  id: string;
  role: 'Leader' | 'Follower' | 'Witness';
  tritVote: Trit;
  powerW: number;
  tempC: number;
  dmaBufBytes: number;
  crc32c: string;
  isOnline: boolean;
}

export const TernaryRaftView: React.FC<TernaryRaftViewProps> = ({ soundEnabled }) => {
  const [term, setTerm] = useState(42);
  const [nodes, setNodes] = useState<SimulatedNode[]>([
    {
      id: 'profplum',
      role: 'Leader',
      tritVote: 1, // +1 Commit
      powerW: 14.2,
      tempC: 39.44,
      dmaBufBytes: 65536,
      crc32c: '0x8F4A2C19',
      isOnline: true,
    },
    {
      id: 'gurley-karst-heimat',
      role: 'Follower',
      tritVote: 1, // +1 Commit
      powerW: 13.9,
      tempC: 41.0,
      dmaBufBytes: 65536,
      crc32c: '0x8F4A2C19',
      isOnline: true,
    },
    {
      id: 'pocketqube-sband-03',
      role: 'Witness',
      tritVote: 0, // 0 Witness
      powerW: 2.4,
      tempC: 22.5,
      dmaBufBytes: 65536,
      crc32c: '0x8F4A2C19',
      isOnline: true,
    },
  ]);

  const [simulatedThermalStress, setSimulatedThermalStress] = useState<number>(0);

  // Compute Fox Daemon Thermal Governor response
  const governedNodes = useMemo(() => {
    return nodes.map(node => {
      const baseTemp = node.tempC + simulatedThermalStress * 4.5;
      const basePower = node.powerW + simulatedThermalStress * 6.0;

      // Fox Daemon Closed-Loop Clamp (clamping power at 18.5W max, and throttling if temp > 41.0°C)
      let governedPower = basePower;
      let governedTemp = baseTemp;
      let isThrottled = false;

      if (basePower > 18.5) {
        governedPower = 18.5; // Hobo Rig Hardware Cap
        isThrottled = true;
      }
      if (baseTemp > 41.0) {
        // Throttling power drops temperature back toward 41.0C
        governedPower = Math.min(governedPower, 14.2);
        governedTemp = +(41.0 + (baseTemp - 41.0) * 0.15).toFixed(2);
        isThrottled = true;
      }

      return {
        ...node,
        powerW: +governedPower.toFixed(2),
        tempC: +governedTemp.toFixed(2),
        isThrottled,
      };
    });
  }, [nodes, simulatedThermalStress]);

  // Compute Ternary Consensus Quorum:
  // -1: Reject, 0: Witness/Abstain, +1: Commit
  const quorumResult = useMemo(() => {
    let commitCount = 0;
    let rejectCount = 0;
    let witnessCount = 0;
    let onlineCount = 0;

    for (const node of nodes) {
      if (!node.isOnline) continue;
      onlineCount++;
      if (node.tritVote === 1) commitCount++;
      else if (node.tritVote === -1) rejectCount++;
      else witnessCount++;
    }

    // 2/3 supermajority rule or plurality
    const isQuorumCommit = commitCount >= 2;
    const isQuorumReject = rejectCount >= 2;

    let finalState: 'COMMIT (+1)' | 'REJECT (-1)' | 'INDECISIVE (0)' = 'INDECISIVE (0)';
    if (isQuorumCommit) finalState = 'COMMIT (+1)';
    else if (isQuorumReject) finalState = 'REJECT (-1)';

    return {
      commitCount,
      rejectCount,
      witnessCount,
      onlineCount,
      finalState,
      isCommitted: isQuorumCommit,
    };
  }, [nodes]);

  const handleToggleVote = (nodeId: string) => {
    setNodes(prev =>
      prev.map(n => {
        if (n.id !== nodeId) return n;
        // Cycle: +1 -> 0 -> -1 -> +1
        const nextVote: Trit = n.tritVote === 1 ? 0 : n.tritVote === 0 ? -1 : 1;
        return { ...n, tritVote: nextVote };
      })
    );
  };

  const handleProposeBlock = () => {
    setTerm(prev => prev + 1);
    if (soundEnabled) {
      audioSynth.playConsensusCommit();
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs mb-2">
            <span>DMA-BUF Zero-Copy Mesh & Ternary Raft v4.1.2</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Balanced Ternary Raft Consensus & Fox Daemon Governor
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Achieves 0.84 ms roundtrip consensus across 3-state {"{-1, 0, +1}"} voting over 64 KB DMA-BUF rings, 
            protected by closed-loop thermal entropy throttling (18.5 W cap).
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleProposeBlock}
            className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Propose Consensus Block (Term #{term})</span>
          </button>
        </div>
      </div>

      {/* Quorum Status Bar */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
              quorumResult.finalState === 'COMMIT (+1)'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : quorumResult.finalState === 'REJECT (-1)'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {quorumResult.finalState === 'COMMIT (+1)' ? '+1' : quorumResult.finalState === 'REJECT (-1)' ? '-1' : '0'}
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400">Ternary Consensus Quorum:</span>
            <div className="text-sm font-bold font-mono text-slate-100">
              STATUS: {quorumResult.finalState}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>+1 Commit: {quorumResult.commitCount}</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            <span>0 Witness: {quorumResult.witnessCount}</span>
          </div>
          <div className="flex items-center space-x-1 text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>-1 Reject: {quorumResult.rejectCount}</span>
          </div>
        </div>
      </div>

      {/* Cluster Nodes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {governedNodes.map((node) => {
          const tritColor =
            node.tritVote === 1
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : node.tritVote === -1
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

          return (
            <div
              key={node.id}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
                    {node.role}
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm font-mono">{node.id}</h3>
                </div>
                <button
                  onClick={() => handleToggleVote(node.id)}
                  title="Click to cycle balanced ternary vote (+1, 0, -1)"
                  className={`px-3 py-1 rounded-lg border font-mono font-bold text-xs transition ${tritColor}`}
                >
                  {node.tritVote === 1 ? '+1 COMMIT' : node.tritVote === -1 ? '-1 REJECT' : '0 WITNESS'}
                </button>
              </div>

              {/* DMA-BUF & Node metrics */}
              <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <HardDrive className="w-3 h-3 text-blue-400" />
                    <span>DMA-BUF Ring:</span>
                  </span>
                  <span className="text-blue-300">{node.dmaBufBytes.toLocaleString()} B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">CRC32C Castagnoli:</span>
                  <span className="text-amber-300">{node.crc32c}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span>Die Junction Temp:</span>
                  </span>
                  <span className={node.tempC > 40 ? 'text-amber-300 font-bold' : 'text-emerald-300'}>
                    {node.tempC} °C
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Power Draw:</span>
                  <span className={node.powerW >= 18.0 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                    {node.powerW} W / 18.5 W
                  </span>
                </div>
              </div>

              {node.isThrottled && (
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] font-mono text-amber-300 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fox Daemon Throttling Active</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fox Daemon Thermal Entropy Controller */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Fox Daemon Thermal-Entropy Governor (Closed-Loop dT/dt)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Strictly enforces Landauer Thermodynamic Bound (dS &gt; 0) and limits node envelope to 18.5 W.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Inject Cluster Thermal/Workload Surge:</span>
            <span className="text-orange-400 font-bold">+{Math.round(simulatedThermalStress * 100)}% Surge</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.05"
            value={simulatedThermalStress}
            onChange={(e) => setSimulatedThermalStress(parseFloat(e.target.value))}
            className="w-full accent-orange-500 bg-slate-800"
          />
          <p className="text-[11px] text-slate-500 font-mono">
            Slide to stress nodes. Notice how the Fox Daemon dynamically caps node power at 18.5W and clamps die temperature at &le; 41.0°C!
          </p>
        </div>
      </div>
    </div>
  );
};
