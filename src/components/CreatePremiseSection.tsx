import React, { useState } from 'react';
import { Premise, CoExaminer } from '../types';
import { 
  Building2, 
  UserCheck, 
  Shield, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Users, 
  MapPin, 
  Briefcase, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Props {
  existingCount: number;
  templatePremise?: Premise;
  onCreatePremise: (newPremise: Premise) => void;
  defaultExpanded?: boolean;
}

export const CreatePremiseSection: React.FC<Props> = ({
  existingCount,
  templatePremise,
  onCreatePremise,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Fields required by user:
  // 1. Premise code
  // 2. Authorized officer name
  // 3. Department Name
  // 4. Party/Assessee Name
  // 5. Party Address
  // 6. Forensics Examiner Lead
  // 7. Option to add co-examiner(s)
  
  const [code, setCode] = useState(`Premise-${String(existingCount + 1).padStart(2, '0')}`);
  const [premiseName, setPremiseName] = useState('');
  const [assesseeName, setAssesseeName] = useState(templatePremise?.assesseeName || '');
  const [address, setAddress] = useState('');
  const [officerName, setOfficerName] = useState(templatePremise?.authorizedOfficer.name || '');
  const [officerDesignation, setOfficerDesignation] = useState(templatePremise?.authorizedOfficer.designation || 'Deputy Director of Income Tax (Inv.)');
  const [departmentName, setDepartmentName] = useState(templatePremise?.authorizedOfficer.department || 'Income Tax Department (Inv.)');
  const [departmentCity, setDepartmentCity] = useState(templatePremise?.authorizedOfficer.departmentCity || 'New Delhi');
  const [examinerLead, setExaminerLead] = useState(templatePremise?.forensicTeam.examinerName || '');
  const [leadDesignation, setLeadDesignation] = useState(templatePremise?.forensicTeam.examinerDesignation || 'Lead Forensic Examiner');
  const [companyName, setCompanyName] = useState(templatePremise?.forensicTeam.companyName || 'WALCore Intelligence Pvt. Ltd.');
  
  // Dynamic co-examiners
  const [coExaminers, setCoExaminers] = useState<CoExaminer[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
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
      searchDate: templatePremise?.searchDate || new Date().toISOString().split('T')[0],
      searchTime: templatePremise?.searchTime || '07:30 AM',
      authorizedOfficer: {
        name: officerName.trim() || 'Shri Authorized Officer, IRS',
        designation: officerDesignation.trim(),
        department: departmentName.trim() || 'Income Tax Department (Inv.)',
        departmentCity: departmentCity.trim() || 'New Delhi',
        authorizationRef: templatePremise?.authorizedOfficer.authorizationRef || `WARRANT/INV/${Date.now().toString().slice(-6)}`,
        contactNumber: templatePremise?.authorizedOfficer.contactNumber || '',
      },
      forensicTeam: {
        companyName: companyName.trim() || 'WALCore Intelligence Pvt. Ltd.',
        natureOfService: 'Digital Forensics & Cyber Investigation Support',
        teamCode: `TM-${code.replace(/[^a-zA-Z0-9]/g, '')}`,
        examinerName: examinerLead.trim() || 'Forensic Examiner Lead',
        examinerDesignation: leadDesignation.trim() || 'Lead Forensic Examiner',
        contactNumber: templatePremise?.forensicTeam.contactNumber || '',
        coExaminers: coExaminers.filter(ce => ce.name.trim().length > 0),
      },
      witness1: templatePremise?.witness1 || {
        name: '',
        address: '',
      },
      witness2: templatePremise?.witness2 || {
        name: '',
        address: '',
      },
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
        ratingRemarks: {
          promptReaching: 'Team arrived punctually prior to search entry.',
          courteousConduct: 'Strict adherence to decorum and procedural courtesy.',
          doneWithoutDelay: 'Immediate acquisition without idling or operational lag.',
          doneAsPerSop: 'Forensic imaging strictly in line with Directorate SOP.',
          significantFindings: 'Successfully secured critical enterprise ERP accounting logs.',
          requisiteTools: 'Equipped with hardware write-blockers and licensed forensic tools.',
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
        deptCity: 'HQ',
        searchDate: new Date().toLocaleDateString('en-GB'),
        completionDate: new Date().toLocaleDateString('en-GB'),
        totalSize: '0 GB',
      },
    };

    onCreatePremise(newPremise);
    setSuccessMsg(`Premise "${newPremise.code}" created and opened successfully!`);
    
    // Reset form for next entry
    setCode(`Premise-${String(existingCount + 2).padStart(2, '0')}`);
    setPremiseName('');
    setAddress('');
    setCoExaminers([]);

    setTimeout(() => {
      setSuccessMsg('');
      setIsExpanded(false);
    }, 2800);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden print:hidden transition-all">
      {/* SECTION HEADER / TOGGLE BAR */}
      <div 
        className="px-5 py-3.5 bg-gradient-to-r from-blue-50/80 via-slate-50 to-white border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Create New Search Premise
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                Primary Action
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Quickly setup premise code, authorized officer, department, party details, forensic lead &amp; co-examiners.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <span>Collapse Form</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>+ Create Premise</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* EXPANDABLE FORM BODY */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* GRID: CORE PREMISE IDENTIFIERS */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Premise &amp; Target Information</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Premise Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Premise Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. Premise-01, PR-HQ, DEL-P3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Identifies this premise across all statutory reports.
                </span>
              </div>

              {/* Party/Assessee Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Party / Assessee Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={assesseeName}
                  onChange={(e) => setAssesseeName(e.target.value)}
                  placeholder="e.g. M/s ABC Corporation Pvt. Ltd. / Sh. Ramesh Kumar"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Premise Nickname / Location Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Premise Location Name / Label
                </label>
                <input
                  type="text"
                  value={premiseName}
                  onChange={(e) => setPremiseName(e.target.value)}
                  placeholder="e.g. Corporate Head Office, Factory Unit 2, Residence"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Party Address */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Party Address (Premise Location under Search) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full physical address as per Warrant of Authorization (e.g. Floor 4, Tower B, Cyber City, Gurugram)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* GRID: AUTHORIZED OFFICER & DEPARTMENT */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Authorized Officer &amp; Conducting Department</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Authorized Officer Name */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorized Officer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. Shri Rajesh Kumar, IRS / Sh. Anuj Saxena"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Department Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  placeholder="e.g. Income Tax Department (Inv.)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Department City */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department Unit / City
                </label>
                <input
                  type="text"
                  value={departmentCity}
                  onChange={(e) => setDepartmentCity(e.target.value)}
                  placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* GRID: FORENSIC EXAMINER LEAD & CO-EXAMINERS */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>3. Forensic Team: Lead &amp; Co-Examiners</span>
              </h3>
              
              <button
                type="button"
                onClick={handleAddCoExaminer}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Co-Examiner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Forensics Examiner Lead */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Forensics Examiner Lead <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={examinerLead}
                  onChange={(e) => setExaminerLead(e.target.value)}
                  placeholder="e.g. Aditya Verma, EnCE / Sh. V. K. Nair"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Lead Designation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead Examiner Designation
                </label>
                <input
                  type="text"
                  value={leadDesignation}
                  onChange={(e) => setLeadDesignation(e.target.value)}
                  placeholder="e.g. Lead Cyber Forensic Examiner / Director"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Forensic Agency / Company */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Forensic Agency / Lab Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. WALCore Intelligence Pvt. Ltd."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* DYNAMIC CO-EXAMINERS LIST */}
            {coExaminers.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    Assigned Co-Examiners ({coExaminers.length})
                  </span>
                  <span className="text-[11px] font-normal text-slate-500">
                    Will be included in Annexure E, Chain of Custody &amp; Handover Letter.
                  </span>
                </div>

                <div className="space-y-2.5">
                  {coExaminers.map((examiner, idx) => (
                    <div 
                      key={examiner.id || idx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 items-center"
                    >
                      <div className="sm:col-span-1 text-center font-mono text-xs font-semibold text-slate-400">
                        #{idx + 1}
                      </div>
                      
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          required
                          value={examiner.name}
                          onChange={(e) => handleUpdateCoExaminer(idx, 'name', e.target.value)}
                          placeholder="Co-Examiner Full Name"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={examiner.designation || ''}
                          onChange={(e) => handleUpdateCoExaminer(idx, 'designation', e.target.value)}
                          placeholder="Designation / Role (e.g. Analyst)"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={examiner.contactNumber || ''}
                          onChange={(e) => handleUpdateCoExaminer(idx, 'contactNumber', e.target.value)}
                          placeholder="Contact No. (optional)"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveCoExaminer(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Remove co-examiner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              * All created premise data persists locally in offline storage and cascades across all 9 statutory annexures.
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow transition-all"
              >
                <span>Create Premise &amp; Open Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
