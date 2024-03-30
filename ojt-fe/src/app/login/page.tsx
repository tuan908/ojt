"use client";

import {useAppDispatch} from "@/lib/redux/hooks";
import {setUser} from "@/lib/redux/slice/authSlice";
import Https from "@mui/icons-material/Https";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {InputAdornment, TextField} from "@mui/material";
import Link from "next/link";
import {redirect} from "next/navigation";
import {useEffect, useRef, useState, type SyntheticEvent} from "react";
import {useFormState, useFormStatus} from "react-dom";
import {login} from "../actions/auth";

export default function Page() {
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLInputElement>(null);
    const [state, formAction] = useFormState(login, {message: "", user: null});
    const [inputState, setState] = useState<{
        type: "password" | "text";
        show: boolean;
    }>({type: "password", show: false});

    useEffect(() => {
        if (state.user) {
            dispatch(setUser(state.user));
            redirect("/student/list");
        }
    }, [dispatch, state.user]);

    function showOrHidePassword(e: SyntheticEvent<HTMLDivElement>) {
        e.preventDefault();
        setState(x => ({
            ...x,
            show: !x.show,
            type: x.type === "password" ? "text" : "password",
        }));
    }

    return (
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
                    placeholder="Username"
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
                    error={
                        typeof state.message !== "string" &&
                        state.message?.username !== undefined
                    }
                    helperText={
                        typeof state.message !== "string"
                            ? state.message?.username
                            : ""
                    }
                />

                <TextField
                    variant="standard"
                    name="password"
                    placeholder="Password"
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
                                onClick={e => showOrHidePassword(e)}
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
                    error={
                        typeof state.message !== "string" &&
                        state.message?.password !== undefined
                    }
                    helperText={
                        typeof state.message !== "string"
                            ? state.message?.password
                            : ""
                    }
                />

                <div className="w-full h-full flex items-center justify-center py-2">
                    <SubmitButton />
                </div>
                <Link href="/forgot-password" className="m-auto pb-2">
                    Forgot your password ?
                </Link>
                <span className="text-red-500 m-auto text-[0.875rem] leading-none">
                    {typeof state.message === "string" ? state.message : null}
                </span>
            </form>
        </div>
    );
}

function SubmitButton() {
    const {pending} = useFormStatus();

    return (
        <button
            type="submit"
            className="bg-[#407ed9] text-white font-bold px-4 py-2 m-auto rounded-xl text-sm outline-none"
            aria-disabled={pending}
        >
            Login
        </button>
    );
}
