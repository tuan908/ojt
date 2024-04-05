import {getStudentByCode} from "@/app/actions/student";

export async function GET(_: Request, {params}: {params: {slug: string}}) {
    const code = params.slug;
    const data = await getStudentByCode(code);
    const response = Response.json(data);
    return response;
}
