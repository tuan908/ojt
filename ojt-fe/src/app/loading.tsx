import {CircularProgress} from "@mui/material";

export default async function Loading() {
    return (
        <div className="w-dvw h-dvh flex flex-col items-center justify-center">
            <CircularProgress color="info" size="5rem" />
        </div>
    );
}
