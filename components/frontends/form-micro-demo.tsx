'use client';

import React, { useState, useRef } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import { Eye, EyeOff, ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export function FormMicroDemo() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('supersecret849');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [hapticHapticsEnabled, setHapticsEnabled] = useState(true);
  const [lowLatencyMode, setLowLatencyMode] = useState(true);
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const togglePasswordVisibility = () => {
    const next = !showPassword;
    setShowPassword(next);
    if (next) {
      playSound('unlock');
    } else {
      playSound('lock');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value) {
      playSound('keystroke');
      if (index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
      playSound('tap');
    }
  };

  const toggleHaptics = () => {
    const next = !hapticHapticsEnabled;
    setHapticsEnabled(next);
    playSound(next ? 'toggle-on' : 'toggle-off');
  };

  const toggleLatency = () => {
    const next = !lowLatencyMode;
    setLowLatencyMode(next);
    playSound(next ? 'toggle-on' : 'toggle-off');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) {
      playSound('warning');
      setStatus('error');
      setStatusMessage('Please complete the 4-digit code (e.g. 1 2 3 4)');
      return;
    }

    if (entered === '1234' || entered === '8888') {
      playSound('success');
      setStatus('success');
      setStatusMessage('Authentication validated successfully!');
    } else {
      playSound('error');
      setStatus('error');
      setStatusMessage('Invalid security code. Try code "1234"');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7 shadow-2xl text-neutral-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ff3700]/10 border border-[#ff3700]/20 flex items-center justify-center text-[#ff3700]">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h4 className="font-helvetica-neue text-sm font-semibold text-white">Security & Form Interactions</h4>
            <p className="text-[11px] font-mono text-neutral-400">Lock/unlock reveals, keystroke clicks & toggle switches</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleVerify} className="mt-5 space-y-4">
        {/* Password input with lock/unlock sound */}
        <div>
          <label className="block text-xs font-mono text-neutral-300 mb-1.5 flex items-center justify-between">
            <span>Secret Passkey</span>
            <span className="text-[10px] text-neutral-500">unlock / lock sound</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3.5 pr-10 rounded-xl border border-white/[0.08] bg-[#16161a] text-xs font-mono text-white outline-none focus:border-[#ff3700]/50 transition-colors"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              title={showPassword ? 'Hide passkey (lock)' : 'Show passkey (unlock)'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* 4-digit OTP input with keystroke feedback */}
        <div>
          <label className="block text-xs font-mono text-neutral-300 mb-1.5 flex items-center justify-between">
            <span>Two-Factor Pin (Type 1-2-3-4)</span>
            <span className="text-[10px] text-neutral-500">keystroke feedback</span>
          </label>
          <div className="flex items-center justify-between gap-2.5">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                className="w-full h-12 text-center text-base font-mono font-bold rounded-xl border border-white/[0.08] bg-[#16161a] text-white outline-none focus:border-[#ff3700] transition-all"
              />
            ))}
          </div>
        </div>

        {/* Toggle Switches */}
        <div className="pt-2 space-y-2.5">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161a] border border-white/[0.04]">
            <div className="text-xs font-mono">
              <span className="text-white block font-medium">Haptic Feedback Emulation</span>
              <span className="text-[10px] text-neutral-400">Play soft micro-tones on interaction</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={hapticHapticsEnabled}
              onClick={toggleHaptics}
              title="Toggle haptics (toggle-on / toggle-off)"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                hapticHapticsEnabled ? 'bg-[#ff3700]' : 'bg-[#26262a]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  hapticHapticsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161a] border border-white/[0.04]">
            <div className="text-xs font-mono">
              <span className="text-white block font-medium">Sub-millisecond Pre-warming</span>
              <span className="text-[10px] text-neutral-400">Keep AudioContext active without suspension</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={lowLatencyMode}
              onClick={toggleLatency}
              title="Toggle latency (toggle-on / toggle-off)"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                lowLatencyMode ? 'bg-[#ff3700]' : 'bg-[#26262a]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  lowLatencyMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Status indicator */}
        {status !== 'idle' && (
          <div
            className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150 ${
              status === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {status === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-10 rounded-xl bg-[#ff3700] hover:bg-[#ff4500] active:scale-[0.98] text-white font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,55,0,0.25)] cursor-pointer"
        >
          <KeyRound size={13} />
          <span>Verify & Unlock Session</span>
        </button>
      </form>
    </div>
  );
}
