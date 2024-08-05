import {CircularProgress} from "@mui/material";
import Button from "@mui/material/Button";
import {memo} from "react";
import {useFormStatus} from "react-dom";

const SubmitButton = memo(function SubmitButton() {
    const {pending} = useFormStatus();
    return (
        <Button
            type="submit"
            title="送信"
            variant="contained"
            startIcon={
                pending ? (
                    <CircularProgress size="1.5rem" sx={{color: "#fff"}} />
                ) : null
            }
            disableRipple
            disabled={pending}
        >
            {pending ? "送信中" : "送信"}
        </Button>
    );
});

export default SubmitButton;
