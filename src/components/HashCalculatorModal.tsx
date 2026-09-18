import React, { useState } from 'react';
import { X, Hash, Upload, Copy, Check, FileCheck, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyHash?: (hash: string) => void;
}

export const HashCalculatorModal: React.FC<Props> = ({ isOpen, onClose, onApplyHash }) => {
  if (!isOpen) return null;

  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [sha256, setSha256] = useState('');
  const [sha1, setSha1] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [copiedSha256, setCopiedSha256] = useState(false);
  const [testText, setTestText] = useState('');

  const calculateHashesForFile = async (file: File) => {
    setIsHashing(true);
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB (${file.size.toLocaleString()} bytes)`);

    try {
      const buffer = await file.arrayBuffer();

      // SHA-256
      const hashBuffer256 = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
      const hashHex256 = hashArray256.map(b => b.toString(16).padStart(2, '0')).join('');
      setSha256(hashHex256);

      // SHA-1
      const hashBuffer1 = await crypto.subtle.digest('SHA-1', buffer);
      const hashArray1 = Array.from(new Uint8Array(hashBuffer1));
      const hashHex1 = hashArray1.map(b => b.toString(16).padStart(2, '0')).join('');
      setSha1(hashHex1);
    } catch (err) {
      console.error('Error calculating hash', err);
      alert('Failed to hash file. Memory limits may apply for multi-gigabyte files.');
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      calculateHashesForFile(file);
    }
  };

  const handleHashText = async () => {
    if (!testText) return;
    setIsHashing(true);
    setFileName('Text Input String');
    setFileSize(`${testText.length} characters`);

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(testText);

      const hashBuffer256 = await crypto.subtle.digest('SHA-256', data);
      const hashHex256 = Array.from(new Uint8Array(hashBuffer256)).map(b => b.toString(16).padStart(2, '0')).join('');
      setSha256(hashHex256);

      const hashBuffer1 = await crypto.subtle.digest('SHA-1', data);
      const hashHex1 = Array.from(new Uint8Array(hashBuffer1)).map(b => b.toString(16).padStart(2, '0')).join('');
      setSha1(hashHex1);
    } finally {
      setIsHashing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-900 my-auto overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Offline Digital Forensics Hash Calculator
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <strong>100% Air-Gapped &amp; Client-Side:</strong> Files selected here never leave your local machine or tamper with original evidence. Computed via native Web Crypto.
            </div>
          </div>

          {/* DROPZONE / FILE SELECTOR */}
          <div>
            <label className="block text-slate-700 font-semibold mb-2">
              Select Forensic File / Extraction to Hash:
            </label>
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-all">
              <Upload className="w-8 h-8 text-blue-600" />
              <div className="text-slate-800 font-semibold text-center">
                Click or drag &amp; drop file to calculate checksum
              </div>
              <div className="text-[11px] text-slate-500">
                Supports .E01, .dd, .raw, .zip, .tar, .pdf, forensic dumps
              </div>
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* TEXT HASH FALLBACK */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-slate-600 mb-1 font-medium">Or Hash Text / Serial / Ledger Record:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Enter string (e.g. device serial or log line)..."
                className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
              />
              <button
                type="button"
                onClick={handleHashText}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
              >
                Hash String
              </button>
            </div>
          </div>

          {/* RESULTS DISPLAY */}
          {isHashing ? (
            <div className="p-6 text-center text-slate-500">
              <div className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <div>Computing cryptographic hash (SHA-256 / SHA-1)...</div>
            </div>
          ) : sha256 ? (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-600 font-medium">Source: {fileName}</span>
                <span className="font-mono text-slate-600">{fileSize}</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-800">SHA-256 Checksum (Statutory Standard):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sha256);
                      setCopiedSha256(true);
                      setTimeout(() => setCopiedSha256(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    {copiedSha256 ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSha256 ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-300 text-emerald-800 break-all select-all shadow-2xs font-semibold">
                  {sha256}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">SHA-1 Checksum:</span>
                <div className="font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-300 text-slate-700 break-all select-all shadow-2xs">
                  {sha1}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
