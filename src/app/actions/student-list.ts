"use client";

export type SearchStudentListDto = Partial<{
    name: string;
    schoolYear: string;
    event: string;
    skills: string[];
}>;

export async function getStudentList(dto: SearchStudentListDto) {}
