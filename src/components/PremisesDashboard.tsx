import React, { useState } from 'react';
import { Premise, Device, CoExaminer } from '../types';
import { 
  Building2, 
  Plus, 
  Save, 
  Trash2, 
  CheckCircle2, 
  Users, 
  MapPin, 
  Briefcase, 
  ChevronRight, 
  Laptop, 
  FileText, 
  ArrowRight,
  Shield,
  Calendar,
  Clock,
  UserCheck,
  Check
} from 'lucide-react';

interface Props {
  premises: Premise[];
  activePremiseId: string;
  devices: Device[];
  onSelectPremise: (id: string) => void;
  onCreatePremise: (newPremise: Premise) => void;
  onDeletePremise: (id: string) => void;
  onNavigateToDevices: () => void;
  onNavigateToReports: () => void;
  onOpenNewDevice: () => void;
  onEditPremiseDetails: (premise: Premise) => void;
}

export const PremisesDashboard: React.FC<Props> = ({
  premises,
  activePremiseId,
  devices,
  onSelectPremise,
  onCreatePremise,
  onDeletePremise,
  onNavigateToDevices,
  onNavigateToReports,
  onOpenNewDevice,
  onEditPremiseDetails,
}) => {
  const activePremise = premises.find(p => p.id === activePremiseId) || premises[0];

  // State for creating new premise (open by default if no premises registered)
  const [showCreateForm, setShowCreateForm] = useState(premises.length === 0);
  const [code, setCode] = useState(`Premise-${String(premises.length + 1).padStart(2, '0')}`);
  const [premiseName, setPremiseName] = useState('');
  const [assesseeName, setAssesseeName] = useState(activePremise?.assesseeName || '');
  const [address, setAddress] = useState('');
  const [searchDate, setSearchDate] = useState(activePremise?.searchDate || new Date().toISOString().split('T')[0]);
  const [searchTime, setSearchTime] = useState(activePremise?.searchTime || '07:30 AM');
  
  // Officers & Examiners
  const [officerName, setOfficerName] = useState(activePremise?.authorizedOfficer?.name || '');
  const [officerDesignation, setOfficerDesignation] = useState(activePremise?.authorizedOfficer?.designation || 'Deputy Director of Income Tax (Inv.)');
  const [departmentName, setDepartmentName] = useState(activePremise?.authorizedOfficer?.department || 'Income Tax Department (Inv.)');
  const [departmentCity, setDepartmentCity] = useState(activePremise?.authorizedOfficer?.departmentCity || 'New Delhi');
  const [examinerLead, setExaminerLead] = useState(activePremise?.forensicTeam?.examinerName || '');
  const [leadDesignation, setLeadDesignation] = useState(activePremise?.forensicTeam?.examinerDesignation || 'Lead Forensic Examiner');
  const [companyName, setCompanyName] = useState(activePremise?.forensicTeam?.companyName || 'WALCore Intelligence Pvt. Ltd.');
  
  const [coExaminers, setCoExaminers] = useState<CoExaminer[]>([]);
  const [savedPremiseCode, setSavedPremiseCode] = useState<string | null>(null);

  const handleAddCoExaminer = () => {
    setCoExaminers(prev => [
      ...prev,
      {
        id: `co-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        name: '',
        designation: 'Digital Forensic Analyst',
        contactNumber: '',
      }
    ]);
  };

  const handleUpdateCoExaminer = (index: number, field: keyof CoExaminer, value: string) => {
    setCoExaminers(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveCoExaminer = (index: number) => {
    setCoExaminers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSavePremise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('Premise code is required (e.g. Premise-01).');
      return;
    }
    if (!assesseeName.trim()) {
      alert('Party / Assessee Name is required.');
      return;
    }

    const newPremiseId = `premise-${Date.now()}`;
    const newPremise: Premise = {
      id: newPremiseId,
      code: code.trim(),
      name: premiseName.trim() || `${code.trim()} - ${assesseeName.trim()}`,
      address: address.trim() || 'Address as specified in the Search Warrant',
      assesseeName: assesseeName.trim(),
      searchDate,
      searchTime,
      authorizedOfficer: {
        name: officerName.trim() || 'Shri Authorized Officer, IRS',
        designation: officerDesignation.trim(),
        department: departmentName.trim() || 'Income Tax Department (Inv.)',
        departmentCity: departmentCity.trim() || 'New Delhi',
        authorizationRef: activePremise?.authorizedOfficer?.authorizationRef || `WARRANT/INV/${Date.now().toString().slice(-6)}`,
        contactNumber: activePremise?.authorizedOfficer?.contactNumber || '',
      },
      forensicTeam: {
        companyName: companyName.trim() || 'WALCore Intelligence Pvt. Ltd.',
        natureOfService: 'Digital Forensics & Cyber Investigation Support',
        teamCode: `TM-${code.replace(/[^a-zA-Z0-9]/g, '')}`,
        examinerName: examinerLead.trim() || 'Forensic Examiner Lead',
        examinerDesignation: leadDesignation.trim() || 'Lead Forensic Examiner',
        contactNumber: activePremise?.forensicTeam?.contactNumber || '',
        coExaminers: coExaminers.filter(ce => ce.name.trim().length > 0),
      },
      witness1: activePremise?.witness1 || { name: '', address: '' },
      witness2: activePremise?.witness2 || { name: '', address: '' },
      accountingDeclaration: {
        companyName: assesseeName.trim(),
        companyAddress: address.trim() || 'Head Office Premise',
        softwareName: 'SAP S/4HANA / ERP',
        backupDescription: 'Bit-stream forensic copy of accounting database',
        signeeName: 'Authorized Signatory of Assessee',
        signeeAddress: address.trim() || 'Premise Location',
        date: new Date().toISOString().split('T')[0],
      },
      feedback: {
        ratings: {
          promptReaching: 10,
          courteousConduct: 10,
          doneWithoutDelay: 10,
          doneAsPerSop: 10,
          significantFindings: 10,
          requisiteTools: 10,
        },
        checklist: {
          dataVerified: 'YES',
          dataDeletedFromLaptop: 'YES',
          handedOverImagedCopies: 'YES',
          summaryReportFurnished: 'YES',
        },
        checklistRemarks: {
          dataVerified: 'Verified on write-blocked triage workstation',
          dataDeletedFromLaptop: 'Temporary cache safely purged as per guidelines',
          handedOverImagedCopies: 'Forensic clone HDD handed over in sealed evidence bag',
          summaryReportFurnished: 'Preliminary digital evidence summary submitted',
        },
        additionalComments: 'Forensic team demonstrated commendable professionalism.',
        officerName: officerName.trim() || 'Authorized Officer',
        officerDesignation: officerDesignation.trim() || 'DDIT (Inv.)',
        date: new Date().toISOString().split('T')[0],
      },
      workCompletion: {
        letterDate: new Date().toISOString().split('T')[0],
        receivedDate: new Date().toISOString().split('T')[0],
        authName: officerName.trim() || 'Authorized Officer',
        authorization: 'Search Warrant Authorization',
        dept: departmentName.trim() || 'Income Tax Department (Inv.)',
        deptCity: departmentCity.trim() || 'HQ',
        searchDate: new Date().toLocaleDateString('en-GB'),
        completionDate: new Date().toLocaleDateString('en-GB'),
        totalSize: '0 GB',
      },
    };

    onCreatePremise(newPremise);
    setSavedPremiseCode(newPremise.code);
    
    // Reset form
    setCode(`Premise-${String(premises.length + 2).padStart(2, '0')}`);
    setPremiseName('');
    setAddress('');
    setCoExaminers([]);
  };

  return (
    <div className="space-y-6">
      {/* SUCCESS PROMPT AFTER SAVING PREMISE */}
      {savedPremiseCode && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-5 shadow-sm text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-900">
                Premise &quot;{savedPremiseCode}&quot; Saved Successfully!
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                The search premise has been stored in your evidence ledger. You can now add digital evidence devices, target media, cryptographic hashes, and chain of custody logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setSavedPremiseCode(null);
                setShowCreateForm(false);
                onOpenNewDevice();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Device Details Now</span>
            </button>

            <button
              onClick={() => setSavedPremiseCode(null)}
              className="px-3 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* HEADER WITH STATS & NEW PREMISE BUTTON */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Search Operation Locations Ledger</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            Registered Search Premises ({premises.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            All registered premises for this operation. Select any premise to view or add digital devices, or click create to log a new search premise.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setSavedPremiseCode(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{showCreateForm ? 'Close Premise Form' : '+ Create New Premise'}</span>
          </button>
        </div>
      </div>

      {/* CREATE NEW PREMISE FORM */}
      {showCreateForm && (
        <div className="bg-white border-2 border-blue-300 rounded-xl shadow-md overflow-hidden animate-fadeIn">
          <div className="px-5 py-3.5 bg-blue-50/80 border-b border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Create &amp; Save Search Premise</h3>
                <p className="text-[11px] text-slate-500">Enter premise code, party details, authorized officer, and forensic examiners.</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSavePremise} className="p-5 sm:p-6 space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  1. Premise Code * (e.g. Premise-01, Premise-02)
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="Premise-01"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">
                  2. Party / Assessee Name * (as per Search Warrant)
                </label>
                <input
                  type="text"
                  required
                  value={assesseeName}
                  onChange={(e) => setAssesseeName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="e.g. M/s ABC Infotech Ltd. / Sh. R.K. Gupta"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-slate-700 font-bold mb-1">
                  3. Full Premise Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="e.g. Plot No. 45, 3rd Floor, Okhla Industrial Area Phase-III, New Delhi - 110020"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Search Date</label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Search Entry Time</label>
                <input
                  type="text"
                  value={searchTime}
                  onChange={(e) => setSearchTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                  placeholder="07:30 AM"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Premise Nickname (Optional)</label>
                <input
                  type="text"
                  value={premiseName}
                  onChange={(e) => setPremiseName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                  placeholder="e.g. Factory Premises / Corporate HQ"
                />
              </div>
            </div>

            {/* AUTHORIZED OFFICER & EXAMINER SECTION */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Authorized Officer &amp; Forensic Team
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Authorised Officer Name *</label>
                  <input
                    type="text"
                    required
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                    placeholder="e.g. Shri Rajesh Sharma, IRS"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Officer Designation</label>
                  <input
                    type="text"
                    value={officerDesignation}
                    onChange={(e) => setOfficerDesignation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                    placeholder="Deputy Director of Income Tax (Inv.)"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department &amp; City</label>
                  <input
                    type="text"
                    value={`${departmentName}, ${departmentCity}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      setDepartmentName(parts[0]?.trim() || departmentName);
                      if (parts[1]) setDepartmentCity(parts[1]?.trim());
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                    placeholder="Income Tax Department (Inv.), New Delhi"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lead Forensic Examiner Name *</label>
                  <input
                    type="text"
                    required
                    value={examinerLead}
                    onChange={(e) => setExaminerLead(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 shadow-2xs"
                    placeholder="e.g. Amit Verma"
                  />
                </div>
              </div>
            </div>

            {/* CO-EXAMINERS */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Co-Examiner(s) (Optional)</span>
                <button
                  type="button"
                  onClick={handleAddCoExaminer}
                  className="inline-flex items-center gap-1 text-xs text-blue-700 font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Co-Examiner</span>
                </button>
              </div>

              {coExaminers.map((ce, idx) => (
                <div key={ce.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={ce.name}
                    onChange={(e) => handleUpdateCoExaminer(idx, 'name', e.target.value)}
                    placeholder="Co-Examiner Name"
                    className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                  />
                  <input
                    type="text"
                    value={ce.designation}
                    onChange={(e) => handleUpdateCoExaminer(idx, 'designation', e.target.value)}
                    placeholder="Designation"
                    className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-slate-900 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCoExaminer(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* SUBMIT FOOTER */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                * Clicking Save Premise will store this premise. You can then log digital devices and generate statutory reports.
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Premise</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ALL PAST PREMISES LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            All Past &amp; Registered Premises ({premises.length})
          </h3>
          <span className="text-xs text-slate-500">
            {premises.length > 0 ? 'Click on any premise to set as active or add evidence devices.' : 'No premises currently in database.'}
          </span>
        </div>

        {premises.length === 0 ? (
          <div className="p-8 text-center bg-white border-2 border-dashed border-slate-300 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Search Premises Registered</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              All prefilled premises and data have been cleared. Fill out the form above to register your first search premise.
            </p>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create First Premise</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {premises.map((p) => {
            const pDevices = devices.filter(d => d.premiseId === p.id);
            const isActive = p.id === activePremiseId;
            const laptopsCount = pDevices.filter(d => d.deviceCategory === 'laptop' || d.deviceCategory === 'desktop').length;
            const mobilesCount = pDevices.filter(d => d.deviceCategory === 'mobile').length;
            const otherCount = pDevices.length - laptopsCount - mobilesCount;

            return (
              <div
                key={p.id}
                className={`bg-white border rounded-xl p-5 shadow-xs hover:shadow transition-all flex flex-col justify-between ${
                  isActive 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* CARD TOP BADGE & CODE */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono font-bold text-xs tracking-wide">
                        {p.code}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          Active Premise
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{p.searchDate}</span>
                    </div>
                  </div>

                  {/* PREMISE TITLE & ASSESSEE */}
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                    {p.name}
                  </h4>
                  <div className="text-xs text-blue-700 font-semibold mt-0.5 line-clamp-1">
                    Assessee: {p.assesseeName}
                  </div>

                  {/* ADDRESS */}
                  <div className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{p.address}</span>
                  </div>

                  {/* OFFICERS */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Officer:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[170px]">{p.authorizedOfficer?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Lead Examiner:</span>
                      <span className="font-medium text-emerald-700 truncate max-w-[170px]">{p.forensicTeam?.examinerName || 'N/A'}</span>
                    </div>
                  </div>

                  {/* EVIDENCE DEVICE COUNTER */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Laptop className="w-4 h-4 text-blue-600" />
                      <span>{pDevices.length} Device{pDevices.length !== 1 ? 's' : ''} Logged</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {pDevices.length > 0 ? `${laptopsCount} PC • ${mobilesCount} Mob` : 'No devices yet'}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectPremise(p.id);
                        onNavigateToDevices();
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                      title="Open premise and log/view digital evidence devices"
                    >
                      <span>Manage Devices</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onSelectPremise(p.id);
                        onNavigateToReports();
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      title="Generate statutory reports for this premise"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Reports</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${p.code} - ${p.name}" and all its associated devices?`)) {
                          onDeletePremise(p.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete premise"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
};
