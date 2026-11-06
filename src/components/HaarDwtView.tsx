import React, { useState, useEffect, useRef, useMemo } from 'react';
import { runHaarDwtAndBarker, BARKER13_KERNEL } from '../lib/dandelion-core';
import { Activity, Lock, Unlock, Play, Pause, RefreshCw, BarChart2 } from 'lucide-react';

export const HaarDwtView: React.FC = () => {
  const [tremorAmplitude, setTremorAmplitude] = useState<number>(0.6);
  const [intentionalSignalLevel, setIntentionalSignalLevel] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [signalMode, setSignalMode] = useState<'barker' | 'sine' | 'square'>('barker');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Generate 14-sample raw buffer based on settings
  const rawSamples = useMemo(() => {
    const samples: number[] = [];
    const t = timeRef.current;

    for (let i = 0; i < 14; i++) {
      let baseIntent = 0;
      if (signalMode === 'barker') {
        const barkerVal = i < BARKER13_KERNEL.length ? BARKER13_KERNEL[i] : 1;
        baseIntent = barkerVal * intentionalSignalLevel;
      } else if (signalMode === 'sine') {
        baseIntent = Math.sin((i + t) * 0.4) * intentionalSignalLevel;
      } else {
        baseIntent = (i % 4 < 2 ? 1 : -1) * intentionalSignalLevel;
      }

      // Pathological Parkinsonian / dystonic tremor jitter (~6 Hz)
      const tremorJitter = (Math.sin(i * 3.8 + t * 4) * 0.7 + (Math.random() - 0.5) * 0.4) * tremorAmplitude;
      samples.push(baseIntent + tremorJitter);
    }
    return samples;
  }, [tremorAmplitude, intentionalSignalLevel, signalMode]);

  // Compute Haar DWT + Barker correlation
  const dwtResult = useMemo(() => runHaarDwtAndBarker(rawSamples), [rawSamples]);

  // Live Canvas Rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localTime = 0;

    const render = () => {
      if (isPlaying) {
        localTime += 0.05;
        timeRef.current = localTime;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 30) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Zero baseline
      const midY = height / 2;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Draw Raw Signal (Yellow/Amber)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const stepX = width / (rawSamples.length - 1);
      rawSamples.forEach((val, idx) => {
        const x = idx * stepX;
        const y = midY - val * 35;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw Haar Low-Pass Intent (Emerald Green)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const haarStepX = width / (dwtResult.lowPassIntent.length - 1);
      dwtResult.lowPassIntent.forEach((val, idx) => {
        const x = idx * haarStepX;
        const y = midY - (val / Math.SQRT2) * 35;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw High-Pass Tremor Residual (Rose Red)
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      dwtResult.highPassTremor.forEach((val, idx) => {
        const x = idx * haarStepX;
        const y = midY - (val / Math.SQRT2) * 35;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, rawSamples, dwtResult]);

  return (
    <div className="space-y-6">
      {/* Title & Info Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs mb-2">
            <span>MTP Assist v4.1.1 — ISO C99 Real-Time Signal Filter</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Rectified Haar DWT Tremor Separation & Barker-13 Lock
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Separates high-frequency neuromuscular tremor from deliberate user motor pulses in real-time, locking 
            onto Barker-13 preamble with p99.9 latency of 35.90 µs.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition ${
              isPlaying
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/30 hover:bg-amber-400/30'
                : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30 hover:bg-emerald-400/30'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Freeze Scope' : 'Resume Scope'}</span>
          </button>
        </div>
      </div>

      {/* Oscilloscope Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono font-bold text-slate-200">Real-Time Wavelet Oscilloscope</span>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span className="text-amber-400">Raw Input</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                <span className="text-emerald-400">Haar Intent (Low-Pass)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
                <span className="text-rose-400">Tremor (High-Pass)</span>
              </span>
            </div>
          </div>

          {/* Barker Lock Status */}
          <div className="flex items-center space-x-2">
            {dwtResult.isBarkerLocked ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>BARKER-13 LOCKED ({dwtResult.barkerScore}/13)</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                <Unlock className="w-3.5 h-3.5" />
                <span>SEARCHING CORRELATION ({dwtResult.barkerScore}/13)</span>
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950">
          <canvas
            ref={canvasRef}
            width={720}
            height={220}
            className="w-full h-56 block"
          />
        </div>

        {/* Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono space-y-1">
            <span className="text-[11px] text-slate-400">Barker Score</span>
            <div className="text-lg font-bold text-slate-100">
              {dwtResult.barkerScore} / 13
            </div>
            <span className="text-[10px] text-emerald-400">Lock threshold: &ge; 9</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono space-y-1">
            <span className="text-[11px] text-slate-400">MTP Latency (p99.9)</span>
            <div className="text-lg font-bold text-purple-400">
              {dwtResult.mtpLatencyUs} µs
            </div>
            <span className="text-[10px] text-slate-500">Benchmark: 35.90 µs</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono space-y-1">
            <span className="text-[11px] text-slate-400">Wavelet Sparsity</span>
            <div className="text-lg font-bold text-blue-400">
              {dwtResult.sparsityPermille} ‰
            </div>
            <span className="text-[10px] text-slate-500">Fixed-point Q8</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono space-y-1">
            <span className="text-[11px] text-slate-400">Barker Sequence</span>
            <div className="text-xs font-bold text-slate-300 pt-1 tracking-wider">
              + + + + + - - + + - + - +
            </div>
            <span className="text-[10px] text-slate-500">Barker-13 standard</span>
          </div>
        </div>
      </div>

      {/* Signal Generator Controls */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-5">
        <h3 className="text-sm font-bold text-slate-200">Interactive Signal Controls</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Tremor Amplitude (Noise):</span>
              <span className="text-rose-400 font-bold">{Math.round(tremorAmplitude * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={tremorAmplitude}
              onChange={(e) => setTremorAmplitude(parseFloat(e.target.value))}
              className="w-full accent-rose-500 bg-slate-800"
            />
            <p className="text-[10px] text-slate-500 font-mono">Simulates high-frequency neuromuscular tremor</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Intentional Pulse Level:</span>
              <span className="text-emerald-400 font-bold">{intentionalSignalLevel.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.1"
              value={intentionalSignalLevel}
              onChange={(e) => setIntentionalSignalLevel(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800"
            />
            <p className="text-[10px] text-slate-500 font-mono">Strength of deliberate motor intent</p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 block">Signal Pattern:</span>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setSignalMode('barker')}
                className={`py-1.5 rounded transition ${signalMode === 'barker' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Barker-13
              </button>
              <button
                onClick={() => setSignalMode('sine')}
                className={`py-1.5 rounded transition ${signalMode === 'sine' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Sine Wave
              </button>
              <button
                onClick={() => setSignalMode('square')}
                className={`py-1.5 rounded transition ${signalMode === 'square' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Square
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Base intentional wave envelope</p>
          </div>
        </div>
      </div>
    </div>
  );
};
