import AddCircle from "@mui/icons-material/AddCircle";
import {memo} from "react";

interface AddEventButtonProps {
    hide: boolean;
    onClick: () => void;
}

const AddEventButton = memo(function AddEventButton(
    props: AddEventButtonProps
) {
    if (props.hide === true) return null;

    return (
        <button
            type="button"
            className="flex gap-x-2 items-center px-6 py-2 bg-[#33b5e5] text-white rounded-lg hover:opacity-80"
            onClick={props.onClick}
        >
            <AddCircle />
            <span>新規作成</span>
        </button>
    );
});

export default AddEventButton;
