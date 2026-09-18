import React from 'react';
import { Premise, Device } from '../../types';

interface Props {
  premise: Premise;
  device: Device;
}

export const AnnexureD: React.FC<Props> = ({ premise, device }) => {
  const m = device.mobileDetails || {
    imei1: 'N/A',
    imei2: 'N/A',
    simPresent: 'NO',
    simDetails: '',
    simProvider: '',
    mediaCardPresent: 'NO',
    mediaCardDetails: '',
    mediaCardMake: '',
    mediaCardModel: '',
  };

  return (
    <div className="bg-white text-black p-6 md:p-10 max-w-[850px] mx-auto font-sans text-xs border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-2 print:m-0 print:max-w-none">
      <div className="text-right font-bold text-sm mb-2">Annexure D</div>
      <div className="text-center font-bold text-sm uppercase tracking-wide mb-4">
        DEVICE COLLECTION FORM FOR MOBILE PHONES
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
              {premise.forensicTeam.teamCode ? ` [Team: ${premise.forensicTeam.teamCode}]` : ''}
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
              {device.visibleOnScreen || 'Normal lock screen / display on'}
            </td>
          </tr>

          {/* DEVICE INFO */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200 text-center" rowSpan={6}>
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
          <tr>
            <td className="border border-black p-2" colSpan={3}>
              <span className="font-bold">IMEI1:</span> <span className="font-mono">{m.imei1 || 'N/A'}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2" colSpan={3}>
              <span className="font-bold">IMEI2:</span> <span className="font-mono">{m.imei2 || 'N/A'}</span>
            </td>
          </tr>

          {/* SIM CARD */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SIM CARD PRESENT
            </td>
            <td className="border border-black p-2 font-semibold">
              <span className="mr-3">{m.simPresent === 'YES' ? '☒ YES' : '☐ YES'}</span>
              <span>{m.simPresent === 'NO' ? '☒ NO' : '☐ NO'}</span>
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SIM CARD DETAILS
            </td>
            <td className="border border-black p-2">
              {m.simDetails || 'N/A'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SIM CARD PROVIDER:
            </td>
            <td className="border border-black p-2 font-semibold" colSpan={3}>
              {m.simProvider || 'N/A'}
            </td>
          </tr>

          {/* MEDIA CARD */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              MEDIA CARD PRESENT
            </td>
            <td className="border border-black p-2 font-semibold">
              <span className="mr-3">{m.mediaCardPresent === 'YES' ? '☒ YES' : '☐ YES'}</span>
              <span>{m.mediaCardPresent === 'NO' ? '☒ NO' : '☐ NO'}</span>
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              MEDIA CARD DETAILS
            </td>
            <td className="border border-black p-2">
              {m.mediaCardDetails || 'N/A'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              MAKE:
            </td>
            <td className="border border-black p-2">
              {m.mediaCardMake || 'N/A'}
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              MODEL:
            </td>
            <td className="border border-black p-2">
              {m.mediaCardModel || 'N/A'}
            </td>
          </tr>

          {/* MOBILE STATE */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              MOBILE PHONE STATE
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{device.deviceStatus === 'ON' ? '☒' : '☐'}</span> ON
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{device.deviceStatus === 'OFF' ? '☒' : '☐'}</span> OFF
            </td>
            <td className="border border-black p-2 text-center font-semibold">
              <span className="inline-block mr-1">{device.deviceStatus === 'OFFLINE' ? '☒' : '☐'}</span> OFFLINE
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
              {device.imagingToolsAndDetails || 'Cellebrite UFED 7.70'}
            </td>
          </tr>

          {/* HASHES */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              MD5 HASH VALUE:
            </td>
            <td className="border border-black p-2 font-mono text-[11px]" colSpan={3}>
              {device.md5Hash || '—'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SHA1 HASH VALUE:
            </td>
            <td className="border border-black p-2 font-mono text-[11px]" colSpan={3}>
              {device.sha1Hash || '—'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SHA256 HASH VALUE1:
            </td>
            <td className="border border-black p-2 font-mono text-[11px]" colSpan={3}>
              {device.sha256Hash1 || '—'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SHA256 HASH VALUE2:
            </td>
            <td className="border border-black p-2 font-mono text-[11px]" colSpan={3}>
              {device.sha256Hash2 || '—'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SHA256 HASH VALUE3:
            </td>
            <td className="border border-black p-2 font-mono text-[11px]" colSpan={3}>
              {device.sha256Hash3 || '—'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SHA256 HASH VALUE4:
            </td>
            <td className="border border-black p-2 font-mono text-[11px]" colSpan={3}>
              {device.sha256Hash4 || '—'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              SHA256 HASH VALUE5:
            </td>
            <td className="border border-black p-2 font-mono text-[11px]" colSpan={3}>
              {device.sha256Hash5 || '—'}
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

          {/* NOTES */}
          <tr>
            <td className="border border-black p-2 font-bold bg-slate-200 print:bg-slate-300" colSpan={4}>
              NOTES BY AUTHORISED OFFICER
            </td>
          </tr>
          <tr>
            <td className="border border-black p-3 h-20 align-top" colSpan={4}>
              {device.notesByAuthorisedOfficer || 'Extraction conducted as per standard digital forensics operating procedures.'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
