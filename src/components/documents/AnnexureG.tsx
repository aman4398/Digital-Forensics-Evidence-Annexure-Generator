import React from 'react';
import { Premise, Device } from '../../types';

interface Props {
  premise: Premise;
  devices: Device[];
}

export const AnnexureG: React.FC<Props> = ({ premise, devices }) => {
  return (
    <div className="bg-white text-black p-6 md:p-10 max-w-[900px] mx-auto font-sans text-xs border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-2 print:m-0 print:max-w-none">
      <div className="text-right font-bold text-sm mb-2">Annexure G</div>
      
      <div className="text-center font-bold text-sm uppercase tracking-wide mb-6">
        IDENTIFICATION AND PHYSICAL INVENTORY OF DEVICES
      </div>

      <div className="mb-4 space-y-1 text-xs">
        <div>
          <span className="font-bold">Name of Assessee: </span>
          <span className="font-semibold uppercase">{premise.assesseeName}</span>
        </div>
        <div>
          <span className="font-bold">Address: </span>
          <span>{premise.address}</span>
        </div>
        <div>
          <span className="font-bold">Premise Code & Location: </span>
          <span className="font-semibold">{premise.code} - {premise.name}</span>
        </div>
      </div>

      <table className="w-full border-collapse border border-black text-left mb-6">
        <thead>
          <tr className="bg-slate-100 print:bg-slate-200 text-center font-bold text-[11px]">
            <th className="border border-black p-2 w-28" rowSpan={2}>
              Device found at premise
            </th>
            <th className="border border-black p-2 text-center" colSpan={5}>
              EVIDENCE DETAILS
            </th>
          </tr>
          <tr className="bg-slate-100 print:bg-slate-200 text-center font-bold text-[11px]">
            <th className="border border-black p-1.5 w-24">
              Nature of evidence found
            </th>
            <th className="border border-black p-1.5 w-48">
              (MAKE/ S.No./ Capacity/ Unique No)
            </th>
            <th className="border border-black p-1.5 w-32">
              Found From Possession of
            </th>
            <th className="border border-black p-1.5 w-40">
              Whether the person in preceding column is OWNER/USER and his relation with the target
            </th>
            <th className="border border-black p-1.5">
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {devices.length === 0 ? (
            <tr>
              <td className="border border-black p-6 text-center text-slate-500 italic" colSpan={6}>
                No devices added to physical inventory yet for this premise.
              </td>
            </tr>
          ) : (
            devices.map((d, index) => (
              <tr key={d.id} className="text-[11px] align-top">
                <td className="border border-black p-2 font-medium">
                  <div className="font-bold">{d.foundLocationAtPremise || `Item #${index + 1}`}</div>
                  <div className="text-[10px] text-slate-600 print:text-black">{d.deviceName}</div>
                </td>
                <td className="border border-black p-2 uppercase font-semibold text-center">
                  {d.deviceCategory}
                </td>
                <td className="border border-black p-2">
                  <div><span className="font-semibold">Make:</span> {d.make}</div>
                  <div><span className="font-semibold">Model:</span> {d.model}</div>
                  <div><span className="font-semibold">S/N:</span> <span className="font-mono">{d.serialNumber}</span></div>
                  <div><span className="font-semibold">Cap:</span> {d.storageCapacity}</div>
                  {d.mobileDetails?.imei1 && (
                    <div><span className="font-semibold">IMEI:</span> <span className="font-mono">{d.mobileDetails.imei1}</span></div>
                  )}
                </td>
                <td className="border border-black p-2">
                  <div className="font-semibold">{d.foundPossessionOf || d.ownerUserName}</div>
                  {d.ownerRelative && <div className="text-[10px] text-slate-600 print:text-black">{d.ownerRelative}</div>}
                </td>
                <td className="border border-black p-2">
                  <div className="font-semibold">{d.isOwnerUser || 'OWNER/USER'}</div>
                  <div className="text-[10px] text-slate-700 print:text-black">
                    <span className="font-bold">Relation: </span>
                    {d.relationWithTarget || 'Associate'}
                  </div>
                </td>
                <td className="border border-black p-2 text-[10px]">
                  {d.remarks || 'Seized / Imaged forensically during search.'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* FOOTER SIGNATURES */}
      <div className="grid grid-cols-2 gap-8 mt-14 pt-4 border-t border-slate-300 font-sans text-xs">
        <div>
          <div className="font-bold">Independent Witnesses:</div>
          <div className="mt-2 space-y-2 text-[11px]">
            <div>1. {premise.witness1.name} ({premise.witness1.address}) - Sign: __________________</div>
            <div>2. {premise.witness2.name} ({premise.witness2.address}) - Sign: __________________</div>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="font-bold">Authorised Officer / Conducting DDIT:</div>
          <div className="font-semibold">{premise.authorizedOfficer.name}</div>
          <div className="text-[11px] text-slate-700 print:text-black">{premise.authorizedOfficer.designation}</div>
          <div className="pt-6">
            <span className="font-bold">Signature & Seal: </span>
            <span className="inline-block border-b border-black w-40 ml-2"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
