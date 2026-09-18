import React from 'react';
import { Premise } from '../../types';

interface Props {
  premise: Premise;
}

export const FeedbackForm: React.FC<Props> = ({ premise }) => {
  const f = premise.feedback;
  const ft = premise.forensicTeam;
  const ao = premise.authorizedOfficer;

  return (
    <div className="bg-white text-black p-6 md:p-10 max-w-[850px] mx-auto font-sans text-xs border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-2 print:m-0 print:max-w-none">
      <div className="text-center font-bold text-sm uppercase tracking-wide mb-4">
        Forensic Team Feedback Form
      </div>

      {/* TOP SUMMARY TABLE */}
      <table className="w-full border-collapse border border-black text-left mb-4 text-xs">
        <tbody>
          <tr className="bg-slate-100 print:bg-slate-200 font-bold text-center">
            <td className="border border-black p-2 w-1/5">Name of the Forensic Team</td>
            <td className="border border-black p-2 w-1/5">Location/Team code (if applicable)</td>
            <td className="border border-black p-2 w-1/5">Nature of Service</td>
            <td className="border border-black p-2 w-1/6">Date of Service</td>
            <td className="border border-black p-2">Authorised Officer/Conducting DDIT (Name and Designation)</td>
          </tr>
          <tr className="align-top">
            <td className="border border-black p-2 font-semibold">
              {ft.companyName}
            </td>
            <td className="border border-black p-2 text-center">
              {ft.teamCode || premise.code}
            </td>
            <td className="border border-black p-2">
              {ft.natureOfService || 'Digital Forensics & Evidence Extraction'}
            </td>
            <td className="border border-black p-2 text-center font-mono">
              {f.date || premise.searchDate}
            </td>
            <td className="border border-black p-2">
              <div className="font-semibold">{ao.name}</div>
              <div className="text-[11px] text-slate-700 print:text-black">{ao.designation}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="italic text-[11px] mb-2">
        (Provide a rating between 1–10 with 10 being exceptional and 1 being very poor in the corresponding column below)
      </div>

      {/* RATINGS TABLE */}
      <table className="w-full border-collapse border border-black text-left mb-6 text-xs">
        <thead>
          <tr className="bg-slate-100 print:bg-slate-200 font-bold text-center">
            <th className="border border-black p-1.5 w-10">S.No.</th>
            <th className="border border-black p-1.5">Description</th>
            <th className="border border-black p-1.5 w-16">Rating</th>
            <th className="border border-black p-1.5 w-48">Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2 text-center font-semibold">1.</td>
            <td className="border border-black p-2">
              Was the Forensic Team prompt in reaching the search premises (if applicable).
            </td>
            <td className="border border-black p-2 text-center font-bold text-sm">
              {f.ratings.promptReaching || 10}
            </td>
            <td className="border border-black p-2 text-[11px]">
              {f.ratingRemarks?.promptReaching || 'Reached on time before commencement of search.'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center font-semibold">2.</td>
            <td className="border border-black p-2">
              Was the Forensic Team courteous, respectful and professional in conduct.
            </td>
            <td className="border border-black p-2 text-center font-bold text-sm">
              {f.ratings.courteousConduct || 10}
            </td>
            <td className="border border-black p-2 text-[11px]">
              {f.ratingRemarks?.courteousConduct || 'High professionalism maintained throughout.'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center font-semibold">3.</td>
            <td className="border border-black p-2">
              Was the forensic work done without any undue delay.
            </td>
            <td className="border border-black p-2 text-center font-bold text-sm">
              {f.ratings.doneWithoutDelay || 10}
            </td>
            <td className="border border-black p-2 text-[11px]">
              {f.ratingRemarks?.doneWithoutDelay || 'Rapid triage and imaging executed.'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center font-semibold">4.</td>
            <td className="border border-black p-2">
              Was the forensic work done by the Forensic Team as per the issued SoP and guidelines (Kindly refer to the SoP and guidelines as kept in the search kit or request for the same from the Control Room).
            </td>
            <td className="border border-black p-2 text-center font-bold text-sm">
              {f.ratings.doneAsPerSop || 10}
            </td>
            <td className="border border-black p-2 text-[11px]">
              {f.ratingRemarks?.doneAsPerSop || 'Strict compliance with digital forensics SOP.'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center font-semibold">5.</td>
            <td className="border border-black p-2">
              Did the Forensic Team give any significant findings in its data analysis work.
            </td>
            <td className="border border-black p-2 text-center font-bold text-sm">
              {f.ratings.significantFindings || 10}
            </td>
            <td className="border border-black p-2 text-[11px]">
              {f.ratingRemarks?.significantFindings || 'Key financial folders and deleted caches identified.'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center font-semibold">6.</td>
            <td className="border border-black p-2">
              Did the Forensic Team had the requisite forensic tools (with updated version) to complete the work promptly and efficiently.
            </td>
            <td className="border border-black p-2 text-center font-bold text-sm">
              {f.ratings.requisiteTools || 10}
            </td>
            <td className="border border-black p-2 text-[11px]">
              {f.ratingRemarks?.requisiteTools || 'Equipped with Tableau write-blockers & Cellebrite UFED.'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* CHECKLIST TABLE */}
      <div className="font-bold text-xs mb-2">Check list for the Authorised officer/conducting DDITs:</div>
      <table className="w-full border-collapse border border-black text-left mb-6 text-xs">
        <thead>
          <tr className="bg-slate-100 print:bg-slate-200 font-bold text-center">
            <th className="border border-black p-1.5 w-10">S.No</th>
            <th className="border border-black p-1.5">Description of check list</th>
            <th className="border border-black p-1.5 w-20">(Yes/No)</th>
            <th className="border border-black p-1.5 w-48">Remarks (if any)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2 text-center font-semibold">1.</td>
            <td className="border border-black p-2">
              After imaging, verification of the data done by the Forensic Team and cross-verified by the Authorised officer at the Search premises.
            </td>
            <td className="border border-black p-2 text-center font-bold">
              {f.checklist.dataVerified || 'Yes'}
            </td>
            <td className="border border-black p-2 text-[11px]">
              {f.checklistRemarks?.dataVerified || 'Checksum verified in presence of officer.'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center font-semibold">2.</td>
            <td className="border border-black p-2">
              In case of mobile and e-mails, the data copied on laptop through forensic tools, like Cellebrite UFED, were deleted from the laptop (including recycle bin) and hash value generated and both the process were verified by the Authorised officer.
            </td>
            <td className="border border-black p-2 text-center font-bold">
              {f.checklist.dataDeletedFromLaptop || 'Yes'}
            </td>
            <td className="border border-black p-2 text-[11px]">
              {f.checklistRemarks?.dataDeletedFromLaptop || 'Zeroized and deleted securely.'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center font-semibold">3.</td>
            <td className="border border-black p-2">
              Did the Forensic team hand over the imaged and working copies to Authorised officer properly and signed the chain of custody form at the search premises.
            </td>
            <td className="border border-black p-2 text-center font-bold">
              {f.checklist.handedOverImagedCopies || 'Yes'}
            </td>
            <td className="border border-black p-2 text-[11px]">
              {f.checklistRemarks?.handedOverImagedCopies || 'Sealed hard drives handed over with tamper tag.'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center font-semibold">4.</td>
            <td className="border border-black p-2">
              Did the forensic team furnish the summary report, duly signed and stamped, along with details of password protected/deleted files (for conducting DDITs only).
            </td>
            <td className="border border-black p-2 text-center font-bold">
              {f.checklist.summaryReportFurnished || 'Yes'}
            </td>
            <td className="border border-black p-2 text-[11px]">
              {f.checklistRemarks?.summaryReportFurnished || 'Summary report submitted.'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ADDITIONAL COMMENTS */}
      <div className="border border-black p-3 mb-8">
        <div className="font-bold text-xs mb-1">Please provide additional comments or suggestions, if any:</div>
        <div className="text-xs italic min-h-[40px]">{f.additionalComments || 'No further observations. Service was satisfactory.'}</div>
      </div>

      {/* SIGNATURE BLOCK */}
      <div className="space-y-2 max-w-sm ml-auto text-right font-sans text-xs">
        <div><span className="font-bold">Name: </span><span className="font-semibold">{f.officerName || ao.name}</span></div>
        <div><span className="font-bold">Designation: </span><span>{f.officerDesignation || ao.designation}</span></div>
        <div><span className="font-bold">Date: </span><span className="font-mono">{f.date || premise.searchDate}</span></div>
        <div className="pt-6">
          <span className="font-bold">(Signature) </span>
          <span className="inline-block border-b border-black w-48 ml-2"></span>
        </div>
      </div>
    </div>
  );
};
