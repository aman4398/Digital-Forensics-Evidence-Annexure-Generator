import React from 'react';
import { X, HardDrive, WifiOff, FileCheck, Layers, Terminal, Shield, Download, Upload } from 'lucide-react';
import { Premise, Device, CaseInfo } from '../types';
import { exportFullCaseJson } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  caseInfo: CaseInfo;
  premises: Premise[];
  devices: Device[];
}

export const OfflineSyncInfoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  caseInfo,
  premises,
  devices,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-900 my-auto overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              Offline Multi-Premise Sync &amp; Electron Desktop Workflow
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* NOTICE BANNER */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-relaxed">
            <strong>20+ Premises Raid Strategy:</strong> Income Tax and Enforcement Directorate (ED) search &amp; seizure operations are executed under strict communication blackout conditions with zero internet connectivity. This application is built 100% offline-first.
          </div>

          {/* STEP BY STEP WORKFLOW */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
              How to Coordinate 20+ Premises in the Field:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-2">1</div>
                <div className="font-bold text-slate-900 mb-1">Field Entry at Premise</div>
                <p className="text-slate-600 text-[11px]">
                  Each forensic team on-site logs premise details once, then records all digital devices into the offline app.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mb-2">2</div>
                <div className="font-bold text-slate-900 mb-1">Export Premise JSON</div>
                <p className="text-slate-600 text-[11px]">
                  Click &ldquo;Export Dossier (JSON)&rdquo; to save the premise dataset to an encrypted or air-gapped USB flash drive.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mb-2">3</div>
                <div className="font-bold text-slate-900 mb-1">Central Raid Merge</div>
                <p className="text-slate-600 text-[11px]">
                  The Central Control Room / Conducting DDIT clicks &ldquo;Import Field JSON&rdquo; to merge all 20+ premises into the Master Case.
                </p>
              </div>
            </div>
          </div>

          {/* DESKTOP ELECTRON APP SECTION */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-slate-900 text-xs">Run as Standalone Native Desktop App (Electron)</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              The repository includes pre-configured <code className="text-blue-700 font-semibold bg-blue-50 px-1 py-0.5 rounded">electron-main.cjs</code> and <code className="text-blue-700 font-semibold bg-blue-50 px-1 py-0.5 rounded">electron-preload.cjs</code>. To run as an offline desktop window:
            </p>
            <div className="p-2.5 bg-white font-mono text-[11px] text-emerald-800 rounded-lg border border-slate-300 select-all font-semibold shadow-2xs">
              npm run electron
            </div>
            <p className="text-slate-500 text-[11px]">
              In Electron mode, the app uses native operating system file dialogs and direct print-to-PDF drivers.
            </p>
          </div>

          {/* EXPORT MASTER CASE */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-200">
            <div>
              <div className="font-bold text-slate-900">Consolidated Case Dossier</div>
              <div className="text-[11px] text-slate-500">
                Contains {premises.length} premises and {devices.length} total logged devices.
              </div>
            </div>

            <button
              onClick={() => exportFullCaseJson(caseInfo, premises, devices)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Master Case (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
