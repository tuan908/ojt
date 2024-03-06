"use server";

import {z} from "zod";

const schema = z.object({
    eventsInSchoolLife: z.string(),
    myAction: z.string(),
    shownPower: z.string(),
    strengthGrown: z.string(),
    myThought: z.string(),
});

type RegisterStudentEventDto = z.infer<typeof schema>;

export async function registerStudentEvent(_: any, formData: FormData) {
    const raw = Object.fromEntries(formData.entries());

    const result = await schema.safeParseAsync(raw);

    if (!result.success) {
        console.log(result.error.errors);
    } else {
        console.log(result.data);
        return {
            message: "",
        };
    }
}
