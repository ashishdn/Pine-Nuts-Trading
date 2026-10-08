import { Card } from "@heroui/react";

export default function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  accent = "green",
}) {
  return (
    <Card className="metric-card">
      <Card.Content className="metric-card-content">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="metric-label">{label}</p>
            <p className="metric-value">{value}</p>
          </div>
          <span className={`metric-icon metric-icon-${accent}`}>
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
          </span>
        </div>
        <p className="metric-note">{note}</p>
      </Card.Content>
    </Card>
  );
}
