import React, { useState } from 'react';
import { Device, DeviceCategory, Premise, ChainOfCustodyEntry, TargetMedia } from '../types';
import { 
  X, 
  Save, 
  Smartphone, 
  Laptop, 
  HardDrive, 
  Server,
  Cloud,
  FolderArchive,
  Tv,
  Award, 
  Plus, 
  Trash2, 
  Info,
  Disc,
  ArrowRight,
  ShieldCheck,
  Hash,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  premise: Premise;
  onSave: (device: Device) => void;
}

export const DeviceFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  device,
  premise,
  onSave,
}) => {
  if (!isOpen) return null;

  const isEditing = !!device;

  const getBlankDevice = (): Device => {
    const defaultMaster: TargetMedia = {
      id: `mc-${Date.now()}-1`,
      make: 'Seagate',
      model: 'Expansion Portable HDD',
      serialNumber: '',
      storageCapacity: '2 TB',
    };
    const defaultWorking: TargetMedia = {
      id: `wc-${Date.now()}-1`,
      make: 'Western Digital',
      model: 'My Passport',
      serialNumber: '',
      storageCapacity: '2 TB',
    };

    return {
      id: `dev-${Date.now()}`,
      premiseId: premise.id,
      deviceName: '',
      deviceCategory: 'laptop',
      make: '',
      model: '',
      serialNumber: '',
      color: '',
      storageCapacity: '',
      dataSize: '',
      imageSize: '',
      backupMethod: '',
      ownerUserName: '',
      ownerRelative: '',
      ownerLocation: premise.address,
      foundPossessionOf: '',
      relationWithTarget: 'User',
      foundLocationAtPremise: 'Office Desk',
      remarks: '',
      deviceStatus: 'ON',
      visibleOnScreen: '',
      shutdownType: 'NORMAL',
      encryptionPresent: 'NO',
      encryptionSoftwareUsed: '',
      mobileDetails: {
        imei1: '',
        imei2: '',
        simPresent: 'YES',
        simDetails: '',
        simProvider: '',
        mediaCardPresent: 'NO',
        mediaCardDetails: '',
        mediaCardMake: '',
        mediaCardModel: '',
      },
      deviceHandling: 'IMAGING',
      imagingToolsAndDetails: 'FTK Imager v4.7.1 with Tableau Write-Blocker',
      md5Hash: '',
      sha1Hash: '',
      sha256Hash1: '',
      masterCopy: defaultMaster,
      workingCopy: defaultWorking,
      masterCopies: [defaultMaster],
      workingCopies: [defaultWorking],
      deviceReturnedToOriginalState: 'YES',
      returnDate: premise.searchDate,
      returnTime: '17:00 hrs',
      witnessSignatureTaken: 'YES',
      notesByAuthorisedOfficer: 'Forensically imaged with verified bit-stream checksum.',
      chainOfCustody: [
        {
          id: `coc-${Date.now()}`,
          reasonAction: 'Device identified and taken for forensic triage',
          givenByName: '',
          receivedByName: premise.forensicTeam.examinerName,
          date: premise.searchDate,
          time: premise.searchTime || '09:00 hrs',
        },
      ],
      bsaDetails: {
        sourceType: 'Computer / Storage Media',
        uniqueId: '',
        partyRelationship: 'Operated',
        hashAlgorithm: 'SHA256',
        partyDate: premise.searchDate,
        partyTime: '17:30',
        partyPlace: premise.authorizedOfficer.departmentCity || 'New Delhi',
        expertName: premise.forensicTeam.examinerName,
        expertRelative: 'Son of Sh. ____________',
        expertLocation: premise.forensicTeam.companyName,
        expertDesignation: premise.forensicTeam.examinerDesignation,
        expertDate: premise.searchDate,
        expertTime: '18:00',
        expertPlace: premise.authorizedOfficer.departmentCity || 'New Delhi',
      },
      cloudJobSheet: {
        isCloudEvidence: false,
        evidenceSourceSize: '',
        imageSize: '',
        backupMethod: 'Physical Bit-Stream Forensic Image (E01)',
        hash: '',
      },
      workCompletionEntry: {
        particulars: '',
        contentType: 'Physical Forensic Image',
        size: '',
      },
    };
  };

  const [formData, setFormData] = useState<Device>(() => {
    if (!device) return getBlankDevice();
    const d = JSON.parse(JSON.stringify(device));
    if (!d.masterCopies || d.masterCopies.length === 0) {
      d.masterCopies = [d.masterCopy || {
        id: `mc-${Date.now()}-1`,
        make: 'Seagate',
        model: 'Expansion Portable HDD',
        serialNumber: '',
        storageCapacity: '2 TB',
      }];
    }
    if (!d.workingCopies || d.workingCopies.length === 0) {
      d.workingCopies = [d.workingCopy || {
        id: `wc-${Date.now()}-1`,
        make: 'Western Digital',
        model: 'My Passport',
        serialNumber: '',
        storageCapacity: '2 TB',
      }];
    }
    return d;
  });

  // Tabs: TARGET_MEDIA, EVIDENCE_DETAILS, HASH_VALUES, USER_CUSTODY, BSA_CHAIN
  const [activeTab, setActiveTab] = useState<'TARGET_MEDIA' | 'EVIDENCE_DETAILS' | 'HASH_VALUES' | 'USER_CUSTODY' | 'BSA_CHAIN'>('TARGET_MEDIA');

  const generateSampleHashes = () => {
    const chars = '0123456789abcdef';
    let sha256 = '';
    for (let i = 0; i < 64; i++) sha256 += chars[Math.floor(Math.random() * 16)];
    let md5 = '';
    for (let i = 0; i < 32; i++) md5 += chars[Math.floor(Math.random() * 16)];
    let sha1 = '';
    for (let i = 0; i < 40; i++) sha1 += chars[Math.floor(Math.random() * 16)];

    setFormData(prev => ({
      ...prev,
      sha256Hash1: sha256,
      md5Hash: md5,
      sha1Hash: sha1,
      imagingToolsAndDetails: prev.imagingToolsAndDetails || 'Tableau Forensic T8u USB3 Bridge with FTK Imager v4.7.1',
      bsaDetails: {
        ...prev.bsaDetails,
        hashAlgorithm: 'SHA256',
      }
    }));
  };

  const updateField = (path: string, value: unknown) => {
    setFormData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = next;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return next;
    });
  };

  // Master copies handlers
  const handleAddMasterCopy = () => {
    const newCopy: TargetMedia = {
      id: `mc-${Date.now()}`,
      make: 'Seagate',
      model: 'Expansion Portable HDD',
      serialNumber: '',
      storageCapacity: '2 TB',
    };
    setFormData(prev => ({
      ...prev,
      masterCopies: [...(prev.masterCopies || [prev.masterCopy]), newCopy],
    }));
  };

  const handleUpdateMasterCopy = (index: number, field: keyof TargetMedia, value: string) => {
    setFormData(prev => {
      const list = [...(prev.masterCopies || [prev.masterCopy])];
      list[index] = { ...list[index], [field]: value };
      return {
        ...prev,
        masterCopies: list,
        masterCopy: list[0] || prev.masterCopy,
      };
    });
  };

  const handleRemoveMasterCopy = (index: number) => {
    setFormData(prev => {
      const list = (prev.masterCopies || [prev.masterCopy]).filter((_, i) => i !== index);
      return {
        ...prev,
        masterCopies: list,
        masterCopy: list[0] || prev.masterCopy,
      };
    });
  };

  // Working copies handlers
  const handleAddWorkingCopy = () => {
    const newCopy: TargetMedia = {
      id: `wc-${Date.now()}`,
      make: 'Western Digital',
      model: 'My Passport',
      serialNumber: '',
      storageCapacity: '2 TB',
    };
    setFormData(prev => ({
      ...prev,
      workingCopies: [...(prev.workingCopies || [prev.workingCopy]), newCopy],
    }));
  };

  const handleUpdateWorkingCopy = (index: number, field: keyof TargetMedia, value: string) => {
    setFormData(prev => {
      const list = [...(prev.workingCopies || [prev.workingCopy])];
      list[index] = { ...list[index], [field]: value };
      return {
        ...prev,
        workingCopies: list,
        workingCopy: list[0] || prev.workingCopy,
      };
    });
  };

  const handleRemoveWorkingCopy = (index: number) => {
    setFormData(prev => {
      const list = (prev.workingCopies || [prev.workingCopy]).filter((_, i) => i !== index);
      return {
        ...prev,
        workingCopies: list,
        workingCopy: list[0] || prev.workingCopy,
      };
    });
  };

  const handleCategoryChange = (cat: DeviceCategory) => {
    updateField('deviceCategory', cat);
    if (cat === 'mobile') {
      updateField('bsaDetails.sourceType', 'Mobile');
      updateField('imagingToolsAndDetails', 'Cellebrite UFED 7.70 / Physical Analyzer');
    } else if (cat === 'cloud') {
      updateField('bsaDetails.sourceType', 'Cloud');
      updateField('cloudJobSheet.isCloudEvidence', true);
      if (!formData.backupMethod) {
        updateField('backupMethod', 'Google Takeout MBOX export with AD1 Forensic Packaging');
      }
    } else if (cat === 'file_folder') {
      updateField('bsaDetails.sourceType', 'Computer / Storage Media');
      updateField('cloudJobSheet.isCloudEvidence', true);
    } else {
      updateField('bsaDetails.sourceType', 'Computer / Storage Media');
    }
  };

  const handleAddCustodyRow = () => {
    const newEntry: ChainOfCustodyEntry = {
      id: `coc-${Date.now()}`,
      reasonAction: 'Handed over for custody / verification',
      givenByName: premise.forensicTeam.examinerName ? `${premise.forensicTeam.examinerName} (Lead Forensic Examiner)` : '',
      receivedByName: premise.authorizedOfficer.name ? `${premise.authorizedOfficer.name} (Authorised Officer)` : '',
      date: premise.searchDate,
      time: '18:00 hrs',
    };
    setFormData(prev => ({
      ...prev,
      chainOfCustody: [...prev.chainOfCustody, newEntry],
    }));
  };

  const handleAddPresetCustody = (type: 'SEIZURE' | 'OFFICER_SEAL' | 'RETURN') => {
    const officerStr = premise.authorizedOfficer.name ? `${premise.authorizedOfficer.name} (${premise.authorizedOfficer.designation || 'Authorised Officer'})` : 'Authorised Officer';
    const examinerStr = premise.forensicTeam.examinerName ? `${premise.forensicTeam.examinerName} (${premise.forensicTeam.examinerDesignation || 'Lead Forensic Examiner'})` : 'Lead Forensic Examiner';
    const ownerStr = formData.ownerUserName ? `${formData.ownerUserName} (Custodian/Owner)` : `${premise.assesseeName} (Assessee)`;

    let reason = '';
    let given = '';
    let received = '';

    if (type === 'SEIZURE') {
      reason = 'Seized and handed over for forensic bit-stream extraction under Panchnama';
      given = ownerStr;
      received = examinerStr;
    } else if (type === 'OFFICER_SEAL') {
      reason = 'Master copy sealed in tamper-evident forensic bag handed over to Authorised Officer';
      given = examinerStr;
      received = officerStr;
    } else {
      reason = 'Device returned in original physical working state post bit-stream verification';
      given = examinerStr;
      received = ownerStr;
    }

    const newEntry: ChainOfCustodyEntry = {
      id: `coc-${Date.now()}`,
      reasonAction: reason,
      givenByName: given,
      receivedByName: received,
      date: premise.searchDate || '18/09/2026',
      time: type === 'SEIZURE' ? '10:30 hrs' : (type === 'OFFICER_SEAL' ? '18:00 hrs' : '18:30 hrs'),
    };

    setFormData(prev => ({
      ...prev,
      chainOfCustody: [...prev.chainOfCustody, newEntry],
    }));
  };

  const handleRemoveCustodyRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chainOfCustody: prev.chainOfCustody.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...formData };

    // Sync masterCopy and workingCopy with first items of arrays
    if (updated.masterCopies && updated.masterCopies.length > 0) {
      updated.masterCopy = updated.masterCopies[0];
    }
    if (updated.workingCopies && updated.workingCopies.length > 0) {
      updated.workingCopy = updated.workingCopies[0];
    }

    // Category specific mappings
    if (updated.deviceCategory === 'cloud') {
      if (!updated.deviceName.trim()) {
        alert('Please provide the Target Email Address or Mailbox Identifier (e.g. cfo@company.com).');
        return;
      }
      updated.storageCapacity = updated.imageSize || '10 GB';
      if (!updated.cloudJobSheet) {
        updated.cloudJobSheet = { isCloudEvidence: true, evidenceSourceSize: updated.imageSize || '', imageSize: updated.imageSize || '', backupMethod: updated.backupMethod || '', hash: '' };
      } else {
        updated.cloudJobSheet.isCloudEvidence = true;
        updated.cloudJobSheet.imageSize = updated.imageSize || updated.cloudJobSheet.imageSize;
        updated.cloudJobSheet.backupMethod = updated.backupMethod || updated.cloudJobSheet.backupMethod;
      }
      updated.imagingToolsAndDetails = updated.backupMethod || 'Google Takeout MBOX / AD1';
    } else if (updated.deviceCategory === 'file_folder') {
      if (!updated.deviceName.trim()) {
        alert('Please provide the Folder / File Name or Path (e.g. Accounting Data Folder D:\\Tally).');
        return;
      }
      updated.storageCapacity = updated.dataSize || updated.imageSize || '10 GB';
      if (!updated.cloudJobSheet) {
        updated.cloudJobSheet = { isCloudEvidence: true, evidenceSourceSize: updated.dataSize || '', imageSize: updated.imageSize || '', backupMethod: 'Forensic File-System / E01 Image', hash: '' };
      } else {
        updated.cloudJobSheet.isCloudEvidence = true;
        updated.cloudJobSheet.evidenceSourceSize = updated.dataSize || updated.cloudJobSheet.evidenceSourceSize;
        updated.cloudJobSheet.imageSize = updated.imageSize || updated.cloudJobSheet.imageSize;
        updated.cloudJobSheet.backupMethod = 'Forensic File-System / E01 Image';
      }
    } else {
      if (!updated.deviceName.trim()) {
        alert('Please provide a Device Name or Functional Identifier (e.g. Dell Latitude Laptop - CFO).');
        return;
      }
    }

    if (!updated.workCompletionEntry?.particulars) {
      updated.workCompletionEntry = {
        particulars: `${updated.deviceName} (${updated.make || ''} ${updated.model || ''} ${updated.serialNumber ? 'S/N: ' + updated.serialNumber : ''})`.trim(),
        contentType: updated.deviceCategory === 'mobile' 
          ? 'UFED Mobile Dump' 
          : updated.deviceCategory === 'cloud' 
            ? 'Email / Cloud Archive' 
            : updated.deviceCategory === 'file_folder'
              ? 'File / Folder Record'
              : 'Physical Forensic Image',
        size: updated.imageSize || updated.dataSize || updated.storageCapacity || '512 GB',
      };
    }

    onSave(updated);
    onClose();
  };

  const categories: Array<{ key: DeviceCategory; label: string; icon: React.FC<{ className?: string }> }> = [
    { key: 'laptop', label: 'Laptop', icon: Laptop },
    { key: 'mobile', label: 'Mobile / Smartphone', icon: Smartphone },
    { key: 'cloud', label: 'Email / Cloud Archive', icon: Cloud },
    { key: 'file_folder', label: 'File & Folder Record', icon: FolderArchive },
    { key: 'desktop', label: 'Desktop PC', icon: Laptop },
    { key: 'storage', label: 'External Drive / SSD', icon: HardDrive },
    { key: 'server', label: 'Server / Workstation', icon: Server },
    { key: 'dvr', label: 'CCTV / DVR', icon: Tv },
    { key: 'others', label: 'Other Digital Media', icon: HardDrive },
  ];

  const currentCategory = categories.find(c => c.key === formData.deviceCategory) || categories[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-900 my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              {premise.code} &bull; {premise.name}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {isEditing ? `Edit Device: ${formData.deviceName || 'Digital Evidence'}` : 'Register New Digital Evidence Device'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS - Target Media is FIRST as requested */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-white text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('TARGET_MEDIA')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'TARGET_MEDIA' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Disc className="w-4 h-4 text-blue-600" />
            <span>1. Master &amp; Working Copies</span>
            {((formData.masterCopies?.length || 1) > 1 || (formData.workingCopies?.length || 1) > 1) && (
              <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-800 rounded-full font-bold">
                Multi
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('EVIDENCE_DETAILS')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'EVIDENCE_DETAILS' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <currentCategory.icon className="w-4 h-4" />
            <span>
              2. {formData.deviceCategory === 'mobile' 
                ? 'Mobile, IMEI & SIM' 
                : formData.deviceCategory === 'cloud' 
                  ? 'Email Archival' 
                  : formData.deviceCategory === 'file_folder'
                    ? 'File / Folder Record'
                    : 'Evidence Details'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('HASH_VALUES')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'HASH_VALUES' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Hash className="w-4 h-4 text-emerald-600" />
            <span>3. Forensic Hashes &amp; Integrity</span>
            {formData.sha256Hash1 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-full font-bold">
                ✓
              </span>
            )}
          </button>

          {formData.deviceCategory !== 'cloud' && formData.deviceCategory !== 'file_folder' && (
            <button
              type="button"
              onClick={() => setActiveTab('USER_CUSTODY')}
              className={`pb-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'USER_CUSTODY' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>4. User &amp; Seizure State</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('BSA_CHAIN')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'BSA_CHAIN' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{formData.deviceCategory === 'cloud' || formData.deviceCategory === 'file_folder' ? '4.' : '5.'} BSA 63(4)(c) &amp; Chain</span>
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* ========================================================================= */}
          {/* TAB 1: MASTER & WORKING COPIES (TAKEN FIRST, MULTIPLE COPIES SUPPORTED) */}
          {/* ========================================================================= */}
          {activeTab === 'TARGET_MEDIA' && (
            <div className="space-y-6">
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 leading-relaxed flex items-start gap-2.5">
                <Disc className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs">Forensic Target Media Details (Recorded First)</div>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    Specify the target physical drives / storage media used to store the bit-stream <strong>Master Copy</strong> (evidence preservation) and <strong>Working Copy</strong> (examiner analysis). You can add multiple master copies and multiple working copies below.
                  </p>
                </div>
              </div>

              {/* MASTER COPIES SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                      Master Copy Target Media ({formData.masterCopies?.length || 1})
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMasterCopy}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-700" />
                    <span>Add Another Master Copy</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.masterCopies || [formData.masterCopy]).map((copy, index) => (
                    <div key={copy.id || index} className="p-4 bg-amber-50/40 border border-amber-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                        <span className="font-bold text-amber-900 text-xs">
                          Master Copy #{index + 1}
                        </span>
                        {(formData.masterCopies?.length || 1) > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMasterCopy(index)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded text-[11px] font-medium transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Copy</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Make / Brand *</label>
                          <input
                            type="text"
                            required
                            value={copy.make}
                            onChange={(e) => handleUpdateMasterCopy(index, 'make', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                            placeholder="Seagate / SanDisk / WD"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Model Name / Number *</label>
                          <input
                            type="text"
                            required
                            value={copy.model}
                            onChange={(e) => handleUpdateMasterCopy(index, 'model', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                            placeholder="One Touch 2TB HDD"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Serial Number (S/N) *</label>
                          <input
                            type="text"
                            required
                            value={copy.serialNumber}
                            onChange={(e) => handleUpdateMasterCopy(index, 'serialNumber', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                            placeholder="NAA87129-E01"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Storage Capacity *</label>
                          <input
                            type="text"
                            required
                            value={copy.storageCapacity}
                            onChange={(e) => handleUpdateMasterCopy(index, 'storageCapacity', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                            placeholder="2 TB / 4 TB / 1 TB"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WORKING COPIES SECTION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                      Working Copy Target Media ({formData.workingCopies?.length || 1})
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddWorkingCopy}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-700" />
                    <span>Add Another Working Copy</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.workingCopies || [formData.workingCopy]).map((copy, index) => (
                    <div key={copy.id || index} className="p-4 bg-blue-50/40 border border-blue-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                        <span className="font-bold text-blue-900 text-xs">
                          Working Copy #{index + 1}
                        </span>
                        {(formData.workingCopies?.length || 1) > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveWorkingCopy(index)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded text-[11px] font-medium transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Copy</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Make / Brand *</label>
                          <input
                            type="text"
                            required
                            value={copy.make}
                            onChange={(e) => handleUpdateWorkingCopy(index, 'make', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                            placeholder="Western Digital / Seagate"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Model Name / Number *</label>
                          <input
                            type="text"
                            required
                            value={copy.model}
                            onChange={(e) => handleUpdateWorkingCopy(index, 'model', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                            placeholder="My Passport 2TB"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Serial Number (S/N) *</label>
                          <input
                            type="text"
                            required
                            value={copy.serialNumber}
                            onChange={(e) => handleUpdateWorkingCopy(index, 'serialNumber', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                            placeholder="WX32AB491022"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Storage Capacity *</label>
                          <input
                            type="text"
                            required
                            value={copy.storageCapacity}
                            onChange={(e) => handleUpdateWorkingCopy(index, 'storageCapacity', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                            placeholder="2 TB / 4 TB / 1 TB"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROCEED BUTTON */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('EVIDENCE_DETAILS')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-2xs"
                >
                  <span>Proceed to 2. Evidence Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EVIDENCE DETAILS (DYNAMIC CATEGORY: MOBILE, EMAIL, FILE/FOLDER) */}
          {/* ========================================================================= */}
          {activeTab === 'EVIDENCE_DETAILS' && (
            <div className="space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Device / Evidence Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => handleCategoryChange(cat.key)}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center gap-2 ${
                          formData.deviceCategory === cat.key
                            ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold ring-1 ring-blue-500 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* SPECIAL CASE A: EMAIL (ONLY TAKE IMAGE SIZE, BACKUP METHOD) */}
              {/* ----------------------------------------------------------------- */}
              {formData.deviceCategory === 'cloud' && (
                <div className="space-y-4 p-4 bg-sky-50/50 border border-sky-200 rounded-xl">
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                    <Cloud className="w-4 h-4 text-sky-600" />
                    <span>Email &amp; Cloud Archival Extraction</span>
                  </div>
                  <p className="text-[11px] text-sky-800">
                    As per standard operating procedure, for email accounts only <strong>Image Size</strong> and <strong>Backup Method</strong> are required.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Email Address / Mailbox Identifier *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.deviceName}
                        onChange={(e) => updateField('deviceName', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-2xs"
                        placeholder="e.g. cfo@targetcompany.com / director.personal@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Account Custodian / User Name
                      </label>
                      <input
                        type="text"
                        value={formData.ownerUserName}
                        onChange={(e) => updateField('ownerUserName', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-2xs"
                        placeholder="Sh. Rajesh Goel (CFO)"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Image Size *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.imageSize || ''}
                        onChange={(e) => {
                          updateField('imageSize', e.target.value);
                          updateField('cloudJobSheet.imageSize', e.target.value);
                          updateField('storageCapacity', e.target.value);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-2xs"
                        placeholder="e.g. 45.2 GB (MBOX / AD1) / 18.5 GB"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Backup Method *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.backupMethod || ''}
                        onChange={(e) => {
                          updateField('backupMethod', e.target.value);
                          updateField('cloudJobSheet.backupMethod', e.target.value);
                          updateField('imagingToolsAndDetails', e.target.value);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-2xs"
                        placeholder="e.g. Google Takeout MBOX export with AD1 Forensic Packaging"
                      />
                      
                      {/* Preset shortcuts for quick entry */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[
                          'Google Takeout MBOX with AD1 Forensic Packaging',
                          'Microsoft 365 eDiscovery PST Export',
                          'IMAP Full Mailbox Archival Dump',
                          'Exchange EDB / Mailbox Export to PST',
                        ].map(method => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => {
                              updateField('backupMethod', method);
                              updateField('cloudJobSheet.backupMethod', method);
                              updateField('imagingToolsAndDetails', method);
                            }}
                            className="px-2 py-1 bg-white border border-sky-300 hover:bg-sky-100 text-sky-900 rounded text-[10px] font-medium transition-colors"
                          >
                            + {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* SPECIAL CASE B: FILE AND FOLDER (ONLY TAKE SIZE OF DATA, IMAGE SIZE) */}
              {/* ----------------------------------------------------------------- */}
              {formData.deviceCategory === 'file_folder' && (
                <div className="space-y-4 p-4 bg-orange-50/50 border border-orange-200 rounded-xl">
                  <div className="flex items-center gap-2 text-orange-900 font-bold text-sm">
                    <FolderArchive className="w-4 h-4 text-orange-600" />
                    <span>File &amp; Folder Record Extraction</span>
                  </div>
                  <p className="text-[11px] text-orange-800">
                    For file and folder records, only <strong>Size of Data</strong> and <strong>Image Size</strong> are required.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Folder / File Name &amp; Source Path *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.deviceName}
                        onChange={(e) => updateField('deviceName', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-2xs"
                        placeholder="e.g. Accounting Data Folder (D:\TallyData\2023-24) / Contracts Archive"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Custodian / Accountant Name
                      </label>
                      <input
                        type="text"
                        value={formData.ownerUserName}
                        onChange={(e) => updateField('ownerUserName', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-2xs"
                        placeholder="Sh. Suresh Sharma (Accountant)"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Size of Data *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.dataSize || ''}
                        onChange={(e) => {
                          updateField('dataSize', e.target.value);
                          updateField('cloudJobSheet.evidenceSourceSize', e.target.value);
                          updateField('storageCapacity', e.target.value);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-2xs"
                        placeholder="e.g. 120 GB / 850 MB"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Image Size *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.imageSize || ''}
                        onChange={(e) => {
                          updateField('imageSize', e.target.value);
                          updateField('cloudJobSheet.imageSize', e.target.value);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-2xs"
                        placeholder="e.g. 120 GB (Physical Forensic E01 Image) / 850 MB ZIP archive"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* SPECIAL CASE C: MOBILE PHONE (PROMINENT IMEI-1, IMEI-2, SIM DETAILS) */}
              {/* ----------------------------------------------------------------- */}
              {formData.deviceCategory === 'mobile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Device Name / Phone Description *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.deviceName}
                        onChange={(e) => updateField('deviceName', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                        placeholder="e.g. Apple iPhone 15 Pro Max - MD Personal Phone"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Make / Brand</label>
                      <input
                        type="text"
                        value={formData.make}
                        onChange={(e) => updateField('make', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                        placeholder="Apple / Samsung / OnePlus"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Model Name / Number</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => updateField('model', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                        placeholder="iPhone 15 Pro (A3102) / Galaxy S24"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Storage Capacity</label>
                      <input
                        type="text"
                        value={formData.storageCapacity}
                        onChange={(e) => updateField('storageCapacity', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                        placeholder="256 GB / 512 GB / 128 GB"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Color</label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => updateField('color', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                        placeholder="Natural Titanium / Phantom Black"
                      />
                    </div>
                  </div>

                  {/* PROMINENT IMEI & SIM CARD DETAILS SECTION */}
                  <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                      <Smartphone className="w-4 h-4 text-indigo-600" />
                      <span>Mobile IMEI Identifiers &amp; SIM Card Details (Annexure D Standard)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          IMEI-1 (Primary) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.mobileDetails?.imei1 || ''}
                          onChange={(e) => updateField('mobileDetails.imei1', e.target.value)}
                          className="w-full bg-white border border-indigo-300 rounded-lg p-2.5 font-mono text-indigo-950 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                          placeholder="e.g. 354920118274619"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          IMEI-2 / eSIM Identifier
                        </label>
                        <input
                          type="text"
                          value={formData.mobileDetails?.imei2 || ''}
                          onChange={(e) => updateField('mobileDetails.imei2', e.target.value)}
                          className="w-full bg-white border border-indigo-300 rounded-lg p-2.5 font-mono text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                          placeholder="e.g. 354920118274627 (or eSIM ID)"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          SIM Card Present? *
                        </label>
                        <select
                          value={formData.mobileDetails?.simPresent || 'YES'}
                          onChange={(e) => updateField('mobileDetails.simPresent', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold shadow-2xs"
                        >
                          <option value="YES">YES - SIM Present</option>
                          <option value="NO">NO - No SIM Inserted</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          SIM Card Provider &amp; Mobile Number
                        </label>
                        <input
                          type="text"
                          value={formData.mobileDetails?.simProvider || ''}
                          onChange={(e) => updateField('mobileDetails.simProvider', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                          placeholder="e.g. Bharti Airtel (98100 12345) / Reliance Jio"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-slate-700 font-semibold mb-1">
                          SIM Card Details (Slot / ICCID / IMSI)
                        </label>
                        <input
                          type="text"
                          value={formData.mobileDetails?.simDetails || ''}
                          onChange={(e) => updateField('mobileDetails.simDetails', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                          placeholder="e.g. Slot 1 Physical Nano-SIM (ICCID: 899100223344556677)"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Media Card (MicroSD) Present?
                        </label>
                        <select
                          value={formData.mobileDetails?.mediaCardPresent || 'NO'}
                          onChange={(e) => updateField('mobileDetails.mediaCardPresent', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                        >
                          <option value="NO">NO - No Media Card</option>
                          <option value="YES">YES - MicroSD Card Inserted</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Media Card Make / Model / Capacity
                        </label>
                        <input
                          type="text"
                          value={formData.mobileDetails?.mediaCardMake || ''}
                          onChange={(e) => updateField('mobileDetails.mediaCardMake', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                          placeholder="SanDisk Ultra 128GB MicroSD"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* STANDARD HARDWARE: LAPTOP / DESKTOP / SERVER / STORAGE / DVR */}
              {/* ----------------------------------------------------------------- */}
              {formData.deviceCategory !== 'cloud' && formData.deviceCategory !== 'file_folder' && formData.deviceCategory !== 'mobile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Device Name / Functional Identifier * (as cited in Annexures)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.deviceName}
                      onChange={(e) => updateField('deviceName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                      placeholder="e.g. Dell Latitude 7420 Laptop - CFO Office Desk"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Make / Manufacturer</label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) => updateField('make', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                      placeholder="Dell / Apple / Lenovo / Western Digital"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Model Name / Number</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => updateField('model', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                      placeholder="Latitude 7420 / ThinkPad / Precision"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Serial Number (S/N) *</label>
                    <input
                      type="text"
                      required
                      value={formData.serialNumber}
                      onChange={(e) => updateField('serialNumber', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                      placeholder="8F3G9K2-IN"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => updateField('color', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                      placeholder="Matte Black / Titanium Grey / Silver"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Storage Capacity *</label>
                    <input
                      type="text"
                      value={formData.storageCapacity}
                      onChange={(e) => updateField('storageCapacity', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                      placeholder="512 GB NVMe SSD / 1 TB / 256 GB"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Where Found at Premise</label>
                    <input
                      type="text"
                      value={formData.foundLocationAtPremise}
                      onChange={(e) => updateField('foundLocationAtPremise', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                      placeholder="CFO Cabin Desk / Master Bedroom Safe"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: FORENSIC HASH VALUES & INTEGRITY (SHA-256 / MD5 / SHA-1) */}
          {/* ========================================================================= */}
          {activeTab === 'HASH_VALUES' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-emerald-900">Cryptographic Bit-Stream Integrity Hashes</div>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Statutory forensic verification under Bharatiya Sakshya Adhiniyam, 2023 Section 63(4)(c) and Income Tax Forensic SOPs. Hashes establish court-admissible non-tampering proof.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={generateSampleHashes}
                  className="shrink-0 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                  title="Generate realistic bit-stream hash checksums for field demo or fast logging"
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Auto-Generate Hashes</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-800 font-bold">
                      SHA-256 Bit-Stream Hash * (Primary Forensic Standard)
                    </label>
                    {formData.sha256Hash1 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 64 Hex Chars Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.sha256Hash1}
                    onChange={(e) => updateField('sha256Hash1', e.target.value.toLowerCase().trim())}
                    className="w-full font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs"
                    placeholder="e.g. 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
                  />
                  <p className="text-[10.5px] text-slate-500 mt-1">
                    SHA-256 computed on physical source bit-stream or E01 acquisition image.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">MD5 Checksum (Auxiliary)</label>
                    {formData.md5Hash && (
                      <span className="text-[10px] font-semibold text-slate-500 font-mono">
                        {formData.md5Hash.length} chars
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.md5Hash}
                    onChange={(e) => updateField('md5Hash', e.target.value.toLowerCase().trim())}
                    className="w-full font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs"
                    placeholder="e.g. e4d909c290d0fb1ca068ffaddf22cbd0"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">SHA-1 Checksum (Optional)</label>
                  <input
                    type="text"
                    value={formData.sha1Hash}
                    onChange={(e) => updateField('sha1Hash', e.target.value.toLowerCase().trim())}
                    className="w-full font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs"
                    placeholder="e.g. 2fd4e1c67a2d28fced849ee1bb76e7391b93eb12"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Forensic Acquisition Hardware / Write-Blocker &amp; Software Tool
                  </label>
                  <input
                    type="text"
                    value={formData.imagingToolsAndDetails}
                    onChange={(e) => updateField('imagingToolsAndDetails', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                    placeholder="e.g. Tableau Forensic SATA/IDE T35u Bridge with FTK Imager v4.7.1 / Cellebrite UFED Touch2"
                  />
                  <p className="text-[10.5px] text-slate-500 mt-1">
                    Recorded in Annexure B, C, D, E and DDIT forensic feedback documents.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Primary Algorithm for BSA Certificate</label>
                  <select
                    value={formData.bsaDetails?.hashAlgorithm || 'SHA256'}
                    onChange={(e) => updateField('bsaDetails.hashAlgorithm', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                  >
                    <option value="SHA256">SHA-256 (Recommended statutory 256-bit hash)</option>
                    <option value="MD5">MD5 (128-bit checksum)</option>
                    <option value="SHA1">SHA-1 (160-bit checksum)</option>
                    <option value="Other">Other / Dual Combined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bit-Stream Verification Status</label>
                  <select
                    value={formData.sha256Hash1 ? 'MATCH' : 'PENDING'}
                    onChange={() => {}}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                  >
                    <option value="MATCH">MATCH - Verified 100% Bit-Stream Identical</option>
                    <option value="PENDING">Pending Hash Verification</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: USER, POSSESSION & SEIZURE STATE (FOR HARDWARE / MOBILE) */}
          {/* ========================================================================= */}
          {activeTab === 'USER_CUSTODY' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Owner / Primary User Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerUserName}
                    onChange={(e) => updateField('ownerUserName', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                    placeholder="Sh. Rajesh Goel / Sh. Anupam Mehra"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Parent / Relative Name (for BSA Certificate)</label>
                  <input
                    type="text"
                    value={formData.ownerRelative}
                    onChange={(e) => updateField('ownerRelative', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                    placeholder="Son/Daughter/Spouse of Sh. _________"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">User's Residential / Employment Address</label>
                  <input
                    type="text"
                    value={formData.ownerLocation}
                    onChange={(e) => updateField('ownerLocation', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                    placeholder="Residing at Bunglow 18, Golf Links, New Delhi"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Found from Possession of</label>
                  <input
                    type="text"
                    value={formData.foundPossessionOf}
                    onChange={(e) => updateField('foundPossessionOf', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                    placeholder="Sh. Anupam Mehra (CFO)"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Relation with Target Assessee</label>
                  <input
                    type="text"
                    value={formData.relationWithTarget}
                    onChange={(e) => updateField('relationWithTarget', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                    placeholder="Director / Promoter / CFO / Accountant"
                  />
                </div>
              </div>

              {/* PHYSICAL STATE */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 mt-4">
                <div className="font-bold text-slate-800 uppercase">Physical State &amp; Display on Search</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Device State</label>
                    <select
                      value={formData.deviceStatus}
                      onChange={(e) => updateField('deviceStatus', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                    >
                      <option value="ON">ON</option>
                      <option value="OFF">OFF</option>
                      <option value="HIBERNATION/SLEEP">HIBERNATION / SLEEP</option>
                      <option value="OFFLINE">OFFLINE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Shutdown Type</label>
                    <select
                      value={formData.shutdownType}
                      onChange={(e) => updateField('shutdownType', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="POWER PLUG PULLED">POWER PLUG PULLED</option>
                      <option value="BATTERY REMOVED">BATTERY REMOVED</option>
                      <option value="NOT SHUT DOWN">NOT SHUT DOWN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Encryption Detected?</label>
                    <select
                      value={formData.encryptionPresent}
                      onChange={(e) => updateField('encryptionPresent', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold shadow-2xs"
                    >
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                      <option value="UNKNOWN">UNKNOWN</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 mb-1 font-medium">If switched on, what was visible on screen?</label>
                    <input
                      type="text"
                      value={formData.visibleOnScreen}
                      onChange={(e) => updateField('visibleOnScreen', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                      placeholder="Windows desktop with open Excel ledger and Outlook mail"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Encryption Software</label>
                    <input
                      type="text"
                      value={formData.encryptionSoftwareUsed}
                      onChange={(e) => updateField('encryptionSoftwareUsed', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                      placeholder="BitLocker / FileVault / Knox"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: BSA 63(4)(c) & CHAIN OF CUSTODY */}
          {/* ========================================================================= */}
          {activeTab === 'BSA_CHAIN' && (
            <div className="space-y-6">
              {/* BSA SECTION 63(4)(c) */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
                <div className="font-bold text-sm text-amber-900 uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>Bharatiya Sakshya Adhiniyam, 2023 (Section 63(4)(c) Certificate)</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Statutory replacement for erstwhile Section 65B of Indian Evidence Act. Automatically fills both Part A (Party) and Part B (Expert).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Party Ownership Status</label>
                    <select
                      value={formData.bsaDetails?.partyRelationship || 'Operated'}
                      onChange={(e) => updateField('bsaDetails.partyRelationship', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                    >
                      <option value="Owned">Owned</option>
                      <option value="Maintained">Maintained</option>
                      <option value="Managed">Managed</option>
                      <option value="Operated">Operated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Party Affirmation Place</label>
                    <input
                      type="text"
                      value={formData.bsaDetails?.partyPlace || ''}
                      onChange={(e) => updateField('bsaDetails.partyPlace', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                      placeholder="New Delhi"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Party Affirmation Time</label>
                    <input
                      type="text"
                      value={formData.bsaDetails?.partyTime || ''}
                      onChange={(e) => updateField('bsaDetails.partyTime', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                      placeholder="17:30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Expert Relative (Son/Daughter of)</label>
                    <input
                      type="text"
                      value={formData.bsaDetails?.expertRelative || ''}
                      onChange={(e) => updateField('bsaDetails.expertRelative', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                      placeholder="Son of Sh. R.P. Verma"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Expert Location / Office</label>
                    <input
                      type="text"
                      value={formData.bsaDetails?.expertLocation || ''}
                      onChange={(e) => updateField('bsaDetails.expertLocation', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                      placeholder="WALCore Intelligence Pvt. Ltd., New Delhi"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Expert Affirmation Time</label>
                    <input
                      type="text"
                      value={formData.bsaDetails?.expertTime || ''}
                      onChange={(e) => updateField('bsaDetails.expertTime', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                      placeholder="18:00"
                    />
                  </div>
                </div>
              </div>

              {/* CHAIN OF CUSTODY LOG */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-blue-900 uppercase tracking-wide">
                      Chain of Custody Handover Log (Annexure C)
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Select Authorized Officer, Lead Examiner, or Custodian from dropdowns for court-admissible handover.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleAddCustodyRow}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Custody Row
                    </button>
                  </div>
                </div>

                {/* QUICK PRESET BUTTONS FOR FIELD CONVENIENCE */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-600 mr-1">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleAddPresetCustody('SEIZURE')}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[11px] font-medium transition-colors"
                  >
                    + Seizure: Owner &rarr; Lead Examiner
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPresetCustody('OFFICER_SEAL')}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded text-[11px] font-medium transition-colors"
                  >
                    + Sealed Bag: Lead Examiner &rarr; Authorised Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPresetCustody('RETURN')}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[11px] font-medium transition-colors"
                  >
                    + Return: Lead Examiner &rarr; Owner
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {formData.chainOfCustody.map((coc, idx) => (
                    <div key={coc.id || idx} className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                        {/* REASON / ACTION */}
                        <div className="md:col-span-4">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Reason / Action Taken
                          </label>
                          <input
                            type="text"
                            value={coc.reasonAction}
                            onChange={(e) => {
                              const updated = [...formData.chainOfCustody];
                              updated[idx].reasonAction = e.target.value;
                              setFormData(prev => ({ ...prev, chainOfCustody: updated }));
                            }}
                            className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            placeholder="e.g. Seized under Panchnama / Sealed copy handed over"
                          />
                        </div>

                        {/* GIVEN BY (DROPDOWN + INPUT) */}
                        <div className="md:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Given By (Officer / Examiner Dropdown)
                          </label>
                          <select
                            value={coc.givenByName || ''}
                            onChange={(e) => {
                              const updated = [...formData.chainOfCustody];
                              updated[idx].givenByName = e.target.value;
                              setFormData(prev => ({ ...prev, chainOfCustody: updated }));
                            }}
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-blue-500 mb-1"
                          >
                            <option value="">-- Select Given By --</option>
                            <optgroup label="Government & Forensic Team">
                              <option value={`${premise.authorizedOfficer.name} (${premise.authorizedOfficer.designation || 'Authorised Officer'})`}>
                                👮 Authorised Officer: {premise.authorizedOfficer.name}
                              </option>
                              <option value={`${premise.forensicTeam.examinerName} (${premise.forensicTeam.examinerDesignation || 'Lead Forensic Examiner'})`}>
                                🔬 Lead Examiner: {premise.forensicTeam.examinerName}
                              </option>
                              {(premise.forensicTeam.coExaminers || []).map((co, cIdx) => (
                                <option key={cIdx} value={`${co.name} (${co.designation || 'Co-Examiner'})`}>
                                  🔬 Co-Examiner: {co.name}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Assessee / Custodian / Witnesses">
                              {formData.ownerUserName && (
                                <option value={`${formData.ownerUserName} (Custodian/Owner)`}>
                                  👤 Owner/User: {formData.ownerUserName}
                                </option>
                              )}
                              <option value={`${premise.assesseeName} (Assessee)`}>
                                🏢 Assessee: {premise.assesseeName}
                              </option>
                              {premise.witness1?.name && (
                                <option value={`${premise.witness1.name} (Independent Witness)`}>
                                  👁️ Witness 1: {premise.witness1.name}
                                </option>
                              )}
                              {premise.witness2?.name && (
                                <option value={`${premise.witness2.name} (Independent Witness)`}>
                                  👁️ Witness 2: {premise.witness2.name}
                                </option>
                              )}
                            </optgroup>
                          </select>
                          <input
                            type="text"
                            value={coc.givenByName}
                            onChange={(e) => {
                              const updated = [...formData.chainOfCustody];
                              updated[idx].givenByName = e.target.value;
                              setFormData(prev => ({ ...prev, chainOfCustody: updated }));
                            }}
                            className="w-full bg-white border border-slate-300 rounded p-1 text-[11px] text-slate-800 placeholder:text-slate-400"
                            placeholder="Type or customize Given By name"
                          />
                        </div>

                        {/* RECEIVED BY (DROPDOWN + INPUT) */}
                        <div className="md:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Received By (Officer / Examiner Dropdown)
                          </label>
                          <select
                            value={coc.receivedByName || ''}
                            onChange={(e) => {
                              const updated = [...formData.chainOfCustody];
                              updated[idx].receivedByName = e.target.value;
                              setFormData(prev => ({ ...prev, chainOfCustody: updated }));
                            }}
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-blue-500 mb-1"
                          >
                            <option value="">-- Select Received By --</option>
                            <optgroup label="Government & Forensic Team">
                              <option value={`${premise.authorizedOfficer.name} (${premise.authorizedOfficer.designation || 'Authorised Officer'})`}>
                                👮 Authorised Officer: {premise.authorizedOfficer.name}
                              </option>
                              <option value={`${premise.forensicTeam.examinerName} (${premise.forensicTeam.examinerDesignation || 'Lead Forensic Examiner'})`}>
                                🔬 Lead Examiner: {premise.forensicTeam.examinerName}
                              </option>
                              {(premise.forensicTeam.coExaminers || []).map((co, cIdx) => (
                                <option key={cIdx} value={`${co.name} (${co.designation || 'Co-Examiner'})`}>
                                  🔬 Co-Examiner: {co.name}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Assessee / Custodian / Witnesses">
                              {formData.ownerUserName && (
                                <option value={`${formData.ownerUserName} (Custodian/Owner)`}>
                                  👤 Owner/User: {formData.ownerUserName}
                                </option>
                              )}
                              <option value={`${premise.assesseeName} (Assessee)`}>
                                🏢 Assessee: {premise.assesseeName}
                              </option>
                              {premise.witness1?.name && (
                                <option value={`${premise.witness1.name} (Independent Witness)`}>
                                  👁️ Witness 1: {premise.witness1.name}
                                </option>
                              )}
                              {premise.witness2?.name && (
                                <option value={`${premise.witness2.name} (Independent Witness)`}>
                                  👁️ Witness 2: {premise.witness2.name}
                                </option>
                              )}
                            </optgroup>
                          </select>
                          <input
                            type="text"
                            value={coc.receivedByName}
                            onChange={(e) => {
                              const updated = [...formData.chainOfCustody];
                              updated[idx].receivedByName = e.target.value;
                              setFormData(prev => ({ ...prev, chainOfCustody: updated }));
                            }}
                            className="w-full bg-white border border-slate-300 rounded p-1 text-[11px] text-slate-800 placeholder:text-slate-400"
                            placeholder="Type or customize Received By name"
                          />
                        </div>

                        {/* TIME & REMOVE */}
                        <div className="md:col-span-2 flex items-start justify-between gap-1 pt-0.5">
                          <div className="w-full">
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Time (hrs)
                            </label>
                            <input
                              type="text"
                              value={coc.time}
                              onChange={(e) => {
                                const updated = [...formData.chainOfCustody];
                                updated[idx].time = e.target.value;
                                setFormData(prev => ({ ...prev, chainOfCustody: updated }));
                              }}
                              className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 font-mono"
                              placeholder="18:00 hrs"
                            />
                          </div>
                          {formData.chainOfCustody.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCustodyRow(idx)}
                              className="mt-5 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors shrink-0"
                              title="Delete custody event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="text-[11px] text-slate-500 text-left">
              * Device specifications, target media, hashes, and custody will be saved. Generate statutory reports from the dashboard once logging is complete.
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Device Changes' : 'Save Device Details'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
