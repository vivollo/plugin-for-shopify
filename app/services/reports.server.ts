import api from "./api.server";

export class ReportsService {
  static async getOverview(
    vivolloAccessToken: string,
    tenantName: string,
    fromDate: string,
    toDate: string
  ) {
    const response = await api.post(
      "/reports/overview",
      {
        reports: [
          {
            name: "total_conversations",
            from: fromDate,
            to: toDate,
            aggregate: "sum",
            type: "conversation",
            key: ["day::total"],
            period: 86400,
            compare: true,
          },
          {
            name: "conversations_trend",
            from: fromDate,
            to: toDate,
            aggregate: "count",
            type: "conversation",
            key: ["day::total"],
            period: 86400,
          },
          {
            name: "conversations_hourly_activity",
            from: fromDate,
            to: toDate,
            aggregate: "avg",
            type: "conversation",
            key: [
              "hour::0",
              "hour::1",
              "hour::2",
              "hour::3",
              "hour::4",
              "hour::5",
              "hour::6",
              "hour::7",
              "hour::8",
              "hour::9",
              "hour::10",
              "hour::11",
              "hour::12",
              "hour::13",
              "hour::14",
              "hour::15",
              "hour::16",
              "hour::17",
              "hour::18",
              "hour::19",
              "hour::20",
              "hour::21",
              "hour::22",
              "hour::23",
            ],
            period: 3600,
          },
          {
            name: "unique_users",
            from: fromDate,
            to: toDate,
            aggregate: "sum",
            type: "end_user",
            key: ["day::total"],
            period: 86400,
            compare: true,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${vivolloAccessToken}`,
          "X-Tenant": tenantName,
        },
      }
    );

    return response.data;
  }
}
