import ButtonBase from "@/components/ButtonBase";
import {cn} from "@/lib/utils/cn";
import {Dialog, DialogActions, DialogTitle} from "@mui/material";
import {type FC} from "react";

interface DialogWithModeProps {
    open: boolean;
    onClose: () => void;
    title: string;
    actionName: string;
    onCancelClick: () => void;
    onActionClick: () => void;
    // Tailwindcss background color classes:
    bg: "bg-red-400" | "bg-blue-400" | "bg-green-400";
}

const CustomDialog: FC<DialogWithModeProps> = props => {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogActions>
                <ButtonBase
                    classes="px-4 py-2 border"
                    onClick={props.onCancelClick}
                >
                    Cancel
                </ButtonBase>
                <ButtonBase
                    classes={cn(
                        "px-4 py-1 border rounded-md text-white",
                        props.bg
                    )}
                    onClick={props.onActionClick}
                >
                    {props.actionName}
                </ButtonBase>
            </DialogActions>
        </Dialog>
    );
};

export default CustomDialog;
