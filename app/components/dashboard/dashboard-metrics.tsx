import { formatInt, pctChange, safeNumber } from "app/lib/report-utils";
import { ReportsOverviewResponse } from "app/types/vivollo.types";
import { FC, useMemo } from "react";
import { KpiCard } from "../reports/kpi-card";

type DashboardMetricsProps = {
  reports: ReportsOverviewResponse["reports"];
};

export const DashboardMetrics: FC<DashboardMetricsProps> = ({ reports }) => {
  const kpis = useMemo(() => {
    const totalCurrent = safeNumber(reports.total_conversations.current?.[0]?.value);
    const totalPrev = safeNumber(reports.total_conversations.previous?.[0]?.value);

    const usersCurrent = safeNumber(reports.unique_users.current?.[0]?.value);
    const usersPrev = safeNumber(reports.unique_users.previous?.[0]?.value);

    const convPerUser = usersCurrent > 0 ? totalCurrent / usersCurrent : 0;
    const convPerUserPrev = usersPrev > 0 ? totalPrev / usersPrev : 0;

    const totalChange = pctChange(totalCurrent, totalPrev);
    const usersChange = pctChange(usersCurrent, usersPrev);
    const convPerUserChange = pctChange(convPerUser, convPerUserPrev);

    return {
      totalCurrent,
      totalPrev,
      totalChange,
      usersCurrent,
      usersPrev,
      usersChange,
      convPerUser,
      convPerUserChange,
    };
  }, [reports]);

  return (
    <s-section padding="base">
      <s-grid
        gridTemplateColumns="@container (inline-size <= 600px) 1fr, 1fr auto 1fr auto 1fr auto 1fr"
        gap="small"
      >
        <KpiCard
          title="Total conversations"
          value={formatInt(kpis.totalCurrent)}
          delta={kpis.totalChange}
        />
        <s-divider direction="block" />
        <KpiCard
          title="Unique users"
          value={formatInt(kpis.usersCurrent)}
          delta={kpis.usersChange}
        />
        <s-divider direction="block" />
        <KpiCard
          title="Conversations / user"
          value={kpis.convPerUser.toFixed(2)}
          delta={kpis.convPerUserChange}
        />
        <s-divider direction="block" />
        <KpiCard
          title="Engagement signal"
          value={kpis.totalCurrent > 0 ? "Active" : "No activity"}
          delta={null}
        />
      </s-grid>
    </s-section>
  );
};
