"use client";

import json from "@/i18n/jp.json";
import {useEffect} from "react";

type GlobalErrorProps = {
    error: Error & {digest?: string};
    reset: () => void;
};

export default function Error({error, reset}: GlobalErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="w-dvw h-dvh flex flex-col gap-y-8 justify-center items-center">
            <h1 className="text-red-500 text-6xl font-bold">500</h1>
            <h1 className="text-red-500 text-4xl font-bold">
                エラーが発生しました
            </h1>
            <button onClick={() => reset()}>{json.error.try_again}</button>
        </div>
    );
}
