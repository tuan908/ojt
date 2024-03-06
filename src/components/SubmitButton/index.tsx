"use client";

import {type ComponentProps} from "react";
import {useFormStatus} from "react-dom";

type SubmitButtonProps = ComponentProps<"button"> & {backgroundColor: string};

export function SubmitButton({backgroundColor}: SubmitButtonProps) {
    const {pending} = useFormStatus();

    return (
        <button
            type="submit"
            className="border-none px-4 py-2 text-white rounded-md m-auto hover:cursor-pointer"
            style={{backgroundColor}}
            aria-disabled={pending}
        >
            Add
        </button>
    );
}
