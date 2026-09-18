import React from 'react';
import { Premise, Device } from '../../types';

interface Props {
  premise: Premise;
  devices: Device[];
}

export const WorkCompletionLetter: React.FC<Props> = ({ premise, devices }) => {
  const w = premise.workCompletion;
  const ao = premise.authorizedOfficer;
  const ft = premise.forensicTeam;

  // Filter devices that were handled (imaged, backup, seized)
  const handledDevices = devices.filter(
    d => d.workCompletionEntry || d.deviceHandling === 'IMAGING' || d.deviceHandling === 'BACKUP' || d.deviceHandling === 'SEIZURE'
  );

  return (
    <div className="bg-white text-black p-8 md:p-12 max-w-[850px] mx-auto font-sans text-xs leading-relaxed border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-6 print:m-0 print:max-w-none">
      {/* LETTERHEAD */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <div className="text-xl font-black uppercase tracking-wider text-slate-900 print:text-black">
          {ft.companyName || 'WALCore Intelligence Pvt. Ltd.'}
        </div>
        <div className="text-xs font-semibold text-slate-700 print:text-black tracking-wide uppercase mt-0.5">
          {ft.natureOfService || 'Forensic & Cyber Investigation Services'}
        </div>
      </div>

      <div className="text-right font-bold text-xs mb-4">
        Date: <span className="font-mono">{w.letterDate || premise.searchDate}</span>
      </div>

      <div className="mb-6 space-y-1 text-xs">
        <div>To,</div>
        <div className="font-bold">The Authorized Officer,</div>
        <div className="font-semibold">{w.authName || ao.name},</div>
        <div>{w.authorization || ao.designation}</div>
        <div>{ao.department}, {ao.departmentCity}</div>
      </div>

      <div className="mb-4">
        <span className="font-bold underline uppercase">
          Subject: Forensic Imaging and Data Extraction Work Completion, Reg.
        </span>
      </div>

      <div className="space-y-4 text-justify mb-6 text-xs leading-normal">
        <div>Respected Sir,</div>
        <div>
          We, <span className="font-bold">{ft.companyName || 'WALCore Intelligence Pvt. Ltd.'}</span>, are appointed by the{' '}
          <span className="font-bold">{w.dept || ao.department}</span>,{' '}
          <span className="font-bold">{w.deptCity || ao.departmentCity}</span> for the Search &amp; Seizure operation on{' '}
          <span className="font-semibold underline">{w.searchDate || premise.searchDate}</span> at{' '}
          <span className="font-semibold underline">{premise.name} ({premise.code})</span> to identify the device and collect the digital data under forensically sound conditions. The forensic imaging and data extraction work has been successfully completed on{' '}
          <span className="font-semibold underline">{w.completionDate || premise.searchDate}</span>. Below is the description of the device from which the digital data has been collected during the Search &amp; Seizure Operation:
        </div>
      </div>

      {/* DEVICE PARTICULARS TABLE */}
      <table className="w-full border-collapse border border-black text-left mb-6 text-xs">
        <thead>
          <tr className="bg-slate-200 print:bg-slate-300 font-bold text-center">
            <th className="border border-black p-2 w-14">S. No.</th>
            <th className="border border-black p-2">Particulars</th>
            <th className="border border-black p-2 w-48">Content Type</th>
            <th className="border border-black p-2 w-28">Size</th>
          </tr>
        </thead>
        <tbody>
          {handledDevices.length === 0 ? (
            <tr>
              <td className="border border-black p-4 text-center text-slate-500 italic" colSpan={4}>
                No imaged devices recorded for this premise.
              </td>
            </tr>
          ) : (
            handledDevices.map((dev, idx) => (
              <tr key={dev.id} className="align-top">
                <td className="border border-black p-2 text-center font-bold">
                  {idx + 1}
                </td>
                <td className="border border-black p-2">
                  <div className="font-semibold">{dev.workCompletionEntry?.particulars || dev.deviceName}</div>
                  <div className="text-[11px] text-slate-600 print:text-black">
                    {dev.make} {dev.model} | S/N: {dev.serialNumber} | User: {dev.ownerUserName}
                  </div>
                </td>
                <td className="border border-black p-2">
                  {dev.workCompletionEntry?.contentType || (dev.deviceHandling === 'IMAGING' ? 'Forensic Bitstream E01 / Physical Dump' : 'Extracted Data Backup')}
                </td>
                <td className="border border-black p-2 text-right font-mono font-medium">
                  {dev.workCompletionEntry?.size || dev.storageCapacity}
                </td>
              </tr>
            ))
          )}
          <tr className="bg-slate-100 print:bg-slate-200 font-bold">
            <td className="border border-black p-2 text-center" colSpan={3}>
              TOTAL
            </td>
            <td className="border border-black p-2 text-right font-mono text-sm">
              {w.totalSize || 'Calculated on completion'}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mb-10 text-xs">
        <div>Thanking you and assuring you of our best services.</div>
        <div className="mt-8 font-bold">
          <div>Authorized Signatory</div>
          <div className="text-slate-800 print:text-black">{ft.companyName || 'WALCore Intelligence Pvt. Ltd.'}</div>
          <div className="mt-6 text-slate-500 print:text-black">____________________________________</div>
          <div className="text-[11px] font-normal text-slate-700 print:text-black mt-1">({ft.examinerName} - {ft.examinerDesignation})</div>
        </div>
      </div>

      {/* ACKNOWLEDGEMENT BOX */}
      <div className="border border-black p-4 bg-slate-50 print:bg-transparent">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="font-bold text-xs uppercase underline">Acknowledgement of Work Completion</div>
            <div><span className="font-bold">Received from: </span>{ft.companyName || 'WALCore Intelligence Pvt. Ltd.'}</div>
            <div><span className="font-bold">Date of Work: </span><span className="font-mono">{w.receivedDate || premise.searchDate}</span></div>
          </div>
          <div className="text-right space-y-1">
            <div className="font-bold text-xs uppercase">Signature &amp; Seal of Receiving Officer</div>
            <div className="pt-10">
              <span className="inline-block border-b border-black w-48"></span>
            </div>
            <div className="text-xs font-semibold">({w.authName || ao.name})</div>
            <div className="text-[11px] text-slate-700 print:text-black">{ao.designation}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
