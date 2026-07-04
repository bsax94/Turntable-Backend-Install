/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Terminal, 
  Disc, 
  Cast, 
  Server, 
  Settings, 
  Play, 
  Check, 
  Copy, 
  Info,
  Cpu,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [copied, setCopied] = useState(false);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    setAppUrl(window.location.origin);
  }, []);

  const installCommand = `curl -sL ${appUrl}/install.sh | sudo bash`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      id: "01",
      status: "COMPLETED",
      statusColor: "text-green-500",
      title: "Audio Interface",
      description: "USB-AUDIO-CODEC: ALSA HW:1,0 connected."
    },
    {
      id: "02",
      status: "COMPLETED",
      statusColor: "text-green-500",
      title: "Dependency Sync",
      description: "Icecast2, DarkIce, and LAME verified."
    },
    {
      id: "03",
      status: "READY",
      statusColor: "text-accent animate-pulse",
      active: true,
      title: "Encoder Engine",
      description: "Awaiting single-command execution."
    },
    {
      id: "04",
      status: "WAITING",
      statusColor: "text-[#444]",
      disabled: true,
      title: "Service Deployment",
      description: "Systemd stream integration."
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-dark text-[#e0e0e0] font-sans flex flex-col p-6 md:p-12 box-border">
      {/* Design Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border-dark pb-8 mb-10 gap-4">
        <div>
          <h1 className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-3">Installer Utility v2.4.0</h1>
          <h2 className="text-4xl md:text-6xl font-serif italic tracking-tight">VinylStream <span className="text-[#666] font-light">Pro-Link</span></h2>
        </div>
        <div className="md:text-right">
          <div className="text-[10px] uppercase tracking-widest text-[#666] mb-1 font-mono">Source Hardware</div>
          <div className="text-sm font-mono text-[#aaa]">ALSA: USB-AUDIO-CODEC (hw:1,0)</div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-10 min-h-0">
        {/* Sidebar: Step Navigation */}
        <aside className="md:col-span-3 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`p-5 transition-all duration-300 border-l-2 ${
                  step.active 
                    ? "bg-[#1a1a1a] border-white ring-1 ring-white/10" 
                    : step.disabled 
                      ? "bg-[#0c0c0c] border-[#333] opacity-40"
                      : "bg-panel-dark border-accent"
                } flex flex-col gap-1`}
              >
                <span className={`text-[10px] font-mono font-bold ${step.active ? "text-white" : step.disabled ? "text-[#555]" : "text-accent"}`}>
                  STEP {step.id}
                </span>
                <span className="text-sm font-medium tracking-tight">{step.title}</span>
                <span className={`text-[10px] font-mono italic mt-2 uppercase tracking-wider ${step.statusColor}`}>
                  {step.status === "READY" && "● "}
                  {step.status === "COMPLETED" && "✓ "}
                  {step.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto p-5 border border-border-dark rounded-sm">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-3 font-mono">Streaming Status</div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
              <div className="text-xs font-mono uppercase tracking-widest">Offline (Awaiting Setup)</div>
            </div>
          </div>
        </aside>

        {/* Main Terminal Output / Installer UI */}
        <section className="md:col-span-9 bg-[#0c0c0c] border border-border-dark rounded-lg p-8 flex flex-col relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-5 pointer-events-none">
            <span className="text-[10px] font-mono text-[#444] uppercase tracking-widest">DEPLOYMENT_LOG_v2.txt</span>
          </div>

          <div className="flex-1 font-mono text-[13px] leading-relaxed text-[#888]">
            <div className="mb-8">
              <p className="text-accent mb-4 italic text-base font-serif">A wireless vinyl audio server in seconds.</p>
              <p className="max-w-xl text-[#aaa] leading-relaxed mb-6">
                Connect your turntable to a Raspberry Pi via a USB interface. 
                Execute the manifest command below to provision Icecast2 and the DarkIce encoding engine.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-accent">
                <span className="text-white">$</span>
                <p>provision --target=pi --engine=darkice --codec=mp3</p>
              </div>
              
              <div className="relative group/cmd transition-transform duration-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent blur opacity-25 group-hover/cmd:opacity-50 transition duration-1000"></div>
                <div className="relative flex items-center bg-black border border-border-dark rounded-md p-6 overflow-hidden">
                  <div className="flex-1 overflow-x-auto scrollbar-hide">
                    <code className="text-white text-sm tracking-tight whitespace-nowrap">
                      {installCommand}
                    </code>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="ml-4 p-3 rounded bg-[#1a1a1a] border border-neutral-800 hover:border-accent hover:text-accent transition-all active:scale-95 text-neutral-400"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-8 opacity-60 space-y-1">
                <p>[INFO] Fetching deployment manifest... <span className="text-green-500">done</span></p>
                <p>[INFO] Target hostname: raspberrypi.local</p>
                <p>[INFO] Interface detected: hw:1,0 (USB Audio Codec)</p>
                <p className="text-neutral-500 italic mt-4 text-[11px]">Ready for one-liner execution.</p>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="mt-10 pt-10 border-t border-border-dark flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="flex gap-4">
              <div className="px-6 py-2.5 border border-[#444] text-[11px] font-bold uppercase tracking-[0.2em] cursor-not-allowed text-[#444]">
                Pause Setup
              </div>
              <div className="px-6 py-2.5 border border-accent bg-accent text-black text-[11px] font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-white hover:border-white transition-colors duration-300 shadow-[0_0_20px_rgba(255,107,0,0.2)]">
                Initialize Stream
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
              <span className="text-[10px] font-mono text-[#555] uppercase tracking-widest mb-3">Manifest Readiness</span>
              <div className="w-full sm:w-64 h-1 bg-[#222] relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "62%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-accent"
                ></motion.div>
              </div>
              <span className="text-[9px] font-mono text-accent mt-2 uppercase">62% Prepared</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer System Bar */}
      <footer className="mt-12 pt-8 border-t border-border-dark flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-[#444] uppercase tracking-[0.2em] gap-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="flex gap-2">
            <span className="text-[#333]">CPU:</span>
            <span className="text-[#666]">12.4%</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#333]">RAM:</span>
            <span className="text-[#666]">256MB / 2.0GB</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#333]">CORE:</span>
            <span className="text-[#666]">42°C</span>
          </div>
        </div>
        <div className="text-center md:text-right">
          <span className="text-accent underline decoration-accent/30 underline-offset-4">ICECAST_URL: {appUrl}:8000/vinyl</span>
        </div>
      </footer>
    </div>
  );
}
