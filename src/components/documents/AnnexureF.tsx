import React from 'react';
import { Premise, Device } from '../../types';

interface Props {
  premise: Premise;
  devices: Device[];
}

export const AnnexureF: React.FC<Props> = ({ premise, devices }) => {
  // Filter cloud evidences or all imaged evidences
  const evidenceList = devices.filter(
    d => d.cloudJobSheet?.isCloudEvidence || d.deviceHandling === 'IMAGING' || d.deviceHandling === 'BACKUP'
  );

  return (
    <div className="bg-white text-black p-6 md:p-10 max-w-[900px] mx-auto font-sans text-xs border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-2 print:m-0 print:max-w-none">
      <div className="text-right font-bold text-sm mb-2">Annexure F</div>
      
      <p className="font-semibold text-xs text-justify mb-4 leading-normal">
        Annexure F. Data downloaded/retrieved from the cloud software and subsequently imaged may be suitably reflected in the job sheet, along with methodology of such download/retrieval of the cloud data.
      </p>

      <table className="w-full border-collapse border border-black text-left mb-6">
        <thead>
          <tr className="bg-slate-100 print:bg-slate-200 text-center font-bold text-[11px]">
            <th className="border border-black p-1.5 w-10">S.No</th>
            <th className="border border-black p-1.5 w-32">NAME OF ASSESSEE/PARTY:</th>
            <th className="border border-black p-1.5 w-40">Premise Name and Address</th>
            <th className="border border-black p-1.5">Evidence Name</th>
            <th className="border border-black p-1.5 w-20">Evidence Source Size</th>
            <th className="border border-black p-1.5 w-20">Image Size</th>
            <th className="border border-black p-1.5 w-28">Backup Method</th>
            <th className="border border-black p-1.5 w-32">Hash</th>
          </tr>
        </thead>
        <tbody>
          {evidenceList.length === 0 ? (
            <tr>
              <td className="border border-black p-4 text-center text-slate-500 italic" colSpan={8}>
                No imaged or cloud evidences recorded for this premise yet.
              </td>
            </tr>
          ) : (
            evidenceList.map((dev, idx) => (
              <tr key={dev.id} className="text-[11px] align-top">
                <td className="border border-black p-1.5 text-center font-bold">
                  {idx + 1}
                </td>
                <td className="border border-black p-1.5 font-semibold">
                  {premise.assesseeName}
                </td>
                <td className="border border-black p-1.5">
                  <div className="font-bold">{premise.code}</div>
                  <div className="text-[10px] text-slate-700 print:text-black">{premise.address}</div>
                </td>
                <td className="border border-black p-1.5">
                  <div className="font-bold">{dev.deviceName}</div>
                  <div className="text-[10px] text-slate-600 print:text-black">{dev.make} {dev.model} (S/N: {dev.serialNumber})</div>
                </td>
                <td className="border border-black p-1.5 text-center">
                  {dev.dataSize || dev.cloudJobSheet?.evidenceSourceSize || dev.storageCapacity || '—'}
                </td>
                <td className="border border-black p-1.5 text-center font-semibold">
                  {dev.imageSize || dev.cloudJobSheet?.imageSize || dev.storageCapacity || '—'}
                </td>
                <td className="border border-black p-1.5 text-[10px]">
                  {dev.backupMethod || dev.cloudJobSheet?.backupMethod || dev.imagingToolsAndDetails || 'Physical Forensic Image (E01)'}
                </td>
                <td className="border border-black p-1.5 font-mono text-[9px] break-all">
                  {dev.cloudJobSheet?.hash || dev.sha256Hash1 || dev.md5Hash || '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* METHODOLOGY STANDARD NOTES */}
      <div className="border border-black p-3 my-4 bg-slate-50 print:bg-transparent text-xs space-y-1.5">
        <div className="font-bold uppercase text-[11px] mb-1">Standard Forensic Methodology:</div>
        <div>1. We have used latest version of Cellebrite UFED 7.70 for Mobile imaging/Acquisition.</div>
        <div>2. We have used Tableau Forensic Duplicator Hardware / FTK Imager based imaging Tools for Forensic imaging (E01) for pen drives, hard disk and solid state-drive (where possible)</div>
        <div>3. Used Google’s Google Takeout feature to achieve and download email data stored with Gmail. Then created Ad1 image for Hash Value and future forensic integrity.</div>
      </div>

      {/* SIGNATURES */}
      <div className="grid grid-cols-2 gap-8 mt-12 pt-4 font-sans text-xs">
        <div className="space-y-4">
          <div>
            <span className="font-bold">Forensic Examiner: </span>
            <span className="font-semibold">{premise.forensicTeam.examinerName}</span>
          </div>
          <div>{premise.forensicTeam.examinerDesignation}, {premise.forensicTeam.companyName}</div>
          <div className="pt-6">
            <span className="font-bold">Signature: </span>
            <span className="inline-block border-b border-black w-48 ml-2"></span>
          </div>
        </div>

        <div className="space-y-4 text-right">
          <div>
            <span className="font-bold">Authorized officer: </span>
            <span className="font-semibold">{premise.authorizedOfficer.name}</span>
          </div>
          <div>{premise.authorizedOfficer.designation}</div>
          <div className="pt-6">
            <span className="font-bold">Signature: </span>
            <span className="inline-block border-b border-black w-48 ml-2"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
