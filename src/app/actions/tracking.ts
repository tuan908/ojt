"use server";

import {CollectionName} from "@/constants";
import {Astra} from "@/lib/db";

export type Grade = Omit<ChartLabel, "color">;

export async function getChartLabelList() {
    try {
        const list = await Astra.find(
            CollectionName.Hashtag,
            (x: ChartLabel) => x
        );
        return list;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getGradeList() {
    try {
        const list = await Astra.find(CollectionName.Hashtag, (x: Grade) => x);
        return list;
    } catch (error) {
        console.error(error);
        return null;
    }
}
