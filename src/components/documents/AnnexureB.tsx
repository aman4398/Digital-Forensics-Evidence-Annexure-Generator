import React from 'react';
import { Premise, Device } from '../../types';

interface Props {
  premise: Premise;
  device: Device;
}

export const AnnexureB: React.FC<Props> = ({ premise, device }) => {
  const isSelectedCategory = (cat: string) => {
    if (cat === 'LAPTOP' && device.deviceCategory === 'laptop') return true;
    if (cat === 'DESKTOP' && device.deviceCategory === 'desktop') return true;
    if (cat === 'SERVER' && device.deviceCategory === 'server') return true;
    if (cat === 'FILE/FOLDER' && device.deviceCategory === 'file_folder') return true;
    if (cat === 'OTHERS' && (device.deviceCategory === 'storage' || device.deviceCategory === 'dvr' || device.deviceCategory === 'others' || device.deviceCategory === 'cloud')) return true;
    return false;
  };

  return (
    <div className="bg-white text-black p-6 md:p-10 max-w-[850px] mx-auto font-sans text-xs border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-2 print:m-0 print:max-w-none">
      <div className="text-right font-bold text-sm mb-2">Annexure B</div>
      <div className="text-center font-bold text-sm uppercase tracking-wide mb-4">
        DEVICE COLLECTION FORM FOR DIGITAL DEVICES OTHER THAN MOBILE
      </div>

      <table className="w-full border-collapse border border-black text-left">
        <tbody>
          <tr>
            <td className="border border-black p-2 font-bold w-1/3 bg-slate-100 print:bg-slate-200">
              NAME OF AUTHORISED OFFICER:
            </td>
            <td className="border border-black p-2 uppercase font-semibold" colSpan={3}>
              {premise.authorizedOfficer.name} ({premise.authorizedOfficer.designation})
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              NAME OF ASSESSEE/PARTY:
            </td>
            <td className="border border-black p-2 uppercase font-semibold" colSpan={3}>
              {premise.assesseeName}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              OWNER/USER NAME:
            </td>
            <td className="border border-black p-2 font-medium" colSpan={3}>
              {device.ownerUserName} {device.relationWithTarget ? `(${device.relationWithTarget})` : ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              DEVICE NAME:
            </td>
            <td className="border border-black p-2 font-semibold" colSpan={3}>
              {device.deviceName}
            </td>
          </tr>

          {/* DATE / TIME / ADDRESS */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              DATE
            </td>
            <td className="border border-black p-2 font-medium w-1/4">
              {premise.searchDate}
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200 w-1/6">
              TIME
            </td>
            <td className="border border-black p-2 font-medium">
              {premise.searchTime}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              ADDRESS
            </td>
            <td className="border border-black p-2" colSpan={3}>
              {premise.address}
            </td>
          </tr>

          {/* EXAMINER */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-200 text-center print:bg-slate-300" colSpan={4}>
              EXAMINER'S NAMES AND DETAILS
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2" colSpan={4}>
              <span className="font-semibold">{premise.forensicTeam.examinerName}</span> ({premise.forensicTeam.examinerDesignation}), {premise.forensicTeam.companyName}
              {premise.forensicTeam.teamCode ? ` [Team Code: ${premise.forensicTeam.teamCode}]` : ''}
            </td>
          </tr>

          {/* CATEGORIES */}
          <tr>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{isSelectedCategory('LAPTOP') ? '☒' : '☐'}</span> LAPTOP
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{isSelectedCategory('DESKTOP') ? '☒' : '☐'}</span> DESKTOP
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{isSelectedCategory('SERVER') ? '☒' : '☐'}</span> SERVER
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{isSelectedCategory('FILE/FOLDER') ? '☒' : '☐'}</span> FILE/FOLDER
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-semibold">
              <span className="inline-block mr-1">{isSelectedCategory('OTHERS') ? '☒' : '☐'}</span> OTHERS
            </td>
            <td className="border border-black p-2" colSpan={3}>
              <span className="font-bold mr-1">IF OTHERS SPECIFY:</span>
              {device.otherCategorySpecify || (isSelectedCategory('OTHERS') ? device.deviceCategory.toUpperCase() : 'N/A')}
            </td>
          </tr>

          {/* HIBERNATION / SCREEN */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-200 print:bg-slate-300">
              HIBERNATION/SLEEP
            </td>
            <td className="border border-black p-2 font-bold bg-slate-200 print:bg-slate-300" colSpan={3}>
              IF SWITCHED ON WHAT IS VISIBLE ON SCREEN?
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2">
              Status: <span className="font-semibold">{device.deviceStatus}</span>
            </td>
            <td className="border border-black p-2" colSpan={3}>
              {device.visibleOnScreen || 'No display output / switched off'}
            </td>
          </tr>

          {/* DEVICE INFO */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200 text-center" rowSpan={4}>
              DEVICE INFO
            </td>
            <td className="border border-black p-2" colSpan={3}>
              <span className="font-bold">MAKE:</span> {device.make}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2" colSpan={3}>
              <span className="font-bold">MODEL:</span> {device.model}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2" colSpan={3}>
              <span className="font-bold">S/N:</span> {device.serialNumber}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2" colSpan={3}>
              <span className="font-bold">STORAGE CAPACITY:</span> {device.storageCapacity}
            </td>
          </tr>

          {/* SHUT DOWN TYPE */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SHUT DOWN TYPE
            </td>
            <td className="border border-black p-2 text-center">
              <span className="inline-block mr-1">{device.shutdownType === 'NORMAL' ? '☒' : '☐'}</span> NORMAL
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{device.shutdownType === 'POWER PLUG PULLED' ? '☒' : '☐'}</span> POWER PLUG PULLED
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{device.shutdownType === 'BATTERY REMOVED' ? '☒' : '☐'}</span> BATTERY REMOVED
            </td>
          </tr>

          {/* ENCRYPTION */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              ENCRYPTION PRESENT?
            </td>
            <td className="border border-black p-2 font-semibold">
              {device.encryptionPresent}
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              ENCRYPTION SOFTWARE USED
            </td>
            <td className="border border-black p-2">
              {device.encryptionSoftwareUsed || 'None / Not Detected'}
            </td>
          </tr>

          {/* DEVICE HANDLING */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              DEVICE HANDLING
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{device.deviceHandling === 'SEIZURE' ? '☒' : '☐'}</span> SEIZURE
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{device.deviceHandling === 'IMAGING' ? '☒' : '☐'}</span> IMAGING
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{device.deviceHandling === 'BACKUP' ? '☒' : '☐'}</span> BACKUP
            </td>
          </tr>

          {/* IMAGING TOOLS */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              IMAGING TOOLS AND DETAILS:
            </td>
            <td className="border border-black p-2" colSpan={3}>
              {device.imagingToolsAndDetails || 'N/A'}
            </td>
          </tr>

          {/* HASH VALUES */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              MD5 HASH VALUE:
            </td>
            <td className="border border-black p-2 font-mono" colSpan={3}>
              {device.md5Hash || 'Pending calculation'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SHA1 HASH VALUE:
            </td>
            <td className="border border-black p-2 font-mono" colSpan={3}>
              {device.sha1Hash || 'Pending calculation'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SHA256 HASH VALUE:
            </td>
            <td className="border border-black p-2 font-mono" colSpan={3}>
              {device.sha256Hash1 || 'Pending calculation'}
            </td>
          </tr>

          {/* MASTER COPY / WORKING COPY */}
          <tr>
            <td className="border border-black p-2 font-bold text-center bg-slate-200 print:bg-slate-300" colSpan={2}>
              MASTER COPY {device.masterCopies && device.masterCopies.length > 1 ? `(${device.masterCopies.length} COPIES)` : ''}
            </td>
            <td className="border border-black p-2 font-bold text-center bg-slate-200 print:bg-slate-300" colSpan={2}>
              WORKING COPY {device.workingCopies && device.workingCopies.length > 1 ? `(${device.workingCopies.length} COPIES)` : ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2" colSpan={2}>
              {((device.masterCopies && device.masterCopies.length > 0) ? device.masterCopies : [device.masterCopy]).map((mc, mIdx, arr) => (
                <div key={mc.id || mIdx} className={mIdx > 0 ? "mt-2 pt-2 border-t border-slate-300 print:border-black" : ""}>
                  {arr.length > 1 && <div className="font-bold text-[10px] text-blue-800 uppercase mb-0.5">Master Copy #{mIdx + 1}</div>}
                  <div><span className="font-semibold">MAKE:</span> {mc.make || '—'}</div>
                  <div><span className="font-semibold">MODEL:</span> {mc.model || '—'}</div>
                  <div><span className="font-semibold">S/N:</span> {mc.serialNumber || '—'}</div>
                  <div><span className="font-semibold">STORAGE CAPACITY:</span> {mc.storageCapacity || '—'}</div>
                </div>
              ))}
            </td>
            <td className="border border-black p-2" colSpan={2}>
              {((device.workingCopies && device.workingCopies.length > 0) ? device.workingCopies : [device.workingCopy]).map((wc, wIdx, arr) => (
                <div key={wc.id || wIdx} className={wIdx > 0 ? "mt-2 pt-2 border-t border-slate-300 print:border-black" : ""}>
                  {arr.length > 1 && <div className="font-bold text-[10px] text-emerald-800 uppercase mb-0.5">Working Copy #{wIdx + 1}</div>}
                  <div><span className="font-semibold">MAKE:</span> {wc.make || '—'}</div>
                  <div><span className="font-semibold">MODEL:</span> {wc.model || '—'}</div>
                  <div><span className="font-semibold">S/N:</span> {wc.serialNumber || '—'}</div>
                  <div><span className="font-semibold">STORAGE CAPACITY:</span> {wc.storageCapacity || '—'}</div>
                </div>
              ))}
            </td>
          </tr>

          {/* RETURN TO ORIGINAL STATE */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200" colSpan={2}>
              DEVICE RETURNED TO ORIGINAL STATE?
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200 text-center">
              DATE
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200 text-center">
              TIME
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 text-center" colSpan={2}>
              <span className="font-semibold mr-4">
                {device.deviceReturnedToOriginalState === 'YES' ? '☒ YES' : '☐ YES'}
              </span>
              <span className="font-semibold">
                {device.deviceReturnedToOriginalState === 'NO' ? '☒ NO' : '☐ NO'}
              </span>
            </td>
            <td className="border border-black p-2 text-center">
              {device.returnDate || premise.searchDate}
            </td>
            <td className="border border-black p-2 text-center">
              {device.returnTime || '—'}
            </td>
          </tr>

          {/* WITNESS */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200" colSpan={2}>
              WITNESS SIGNATURE TAKEN?
            </td>
            <td className="border border-black p-2 text-center font-semibold" colSpan={2}>
              <span className="mr-4">{device.witnessSignatureTaken === 'YES' ? '☒ YES' : '☐ YES'}</span>
              <span>{device.witnessSignatureTaken === 'NO' ? '☒ NO' : '☐ NO'}</span>
            </td>
          </tr>

          {/* NOTES */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-200 print:bg-slate-300" colSpan={4}>
              NOTES BY AUTHORISED OFFICER
            </td>
          </tr>
          <tr>
            <td className="border border-black p-3 h-20 align-top" colSpan={4}>
              {device.notesByAuthorisedOfficer || 'No additional remarks.'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
