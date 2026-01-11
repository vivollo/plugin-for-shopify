export type CollectionGroup = {
  id: number | string;
  name: string;
  description?: string | null;
  default_documents_count: number;
  chunk_documents_count: number;
  is_collector_locked?: boolean;
};

type ReportItem = {
  type: string;
  key: string;
  metric: "count" | string;
  period: number;
  value: number;
  timestamp: number | null;
  meta: any;
};

export type ReportsOverviewResponse = {
  reports: {
    total_conversations: { current: ReportItem[]; previous: ReportItem[] };
    conversations_trend: { current: ReportItem[]; previous: ReportItem[] };
    conversations_hourly_activity: { current: ReportItem[]; previous: ReportItem[] };
    unique_users: { current: ReportItem[]; previous: ReportItem[] };
  };
};
