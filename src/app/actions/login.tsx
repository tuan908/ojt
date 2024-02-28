"use server";

export type LoginDto = {
    username: string;
    password: string;
};

export async function login(formData: FormData) {}
