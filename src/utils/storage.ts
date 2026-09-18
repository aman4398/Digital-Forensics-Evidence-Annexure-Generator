import { CaseInfo, Premise, Device } from '../types';
import { initialCaseInfo, initialPremises, initialDevices } from '../data/initialData';

const STORAGE_KEYS = {
  CASE_INFO: 'walcore_forensic_case_info_v3',
  PREMISES: 'walcore_forensic_premises_v3',
  DEVICES: 'walcore_forensic_devices_v3',
  ACTIVE_PREMISE_ID: 'walcore_active_premise_id_v3',
};

export interface StoredAppState {
  caseInfo: CaseInfo;
  premises: Premise[];
  devices: Device[];
  activePremiseId: string;
}

export function clearAllStorage() {
  try {
    const legacyKeys = [
      'walcore_forensic_case_info_v1',
      'walcore_forensic_premises_v1',
      'walcore_forensic_devices_v1',
      'walcore_active_premise_id_v1',
      'walcore_forensic_case_info_v2',
      'walcore_forensic_premises_v2',
      'walcore_forensic_devices_v2',
      'walcore_active_premise_id_v2',
      STORAGE_KEYS.CASE_INFO,
      STORAGE_KEYS.PREMISES,
      STORAGE_KEYS.DEVICES,
      STORAGE_KEYS.ACTIVE_PREMISE_ID,
    ];
    legacyKeys.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
}

export function loadAppState(): StoredAppState {
  try {
    // Clear legacy v1/v2 prefilled data if found
    ['walcore_forensic_case_info_v1', 'walcore_forensic_premises_v1', 'walcore_forensic_devices_v1', 'walcore_active_premise_id_v1',
     'walcore_forensic_case_info_v2', 'walcore_forensic_premises_v2', 'walcore_forensic_devices_v2', 'walcore_active_premise_id_v2'].forEach(k => {
      if (localStorage.getItem(k)) localStorage.removeItem(k);
    });

    const savedCase = localStorage.getItem(STORAGE_KEYS.CASE_INFO);
    const savedPremises = localStorage.getItem(STORAGE_KEYS.PREMISES);
    const savedDevices = localStorage.getItem(STORAGE_KEYS.DEVICES);
    const savedActivePremiseId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PREMISE_ID);

    const caseInfo: CaseInfo = savedCase ? JSON.parse(savedCase) : initialCaseInfo;
    const premises: Premise[] = savedPremises ? JSON.parse(savedPremises) : initialPremises;
    const devices: Device[] = savedDevices ? JSON.parse(savedDevices) : initialDevices;
    const activePremiseId = savedActivePremiseId && premises.some(p => p.id === savedActivePremiseId)
      ? savedActivePremiseId
      : (premises[0]?.id || '');

    return { caseInfo, premises, devices, activePremiseId };
  } catch (e) {
    console.error('Failed to load saved state from localStorage:', e);
    return {
      caseInfo: initialCaseInfo,
      premises: initialPremises,
      devices: initialDevices,
      activePremiseId: '',
    };
  }
}

export function saveAppState(state: Partial<StoredAppState>) {
  try {
    if (state.caseInfo) {
      localStorage.setItem(STORAGE_KEYS.CASE_INFO, JSON.stringify(state.caseInfo));
    }
    if (state.premises) {
      localStorage.setItem(STORAGE_KEYS.PREMISES, JSON.stringify(state.premises));
    }
    if (state.devices) {
      localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(state.devices));
    }
    if (state.activePremiseId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PREMISE_ID, state.activePremiseId);
    }
  } catch (e) {
    console.error('Failed to persist app state:', e);
  }
}

export function loadStoredCase(): StoredAppState {
  return loadAppState();
}

export function saveStoredCase(caseInfo: CaseInfo, premises: Premise[], devices: Device[], activePremiseId?: string) {
  saveAppState({ caseInfo, premises, devices, activePremiseId });
}

export function exportPremiseJson(premise: Premise, devices: Device[]) {
  const premiseDevices = devices.filter(d => d.premiseId === premise.id);
  const data = {
    exportType: 'SINGLE_PREMISE',
    exportedAt: new Date().toISOString(),
    premise,
    devices: premiseDevices,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeCode = premise.code.replace(/[^a-zA-Z0-9_-]/g, '_');
  a.href = url;
  a.download = `Forensic_Dossier_${safeCode}_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportFullCaseJson(caseInfo: CaseInfo, premises: Premise[], devices: Device[]) {
  const data = {
    exportType: 'FULL_CASE',
    exportedAt: new Date().toISOString(),
    caseInfo,
    premises,
    devices,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `All_Premises_Evidence_Case_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function isElectronApp(): boolean {
  return typeof window !== 'undefined' && (
    !!(window as unknown as { electron?: unknown }).electron ||
    !!(window as unknown as { process?: { type?: string } }).process?.type
  );
}

// Compute hash demo using Web Crypto API if file is provided
export async function computeFileHash(file: File, algorithm: 'SHA-256' | 'SHA-1' | 'SHA-512'): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
