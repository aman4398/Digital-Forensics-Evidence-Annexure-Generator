import React, { useState } from 'react';
import { Premise, Device, CaseInfo } from '../types';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Download, 
  Upload, 
  Layers, 
  FileText,
  Copy,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { exportFullCaseJson, exportPremiseJson } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  premises: Premise[];
  activePremiseId: string;
  devices: Device[];
  caseInfo: CaseInfo;
  onSelectPremise: (id: string) => void;
  onAddPremise: (code: string, name: string, address: string) => void;
  onDeletePremise: (id: string) => void;
  onImportJson: (data: any) => void;
}

export const PremiseManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  premises,
  activePremiseId,
  devices,
  caseInfo,
  onSelectPremise,
  onAddPremise,
  onDeletePremise,
  onImportJson,
}) => {
  if (!isOpen) return null;

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState(`Premise-${String(premises.length + 1).padStart(2, '0')}`);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [batchCount, setBatchCount] = useState(5);

  const handleCreatePremise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    onAddPremise(
      newCode.trim(),
      newName.trim() || `Premise Location #${premises.length + 1}`,
      newAddress.trim() || 'Address as per Search Warrant'
    );
    setShowAddForm(false);
    setNewCode(`Premise-${String(premises.length + 2).padStart(2, '0')}`);
    setNewName('');
    setNewAddress('');
  };

  const handleBatchCreate = () => {
    if (confirm(`Do you want to batch-generate ${batchCount} additional premise slots (e.g. Premise-${premises.length + 1} to Premise-${premises.length + batchCount})?`)) {
      for (let i = 1; i <= batchCount; i++) {
        const nextNum = premises.length + i;
        const code = `Premise-${String(nextNum).padStart(2, '0')}`;
        onAddPremise(
          code,
          `Premise Location #${nextNum}`,
          `Address of Search Premise #${nextNum}`
        );
      }
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportJson(json);
        alert('Dossier data successfully imported from field file!');
      } catch (err) {
        alert('Failed to parse JSON file. Please ensure it is a valid WALCore Forensic Dossier file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-900 my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Multi-Premise Search Operations &bull; 20+ Premises Management</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Premises &amp; Search Locations ({premises.length} active)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTROLS BAR */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Single Premise</span>
            </button>

            <button
              onClick={handleBatchCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-blue-700 font-semibold rounded-lg border border-slate-300 transition-colors shadow-2xs"
              title="Batch generate up to 20+ premises"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Batch Add 5 Premises</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-300 cursor-pointer transition-colors shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import Field JSON</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>

            <button
              onClick={() => exportFullCaseJson(caseInfo, premises, devices)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export All Premises JSON</span>
            </button>
          </div>
        </div>

        {/* ADD PREMISE FORM EXPANDABLE */}
        {showAddForm && (
          <form onSubmit={handleCreatePremise} className="p-4 bg-blue-50/50 border-b border-blue-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in duration-200">
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Premise Code</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                placeholder="Premise-03"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Location / Premise Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                placeholder="Branch Office / Factory 1"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Search Address</label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                placeholder="Address as per warrant"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
              >
                Create Premise
              </button>
            </div>
          </form>
        )}

        {/* PREMISES GRID */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {premises.map((p) => {
            const premiseDevices = devices.filter(d => d.premiseId === p.id);
            const isActive = p.id === activePremiseId;

            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-blue-700">{p.code}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                          Active Premise
                        </span>
                      )}
                      <span className="text-xs text-slate-500">&bull; {premiseDevices.length} digital device{premiseDevices.length === 1 ? '' : 's'}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">
                      {p.name}
                    </h4>

                    <div className="text-xs text-slate-600 truncate mt-0.5">
                      {p.address}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1">
                      <span className="text-slate-700 font-medium">Assessee: </span>{p.assesseeName} &bull; <span className="text-slate-700 font-medium">Officer: </span>{p.authorizedOfficer.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isActive ? (
                    <button
                      onClick={() => {
                        onSelectPremise(p.id);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                    >
                      Switch to this Premise
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-semibold px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Working on this
                    </span>
                  )}

                  <button
                    onClick={() => exportPremiseJson(p, devices)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    title="Export this premise dossier (.json)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {premises.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${p.code} and its ${premiseDevices.length} registered devices?`)) {
                          onDeletePremise(p.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                      title="Delete premise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
