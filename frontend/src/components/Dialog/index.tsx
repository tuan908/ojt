import Button from "@/components/Button";
import json from "@/i18n/jp.json";
import { cn } from "@/lib/utils";
import {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Dialog as MuiDialog,
} from "@mui/material";
import { useMemo } from "react";

type ButtonColor = "info" | "success" | "danger";

type DialogProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    content: string;
    onCancelClick: () => void;
    onActionClick: () => void | Promise<void>;
    buttonColor?: ButtonColor;
};

export default function Dialog({
    open,
    onClose,
    title,
    content,
    onCancelClick,
    onActionClick,
    buttonColor = "info", // ✅ Provide a default value
}: DialogProps) {
    const backgroundColor = useMemo<string>(() => {
        switch (buttonColor) {
            case "danger":
                return "bg-red-400";

            case "info":
                return "bg-blue-400";

            case "success":
                return "bg-green-400";

            default:
                return "bg-blue-400"; // ✅ Fallback to prevent runtime errors
        }
    }, [buttonColor]);

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            fullWidth
            maxWidth="sm"
        >
            {title && <DialogTitle id="dialog-title">{title}</DialogTitle>}
            <DialogContent>
                <DialogContentText id="dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    classes="px-4 py-1 border font-medium bg-slate-200 rounded-md"
                    onClick={onCancelClick}
                    aria-label="Cancel"
                >
                    {json.dialog.cancel}
                </Button>
                <Button
                    classes={cn(
                        "px-4 py-1 font-medium border rounded-md text-white",
                        backgroundColor
                    )}
                    onClick={onActionClick}
                    aria-label="Confirm"
                >
                    {json.dialog.confirm}
                </Button>
            </DialogActions>
        </MuiDialog>
    );
}