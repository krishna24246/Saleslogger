export interface Visit {
  id: string;
  customerName: string;
  contactPerson: string;
  location: string;
  visitDate: string;
  visitTime: string;
  rawNotes: string;
  outcomeStatus: 'Pending' | 'Follow-up Needed' | 'Closed';
  followUpDate?: string;

  aiSummary?: {
    meetingSummary: string;
    painPoints: string[];
    actionItems: string[];
    recommendedNextStep: string;
  };

  syncStatus: 'Draft' | 'Syncing' | 'Synced' | 'Failed';
}

export type RootStackParamList = {
  Login: undefined;
  VisitList: undefined;
  CreateEditVisit: { visitId?: string };
  VisitDetails: { visitId: string };
  SyncSettings: undefined;
};
