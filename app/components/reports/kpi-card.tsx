import { getTrend } from "app/lib/report-utils";
import { FC } from "react";

type KpiCardProps = {
  title: string;
  value: string;
  delta: number | null;
};

export const KpiCard: FC<KpiCardProps> = ({ title, value, delta }) => {
  const trend = getTrend(delta);

  return (
    <s-clickable paddingBlock="small-400" paddingInline="small-100" borderRadius="base">
      <s-grid gap="small-300">
        <s-heading>{title}</s-heading>
        <s-stack direction="inline" gap="small-200">
          <s-text>{value}</s-text>
          {trend && (
            <s-badge tone={trend.tone} icon={trend.icon}>
              {trend.text}
            </s-badge>
          )}
        </s-stack>
      </s-grid>
    </s-clickable>
  );
};
