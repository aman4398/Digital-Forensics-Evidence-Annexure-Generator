export interface CaseInfo {
  caseTitle: string;
  caseFileNumber: string;
  agencyName: string; // e.g., 'Income Tax Department (Inv.)', 'Enforcement Directorate (ED)', etc.
  investigationWing: string;
  operationDate: string;
  operationName?: string;
  assesseeGroup?: string;
  headAuthorizedOfficer: string;
  totalPremisesPlanned: number;
}

export interface CoExaminer {
  id?: string;
  name: string;
  designation?: string;
  contactNumber?: string;
  role?: string;
  agency?: string;
}

export interface Premise {
  id: string;
  code: string; // e.g., 'Premise-01' or 'PR-HQ'
  name: string; // e.g., 'Corporate Head Office'
  address: string;
  assesseeName: string; // Target Company / Party
  assesseeGroup?: string;
  assesseePan?: string;
  warrantRef?: string;
  
  // Authorized Officer / DDIT details
  authorizedOfficer: {
    name: string;
    designation: string; // e.g., 'Deputy Director of Income Tax (Inv.)', 'Assistant Director', 'Inspector'
    department: string;
    departmentCity: string;
    authorizationRef: string;
    contactNumber?: string;
  };

  // Forensic Agency details
  forensicTeam: {
    companyName: string; // 'WALCore Intelligence Pvt. Ltd.'
    natureOfService: string; // 'Digital Forensics & Cyber Investigation'
    teamCode: string; // e.g., 'DEL-T1'
    examinerName: string; // Forensic Examiner Lead
    examinerDesignation: string; // e.g., 'Lead Forensic Examiner'
    contactNumber?: string;
    coExaminers?: CoExaminer[];
  };

  searchDate: string; // DD/MM/YYYY or YYYY-MM-DD
  searchTime: string;

  // Witnesses
  witness1: {
    name: string;
    address: string;
    contact?: string;
  };
  witness2: {
    name: string;
    address: string;
    contact?: string;
  };

  // Annexure A: Self Declaration Details (Only if ERP/Server found on premise)
  accountingDeclaration: {
    companyName: string;
    companyAddress: string;
    softwareName: string; // e.g. 'SAP / ERP'
    backupDescription: string;
    signeeName: string;
    signeeAddress: string;
    date: string;
    erpOrServerFound?: boolean; // Set to true if an ERP software or dedicated server was discovered at the premise
  };

  // Feedback Form Details
  feedback: {
    ratings: {
      promptReaching: number; // 1-10
      courteousConduct: number;
      doneWithoutDelay: number;
      doneAsPerSop: number;
      significantFindings: number;
      requisiteTools: number;
    };
    checklist: {
      dataVerified: 'YES' | 'NO' | 'NA';
      dataDeletedFromLaptop: 'YES' | 'NO' | 'NA';
      handedOverImagedCopies: 'YES' | 'NO' | 'NA';
      summaryReportFurnished: 'YES' | 'NO' | 'NA';
    };
    checklistRemarks: {
      dataVerified?: string;
      dataDeletedFromLaptop?: string;
      handedOverImagedCopies?: string;
      summaryReportFurnished?: string;
    };
    ratingRemarks?: {
      promptReaching?: string;
      courteousConduct?: string;
      doneWithoutDelay?: string;
      doneAsPerSop?: string;
      significantFindings?: string;
      requisiteTools?: string;
    };
    additionalComments: string;
    officerName: string;
    officerDesignation: string;
    date: string;
  };

  // WALCore Work Completion Letter specifics
  workCompletion: {
    letterDate: string;
    receivedDate: string;
    authName: string;
    authorization: string;
    dept: string;
    deptCity: string;
    searchDate: string;
    completionDate: string;
    totalSize: string;
  };
}

export type DeviceCategory = 'mobile' | 'laptop' | 'desktop' | 'server' | 'storage' | 'dvr' | 'cloud' | 'file_folder' | 'others';

export interface ChainOfCustodyEntry {
  id: string;
  reasonAction: string;
  givenByName: string;
  givenBySign?: string;
  receivedByName: string;
  receivedBySign?: string;
  date: string;
  time: string;
}

export interface TargetMedia {
  id?: string;
  make: string;
  model: string;
  serialNumber: string;
  storageCapacity: string;
}

export interface Device {
  id: string;
  premiseId: string;
  deviceName: string; // e.g., 'MacBook Pro M2 - Accounts', 'iPhone 15 Pro'
  deviceCategory: DeviceCategory;
  otherCategorySpecify?: string;
  make: string;
  model: string;
  serialNumber: string;
  color: string;
  storageCapacity: string;

  // Person / Possession
  ownerUserName: string;
  ownerRelative: string; // e.g. 'Son of Sh. R.K. Gupta'
  ownerLocation: string; // 'Residing / Employed at ...'
  foundPossessionOf: string;
  relationWithTarget: string; // 'OWNER', 'USER', 'Director', 'Accounts Manager', etc.
  isOwnerUser?: string;
  foundLocationAtPremise: string; // 'Cabin 4, 1st Floor'
  remarks: string;

  // Physical State & Screen
  deviceStatus: 'ON' | 'OFF' | 'HIBERNATION/SLEEP' | 'OFFLINE';
  visibleOnScreen: string; // 'Desktop icons visible, Excel sheet "Ledger 2023-24" open'
  shutdownType: 'NORMAL' | 'POWER PLUG PULLED' | 'BATTERY REMOVED' | 'NOT SHUT DOWN';

  // Encryption
  encryptionPresent: 'YES' | 'NO' | 'UNKNOWN';
  encryptionSoftwareUsed: string; // 'BitLocker', 'FileVault', etc.

  // Mobile specific details (Annexure D & C)
  mobileDetails?: {
    imei1: string;
    imei2: string;
    simPresent: 'YES' | 'NO';
    simDetails: string;
    simProvider: string;
    mediaCardPresent: 'YES' | 'NO';
    mediaCardDetails: string;
    mediaCardMake: string;
    mediaCardModel: string;
  };

  // Handling & Forensic Imaging
  deviceHandling: 'SEIZURE' | 'IMAGING' | 'BACKUP';
  imagingToolsAndDetails: string; // e.g. 'Cellebrite UFED 7.70', 'Tableau Duplicator T35u / FTK Imager 4.7'

  // Hashes
  md5Hash: string;
  sha1Hash: string;
  sha256Hash1: string;
  sha256Hash2?: string;
  sha256Hash3?: string;
  sha256Hash4?: string;
  sha256Hash5?: string;

  // Master & Working copies (Supports 1 or more than 1 master & working copy)
  masterCopy: TargetMedia;
  workingCopy: TargetMedia;
  masterCopies?: TargetMedia[];
  workingCopies?: TargetMedia[];

  // Email and File/Folder specific fields
  dataSize?: string;
  imageSize?: string;
  backupMethod?: string;

  // Return & Custody
  deviceReturnedToOriginalState: 'YES' | 'NO';
  returnDate: string;
  returnTime: string;
  witnessSignatureTaken: 'YES' | 'NO';
  notesByAuthorisedOfficer: string;

  // Chain of custody ledger
  chainOfCustody: ChainOfCustodyEntry[];

  // BSA 2023 Section 63(4)(c) specific
  bsaDetails: {
    sourceType: 'Computer / Storage Media' | 'DVR' | 'Mobile' | 'Flash Drive' | 'CD/DVD' | 'Server' | 'Cloud' | 'Other';
    sourceTypeOther?: string;
    uniqueId?: string; // IMEI/UIN/UID/MAC/Cloud ID
    identifier?: string;
    partyRelationship: 'Owned' | 'Maintained' | 'Managed' | 'Operated';
    hashAlgorithm: 'SHA256' | 'SHA1' | 'MD5' | 'Other';
    hashAlgorithmOther?: string;
    partyDate: string;
    partyTime: string;
    partyPlace: string;
    expertName: string;
    expertRelative: string;
    expertLocation: string;
    expertDesignation: string;
    expertDate: string;
    expertTime: string;
    expertPlace: string;
  };

  // Cloud & Job sheet details (Annexure F)
  cloudJobSheet?: {
    isCloudEvidence: boolean;
    evidenceSourceSize: string;
    imageSize: string;
    backupMethod: string;
    hash: string;
  };

  // WALCore Work Completion table entry
  workCompletionEntry?: {
    particulars: string;
    contentType: string;
    size: string;
  };
}

export type DocumentType = 
  | 'ALL_DOSSIER'
  | 'ANNEXURE_A'
  | 'ANNEXURE_B'
  | 'ANNEXURE_C'
  | 'ANNEXURE_D'
  | 'ANNEXURE_E'
  | 'ANNEXURE_F'
  | 'ANNEXURE_G'
  | 'FEEDBACK_FORM'
  | 'WALCORE_LETTER';
