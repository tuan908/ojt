"use client";

import json from "@/i18n/jp.json";
import Utils from "@/utils";
import Https from "@mui/icons-material/Https";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {CircularProgress, InputAdornment, TextField} from "@mui/material";
import Link from "next/link";
import {
    useActionState,
    useEffect,
    useRef,
    useState,
    type SyntheticEvent,
} from "react";
import {login} from "../actions/auth.action";

type LoginFormState = {
    username: FormDataEntryValue;
    password: FormDataEntryValue;
    error?: string;
};

const initialState: LoginFormState = {
    username: "",
    password: "",
};

export default function Page() {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Use new hook useActionState - from React version 19.x
    const [state, formAction, isPending] = useActionState(login, initialState);
    const [inputState, setState] = useState<{
        type: "password" | "text";
        show: boolean;
    }>({type: "password", show: false});

    function showOrHidePassword(e: SyntheticEvent<HTMLDivElement>) {
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
            className="w-full h-full max-w-dvw min-h-dvh flex items-center justify-center bg-cover"
            style={{
                backgroundImage: "url('/login-background.jpg')",
            }}
        >
            <div className="flex flex-col w-4/5 lg:w-1/5 h-full bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl text-center pt-8 md:pt-20">
                    {json.login.title}
                </h1>
                <form
                    action={formAction}
                    className="w-10/12 md:w-4/5 m-auto bg-white flex flex-col gap-y-4 py-4 md:py-12"
                    ref={formRef}
                >
                    <TextField
                        variant="standard"
                        name="username"
                        placeholder={json.login.username}
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
                        placeholder={json.login.password}
                        type={inputState.type}
                        className="w-full"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Https />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    className="hover:cursor-pointer"
                                    onClick={showOrHidePassword}
                                >
                                    {inputState.show ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
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
                            className={Utils.cn(
                                "bg-[#407ed9] text-white font-bold px-4 py-2 m-auto rounded-xl text-sm outline-none",
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
                                    {json.login.login_pending}
                                </div>
                            ) : (
                                <>{json.login.title}</>
                            )}
                        </button>
                    </div>
                    <Link
                        href="/forgot-password"
                        className="m-auto pb-2 font-medium"
                    >
                        パスワードを忘れた？
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
