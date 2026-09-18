import React, { useState } from 'react';
import { Premise, Device, DocumentType } from '../types';
import { AnnexureA } from './documents/AnnexureA';
import { AnnexureB } from './documents/AnnexureB';
import { AnnexureC } from './documents/AnnexureC';
import { AnnexureD } from './documents/AnnexureD';
import { AnnexureE } from './documents/AnnexureE';
import { AnnexureF } from './documents/AnnexureF';
import { AnnexureG } from './documents/AnnexureG';
import { FeedbackForm } from './documents/FeedbackForm';
import { WorkCompletionLetter } from './documents/WorkCompletionLetter';
import { 
  Printer, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Smartphone, 
  Laptop, 
  Database, 
  ShieldCheck, 
  FileSpreadsheet, 
  Award,
  AlertCircle,
  Plus
} from 'lucide-react';
import { exportPremiseJson } from '../utils/storage';

interface Props {
  premise: Premise;
  devices: Device[];
  onOpenDeviceEdit: (device: Device) => void;
  onOpenNewDevice: () => void;
  onUpdatePremise?: (updated: Premise) => void;
  initialDocType?: DocumentType;
  initialDeviceId?: string;
}

export const DocumentViewer: React.FC<Props> = ({
  premise,
  devices,
  onOpenDeviceEdit,
  onOpenNewDevice,
  onUpdatePremise,
  initialDocType = 'ALL_DOSSIER',
  initialDeviceId,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentType>(initialDocType);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(initialDeviceId || devices[0]?.id || '');
  const [copied, setCopied] = useState(false);

  // 1. Mobile devices (Annexure D target)
  const mobileDevices = devices.filter(d => d.deviceCategory === 'mobile');

  // 2. Non-mobile devices (Annexure B target: other than mobile, excludes cloud)
  const nonMobileDevices = devices.filter(d => d.deviceCategory !== 'mobile' && d.deviceCategory !== 'cloud');

  // 3. Chain of Custody for every device EXCEPT email (Annexure C target)
  const devicesExceptEmail = devices.filter(d => d.deviceCategory !== 'cloud');

  // 4. Cloud, email, iCloud and online repository data (Annexure F target)
  const cloudEvidenceDevices = devices.filter(
    d => d.deviceCategory === 'cloud' || 
         d.deviceCategory === 'file_folder' || 
         d.cloudJobSheet?.isCloudEvidence || 
         d.deviceHandling === 'BACKUP'
  );

  // 5. Check if ERP / Server found on premise (Annexure A statutory requirement)
  const hasServerDevice = devices.some(d => d.deviceCategory === 'server');
  const hasDeclaredErp = Boolean(
    premise.accountingDeclaration?.softwareName &&
    premise.accountingDeclaration.softwareName.trim() !== '' &&
    !['NONE', 'N/A', 'NO', 'NIL', 'NULL'].includes(premise.accountingDeclaration.softwareName.trim().toUpperCase())
  );
  const isErpOrServerFound = premise.accountingDeclaration?.erpOrServerFound ?? (hasServerDevice || hasDeclaredErp);

  const handleToggleErpFound = (found: boolean) => {
    if (onUpdatePremise) {
      onUpdatePremise({
        ...premise,
        accountingDeclaration: {
          ...premise.accountingDeclaration,
          erpOrServerFound: found,
        },
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    exportPremiseJson(premise, devices);
  };

  const handleCopyText = () => {
    const el = document.getElementById('printable-document-content');
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Target devices for device-specific forms
  let targetDevices: Device[] = [];
  let noDevicesMessage = '';
  let addDeviceLabel = '+ Add Device';

  if (selectedDoc === 'ANNEXURE_D') {
    targetDevices = mobileDevices;
    noDevicesMessage = 'Annexure D applies exclusively to Mobile Phones & Tablets. No mobile device is currently recorded at this premise.';
    addDeviceLabel = '+ Add Mobile Phone';
  } else if (selectedDoc === 'ANNEXURE_B') {
    targetDevices = nonMobileDevices;
    noDevicesMessage = 'Annexure B applies to Digital Devices other than mobile (Laptops, Desktops, Servers, Hard Drives, DVRs). No non-mobile hardware is currently recorded at this premise.';
    addDeviceLabel = '+ Add Computer / Drive';
  } else if (selectedDoc === 'ANNEXURE_C') {
    targetDevices = devicesExceptEmail;
    noDevicesMessage = 'Annexure C (Chain of Custody) applies to all physical devices (except intangible cloud email). No physical hardware devices are currently recorded at this premise.';
    addDeviceLabel = '+ Add Physical Device';
  } else if (selectedDoc === 'ANNEXURE_E') {
    targetDevices = devices;
    noDevicesMessage = 'Annexure E (BSA 2023 Sec 63(4)(c) Certificate) applies to every seized or imaged device. No devices have been added yet.';
    addDeviceLabel = '+ Add Device';
  }

  // Active device for current view
  const activeDevice = targetDevices.find(d => d.id === selectedDeviceId) || targetDevices[0];

  const docNavItems: Array<{ 
    type: DocumentType; 
    label: string; 
    code: string; 
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeStyle?: string;
  }> = [
    { 
      type: 'ALL_DOSSIER', 
      label: 'Complete Dossier (All Annexures in Sequence)', 
      code: 'Full Pack (A to G)', 
      icon: Layers,
      badge: `${devices.length} Evidences`,
      badgeStyle: 'bg-slate-100 text-slate-800 border-slate-300'
    },
    { 
      type: 'ANNEXURE_A', 
      label: 'Self Declaration (Only if ERP/Server Found)', 
      code: 'Annexure A (ERP/Server)', 
      icon: FileSpreadsheet,
      badge: isErpOrServerFound ? 'ERP Found' : 'Not Found',
      badgeStyle: isErpOrServerFound ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
    },
    { 
      type: 'ANNEXURE_B', 
      label: 'Device Collection (Other than Mobile)', 
      code: 'Annexure B (Non-Mobile)', 
      icon: Laptop,
      badge: `${nonMobileDevices.length} Hardware`,
      badgeStyle: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    { 
      type: 'ANNEXURE_C', 
      label: 'Chain of Custody (Every Device except Email)', 
      code: 'Annexure C (CoC - No Email)', 
      icon: ShieldCheck,
      badge: `${devicesExceptEmail.length} Physical`,
      badgeStyle: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    { 
      type: 'ANNEXURE_D', 
      label: 'Device Collection (Mobile Phones)', 
      code: 'Annexure D (Mobile)', 
      icon: Smartphone,
      badge: `${mobileDevices.length} Mobiles`,
      badgeStyle: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    },
    { 
      type: 'ANNEXURE_E', 
      label: 'BSA 2023 Sec 63(4)(c) Certificate (Every Device)', 
      code: 'Annexure E (All Devices)', 
      icon: Award,
      badge: `${devices.length} Total`,
      badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    { 
      type: 'ANNEXURE_F', 
      label: 'Cloud, Email, iCloud & Repository Job Sheet', 
      code: 'Annexure F (Cloud/Email)', 
      icon: Database,
      badge: `${cloudEvidenceDevices.length} Cloud/Mail`,
      badgeStyle: 'bg-sky-100 text-sky-800 border-sky-300'
    },
    { 
      type: 'ANNEXURE_G', 
      label: 'Physical Inventory of all the Devices', 
      code: 'Annexure G (Inventory)', 
      icon: FileText,
      badge: `${devices.length} Items`,
      badgeStyle: 'bg-slate-100 text-slate-800 border-slate-300'
    },
    { 
      type: 'FEEDBACK_FORM', 
      label: 'Forensic Team Feedback (DDIT)', 
      code: 'Feedback', 
      icon: ShieldCheck 
    },
    { 
      type: 'WALCORE_LETTER', 
      label: 'Forensic Work Completion Letter', 
      code: 'Completion Letter', 
      icon: FileText 
    },
  ];

  const isDeviceSpecific = ['ANNEXURE_B', 'ANNEXURE_C', 'ANNEXURE_D', 'ANNEXURE_E'].includes(selectedDoc);

  return (
    <div className="space-y-6">
      {/* ACTION & NAVIGATION BAR (Light Mode) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-slate-900 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Auto-Generated Legal Reports &bull; {premise.code}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1.5">
              Evidence Reports &amp; Statutory Annexures
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict statutory mapping for Indian Tax Inv &amp; ED raids under BSA 2023 &bull; {devices.length} total device{devices.length === 1 ? '' : 's'}.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
              title="Print directly or save as clean court-admissible PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save to PDF</span>
            </button>

            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg border border-slate-300 transition-colors shadow-2xs"
              title="Export premise dossier as JSON for field teams / offline sync"
            >
              <Download className="w-4 h-4" />
              <span>Export Dossier (JSON)</span>
            </button>

            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg border border-slate-300 transition-colors shadow-2xs"
              title="Copy active document text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        {/* DOCUMENT TABS CAROUSEL */}
        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {docNavItems.map(item => {
              const Icon = item.icon;
              const isActive = selectedDoc === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => setSelectedDoc(item.type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.code}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${isActive ? 'bg-white/20 text-white border-white/30' : item.badgeStyle}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* DEVICE SELECTOR WHEN DOCUMENT IS DEVICE-SPECIFIC */}
        {isDeviceSpecific && (
          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600 uppercase tracking-wide">
                Select {selectedDoc === 'ANNEXURE_D' ? 'Mobile' : (selectedDoc === 'ANNEXURE_B' ? 'Hardware' : 'Device')}:
              </span>
              {targetDevices.length === 0 ? (
                <span className="text-amber-700 font-medium">No matching devices found for this annexure.</span>
              ) : (
                <select
                  value={activeDevice ? activeDevice.id : ''}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium max-w-xs sm:max-w-md truncate shadow-2xs"
                >
                  {targetDevices.map(dev => (
                    <option key={dev.id} value={dev.id}>
                      [{dev.deviceCategory.toUpperCase()}] {dev.deviceName} &bull; {dev.ownerUserName} {dev.serialNumber ? `(S/N: ${dev.serialNumber})` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeDevice && (
                <button
                  onClick={() => onOpenDeviceEdit(activeDevice)}
                  className="text-xs text-blue-700 hover:text-blue-800 underline font-semibold"
                >
                  Edit This Device's Data
                </button>
              )}
              <span className="text-slate-400">&bull;</span>
              <button
                onClick={onOpenNewDevice}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                {addDeviceLabel}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div 
        id="printable-document-content" 
        className="bg-slate-200/60 p-4 sm:p-8 rounded-xl border border-slate-300 shadow-inner overflow-x-auto print:bg-white print:p-0 print:border-none print:shadow-none print:m-0"
      >
        {selectedDoc === 'ALL_DOSSIER' && (
          <div className="space-y-12">
            {/* DOSSIER COVER HEADER (screen only) */}
            <div className="bg-slate-900 text-white p-6 rounded-lg text-center max-w-[850px] mx-auto mb-6 print:hidden shadow-xs">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-1">
                Central Legal Dossier &bull; Master Package
              </div>
              <h3 className="text-xl font-bold">{premise.assesseeName}</h3>
              <div className="text-sm text-slate-300 mt-1">{premise.name} ({premise.code})</div>
              <div className="text-xs text-slate-400 mt-2 max-w-2xl mx-auto">
                Statutory Dossier Package generated per Indian Tax &amp; ED forensic protocol: Annexure A (only if ERP/Server found), Annexure G (Physical Inventory of all devices), Annexure B (Other than mobile), Annexure D (Mobile phones), Annexure C (Chain of Custody for every device except email), Annexure E (Every device), Annexure F (Email, iCloud, and cloud data).
              </div>
            </div>

            {/* 1. Annexure A: ONLY IF ERP / SERVER FOUND ON PREMISE */}
            {isErpOrServerFound ? (
              <div className="print:break-after-page">
                <div className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded mb-3 print:hidden flex items-center justify-between">
                  <span>✓ Annexure A Included: ERP / Accounting Server Found on Premise</span>
                  {onUpdatePremise && (
                    <button
                      onClick={() => handleToggleErpFound(false)}
                      className="text-[10px] text-rose-700 hover:underline font-medium"
                    >
                      Mark ERP Not Found (Omit Annexure A)
                    </button>
                  )}
                </div>
                <AnnexureA premise={premise} />
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-xs text-amber-950 print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Annexure A Omitted from Master Dossier</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-semibold">Statutory Rule</span>
                  </div>
                  <p className="text-amber-800 text-xs mt-1">
                    Annexure A is statutory <strong>ONLY if an ERP software (SAP/Oracle/Tally) or dedicated Server is discovered at the premise</strong>. No ERP or server is currently marked for this premise.
                  </p>
                </div>
                {onUpdatePremise && (
                  <button
                    onClick={() => handleToggleErpFound(true)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0 shadow-xs"
                  >
                    + Flag ERP/Server Found
                  </button>
                )}
              </div>
            )}

            {/* 2. Annexure G: Physical Inventory of ALL the Devices */}
            <div className="print:break-after-page mt-8">
              <div className="text-[10px] text-slate-700 font-bold bg-slate-100 border border-slate-300 px-3 py-1 rounded mb-2 print:hidden">
                Annexure G &bull; Physical Inventory of all {devices.length} Devices
              </div>
              <AnnexureG premise={premise} devices={devices} />
            </div>

            {/* 3. Annexure B: Devices OTHER than Mobile */}
            {nonMobileDevices.map((device) => (
              <div key={`annex-b-${device.id}`} className="print:break-after-page mt-8">
                <div className="text-[10px] text-blue-700 font-bold bg-blue-50 border border-blue-200 px-3 py-1 rounded mb-2 print:hidden">
                  Annexure B &bull; Device other than mobile: {device.deviceName} ({device.deviceCategory.toUpperCase()})
                </div>
                <AnnexureB premise={premise} device={device} />
              </div>
            ))}

            {/* 4. Annexure D: Mobile Devices */}
            {mobileDevices.map((device) => (
              <div key={`annex-d-${device.id}`} className="print:break-after-page mt-8">
                <div className="text-[10px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-3 py-1 rounded mb-2 print:hidden">
                  Annexure D &bull; Mobile Phone: {device.deviceName} (IMEI-1: {device.mobileDetails?.imei1 || 'N/A'})
                </div>
                <AnnexureD premise={premise} device={device} />
              </div>
            ))}

            {/* 5. Annexure C: Chain of Custody for EVERY DEVICE EXCEPT EMAIL */}
            {devicesExceptEmail.map((device) => (
              <div key={`annex-c-${device.id}`} className="print:break-after-page mt-8">
                <div className="text-[10px] text-purple-700 font-bold bg-purple-50 border border-purple-200 px-3 py-1 rounded mb-2 print:hidden">
                  Annexure C &bull; Chain of Custody (Physical Device): {device.deviceName}
                </div>
                <AnnexureC premise={premise} device={device} />
              </div>
            ))}

            {/* 6. Annexure E: BSA 2023 Sec 63(4)(c) Certificate for EVERY DEVICE */}
            {devices.map((device) => (
              <div key={`annex-e-${device.id}`} className="print:break-after-page mt-8">
                <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded mb-2 print:hidden">
                  Annexure E &bull; BSA 2023 Sec 63(4)(c) Certificate: {device.deviceName}
                </div>
                <AnnexureE premise={premise} device={device} />
              </div>
            ))}

            {/* 7. Annexure F: Cloud, Email, iCloud & Online Repository Job Sheet */}
            {cloudEvidenceDevices.length > 0 && (
              <div className="print:break-after-page mt-8">
                <div className="text-[10px] text-sky-700 font-bold bg-sky-50 border border-sky-200 px-3 py-1 rounded mb-2 print:hidden">
                  Annexure F &bull; Cloud, Email, iCloud &amp; Online Repository Job Sheet ({cloudEvidenceDevices.length} items)
                </div>
                <AnnexureF premise={premise} devices={devices} />
              </div>
            )}

            {/* 8. Feedback Form */}
            <div className="print:break-after-page mt-8">
              <FeedbackForm premise={premise} />
            </div>

            {/* 9. Work Completion Letter */}
            <div className="mt-8">
              <WorkCompletionLetter premise={premise} devices={devices} />
            </div>
          </div>
        )}

        {selectedDoc === 'ANNEXURE_A' && (
          <div className="space-y-4">
            {isErpOrServerFound ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-900 print:hidden flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="font-semibold">ERP / Server Found on Premise:</span>
                  <span>Annexure A Self-Declaration is active and will be included in the master dossier.</span>
                </div>
                {onUpdatePremise && (
                  <button
                    onClick={() => handleToggleErpFound(false)}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded font-medium text-[11px] transition-colors"
                  >
                    Mark ERP Not Found
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-300 p-5 rounded-xl text-xs text-amber-950 print:hidden shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-900">
                      Annexure A Statutory Criterion Notice
                    </h4>
                    <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                      In accordance with Income Tax Investigation &amp; ED forensic protocols, <strong>Annexure A (Self Declaration)</strong> is legally required <strong>ONLY if an ERP software (SAP, Oracle, Tally) or a dedicated Server is discovered at the searched premise</strong>.
                    </p>
                    <p className="text-amber-700 text-[11px] mt-1">
                      Currently, no ERP or Server is flagged for <strong>{premise.name} ({premise.code})</strong>. If an ERP server is discovered, click the button below to include Annexure A in the dossier.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-amber-200">
                  {onUpdatePremise && (
                    <button
                      onClick={() => handleToggleErpFound(true)}
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow-xs transition-colors text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Flag ERP / Server Found on Premise (Activate Annexure A)
                    </button>
                  )}
                </div>
              </div>
            )}
            <AnnexureA premise={premise} />
          </div>
        )}

        {selectedDoc === 'ANNEXURE_B' && (
          activeDevice ? (
            <AnnexureB premise={premise} device={activeDevice} />
          ) : (
            <div className="bg-white p-12 text-center text-slate-600 rounded-lg max-w-[800px] mx-auto border border-slate-200 shadow-xs space-y-3">
              <Laptop className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="font-bold text-base text-slate-900">No Non-Mobile Devices Found</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">{noDevicesMessage}</p>
              <button
                onClick={onOpenNewDevice}
                className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                + Add Computer / Laptop / Storage Media
              </button>
            </div>
          )
        )}

        {selectedDoc === 'ANNEXURE_C' && (
          activeDevice ? (
            <AnnexureC premise={premise} device={activeDevice} />
          ) : (
            <div className="bg-white p-12 text-center text-slate-600 rounded-lg max-w-[800px] mx-auto border border-slate-200 shadow-xs space-y-3">
              <ShieldCheck className="w-10 h-10 text-purple-400 mx-auto" />
              <div className="font-bold text-base text-slate-900">No Physical Devices for Chain of Custody</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">{noDevicesMessage}</p>
              <button
                onClick={onOpenNewDevice}
                className="inline-flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                + Add Physical Device
              </button>
            </div>
          )
        )}

        {selectedDoc === 'ANNEXURE_D' && (
          activeDevice ? (
            <AnnexureD premise={premise} device={activeDevice} />
          ) : (
            <div className="bg-white p-12 text-center text-slate-600 rounded-lg max-w-[800px] mx-auto border border-slate-200 shadow-xs space-y-3">
              <Smartphone className="w-10 h-10 text-indigo-400 mx-auto" />
              <div className="font-bold text-base text-slate-900">No Mobile Devices Found</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">{noDevicesMessage}</p>
              <button
                onClick={onOpenNewDevice}
                className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                + Add Mobile Phone
              </button>
            </div>
          )
        )}

        {selectedDoc === 'ANNEXURE_E' && (
          activeDevice ? (
            <AnnexureE premise={premise} device={activeDevice} />
          ) : (
            <div className="bg-white p-12 text-center text-slate-600 rounded-lg max-w-[800px] mx-auto border border-slate-200 shadow-xs space-y-3">
              <Award className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="font-bold text-base text-slate-900">No Devices Logged</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">{noDevicesMessage}</p>
              <button
                onClick={onOpenNewDevice}
                className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                + Add Device
              </button>
            </div>
          )
        )}

        {selectedDoc === 'ANNEXURE_F' && (
          <AnnexureF premise={premise} devices={devices} />
        )}

        {selectedDoc === 'ANNEXURE_G' && (
          <AnnexureG premise={premise} devices={devices} />
        )}

        {selectedDoc === 'FEEDBACK_FORM' && (
          <FeedbackForm premise={premise} />
        )}

        {selectedDoc === 'WALCORE_LETTER' && (
          <WorkCompletionLetter premise={premise} devices={devices} />
        )}
      </div>
    </div>
  );
};
