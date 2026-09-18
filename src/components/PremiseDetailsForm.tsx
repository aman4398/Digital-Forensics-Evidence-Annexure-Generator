import React, { useState } from 'react';
import { Premise, CoExaminer } from '../types';
import { 
  Building2, 
  UserCheck, 
  Shield, 
  FileSpreadsheet, 
  CheckCircle2, 
  Copy, 
  Users,
  Calendar,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  UserPlus
} from 'lucide-react';

interface Props {
  premise: Premise;
  totalPremisesCount: number;
  onUpdatePremise: (updated: Premise) => void;
  onApplyOfficerToAllPremises: (officer: Premise['authorizedOfficer'], team: Premise['forensicTeam']) => void;
}

export const PremiseDetailsForm: React.FC<Props> = ({
  premise,
  totalPremisesCount,
  onUpdatePremise,
  onApplyOfficerToAllPremises,
}) => {
  const [activeSection, setActiveSection] = useState<'BASIC' | 'OFFICER' | 'WITNESSES' | 'ACCOUNTING' | 'FEEDBACK'>('BASIC');
  const [saveBanner, setSaveBanner] = useState(false);

  const triggerSaveNotification = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  const handleFieldChange = (path: string, value: unknown) => {
    const updated = JSON.parse(JSON.stringify(premise));
    const parts = path.split('.');
    let current = updated;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    onUpdatePremise(updated);
  };

  const handleAddCoExaminer = () => {
    const updated = JSON.parse(JSON.stringify(premise));
    if (!updated.forensicTeam.coExaminers) {
      updated.forensicTeam.coExaminers = [];
    }
    updated.forensicTeam.coExaminers.push({
      id: `co-${Date.now()}`,
      name: '',
      designation: 'Associate Forensic Examiner',
      agency: premise.forensicTeam.companyName || 'WALCore Intelligence'
    });
    onUpdatePremise(updated);
  };

  const handleUpdateCoExaminer = (index: number, field: keyof CoExaminer, val: string) => {
    const updated = JSON.parse(JSON.stringify(premise));
    if (!updated.forensicTeam.coExaminers) updated.forensicTeam.coExaminers = [];
    updated.forensicTeam.coExaminers[index] = {
      ...updated.forensicTeam.coExaminers[index],
      [field]: val
    };
    onUpdatePremise(updated);
  };

  const handleRemoveCoExaminer = (index: number) => {
    const updated = JSON.parse(JSON.stringify(premise));
    if (updated.forensicTeam.coExaminers) {
      updated.forensicTeam.coExaminers.splice(index, 1);
    }
    onUpdatePremise(updated);
  };

  const handleSyncToAll = () => {
    if (confirm(`Do you want to copy this Authorized Officer & Forensic Team setup to all other ${totalPremisesCount - 1} premises in this case?`)) {
      onApplyOfficerToAllPremises(premise.authorizedOfficer, premise.forensicTeam);
      triggerSaveNotification();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 text-slate-900">
      {/* HEADER WITH SYNC HELPER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wide">
            <Building2 className="w-4 h-4" />
            <span>Premise Master Record &bull; Fixed Operational Details</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {premise.code}: {premise.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Values entered here will automatically cascade into all Annexures (A, B, C, D, E, F, G, Feedback, and Handover).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {totalPremisesCount > 1 && (
            <button
              onClick={handleSyncToAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors shadow-2xs"
              title="Copy Authorized Officer & Forensic Team details to all premises"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Apply Officer/Team to All Premises</span>
            </button>
          )}

          {saveBanner && (
            <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Auto-saved!
            </span>
          )}
        </div>
      </div>

      {/* SECTION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveSection('BASIC')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
            activeSection === 'BASIC' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Premise &amp; Target</span>
        </button>

        <button
          onClick={() => setActiveSection('OFFICER')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
            activeSection === 'OFFICER' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Officer &amp; Forensic Team</span>
        </button>

        <button
          onClick={() => setActiveSection('WITNESSES')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
            activeSection === 'WITNESSES' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Search Timing &amp; Witnesses</span>
        </button>

        <button
          onClick={() => setActiveSection('ACCOUNTING')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
            activeSection === 'ACCOUNTING' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Annexure A (SAP / ERP)</span>
        </button>

        <button
          onClick={() => setActiveSection('FEEDBACK')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
            activeSection === 'FEEDBACK' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Feedback Form Defaults</span>
        </button>
      </div>

      {/* SECTION 1: PREMISE & ASSESSEE */}
      {activeSection === 'BASIC' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Premise Code / Tag * (e.g. Premise-01, PR-HQ, PR-RES-02)
            </label>
            <input
              type="text"
              value={premise.code}
              onChange={(e) => handleFieldChange('code', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
              placeholder="Premise-01"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Premise Descriptor / Location Title *
            </label>
            <input
              type="text"
              value={premise.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
              placeholder="Corporate Headquarters / Residence / Branch Office"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">
              Premise Physical Address * (As per search warrant)
            </label>
            <textarea
              rows={2}
              value={premise.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
              placeholder="Full physical address as stated in the warrant of authorization..."
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Target Party / Assessee Name *
            </label>
            <input
              type="text"
              value={premise.assesseeName}
              onChange={(e) => handleFieldChange('assesseeName', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
              placeholder="M/s Apex Horizons Logistics Pvt. Ltd."
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Assessee Group / Operation Code
            </label>
            <input
              type="text"
              value={premise.assesseeGroup}
              onChange={(e) => handleFieldChange('assesseeGroup', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
              placeholder="Apex Horizons Group"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              PAN Number / Tax ID
            </label>
            <input
              type="text"
              value={premise.assesseePan}
              onChange={(e) => handleFieldChange('assesseePan', e.target.value.toUpperCase())}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase shadow-2xs"
              placeholder="AAACA1234F"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Search Warrant No. / Authorization Ref
            </label>
            <input
              type="text"
              value={premise.warrantRef}
              onChange={(e) => handleFieldChange('warrantRef', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
              placeholder="DEL/INV/2026/0441-A"
            />
          </div>
        </div>
      )}

      {/* SECTION 2: OFFICER & FORENSIC TEAM */}
      {activeSection === 'OFFICER' && (
        <div className="space-y-6 pt-4 text-xs">
          {/* AUTHORIZED OFFICER */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="font-bold text-sm text-blue-800 uppercase tracking-wide">
              Authorized Officer / Conducting DDIT (Income Tax / ED / LAE)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Officer Name *</label>
                <input
                  type="text"
                  value={premise.authorizedOfficer.name}
                  onChange={(e) => handleFieldChange('authorizedOfficer.name', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold shadow-2xs"
                  placeholder="Sh. Vikramaditya Singh"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Designation *</label>
                <input
                  type="text"
                  value={premise.authorizedOfficer.designation}
                  onChange={(e) => handleFieldChange('authorizedOfficer.designation', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="Deputy Director of Income Tax (Inv.) / Assistant Director"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Department &amp; Wing</label>
                <input
                  type="text"
                  value={premise.authorizedOfficer.department}
                  onChange={(e) => handleFieldChange('authorizedOfficer.department', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="Income Tax Department (Inv.)"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Department City / HQ</label>
                <input
                  type="text"
                  value={premise.authorizedOfficer.departmentCity}
                  onChange={(e) => handleFieldChange('authorizedOfficer.departmentCity', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="New Delhi"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Warrant / Authorization Reference</label>
                <input
                  type="text"
                  value={premise.authorizedOfficer.authorizationRef}
                  onChange={(e) => handleFieldChange('authorizedOfficer.authorizationRef', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="Warrant of Authorization No. DEL/INV/2026/0441"
                />
              </div>
            </div>
          </div>

          {/* FORENSIC AGENCY & LEAD EXAMINER */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="font-bold text-sm text-emerald-800 uppercase tracking-wide">
              Forensic Agency &amp; Lead Examiner (WALCore / In-House / Vendor)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Forensic Agency / Company Name</label>
                <input
                  type="text"
                  value={premise.forensicTeam.companyName}
                  onChange={(e) => handleFieldChange('forensicTeam.companyName', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="WALCore Intelligence Pvt. Ltd."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Forensic Team Code (e.g. WAL-DEL-01)</label>
                <input
                  type="text"
                  value={premise.forensicTeam.teamCode}
                  onChange={(e) => handleFieldChange('forensicTeam.teamCode', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="WAL-DEL-ALPHA"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Forensics Examiner Lead Name *</label>
                <input
                  type="text"
                  value={premise.forensicTeam.examinerName}
                  onChange={(e) => handleFieldChange('forensicTeam.examinerName', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="Er. Alok Verma"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Lead Examiner Designation</label>
                <input
                  type="text"
                  value={premise.forensicTeam.examinerDesignation}
                  onChange={(e) => handleFieldChange('forensicTeam.examinerDesignation', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="Principal Digital Forensic Examiner"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Nature of Forensic Service</label>
                <input
                  type="text"
                  value={premise.forensicTeam.natureOfService}
                  onChange={(e) => handleFieldChange('forensicTeam.natureOfService', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  placeholder="Forensic & Cyber Investigation Services under BSA 2023 Sec 63(4)(c)"
                />
              </div>
            </div>

            {/* CO-EXAMINERS SUB-SECTION */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-700" />
                  <span>Co-Examiners &amp; Assisting Forensic Experts ({premise.forensicTeam.coExaminers?.length || 0})</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddCoExaminer}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-md border border-blue-200 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Co-Examiner</span>
                </button>
              </div>

              {(!premise.forensicTeam.coExaminers || premise.forensicTeam.coExaminers.length === 0) ? (
                <div className="bg-white border border-slate-200 rounded-lg p-3 text-slate-500 text-[11px] text-center">
                  No co-examiners added yet. Click &ldquo;Add Co-Examiner&rdquo; if assisting engineers are part of the raid team.
                </div>
              ) : (
                <div className="space-y-2">
                  {premise.forensicTeam.coExaminers.map((co, idx) => (
                    <div key={co.id || idx} className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={co.name}
                          onChange={(e) => handleUpdateCoExaminer(idx, 'name', e.target.value)}
                          placeholder="Co-Examiner Full Name"
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-900 font-medium"
                        />
                        <input
                          type="text"
                          value={co.designation}
                          onChange={(e) => handleUpdateCoExaminer(idx, 'designation', e.target.value)}
                          placeholder="Designation (e.g. Associate Examiner)"
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-900"
                        />
                        <input
                          type="text"
                          value={co.agency || ''}
                          onChange={(e) => handleUpdateCoExaminer(idx, 'agency', e.target.value)}
                          placeholder="Agency / Department"
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-900"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCoExaminer(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove Co-Examiner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: WITNESSES & TIMING */}
      {activeSection === 'WITNESSES' && (
        <div className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
                Date of Search * (DD/MM/YYYY)
              </label>
              <input
                type="text"
                value={premise.searchDate}
                onChange={(e) => handleFieldChange('searchDate', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                placeholder="18/09/2026"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
                Time of Search Commencement
              </label>
              <input
                type="text"
                value={premise.searchTime}
                onChange={(e) => handleFieldChange('searchTime', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                placeholder="06:30 AM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WITNESS 1 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-amber-800 uppercase">Independent Witness 1 (Panchanama)</div>
              <div>
                <label className="block text-slate-700 mb-1">Witness Name</label>
                <input
                  type="text"
                  value={premise.witness1.name}
                  onChange={(e) => handleFieldChange('witness1.name', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 focus:outline-none shadow-2xs"
                  placeholder="Sh. Manoj Kumar"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={premise.witness1.address}
                  onChange={(e) => handleFieldChange('witness1.address', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 focus:outline-none shadow-2xs"
                  placeholder="H.No. 12, Kalkaji, New Delhi"
                />
              </div>
            </div>

            {/* WITNESS 2 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-amber-800 uppercase">Independent Witness 2 (Panchanama)</div>
              <div>
                <label className="block text-slate-700 mb-1">Witness Name</label>
                <input
                  type="text"
                  value={premise.witness2.name}
                  onChange={(e) => handleFieldChange('witness2.name', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 focus:outline-none shadow-2xs"
                  placeholder="Sh. Satish Chandra"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={premise.witness2.address}
                  onChange={(e) => handleFieldChange('witness2.address', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 focus:outline-none shadow-2xs"
                  placeholder="B-4, Govindpuri, New Delhi"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ACCOUNTING (ANNEXURE A) */}
      {activeSection === 'ACCOUNTING' && (
        <div className="space-y-4 pt-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                  Was an ERP Software or Dedicated Server Found on this Premise?
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Statutory Rule: Annexure A is generated ONLY if SAP/ERP or a server is discovered at the premise.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleFieldChange('accountingDeclaration.erpOrServerFound', true)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    premise.accountingDeclaration.erpOrServerFound !== false
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ✓ YES (Found - Include Annexure A)
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange('accountingDeclaration.erpOrServerFound', false)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    premise.accountingDeclaration.erpOrServerFound === false
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ✕ NO (Not Found - Omit Annexure A)
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
            <strong>Annexure A Self-Declaration:</strong> In Income Tax Inv raids, companies running SAP, ERP, Oracle, or Tally provide a statutory declaration confirming software modus-operandi, client machine access, and dummy server/backup copy availability.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Declaring Company Name</label>
              <input
                type="text"
                value={premise.accountingDeclaration.companyName}
                onChange={(e) => handleFieldChange('accountingDeclaration.companyName', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                placeholder="Apex Horizons Logistics Pvt. Ltd."
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Software Name &amp; Version</label>
              <input
                type="text"
                value={premise.accountingDeclaration.softwareName}
                onChange={(e) => handleFieldChange('accountingDeclaration.softwareName', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold shadow-2xs"
                placeholder="SAP S/4HANA / Tally Prime / Busy"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Backup &amp; Client Machine Specifics</label>
              <input
                type="text"
                value={premise.accountingDeclaration.backupDescription}
                onChange={(e) => handleFieldChange('accountingDeclaration.backupDescription', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                placeholder="SAP Workstation client machine & mirror server IP 192.168.1.150"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Authorized Signee Name</label>
              <input
                type="text"
                value={premise.accountingDeclaration.signeeName}
                onChange={(e) => handleFieldChange('accountingDeclaration.signeeName', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                placeholder="Director / Managing Director"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Signee Designation / Office Address</label>
              <input
                type="text"
                value={premise.accountingDeclaration.signeeAddress}
                onChange={(e) => handleFieldChange('accountingDeclaration.signeeAddress', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                placeholder="Director, Apex Horizons Pvt Ltd"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: FEEDBACK FORM DEFAULTS */}
      {activeSection === 'FEEDBACK' && (
        <div className="space-y-4 pt-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="font-bold text-sm text-purple-800 mb-2">
              Forensic Team Performance Ratings (Scale 1 - 10)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-medium">1. Prompt in Reaching</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={premise.feedback.ratings.promptReaching}
                  onChange={(e) => handleFieldChange('feedback.ratings.promptReaching', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 font-bold shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">2. Courteous &amp; Professional</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={premise.feedback.ratings.courteousConduct}
                  onChange={(e) => handleFieldChange('feedback.ratings.courteousConduct', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 font-bold shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">3. Done Without Delay</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={premise.feedback.ratings.doneWithoutDelay}
                  onChange={(e) => handleFieldChange('feedback.ratings.doneWithoutDelay', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 font-bold shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">4. Work Done as per SoP</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={premise.feedback.ratings.doneAsPerSop}
                  onChange={(e) => handleFieldChange('feedback.ratings.doneAsPerSop', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 font-bold shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">5. Significant Findings</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={premise.feedback.ratings.significantFindings}
                  onChange={(e) => handleFieldChange('feedback.ratings.significantFindings', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 font-bold shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">6. Requisite Forensic Tools</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={premise.feedback.ratings.requisiteTools}
                  onChange={(e) => handleFieldChange('feedback.ratings.requisiteTools', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 font-bold shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <label className="block text-slate-700 font-semibold mb-1">Total Imaged Size for Handover Letter (e.g. 3,842 GB)</label>
            <input
              type="text"
              value={premise.workCompletion.totalSize}
              onChange={(e) => handleFieldChange('workCompletion.totalSize', e.target.value)}
              className="w-full max-w-sm bg-white border border-slate-300 rounded p-2 text-slate-900 font-mono text-sm shadow-2xs"
              placeholder="3,842 GB"
            />
          </div>
        </div>
      )}
    </div>
  );
};
