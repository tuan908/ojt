import {EventStatus} from "@/constants";

export function StatusLabel({status}: {status: number}) {
    let labelText = "";
    let backgroundColor = "";
    switch (status) {
        case EventStatus.Unconfirmed:
            labelText = "Unconfirmed";
            backgroundColor = "#33b5e5";
            break;

        case EventStatus.UnderReviewing:
            labelText = "Under reviewing";
            backgroundColor = "#ffbb33";
            break;

        case EventStatus.Confirmed:
            labelText = "Confirmed";
            backgroundColor = "#00c851";
            break;

        default:
            throw new Error("Invalid stautus");
    }

    return (
        <span
            style={{backgroundColor}}
            className="text-white px-3  py-1 rounded-2xl shadow-md"
        >
            {labelText}
        </span>
    );
}
