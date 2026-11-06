import React, { useState, useMemo, useRef, useEffect } from 'react';
import { solveHarappanTensegrity, KRAMHAUS_TAU_CRIT_UNM, CODE_KINTSUGI_GOLD, CODE_CLEAN } from '../lib/dandelion-core';
import { ShieldCheck, AlertCircle, ArrowDown, Activity, Sparkles, Scale, Info } from 'lucide-react';

export const TensegritySolverView: React.FC = () => {
  const [bodyMassKg, setBodyMassKg] = useState<number>(80.0);
  const [torsoRatio, setTorsoRatio] = useState<number>(0.675); // 54.0 kg torso for 80.0 kg body
  const [radius1, setRadius1] = useState<number>(120);
  const [radius2, setRadius2] = useState<number>(150);
  const [sinTheta1, setSinTheta1] = useState<number>(200);
  const [sinTheta2, setSinTheta2] = useState<number>(220);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const calc = useMemo(() => {
    return solveHarappanTensegrity(
      bodyMassKg,
      torsoRatio,
      [radius1, radius2, 130, 140],
      [sinTheta1, sinTheta2, 210, 230]
    );
  }, [bodyMassKg, torsoRatio, radius1, radius2, sinTheta1, sinTheta2]);

  // Draw 2D Tensegrity & Vector diagram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Coordinate centers
    const cx = w / 2;
    const cy = h / 2 + 10;

    // Draw chair/pelvis base (dark slate platform)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 110, cy + 60, 220, 14);

    // Spine lumbar column
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 60);
    ctx.lineTo(cx, cy - 70);
    ctx.stroke();

    // Lumbar discs
    for (let dy = -40; dy <= 40; dy += 20) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(cx, cy + dy, 14, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Harappan Tetrahedral Tensegrity Struts (Amber)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    // Left strut
    ctx.moveTo(cx - 80, cy + 50);
    ctx.lineTo(cx, cy - 60);
    // Right strut
    ctx.moveTo(cx + 80, cy + 50);
    ctx.lineTo(cx, cy - 60);
    ctx.stroke();

    // Suspension Tendons (Emerald dashed cables)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    // Left sling
    ctx.moveTo(cx - 80, cy + 50);
    ctx.lineTo(cx - 30, cy - 20);
    ctx.lineTo(cx, cy + 20);
    // Right sling
    ctx.moveTo(cx + 80, cy + 50);
    ctx.lineTo(cx + 30, cy - 20);
    ctx.lineTo(cx, cy + 20);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Downward Gravity Vector (Torso Weight W_torso)
    ctx.strokeStyle = '#f43f5e';
    ctx.fillStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 80);
    ctx.lineTo(cx, cy - 40);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 44);
    ctx.lineTo(cx + 6, cy - 44);
    ctx.lineTo(cx, cy - 36);
    ctx.fill();

    // Upward Sling Support Vectors (Unloading 353 N)
    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = '#10b981';
    ctx.lineWidth = 3;
    // Left upward force
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy + 20);
    ctx.lineTo(cx - 40, cy - 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 45, cy - 10);
    ctx.lineTo(cx - 35, cy - 10);
    ctx.lineTo(cx - 40, cy - 18);
    ctx.fill();

    // Right upward force
    ctx.beginPath();
    ctx.moveTo(cx + 40, cy + 20);
    ctx.lineTo(cx + 40, cy - 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 35, cy - 10);
    ctx.lineTo(cx + 45, cy - 10);
    ctx.lineTo(cx + 40, cy - 18);
    ctx.fill();

    // Label markers
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`W_torso = ${calc.torsoWeightN} N`, cx + 15, cy - 70);
    ctx.fillStyle = '#34d399';
    ctx.fillText(`F_sling = -${calc.slingUnloadedN} N (2/3)`, cx + 45, cy);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Residual Disc Load = ${calc.discResidualN} N`, cx - 110, cy + 85);
  }, [calc]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs mb-2">
            <span>Harappan Tensegrity & Kramhaus Torque Governor</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Lumbar Seated-Assist & Avogadro Keyhole Unloading
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Achieves exact 2/3 (66.67%) lumbar disc decompression (V* = 34/51) via tetrahedral tensegrity 
            (cos &theta; = -1/3) with Euler buckling safety factor of 4.81x.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            66.67% UNLOADED (V* = 2/3)
          </div>
        </div>
      </div>

      {/* Main Grid: Biomechanical Simulation & Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tensegrity Canvas Diagram */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-200">
              Tetrahedral Saddle Tension Vector Model
            </span>
            <span className="text-xs font-mono text-amber-400">
              cos(&theta;_tet) = -1/3 (109.4712°)
            </span>
          </div>

          <div className="rounded-xl overflow-hidden bg-slate-900/40 border border-slate-800/80 flex items-center justify-center p-2">
            <canvas ref={canvasRef} width={420} height={250} className="w-full max-w-[420px] h-[250px] block" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1 border-t border-slate-900">
            <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Tendon Tension T_i</span>
              <span className="text-emerald-400 font-bold">{calc.tendonTensionN} N</span>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Strut Axial P</span>
              <span className="text-amber-400 font-bold">{calc.strutCompressionN} N</span>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Euler Buckling SF</span>
              <span className="text-blue-400 font-bold">{calc.eulerSafetyFactor}x Safe</span>
            </div>
          </div>
        </div>

        {/* Biomechanical Controls & Live Values */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Biomechanical Parameters</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Total Body Mass:</span>
                  <span className="text-slate-200 font-bold">{bodyMassKg.toFixed(1)} kg</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="130"
                  step="1"
                  value={bodyMassKg}
                  onChange={(e) => setBodyMassKg(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Torso Mass Ratio:</span>
                  <span className="text-slate-200 font-bold">{(torsoRatio * 100).toFixed(1)}% ({(bodyMassKg * torsoRatio).toFixed(1)} kg)</span>
                </div>
                <input
                  type="range"
                  min="0.55"
                  max="0.75"
                  step="0.005"
                  value={torsoRatio}
                  onChange={(e) => setTorsoRatio(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800"
                />
              </div>
            </div>

            {/* Results breakdown cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Gross Torso Weight</span>
                <div className="text-lg font-bold text-slate-100">{calc.torsoWeightN} N</div>
                <span className="text-[10px] text-slate-500">100% downward force</span>
              </div>
              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/50 font-mono space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase">Sling Unloaded Force</span>
                <div className="text-lg font-bold text-emerald-300">{calc.slingUnloadedN} N</div>
                <span className="text-[10px] text-emerald-400">-{calc.percentRelief}% decompression</span>
              </div>
              <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-900/50 font-mono space-y-1">
                <span className="text-[10px] text-blue-400 uppercase">Residual Lumbar Load</span>
                <div className="text-lg font-bold text-blue-300">{calc.discResidualN} N</div>
                <span className="text-[10px] text-blue-400">Only 1/3 residual</span>
              </div>
              <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-900/50 font-mono space-y-1">
                <span className="text-[10px] text-purple-400 uppercase">Critical Euler Buckling</span>
                <div className="text-lg font-bold text-purple-300">1389.80 N</div>
                <span className="text-[10px] text-purple-400">{calc.eulerSafetyFactor}x safety margin</span>
              </div>
            </div>
          </div>

          {/* Kramhaus Torque Governor Section */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200">
                SCX Kramhaus Torque Governor
              </h3>
              {calc.isKintsugiClamped ? (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>KINTSUGI CLAMP (Byte 251)</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold">
                  CLEAN (Byte 0)
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Lever Arm Radius 1 ({radius1} mm):
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={radius1}
                  onChange={(e) => setRadius1(parseInt(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Lever Arm Radius 2 ({radius2} mm):
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={radius2}
                  onChange={(e) => setRadius2(parseInt(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-400">Raw Torque: </span>
                <span className={calc.isKintsugiClamped ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                  {calc.governorTorqueRawUnm.toLocaleString()} µN·m
                </span>
                <span className="text-slate-500"> (Limit: {KRAMHAUS_TAU_CRIT_UNM.toLocaleString()} µN·m)</span>
              </div>
              <div>
                <span className="text-slate-400">Governed Net: </span>
                <span className="text-emerald-400 font-bold">
                  {calc.governorTorqueNetUnm.toLocaleString()} µN·m
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
