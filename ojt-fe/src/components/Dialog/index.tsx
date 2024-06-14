import Button from "@/components/Button";
import Utils from "@/utils";
import {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Dialog as MuiDialog,
} from "@mui/material";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    actionButtonText: string;
    contentText: string;
    onCancelClick: () => void;
    onActionClick:
        | (() => void)
        | ((args: unknown) => void)
        | (() => Promise<void>);
    actionButtonBackgroundColor: "bg-red-400" | "bg-blue-400" | "bg-green-400";
}

export default function Dialog(props: DialogProps) {
    const {
        open,
        onClose,
        title,
        actionButtonText: actionName,
        contentText,
        onCancelClick: handleCancel,
        onActionClick: handleAction,
        actionButtonBackgroundColor,
    } = props;

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            aria-labelledby="-dialog-title"
            aria-describedby="-dialog-description"
        >
            <DialogTitle id="-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="-dialog-description">
                    {contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button classes="px-4 py-2 border" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button
                    classes={Utils.cn(
                        "px-4 py-1 border rounded-md text-white",
                        actionButtonBackgroundColor
                    )}
                    onClick={handleAction}
                >
                    {actionName}
                </Button>
            </DialogActions>
        </MuiDialog>
    );
}
