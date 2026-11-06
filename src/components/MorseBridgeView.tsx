import React, { useState, useMemo } from 'react';
import { textToMorse, morseToTernary, fowlerPack39Trits, fowlerUnpack39TritsStrict, GAIKU_TRITS, FOWLER_BYTES_PER_SEED, FOWLER_MAX_VALID_BYTE, CODE_KINTSUGI_GOLD } from '../lib/dandelion-core';
import { audioSynth } from '../lib/audio-synthesizer';
import { Trit } from '../types/dandelion';
import { Play, Volume2, ShieldCheck, AlertTriangle, Sparkles, RefreshCw, Radio } from 'lucide-react';

interface MorseBridgeViewProps {
  soundEnabled: boolean;
}

export const MorseBridgeView: React.FC<MorseBridgeViewProps> = ({ soundEnabled }) => {
  const [inputText, setInputText] = useState('SOS');
  const [rawMorseInput, setRawMorseInput] = useState('... --- ...');
  const [activeTabMode, setActiveTabMode] = useState<'text' | 'manual'>('text');
  const [injectedTrapByte, setInjectedTrapByte] = useState<number | null>(null);

  // Derived Morse
  const currentMorse = activeTabMode === 'text' ? textToMorse(inputText) : rawMorseInput;
  const currentTrits = useMemo(() => morseToTernary(currentMorse), [currentMorse]);

  // Fowler Packing
  const packResult = useMemo(() => fowlerPack39Trits(currentTrits), [currentTrits]);

  // Handle injected trapdoor test
  const effectiveBytes = useMemo(() => {
    const bytes = [...packResult.packedBytes];
    if (injectedTrapByte !== null) {
      bytes[0] = injectedTrapByte;
    }
    return bytes;
  }, [packResult.packedBytes, injectedTrapByte]);

  // Strict Unpacking
  const unpackResult = useMemo(() => fowlerUnpack39TritsStrict(effectiveBytes), [effectiveBytes]);

  const handleTap = (symbol: '.' | '-' | ' ') => {
    if (soundEnabled) {
      if (symbol === '.') audioSynth.playDit();
      else if (symbol === '-') audioSynth.playDah();
    }
    setRawMorseInput(prev => prev + symbol);
  };

  const handleClearMorse = () => {
    setRawMorseInput('');
  };

  const playEntireSequence = async () => {
    if (!soundEnabled) return;
    for (const char of currentMorse) {
      if (char === '.') {
        audioSynth.playDit();
        await new Promise(r => setTimeout(r, 140));
      } else if (char === '-') {
        audioSynth.playDah();
        await new Promise(r => setTimeout(r, 260));
      } else if (char === ' ') {
        await new Promise(r => setTimeout(r, 180));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs mb-2">
            <span>Bite 10 Sensory Assist (Joe Bonham Protocol)</span>
          </div>
          <h2 className="text-xl font-bold text-white">Morse / LIS to Fowler Balanced Ternary Bridge</h2>
          <p className="text-xs text-slate-400 mt-1">
            Converts autonomic micro-pulses into 39-trit vectors packed at 5 trits/byte (base-3 shift: 0..242) into 8-byte L1 seeds.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={playEntireSequence}
            className="px-3 py-2 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Play Audio Audio-Dit</span>
          </button>
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Signal Source</span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTabMode('text')}
                className={`px-3 py-1 rounded transition ${activeTabMode === 'text' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Text Transcribe
              </button>
              <button
                onClick={() => setActiveTabMode('manual')}
                className={`px-3 py-1 rounded transition ${activeTabMode === 'manual' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Manual Key Tapper
              </button>
            </div>
          </div>

          {activeTabMode === 'text' ? (
            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-400">Natural Language Utterance:</label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. SOS, HEIMAT, BLUE..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400 transition"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs text-slate-500 py-1 font-mono">Presets:</span>
                {['SOS', 'HEIMAT', 'URSINE', 'FLOWER', 'DAVE'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setInputText(preset)}
                    className="text-xs font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <button
                  onMouseDown={() => handleTap('.')}
                  className="flex-1 py-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 active:bg-blue-600/50 border border-blue-500/40 text-blue-300 font-mono font-bold text-center transition flex flex-col items-center justify-center space-y-1 shadow-inner"
                >
                  <span className="text-xl">•</span>
                  <span className="text-[10px] tracking-widest uppercase">Dit (-1 Blue)</span>
                </button>
                <button
                  onMouseDown={() => handleTap('-')}
                  className="flex-1 py-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 active:bg-rose-600/50 border border-rose-500/40 text-rose-300 font-mono font-bold text-center transition flex flex-col items-center justify-center space-y-1 shadow-inner"
                >
                  <span className="text-xl">▬</span>
                  <span className="text-[10px] tracking-widest uppercase">Dah (+1 Red)</span>
                </button>
                <button
                  onClick={() => handleTap(' ')}
                  className="px-4 py-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 active:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-center transition flex flex-col items-center justify-center space-y-1 shadow-inner"
                >
                  <span className="text-xs">SPACE</span>
                  <span className="text-[10px] tracking-widest uppercase">(0 Green)</span>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400">Live Buffer:</span>
                <button
                  onClick={handleClearMorse}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono transition"
                >
                  Clear Buffer
                </button>
              </div>
            </div>
          )}

          {/* Rendered Morse Output */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
              <span>Morse Representation</span>
              <span>{currentMorse.length} symbols</span>
            </div>
            <div className="font-mono text-sm tracking-wider text-amber-300 break-all">
              {currentMorse || '<EMPTY>'}
            </div>
          </div>
        </div>

        {/* Balanced Ternary Translation */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Balanced Ternary Mapping ({GAIKU_TRITS} Trits)
            </span>
            <span className="text-xs font-mono text-slate-400">
              {currentTrits.length} parsed trits
            </span>
          </div>

          <div className="grid grid-cols-13 gap-1 p-3 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
            {packResult.trits.map((trit, idx) => {
              const bg =
                trit === -1
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : trit === 1
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              return (
                <div
                  key={idx}
                  title={`Trit [${idx}]: ${trit > 0 ? '+1' : trit}`}
                  className={`h-7 flex items-center justify-center font-mono text-[11px] font-bold rounded border ${bg}`}
                >
                  {trit > 0 ? '+1' : trit}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-blue-500/40 border border-blue-500 inline-block"></span>
                <span>-1 (Blue / Dot)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500 inline-block"></span>
                <span>0 (Green / Space)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-500/40 border border-rose-500 inline-block"></span>
                <span>+1 (Red / Dash)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fowler 5-trits Packed Bytes Visualizer */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              Fowler Packed 8-Byte Seed (Base-3 Shift: 0..242 Max Byte)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Fowler packing accumulates 5 trits per byte: acc = &Sigma; (trit + 1) &times; 3^k
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setInjectedTrapByte(injectedTrapByte === null ? CODE_KINTSUGI_GOLD : null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                injectedTrapByte !== null
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {injectedTrapByte !== null ? 'Reset Trapdoor' : 'Inject Trapdoor Byte (251 Kintsugi)'}
            </button>
          </div>
        </div>

        {/* 8 Bytes Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {effectiveBytes.map((byteVal, i) => {
            const isTrapdoor = byteVal > FOWLER_MAX_VALID_BYTE;
            return (
              <div
                key={i}
                className={`p-3 rounded-xl border font-mono text-center space-y-1 transition ${
                  isTrapdoor
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <div className="text-[10px] text-slate-500">Byte [{i}]</div>
                <div className="text-lg font-bold">
                  {byteVal}
                </div>
                <div className="text-[10px] text-slate-400">
                  0x{byteVal.toString(16).toUpperCase().padStart(2, '0')}
                </div>
                {isTrapdoor && (
                  <div className="text-[9px] text-amber-400 font-bold pt-1">
                    PIVOT 251
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Unpacking Status */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2">
            {unpackResult.isValid ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Strict Unpack Status: VALID</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Trapdoor code: 0x{unpackResult.trapCode.toString(16)} (Clean)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-bold">Trapdoor Trapped: Code {unpackResult.trapCode}</span>
                <span className="text-slate-400">(Byte &gt; 242 triggered Kintsugi fail-closed pivot)</span>
              </>
            )}
          </div>
          <div className="text-slate-400">
            Fowler capacity: 3^5 = 243 states/byte (0..242)
          </div>
        </div>
      </div>
    </div>
  );
};
