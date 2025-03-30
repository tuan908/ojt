"use client";

import { signIn } from "@/app/actions/auth";
import json from "@/shared/i18n/locales/ja.json";
import { cn } from "@/shared/utils";
import Https from "@mui/icons-material/Https";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import Link from "next/link";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";

type LoginFormState = {
    username: string;
    password: string;
    error: string;
};

const initialState: LoginFormState = {
    username: "",
    password: "",
    error: "",
};

const initPasswordInputState: PasswordInputState = {
    type: "password",
    show: false,
};

type PasswordInputState = {
    type: "text" | "password";
    show: boolean;
};

export default function Page() {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Use new hook useActionState - from React version 19.x
    const [state, formAction, isPending] = useActionState(signIn, initialState);
    const [inputState, setState] = useState<PasswordInputState>(
        initPasswordInputState
    );

    function showOrHidePassword(e: SyntheticEvent<HTMLButtonElement>) {
        e.preventDefault();
        setState(x => ({
            ...x,
            show: !x.show,
            type: x.type === "password" ? "text" : "password",
        }));
    }

    useEffect(() => {
        if (state.error && inputRef.current) {
            inputRef.current?.focus();
        }
    }, [state.error]);

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover"
            style={{
                backgroundImage: "url('/signin-background.jpg')",
            }}
        >
            <div className="w-4/5 lg:w-1/4 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl text-center pt-8 md:pt-20">
                    {json.signIn.title}
                </h1>
                <form
                    action={formAction}
                    className="w-10/12 md:w-4/5 m-auto bg-white flex flex-col gap-y-4 py-4 md:py-12"
                    ref={formRef}
                >
                    <TextField
                        variant="standard"
                        name="username"
                        placeholder={json.signIn.username}
                        inputRef={inputRef}
                        className="w-full"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutline />
                                </InputAdornment>
                            ),
                        }}
                        autoComplete="off"
                        disabled={isPending}
                        defaultValue={state.username}
                    />

                    <TextField
                        variant="standard"
                        name="password"
                        placeholder={json.signIn.password}
                        type={inputState.type}
                        className="w-full"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Https />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <button
                                        className="cursor-pointer"
                                        onClick={showOrHidePassword}
                                        onMouseDown={e => e.preventDefault()}
                                        onMouseUp={e => e.preventDefault()}
                                    >
                                        {inputState.show ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </button>
                                </InputAdornment>
                            ),
                        }}
                        autoComplete="off"
                        disabled={isPending}
                        defaultValue={state.password}
                    />

                    <div className="w-full h-full flex items-center justify-center py-2">
                        <button
                            type="submit"
                            className={cn(
                                "bg-[#407ed9] text-white font-bold px-4 py-2 m-auto rounded-xl text-sm outline-none cursor-pointer",
                                isPending && "bg-[rgba(64,126,217,0.5)]"
                            )}
                            aria-disabled={isPending}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <div className="flex flex-row items-center gap-x-3">
                                    <CircularProgress
                                        sx={{
                                            color: "#fff",
                                        }}
                                        size="1rem"
                                    />
                                    {json.signIn.pending}
                                </div>
                            ) : (
                                <>{json.signIn.title}</>
                            )}
                        </button>
                    </div>
                    <Link
                        href="/forgot-password"
                        className="m-auto pb-2 font-medium"
                    >
                        {json.signIn.forgotPassword}
                    </Link>
                    {state.error ? (
                        <span className="text-red-500 m-auto text-[0.875rem] leading-none md:whitespace-nowrap">
                            {state.error}
                        </span>
                    ) : null}
                </form>
            </div>
        </div>
    );
}
