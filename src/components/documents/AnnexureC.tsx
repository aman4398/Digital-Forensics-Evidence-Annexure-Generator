import React from 'react';
import { Premise, Device } from '../../types';

interface Props {
  premise: Premise;
  device: Device;
}

export const AnnexureC: React.FC<Props> = ({ premise, device }) => {
  const cocRows = [...device.chainOfCustody];
  // Ensure at least 4 rows for physical signatures in the field
  while (cocRows.length < 4) {
    cocRows.push({
      id: `blank-${cocRows.length}`,
      reasonAction: '',
      givenByName: '',
      receivedByName: '',
      date: '',
      time: '',
    });
  }

  return (
    <div className="bg-white text-black p-6 md:p-10 max-w-[850px] mx-auto font-sans text-xs border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-2 print:m-0 print:max-w-none">
      <div className="text-right font-bold text-sm mb-2">Annexure C</div>
      <div className="text-center font-bold text-sm uppercase tracking-wider mb-1">
        CHAIN OF CUSTODY
      </div>
      <div className="text-center font-bold text-xs uppercase tracking-wide bg-slate-200 py-1 mb-4 print:bg-slate-300">
        CHAIN OF CUSTODY FORM
      </div>

      <table className="w-full border-collapse border border-black text-left mb-6">
        <tbody>
          <tr>
            <td className="border border-black p-2 font-bold w-1/4 bg-slate-100 print:bg-slate-200">
              NAME OF ASSESSEE/PARTY:
            </td>
            <td className="border border-black p-2 uppercase font-semibold" colSpan={3}>
              {premise.assesseeName}
            </td>
          </tr>

          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              DATE:
            </td>
            <td className="border border-black p-2 font-medium">
              {premise.searchDate}
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200 w-1/6">
              TIME:
            </td>
            <td className="border border-black p-2 font-medium">
              {premise.searchTime}
            </td>
          </tr>

          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              ADDRESS:
            </td>
            <td className="border border-black p-2" colSpan={3}>
              {premise.address}
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

          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              MAKE:
            </td>
            <td className="border border-black p-2">
              {device.make}
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              MODEL:
            </td>
            <td className="border border-black p-2">
              {device.model}
            </td>
          </tr>

          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              S/N:
            </td>
            <td className="border border-black p-2">
              {device.serialNumber}
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              CAPACITY:
            </td>
            <td className="border border-black p-2">
              {device.storageCapacity}
            </td>
          </tr>

          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              OWNER/USER:
            </td>
            <td className="border border-black p-2 font-medium" colSpan={3}>
              {device.ownerUserName} {device.relationWithTarget ? `(${device.relationWithTarget})` : ''}
            </td>
          </tr>

          <tr>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              IMEI1:
            </td>
            <td className="border border-black p-2 font-mono">
              {device.mobileDetails?.imei1 || (device.deviceCategory === 'mobile' ? 'N/A' : 'Not Applicable')}
            </td>
            <td className="border border-black p-2 font-bold bg-slate-100 print:bg-slate-200">
              IMEI2:
            </td>
            <td className="border border-black p-2 font-mono">
              {device.mobileDetails?.imei2 || (device.deviceCategory === 'mobile' ? 'N/A' : 'Not Applicable')}
            </td>
          </tr>
        </tbody>
      </table>

      {/* CHAIN OF CUSTODY TABLE */}
      <div className="border border-black">
        <div className="bg-slate-200 p-1 text-center font-bold uppercase tracking-wider border-b border-black print:bg-slate-300">
          CHAIN OF CUSTODY
        </div>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-100 print:bg-slate-200 text-center font-bold">
              <th className="border border-black p-2 w-1/3">REASON/ACTION</th>
              <th className="border border-black p-2 w-1/4">GIVEN BY</th>
              <th className="border border-black p-2 w-1/4">RECEIVED BY</th>
              <th className="border border-black p-2 w-20">DATE</th>
              <th className="border border-black p-2 w-20">TIME</th>
            </tr>
          </thead>
          <tbody>
            {cocRows.map((row, idx) => (
              <tr key={row.id || idx} className="h-16">
                <td className="border border-black p-2 align-top text-xs">
                  {row.reasonAction}
                </td>
                <td className="border border-black p-2 align-top">
                  <div className="font-semibold text-xs">{row.givenByName ? `NAME: ${row.givenByName}` : 'NAME:'}</div>
                  <div className="mt-4 text-[11px] text-slate-600 print:text-black">SIGNATURE: ________________</div>
                </td>
                <td className="border border-black p-2 align-top">
                  <div className="font-semibold text-xs">{row.receivedByName ? `NAME: ${row.receivedByName}` : 'NAME:'}</div>
                  <div className="mt-4 text-[11px] text-slate-600 print:text-black">SIGNATURE: ________________</div>
                </td>
                <td className="border border-black p-2 text-center align-top font-mono text-xs">
                  {row.date}
                </td>
                <td className="border border-black p-2 text-center align-top font-mono text-xs">
                  {row.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
