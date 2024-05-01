import {EventStatus} from "@/constants";

export function StatusLabel({status}: {status: number}) {
    let labelText = "";
    let backgroundColor = "";
    switch (status) {
        case EventStatus.UNCONFIRMED:
            labelText = "未確認";
            backgroundColor = "#33b5e5";
            break;

        case EventStatus.UNDER_REVIEWING:
            labelText = "確認中";
            backgroundColor = "#ffbb33";
            break;

        case EventStatus.CONFIRMED:
            labelText = "修了";
            backgroundColor = "#00c851";
            break;

        default:
            throw new Error("Invalid stautus");
    }

    return (
        <span
            style={{backgroundColor}}
            className="text-white px-4 py-2 font-medium rounded-2xl shadow-md"
        >
            {labelText}
        </span>
    );
}
