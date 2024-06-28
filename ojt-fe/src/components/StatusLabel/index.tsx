import {EventStatus} from "@/constants";
import {useMemo} from "react";
import json from "@/i18n/jp.json"

type StatusLabelProps = {
    status: number;
};

export function StatusLabel({status}: StatusLabelProps) {
    const {labelText, backgroundColor} = useMemo(() => {
        let labelText = "";
        let backgroundColor = "";
        switch (status) {
            case EventStatus.UNCONFIRMED:
                labelText = json.status.unconfirmed;
                backgroundColor = "#33b5e5";
                break;

            case EventStatus.UNDER_REVIEWING:
                labelText = json.status.under_reviewing;
                backgroundColor = "#ffbb33";
                break;

            case EventStatus.CONFIRMED:
                labelText = json.status.confirmed;
                backgroundColor = "#00c851";
                break;

            default:
                throw new Error("Invalid status");
        }

        return {labelText, backgroundColor};
    }, [status]);

    return (
        <span
            style={{backgroundColor}}
            className="text-white px-4 py-2 font-medium rounded-2xl shadow-md"
        >
            {labelText}
        </span>
    );
}
