"use server";

import {Collection} from "@/constants";
import {astraDb} from "@/lib/db";

export type ChartLabel = {id: number; name: string; color: string};
export type Grade = Omit<ChartLabel, "color">;

export async function getChartLabelList(): Promise<ChartLabel[] | null> {
    try {
        const collection = await astraDb.collection(Collection.ChartLabel);
        const list = await collection.find({}).toArray();
        return list;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getGradeList(): Promise<Grade[] | null> {
    try {
        const collection = await astraDb.collection(Collection.Grade);
        const list = await collection.find({}).toArray();
        return list;
    } catch (error) {
        console.error(error);
        return null;
    }
}
