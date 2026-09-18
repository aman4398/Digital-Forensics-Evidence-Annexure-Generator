import React from 'react';
import { Premise, Device } from '../../types';

interface Props {
  premise: Premise;
  device: Device;
}

export const AnnexureE: React.FC<Props> = ({ premise, device }) => {
  const b = device.bsaDetails;

  const isCheckedSource = (type: string) => {
    if (type === 'Computer / Storage Media' && (b.sourceType === 'Computer / Storage Media' || device.deviceCategory === 'laptop' || device.deviceCategory === 'desktop' || device.deviceCategory === 'storage')) return true;
    if (type === 'Mobile' && (b.sourceType === 'Mobile' || device.deviceCategory === 'mobile')) return true;
    if (type === 'DVR' && (b.sourceType === 'DVR' || device.deviceCategory === 'dvr')) return true;
    if (type === 'Server' && (b.sourceType === 'Server' || device.deviceCategory === 'server')) return true;
    if (type === 'Cloud' && (b.sourceType === 'Cloud' || device.deviceCategory === 'cloud')) return true;
    if (type === 'Flash Drive' && b.sourceType === 'Flash Drive') return true;
    if (type === 'CD/DVD' && b.sourceType === 'CD/DVD') return true;
    if (type === 'Other' && b.sourceType === 'Other') return true;
    return false;
  };

  const getIdentifier = () => {
    if (b.uniqueId) return b.uniqueId;
    if (device.deviceCategory === 'mobile' && device.mobileDetails?.imei1) {
      return `IMEI1: ${device.mobileDetails.imei1}${device.mobileDetails.imei2 ? ` / IMEI2: ${device.mobileDetails.imei2}` : ''} | S/N: ${device.serialNumber}`;
    }
    return `Serial No: ${device.serialNumber || 'N/A'}`;
  };

  return (
    <div className="space-y-12">
      {/* PART A: TO BE FILLED BY THE PARTY */}
      <div className="bg-white text-black p-8 md:p-12 max-w-[800px] mx-auto font-serif text-[13.5px] leading-relaxed border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-6 print:m-0 print:max-w-none print:break-after-page">
        <div className="text-right font-bold text-sm mb-4">Annexure E</div>

        <div className="text-center font-bold text-base uppercase tracking-wider mb-1">
          CERTIFICATE UNDER SECTION (63)(4)(c) OF
        </div>
        <div className="text-center font-bold text-base uppercase tracking-wider mb-2">
          BHARATIYA SAKSHYA ADHINIYAM, 2023
        </div>
        <div className="text-center font-bold text-sm uppercase tracking-wide bg-slate-100 py-1 mb-6 border-y border-black print:bg-slate-200">
          PART A<br />
          <span className="font-normal text-xs normal-case">(To be filled by the Party)</span>
        </div>

        <p className="mb-4 text-justify">
          I, <span className="font-bold uppercase underline underline-offset-2">{device.ownerUserName || premise.assesseeName}</span>,{' '}
          <span className="underline underline-offset-2">{device.ownerRelative || 'Son/daughter/spouse of _________'}</span>{' '}
          residing/employed at <span className="underline underline-offset-2">{device.ownerLocation || premise.address}</span> do hereby solemnly affirm and sincerely state and submit as follows: —
        </p>

        <p className="mb-3">
          I have produced electronic record/output of the digital record taken from the Following device/digital record source (tick mark):—
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 p-3 border border-slate-300 bg-slate-50 print:bg-transparent print:border-black font-sans text-xs">
          <div><span className="mr-1">{isCheckedSource('Computer / Storage Media') ? '☒' : '❑'}</span> Computer / Storage Media</div>
          <div><span className="mr-1">{isCheckedSource('DVR') ? '☒' : '❑'}</span> DVR</div>
          <div><span className="mr-1">{isCheckedSource('Mobile') ? '☒' : '❑'}</span> Mobile</div>
          <div><span className="mr-1">{isCheckedSource('Flash Drive') ? '☒' : '❑'}</span> Flash Drive</div>
          <div><span className="mr-1">{isCheckedSource('CD/DVD') ? '☒' : '❑'}</span> CD/DVD</div>
          <div><span className="mr-1">{isCheckedSource('Server') ? '☒' : '❑'}</span> Server</div>
          <div><span className="mr-1">{isCheckedSource('Cloud') ? '☒' : '❑'}</span> Cloud</div>
          <div><span className="mr-1">{isCheckedSource('Other') ? '☒' : '❑'}</span> Other</div>
        </div>
        {b.sourceTypeOther && (
          <div className="text-xs mb-3">Other: <span className="underline underline-offset-2">{b.sourceTypeOther}</span></div>
        )}

        <div className="space-y-1.5 my-4 text-xs font-sans border-l-2 border-black pl-3 py-1">
          <div><span className="font-bold">Device Name:</span> <span className="font-semibold">{device.deviceName}</span></div>
          <div>
            <span className="font-bold">Make & Model:</span> {device.make} {device.model} &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="font-bold">Color:</span> {device.color || 'Standard'}
          </div>
          <div><span className="font-bold">Serial Number:</span> <span className="font-mono">{device.serialNumber}</span></div>
          <div><span className="font-bold">IMEI/UIN/UID/MAC/Cloud ID:</span> <span className="font-mono">{getIdentifier()}</span> (as applicable)</div>
          <div><span className="font-bold">and any other relevant information, if any, about the device/digital record:</span> {device.remarks || 'None'}</div>
        </div>

        <p className="text-justify my-4 leading-normal">
          The digital device or the digital record source was under the lawful control for regularly creating, storing or processing information for the purposes of carrying out regular activities and during this period, the computer or the communication device was working properly and the relevant information was regularly fed into the computer during the ordinary course of business. If computer/digital device at any point of time was not working properly or out of operation, then it has not affected the electronic/digital record or its accuracy. The digital device or the source of the digital record is: -
        </p>

        <div className="flex flex-wrap gap-4 my-2 text-xs font-sans font-bold">
          <div><span className="mr-1">{b.partyRelationship === 'Owned' ? '☒' : '❑'}</span> Owned</div>
          <div><span className="mr-1">{b.partyRelationship === 'Maintained' ? '☒' : '❑'}</span> Maintained</div>
          <div><span className="mr-1">{b.partyRelationship === 'Managed' ? '☒' : '❑'}</span> Managed</div>
          <div><span className="mr-1">{b.partyRelationship === 'Operated' ? '☒' : '❑'}</span> Operated</div>
          <span className="font-normal italic">by me (select as applicable).</span>
        </div>

        <p className="mt-4 mb-2">
          I state that the HASH value/s of the electronic/digital record's is obtained through the following algorithm: —
        </p>

        <div className="space-y-1 my-2 text-xs font-sans font-mono bg-slate-50 p-3 border border-slate-300 print:bg-transparent print:border-black">
          <div><span className="mr-1 font-bold">{device.sha1Hash ? '☒' : '❑'} SHA1:</span> {device.sha1Hash || '—'}</div>
          <div><span className="mr-1 font-bold">{device.sha256Hash1 ? '☒' : '❑'} SHA256:</span> {device.sha256Hash1 || '—'}</div>
          <div><span className="mr-1 font-bold">{device.md5Hash ? '☒' : '❑'} MD5:</span> {device.md5Hash || '—'}</div>
          <div><span className="mr-1 font-bold">❑ Other:</span> ________________ (Legally acceptable standard)</div>
        </div>
        <div className="text-[11px] italic mb-6">(Hash report to be enclosed with the certificate)</div>

        <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-slate-300 font-sans text-xs">
          <div className="space-y-2">
            <div><span className="font-bold">Date (DD/MM/YYYY):</span> {b.partyDate || premise.searchDate}</div>
            <div><span className="font-bold">Time (IST):</span> {b.partyTime || '______'} hours (In 24 hours format)</div>
            <div><span className="font-bold">Place:</span> {b.partyPlace || premise.authorizedOfficer.departmentCity || 'New Delhi'}</div>
          </div>
          <div className="space-y-2 text-right">
            <div><span className="font-bold">Name:</span> <span className="uppercase font-semibold">{device.ownerUserName || premise.assesseeName}</span></div>
            <div className="pt-8">
              <span className="font-bold">Signature: </span>
              <span className="inline-block border-b border-black w-36 ml-2"></span>
            </div>
          </div>
        </div>
      </div>

      {/* PART B: TO BE FILLED BY THE EXPERT */}
      <div className="bg-white text-black p-8 md:p-12 max-w-[800px] mx-auto font-serif text-[13.5px] leading-relaxed border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-6 print:m-0 print:max-w-none print:break-after-page">
        <div className="text-right font-bold text-sm mb-4">Annexure E</div>

        <div className="text-center font-bold text-base uppercase tracking-wider mb-2">
          PART B<br />
          <span className="font-normal text-xs normal-case">(To be filled by the Expert)</span>
        </div>

        <p className="mb-4 text-justify">
          I, <span className="font-bold uppercase underline underline-offset-2">{b.expertName || premise.forensicTeam.examinerName}</span>,{' '}
          <span className="underline underline-offset-2">{b.expertRelative || 'Son/daughter/spouse of _________'}</span>{' '}
          residing/employed at <span className="underline underline-offset-2">{b.expertLocation || `${premise.forensicTeam.companyName}, ${premise.authorizedOfficer.departmentCity || 'New Delhi'}`}</span> do hereby solemnly affirm and sincerely state and submit as follows:-
        </p>

        <p className="mb-3">
          The produced electronic record/output of the digital record are obtained from the following device/digital record source (tick mark): -
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 p-3 border border-slate-300 bg-slate-50 print:bg-transparent print:border-black font-sans text-xs">
          <div><span className="mr-1">{isCheckedSource('Computer / Storage Media') ? '☒' : '❑'}</span> Computer / Storage Media</div>
          <div><span className="mr-1">{isCheckedSource('DVR') ? '☒' : '❑'}</span> DVR</div>
          <div><span className="mr-1">{isCheckedSource('Mobile') ? '☒' : '❑'}</span> Mobile</div>
          <div><span className="mr-1">{isCheckedSource('Flash Drive') ? '☒' : '❑'}</span> Flash Drive</div>
          <div><span className="mr-1">{isCheckedSource('CD/DVD') ? '☒' : '❑'}</span> CD/DVD</div>
          <div><span className="mr-1">{isCheckedSource('Server') ? '☒' : '❑'}</span> Server</div>
          <div><span className="mr-1">{isCheckedSource('Cloud') ? '☒' : '❑'}</span> Cloud</div>
          <div><span className="mr-1">{isCheckedSource('Other') ? '☒' : '❑'}</span> Other</div>
        </div>

        <div className="space-y-1.5 my-4 text-xs font-sans border-l-2 border-black pl-3 py-1">
          <div><span className="font-bold">Device Name:</span> <span className="font-semibold">{device.deviceName}</span></div>
          <div>
            <span className="font-bold">Make & Model:</span> {device.make} {device.model} &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="font-bold">Color:</span> {device.color || 'Standard'}
          </div>
          <div><span className="font-bold">Serial Number:</span> <span className="font-mono">{device.serialNumber}</span></div>
          <div><span className="font-bold">IMEI/UIN/UID/MAC/Cloud ID:</span> <span className="font-mono">{getIdentifier()}</span> (as applicable)</div>
          <div><span className="font-bold">and any other relevant information, if any, about the device/digital record:</span> {device.imagingToolsAndDetails || 'Forensically imaged with verified bit-stream integrity.'}</div>
        </div>

        <p className="mt-4 mb-2">
          I state that the HASH values of the electronic/digital records is obtained through the following algorithm: -
        </p>

        <div className="space-y-1 my-2 text-xs font-sans font-mono bg-slate-50 p-3 border border-slate-300 print:bg-transparent print:border-black">
          <div><span className="mr-1 font-bold">{device.sha1Hash ? '☒' : '❑'} SHA1:</span> {device.sha1Hash || '—'}</div>
          <div><span className="mr-1 font-bold">{device.sha256Hash1 ? '☒' : '❑'} SHA256:</span> {device.sha256Hash1 || '—'}</div>
          <div><span className="mr-1 font-bold">{device.md5Hash ? '☒' : '❑'} MD5:</span> {device.md5Hash || '—'}</div>
          <div><span className="mr-1 font-bold">❑ Other:</span> ________________ (Legally acceptable standard)</div>
        </div>
        <div className="text-[11px] italic mb-6">(Hash report to be enclosed with the certificate)</div>

        <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-slate-300 font-sans text-xs">
          <div className="space-y-2">
            <div><span className="font-bold">Date (DD/MM/YYYY):</span> {b.expertDate || premise.searchDate}</div>
            <div><span className="font-bold">Time (IST):</span> {b.expertTime || '______'} hours (In 24 hours format)</div>
            <div><span className="font-bold">Place:</span> {b.expertPlace || premise.authorizedOfficer.departmentCity || 'New Delhi'}</div>
          </div>
          <div className="space-y-2 text-right">
            <div><span className="font-bold">Name:</span> <span className="uppercase font-semibold">{b.expertName || premise.forensicTeam.examinerName}</span></div>
            <div><span className="font-bold">Designation:</span> {b.expertDesignation || premise.forensicTeam.examinerDesignation}</div>
            <div className="pt-6">
              <span className="font-bold">Signature: </span>
              <span className="inline-block border-b border-black w-36 ml-2"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
