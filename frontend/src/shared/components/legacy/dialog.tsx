import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog as MuiDialog,
} from '@mui/material';
import json from '~/shared/i18n/locales/ja.json';
import {Button} from '../ui/button';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  content: string;
  onCancelClick: () => void;
  onActionClick: () => void | Promise<void>;
};

export default function Dialog({
  open,
  onClose,
  title,
  content,
  onCancelClick,
  onActionClick, // ✅ Provide a default value
}: DialogProps) {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      fullWidth
      maxWidth="sm">
      {title && <DialogTitle id="dialog-title">{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id="dialog-description">{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onActionClick} aria-label="Confirm">
          {json.dialog.confirm}
        </Button>
        <Button onClick={onCancelClick} aria-label="Cancel">
          {json.dialog.cancel}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
}
