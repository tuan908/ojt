"use client";

import {PieChart, type PieSeriesOption} from "echarts/charts";
import {
    TooltipComponent,
    type TooltipComponentOption,
} from "echarts/components";
import type {ComposeOption} from "echarts/core";
import {use} from "echarts/core";
import {LabelLayout} from "echarts/features";
import {CanvasRenderer} from "echarts/renderers";
import ReactEcharts from "echarts-for-react";
import type {TrackingData} from "@/app/actions/student.action";

use([TooltipComponent, PieChart, CanvasRenderer, LabelLayout]);

type EChartsOption = ComposeOption<TooltipComponentOption | PieSeriesOption>;

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

const getOption = (data: TrackingData["hashtags"]["doughnut"]) => {
    const options: EChartsOption = {
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

    return options;
};

export default function DoughnutChart({
    data,
}: {
    data: TrackingData["hashtags"]["doughnut"];
}) {
    return (
        <div className="w-[32rem] h-[20rem] relative bg-white shadow-2xl rounded-2xl">
            <ReactEcharts
                option={getOption(data)}
                className="!h-[22rem] !w-full m-auto absolute -top-3"
            />
        </div>
    );
}
