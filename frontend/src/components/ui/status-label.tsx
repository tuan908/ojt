import { EventStatus } from "@/constants";
import json from "@/i18n/locales/ja.json";
import { cn } from "@/lib/utils";

type StatusLabelProps = {
    status: number;
};

export default function StatusLabel({ status }: StatusLabelProps) {
    const statusMap: Record<number, { label: string; color: string }> = {
        [EventStatus.UNCONFIRMED]: {
            label: json.status.unconfirmed,
            color: "bg-blue-500",
        },
        [EventStatus.UNDER_REVIEWING]: {
            label: json.status.under_reviewing,
            color: "bg-yellow-500",
        },
        [EventStatus.CONFIRMED]: {
            label: json.status.confirmed,
            color: "bg-green-500",
        },
    };

    const { label, color } = statusMap[status] || {
        label: "Unknown",
        color: "bg-gray-500",
    };

    return (
        <span className={cn("text-white px-3 py-1 font-medium rounded-2xl shadow-md", color)}>
            {label}
        </span>
    );
}