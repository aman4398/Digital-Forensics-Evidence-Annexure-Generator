import React from 'react';
import { Premise } from '../../types';

interface Props {
  premise: Premise;
}

export const AnnexureA: React.FC<Props> = ({ premise }) => {
  const d = premise.accountingDeclaration;

  return (
    <div className="bg-white text-black p-8 md:p-12 max-w-[800px] mx-auto font-serif text-[15px] leading-relaxed border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-6 print:m-0 print:max-w-none">
      <div className="text-right font-bold text-base mb-6 tracking-wide">Annexure A</div>
      
      <div className="text-center font-bold text-xl tracking-wider uppercase mb-8 border-b-2 border-black pb-2">
        Self Declaration
      </div>

      <div className="text-right font-semibold mb-6">
        Date: <span className="font-normal underline underline-offset-4">{d.date || premise.searchDate || 'DD/MM/YEAR'}</span>
      </div>

      <div className="space-y-5 text-justify">
        <p>
          With reference to the instruction given by the{' '}
          <span className="font-semibold underline underline-offset-2">
            {premise.authorizedOfficer.department || 'Income Tax Department (Inv.)'}, {premise.authorizedOfficer.departmentCity || 'New Delhi'}
          </span>
          , to provide the modus-operandi of financial accounting software and details on how it works.
        </p>

        <p>
          At (
          <span className="font-bold uppercase underline underline-offset-2">
            {d.companyName || premise.assesseeName || 'ABC COMPANY'}
          </span>
          ), (Address{' '}
          <span className="underline underline-offset-2">
            {d.companyAddress || premise.address || '________________________'}
          </span>
          ) we are using{' '}
          <span className="font-bold underline underline-offset-2">
            {d.softwareName || 'SAP/ERP'}
          </span>{' '}
          accounting software for our maintenance of regular books of account of the Company and other accounting data. We have created a backup copy/ report and Client Machine/ dummy server of the{' '}
          <span className="font-bold underline underline-offset-2">{d.softwareName || 'SAP'}</span> data for the department.
        </p>

        {d.backupDescription && (
          <p className="bg-slate-50 p-3 border border-slate-200 text-sm italic print:bg-transparent print:border-black">
            <span className="font-semibold not-italic">Backup / Client Machine Configuration: </span>
            {d.backupDescription}
          </p>
        )}

        <p>
          We undertake that our{' '}
          <span className="font-bold underline underline-offset-2">{d.softwareName || 'SAP/ERP'}</span>{' '}
          Client Machine is Full/complete for running at{' '}
          <span className="font-bold underline underline-offset-2">{d.softwareName || 'SAP/ERP'}</span>{' '}
          Program. We will always provide access to the Income Tax department for using/ running this application.
        </p>

        <p>
          We undertake that, the department has all rights to use the software and can see/view/export any available report within the database and use for the relevant proceedings.
        </p>
      </div>

      <div className="mt-16 pt-8 space-y-4 max-w-sm">
        <div>
          <span className="font-bold">Name of the assessee: </span>
          <span className="font-semibold underline underline-offset-4">{d.signeeName || premise.assesseeName}</span>
        </div>
        <div>
          <span className="font-bold">Address: </span>
          <span className="underline underline-offset-4">{d.signeeAddress || premise.address}</span>
        </div>
        <div className="pt-6">
          <span className="font-bold">Sign: </span>
          <span className="inline-block border-b border-black w-48 ml-2"></span>
        </div>
      </div>
    </div>
  );
};
