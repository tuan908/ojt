"use client";

import {cn} from "@/lib/utils";
import Https from "@mui/icons-material/Https";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {CircularProgress, InputAdornment, TextField} from "@mui/material";
import Link from "next/link";
import {useActionState, useRef, useState, type SyntheticEvent} from "react";
import {login} from "../actions/auth";

export default function Page() {
    const ref = useRef<HTMLFormElement>(null);
    // Use new hook useActionState - from React version 19.x
    const [state, formAction, isPending] = useActionState(login, {
        error: undefined,
    });
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

    return (
        <div
            className="w-full h-full max-w-dvw min-h-dvh flex items-center justify-center bg-cover"
            style={{
                backgroundImage: "url('/login-background.jpg')",
            }}
        >
            <div className="flex flex-col w-1/3 lg:w-1/4 h-full bg-white rounded-lg shadow-lg">
                <div
                    className="rounded-t-lg h-48 bg-cover"
                    style={{
                        backgroundImage:
                            "url('https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/418313608_855462943043217_191289349546480181_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=3635dc&_nc_ohc=DsKTzqTyTtgAX-HZbYl&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfAri_IB44mLxCPXcj_sxIwFkqyHFSMwK1DIEMdkR7WhMg&oe=65E37168')",
                    }}
                ></div>
                <form
                    action={formAction}
                    className="w-3/5 m-auto bg-white flex flex-col gap-y-4 py-12"
                >
                    <TextField
                        variant="standard"
                        name="username"
                        placeholder="ユーザーネーム"
                        inputRef={ref}
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
                    />

                    <TextField
                        variant="standard"
                        name="password"
                        placeholder="パスワード"
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
                    />

                    <div className="w-full h-full flex items-center justify-center py-2">
                        <button
                            type="submit"
                            className={cn(
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
                                    ログインする．．．
                                </div>
                            ) : (
                                <>ログイン</>
                            )}
                        </button>
                    </div>
                    <Link href="/forgot-password" className="m-auto pb-2">
                        Forgot your password ?
                    </Link>
                    {state.error ? (
                        <span className="text-red-500 m-auto text-[0.875rem] leading-none">
                            {state.error}
                        </span>
                    ) : null}
                </form>
            </div>
        </div>
    );
}
