import { CaseInfo, Premise, Device } from '../types';

export const initialCaseInfo: CaseInfo = {
  caseTitle: '',
  caseFileNumber: '',
  agencyName: 'Income Tax Department (Investigation Wing)',
  investigationWing: '',
  operationDate: new Date().toISOString().split('T')[0],
  headAuthorizedOfficer: '',
  totalPremisesPlanned: 0,
};

export const initialPremises: Premise[] = [];

export const initialDevices: Device[] = [];
