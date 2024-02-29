"use client";

import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black opacity-50">
            <CircularProgress color="success" />
        </div>
    );
}
