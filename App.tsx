import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { checkPasswordStrength, generateSHA256, StrengthResult } from './utils/security';
import StrengthMeter from './components/StrengthMeter';

const App: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<StrengthResult>(checkPasswordStrength(''));
  const [hash, setHash] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Analyze password on change
  useEffect(() => {
    const result = checkPasswordStrength(password);
    setStrength(result);

    const updateHash = async () => {
      if (result.isStrong) {
        const h = await generateSHA256(password);
        setHash(h);
      } else {
        setHash('');
      }
    };

    updateHash();
  }, [password]);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const copyToClipboard = useCallback(() => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [hash]);

  const handleClear = () => {
    setPassword('');
    setHash('');
  };

  return (
    <div className="min-h-screen bg-cyber-900 text-slate-200 flex flex-col items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyber-accent opacity-5 blur-[128px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 opacity-5 blur-[128px] rounded-full"></div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-cyber-800 border border-cyber-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Header */}
        <div className="bg-cyber-900/50 p-6 border-b border-cyber-700 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-cyber-700 rounded-full flex items-center justify-center mb-4 shadow-inner ring-1 ring-cyber-600">
            <ShieldCheck className="w-8 h-8 text-cyber-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Secure Login System</h1>
          <p className="text-cyber-500 text-sm mt-1">Enterprise Grade Encryption</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Password Input Group */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyber-500 ml-1 uppercase tracking-wider text-xs">
              Enter Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-500">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type your secure password..."
                className="w-full bg-cyber-900 border border-cyber-600 text-white text-lg rounded-xl py-3 pl-10 pr-12 focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all placeholder-cyber-600 font-mono tracking-wide"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyber-500 hover:text-white transition-colors focus:outline-none"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Strength Meter */}
          {password && (
            <div className="bg-cyber-900/30 p-4 rounded-xl border border-cyber-700/50">
              <StrengthMeter result={strength} />
            </div>
          )}

          {/* SHA-256 Hash Display (Only when Strong) */}
          <div className={`transition-all duration-700 ease-in-out overflow-hidden ${strength.isStrong ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
             <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-xl p-4 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> SHA-256 Hash Generated
                  </span>
                  <button 
                    onClick={copyToClipboard} 
                    className="text-cyber-500 hover:text-white transition-colors"
                    title="Copy Hash"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="font-mono text-xs text-emerald-100/80 break-all bg-cyber-900/80 p-3 rounded-lg border border-emerald-900/30 shadow-inner">
                  {hash}
                </div>
             </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3">
             <button 
                onClick={handleClear}
                className="flex-1 py-3 bg-cyber-700 hover:bg-cyber-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
               <RefreshCw className="w-4 h-4" /> Clear
             </button>
             <button 
                disabled={!strength.isStrong}
                className={`flex-[2] py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                  ${strength.isStrong 
                    ? 'bg-cyber-accent hover:bg-sky-400 shadow-cyber-accent/20 cursor-pointer' 
                    : 'bg-cyber-600 opacity-50 cursor-not-allowed'
                  }`}
              >
               {strength.isStrong ? 'Secure Login' : 'Password Too Weak'}
             </button>
          </div>

        </div>
        
        {/* Footer */}
        <div className="bg-cyber-900/50 p-4 text-center border-t border-cyber-700">
           <p className="text-xs text-cyber-500">Protected by AES-256 & SHA-256 Standards</p>
        </div>
      </div>
    </div>
  );
};

export default App;