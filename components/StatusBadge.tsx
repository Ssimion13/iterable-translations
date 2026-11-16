import { STATUS_LABEL, type Status } from "@/lib/catalog";

export function StatusBadge({ status }: { status: Status }) {
  if (status === "complete") return null;
  return <span className={`badge badge-${status}`}>{STATUS_LABEL[status]}</span>;
}
