import Button from "@/components/Button";
import {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Dialog as MuiDialog,
} from "@mui/material";
import {useMemo} from "react";
import json from "@/i18n/jp.json";
import {cn} from "@/utils";

type DialogProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    content: string;
    onCancelClick: () => void;
    onActionClick:
        | (() => void)
        | ((args: unknown) => void)
        | (() => Promise<void>);
    buttonColor: "info" | "success" | "danger";
};

export default function Dialog({
    open,
    onClose,
    title,
    content,
    onCancelClick: handleCancel,
    onActionClick: handleAction,
    buttonColor = "info",
}: DialogProps) {
    const backgroundColor = useMemo(() => {
        switch (buttonColor) {
            case "danger":
                return "bg-red-400";

            case "info":
                return "bg-blue-400";

            case "success":
                return "bg-green-400";

            default:
                throw new Error("Invalid color");
        }
    }, [buttonColor]);

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            aria-labelledby="-dialog-title"
            aria-describedby="-dialog-description"
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle id="-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    classes="px-4 py-1 border font-medium bg-slate-200 rounded-md"
                    onClick={handleCancel}
                >
                    {json.dialog.cancel}
                </Button>
                <Button
                    classes={cn(
                        "px-4 py-1 font-medium border rounded-md text-white",
                        backgroundColor
                    )}
                    onClick={handleAction}
                >
                    {json.dialog.confirm}
                </Button>
            </DialogActions>
        </MuiDialog>
    );
}
