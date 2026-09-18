import React, { useState, useEffect } from 'react';
import { CaseInfo, Premise, Device, DocumentType } from './types';
import { 
  loadStoredCase, 
  saveStoredCase, 
  exportPremiseJson, 
  exportFullCaseJson 
} from './utils/storage';
import { initialCaseInfo, initialPremises, initialDevices } from './data/initialData';
import { DocumentViewer } from './components/DocumentViewer';
import { DeviceManager } from './components/DeviceManager';
import { PremiseDetailsForm } from './components/PremiseDetailsForm';
import { PremiseManagerModal } from './components/PremiseManagerModal';
import { PremisesDashboard } from './components/PremisesDashboard';
import { DeviceFormModal } from './components/DeviceFormModal';
import { 
  Building2, 
  Laptop, 
  FileText, 
  Layers, 
  Shield, 
  Plus, 
  Printer, 
  ChevronDown, 
  Users,
  CheckCircle2,
  FolderArchive
} from 'lucide-react';

export default function App() {
  // Load local persisted data or fallback to sample case data
  const [dataLoaded, setDataLoaded] = useState(false);
  const [caseInfo, setCaseInfo] = useState<CaseInfo>(initialCaseInfo);
  const [premises, setPremises] = useState<Premise[]>(initialPremises);
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [activePremiseId, setActivePremiseId] = useState<string>(initialPremises[0].id);

  // Active view tab: PREMISES (Past & New), DEVICES (Evidence Ledger), REPORTS (Annexures A-G), PREMISE_INFO
  const [activeTab, setActiveTab] = useState<'PREMISES' | 'DEVICES' | 'REPORTS' | 'PREMISE_INFO'>('PREMISES');

  // Modals state
  const [showPremiseModal, setShowPremiseModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('ALL_DOSSIER');
  const [selectedDocDeviceId, setSelectedDocDeviceId] = useState<string>('');

  // Initialize from storage on mount
  useEffect(() => {
    const stored = loadStoredCase();
    if (stored) {
      setCaseInfo(stored.caseInfo);
      setPremises(stored.premises);
      setDevices(stored.devices);
      if (stored.premises.length > 0) {
        setActivePremiseId(stored.premises[0].id);
      }
    }
    setDataLoaded(true);
  }, []);

  // Save to storage whenever state updates
  useEffect(() => {
    if (dataLoaded) {
      saveStoredCase(caseInfo, premises, devices);
    }
  }, [caseInfo, premises, devices, dataLoaded]);

  // Current active premise and its associated devices
  const activePremise = premises.find(p => p.id === activePremiseId) || premises[0] || initialPremises[0];
  const activePremiseDevices = devices.filter(d => d.premiseId === activePremise?.id);

  // Premise update handler
  const handleUpdateActivePremise = (updated: Premise) => {
    setPremises(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Sync officer and forensic team across all premises (for multi-premise raids)
  const handleApplyOfficerToAllPremises = (
    officer: Premise['authorizedOfficer'], 
    team: Premise['forensicTeam']
  ) => {
    setPremises(prev => prev.map(p => ({
      ...p,
      authorizedOfficer: { ...officer },
      forensicTeam: { ...team },
    })));
  };

  // Add new premise from dashboard form
  const handleCreatePremiseFromDashboard = (newPremise: Premise) => {
    setPremises(prev => [...prev, newPremise]);
    setActivePremiseId(newPremise.id);
  };

  // Add new premise from modal
  const handleAddPremise = (code: string, name: string, address: string) => {
    const newPremise: Premise = {
      ...JSON.parse(JSON.stringify(activePremise)),
      id: `premise-${Date.now()}`,
      code,
      name,
      address,
    };
    setPremises(prev => [...prev, newPremise]);
    setActivePremiseId(newPremise.id);
  };

  // Delete premise
  const handleDeletePremise = (id: string) => {
    if (premises.length <= 1) {
      alert('At least one premise must remain in the case.');
      return;
    }
    setPremises(prev => prev.filter(p => p.id !== id));
    setDevices(prev => prev.filter(d => d.premiseId !== id));
    if (activePremiseId === id) {
      const remaining = premises.filter(p => p.id !== id);
      setActivePremiseId(remaining[0].id);
    }
  };

  // Import JSON handler
  const handleImportJson = (imported: any) => {
    if (imported.premise && Array.isArray(imported.devices)) {
      const importedPremise: Premise = imported.premise;
      const importedDevs: Device[] = imported.devices;
      
      setPremises(prev => {
        const existingIdx = prev.findIndex(p => p.id === importedPremise.id || p.code === importedPremise.code);
        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = importedPremise;
          return next;
        }
        return [...prev, importedPremise];
      });

      setDevices(prev => {
        const otherDevs = prev.filter(d => d.premiseId !== importedPremise.id);
        return [...otherDevs, ...importedDevs];
      });

      setActivePremiseId(importedPremise.id);
    } else if (imported.premises && imported.devices) {
      if (imported.caseInfo) setCaseInfo(imported.caseInfo);
      setPremises(imported.premises);
      setDevices(imported.devices);
      if (imported.premises[0]) setActivePremiseId(imported.premises[0].id);
    }
  };

  // Device CRUD Handlers - Only persists data, does NOT generate reports
  const handleSaveDevice = (device: Device) => {
    setDevices(prev => {
      const idx = prev.findIndex(d => d.id === device.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = device;
        return next;
      }
      return [...prev, device];
    });
  };

  const handleDuplicateDevice = (device: Device) => {
    const clone: Device = {
      ...JSON.parse(JSON.stringify(device)),
      id: `dev-${Date.now()}`,
      deviceName: `${device.deviceName} (Copy)`,
      serialNumber: `${device.serialNumber}-CPY`,
      sha256Hash1: '',
      md5Hash: '',
      sha1Hash: '',
    };
    setDevices(prev => [...prev, clone]);
  };

  const handleDeleteDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
  };

  const handleOpenEditDevice = (device: Device) => {
    setEditingDevice(device);
    setShowDeviceModal(true);
  };

  const handleOpenNewDevice = () => {
    setEditingDevice(null);
    setShowDeviceModal(true);
  };

  const handleSelectDocumentForDevice = (device: Device) => {
    setSelectedDocDeviceId(device.id);
    if (device.deviceCategory === 'mobile') {
      setSelectedDocType('ANNEXURE_D');
    } else if (device.deviceCategory === 'cloud') {
      setSelectedDocType('ANNEXURE_F');
    } else {
      setSelectedDocType('ANNEXURE_B');
    }
    setActiveTab('REPORTS');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* TOP CLEAN HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* BRANDING & CASE INFO */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-blue-600 rounded-xl shadow-xs text-white shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-slate-900 tracking-tight truncate">
                    Digital Forensics Evidence &amp; Annexure Suite
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    BSA 2023 Sec 63(4)(c) Compliant
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  <span className="text-slate-800 font-semibold">{caseInfo.assesseeGroup}</span> &bull; Ref: <span className="font-mono text-slate-700">{caseInfo.operationName}</span>
                </div>
              </div>
            </div>

            {/* PREMISE SELECTOR & PRINT BUTTON */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPremiseModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
                title="Switch premise or manage all premises"
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="font-mono font-bold text-blue-700">{activePremise?.code}</span>
                <span className="hidden md:inline text-slate-600">({premises.length} Premise{premises.length > 1 ? 's' : ''})</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                title="Print court-admissible PDF dossier"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="border-t border-slate-200 bg-slate-50/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-2">
              <button
                onClick={() => setActiveTab('PREMISES')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'PREMISES'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>1. Search Premises Ledger ({premises.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('DEVICES')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'DEVICES'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>2. Evidence Devices &amp; Custody ({activePremiseDevices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('REPORTS')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'REPORTS'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>3. Statutory Forensic Reports (Annexures A to G)</span>
              </button>

              <button
                onClick={() => setActiveTab('PREMISE_INFO')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'PREMISE_INFO'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                <span>Fixed Master Details</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 print:p-0 print:m-0 print:max-w-none">
        
        {/* ACTIVE PREMISE STATUS STRIP (Shown on Devices, Reports and Info tabs) */}
        {activeTab !== 'PREMISES' && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs print:hidden shadow-xs">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-sm">
                {activePremise.code}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {activePremise.name}
                </div>
                <div className="text-slate-500 text-[11px] truncate max-w-xl">
                  {activePremise.address} &bull; Target: <span className="text-slate-800 font-semibold">{activePremise.assesseeName}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
              <div>
                <span className="text-slate-400">Authorised Officer: </span>
                <span className="text-slate-800 font-semibold">{activePremise.authorizedOfficer.name}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">&bull;</span>
              <div>
                <span className="text-slate-400">Lead Examiner: </span>
                <span className="text-emerald-700 font-semibold">{activePremise.forensicTeam.examinerName}</span>
              </div>
              {activePremise.forensicTeam.coExaminers && activePremise.forensicTeam.coExaminers.length > 0 && (
                <>
                  <span className="text-slate-300 hidden sm:inline">&bull;</span>
                  <div className="flex items-center gap-1 text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    <Users className="w-3 h-3" />
                    <span>{activePremise.forensicTeam.coExaminers.length} Co-Examiner{activePremise.forensicTeam.coExaminers.length > 1 ? 's' : ''}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: PREMISES DASHBOARD (ALL PAST PREMISES & CREATE/SAVE PREMISE) */}
        {activeTab === 'PREMISES' && (
          <PremisesDashboard
            premises={premises}
            activePremiseId={activePremiseId}
            devices={devices}
            onSelectPremise={(id) => setActivePremiseId(id)}
            onCreatePremise={handleCreatePremiseFromDashboard}
            onDeletePremise={handleDeletePremise}
            onNavigateToDevices={() => setActiveTab('DEVICES')}
            onNavigateToReports={() => setActiveTab('REPORTS')}
            onOpenNewDevice={handleOpenNewDevice}
            onEditPremiseDetails={() => setActiveTab('PREMISE_INFO')}
          />
        )}

        {/* TAB 2: EVIDENCE DEVICES LEDGER */}
        {activeTab === 'DEVICES' && (
          <DeviceManager
            premise={activePremise}
            devices={activePremiseDevices}
            onOpenNewDevice={handleOpenNewDevice}
            onEditDevice={handleOpenEditDevice}
            onDuplicateDevice={handleDuplicateDevice}
            onDeleteDevice={handleDeleteDevice}
            onSelectDocumentForDevice={handleSelectDocumentForDevice}
            onGenerateReports={() => setActiveTab('REPORTS')}
          />
        )}

        {/* TAB 3: STATUTORY FORENSIC REPORTS (ANNEXURES A TO G) */}
        {activeTab === 'REPORTS' && (
          <DocumentViewer
            premise={activePremise}
            devices={activePremiseDevices}
            onOpenDeviceEdit={handleOpenEditDevice}
            onOpenNewDevice={handleOpenNewDevice}
            onUpdatePremise={handleUpdateActivePremise}
            initialDocType={selectedDocType}
            initialDeviceId={selectedDocDeviceId}
          />
        )}

        {/* TAB 4: PREMISE FIXED DETAILS */}
        {activeTab === 'PREMISE_INFO' && (
          <PremiseDetailsForm
            premise={activePremise}
            totalPremisesCount={premises.length}
            onUpdatePremise={handleUpdateActivePremise}
            onApplyOfficerToAllPremises={handleApplyOfficerToAllPremises}
          />
        )}
      </main>

      {/* CLEAN FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 print:hidden mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Digital Forensics Evidence &amp; Annexure Suite &bull; Statutory Compliance under Bharatiya Sakshya Adhiniyam, 2023
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-600 font-medium">Offline Storage Persistent</span>
            <span>&bull;</span>
            <span className="text-slate-600 font-medium">Field Investigation Ready</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <PremiseManagerModal
        isOpen={showPremiseModal}
        onClose={() => setShowPremiseModal(false)}
        premises={premises}
        activePremiseId={activePremiseId}
        devices={devices}
        caseInfo={caseInfo}
        onSelectPremise={(id) => setActivePremiseId(id)}
        onAddPremise={handleAddPremise}
        onDeletePremise={handleDeletePremise}
        onImportJson={handleImportJson}
      />

      <DeviceFormModal
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        device={editingDevice}
        premise={activePremise}
        onSave={handleSaveDevice}
      />
    </div>
  );
}


