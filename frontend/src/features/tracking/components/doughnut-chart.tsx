"use client";

import { PieChart } from "echarts/charts";
import {
    TooltipComponent
} from "echarts/components";
import { use } from "echarts/core";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import dynamic from "next/dynamic";
import { memo } from "react";
import type { DoughnutData, EChartsOption } from "../types";

const ReactEchart = dynamic(() => import("echarts-for-react"))

use([TooltipComponent, PieChart, CanvasRenderer, LabelLayout]);

export const colorPalette = [
    "#4ad295",
    "#f2b2bf",
    "#fb5252",
    "#fca120",
    "#edb183",
    "#fcdb7e",
    "#92cdfa",
    "#1273eb",
    "#8080f1",
    "#bac8d3",
    "#58595b",
    "#bdd333",
];

const getDefault = (data: DoughnutData): EChartsOption => {
    return {
        tooltip: {
            trigger: "item",
        },
        title: {
            text: data.text,
            left: "center",
            top: "center",
            textStyle: {
                fontSize: 40,
            },
        },
        series: [
            {
                name: "",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                padAngle: 1,
                itemStyle: {
                    borderRadius: 10,
                    borderWidth: 2,
                },
                label: {
                    show: true,
                    position: "inside",
                    formatter: params => params.value?.toString()!,
                    color: "#ffffff",
                },
                emphasis: {
                    disabled: true,
                },
                labelLine: {
                    show: false,
                },
                data: data._data,
                color: colorPalette,
            },
        ],
    };
};

type Props = {
    data: DoughnutData;
};

const DoughnutChart = memo(({ data }: Props) => {
    return (
        <div className="w-[32rem] h-[20rem] relative bg-white shadow-2xl rounded-2xl">
            <ReactEchart
                option={getDefault(data)}
                className="!h-[22rem] !w-full m-auto absolute -top-3"
            />
        </div>
    );
});

export default DoughnutChart;
