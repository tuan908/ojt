import OjtButtonBase from "@/components/ButtonBase";
import {cn} from "@/lib/utils";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

interface DialogWithModeProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    actionButtonText: string;
    contentText: string;
    onCancelClick: () => void;
    onActionClick: () => void | ((args: unknown) => void);
    actionButtonBackgroundColor: "bg-red-400" | "bg-blue-400" | "bg-green-400";
}

export default function OjtDialog(props: DialogWithModeProps) {
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
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="ojt-dialog-title"
            aria-describedby="ojt-dialog-description"
        >
            <DialogTitle id="ojt-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="ojt-dialog-description">
                    {contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <OjtButtonBase
                    classes="px-4 py-2 border"
                    onClick={handleCancel}
                >
                    Cancel
                </OjtButtonBase>
                <OjtButtonBase
                    classes={cn(
                        "px-4 py-1 border rounded-md text-white",
                        actionButtonBackgroundColor
                    )}
                    onClick={handleAction}
                >
                    {actionName}
                </OjtButtonBase>
            </DialogActions>
        </Dialog>
    );
}
