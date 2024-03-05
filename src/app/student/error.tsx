"use client";

import Link from "next/link";

export default function Error() {
    return (
        <div className="w-dvw h-dvh flex justify-center items-center">
            <h1 className="text-red-500 text-2xl">
                There was an error when loading page
            </h1>
            <Link href="/home">Back to Home</Link>
        </div>
    );
}
