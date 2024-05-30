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

const getOption = (text: string) => {
    const options: EChartsOption = {
        tooltip: {
            trigger: "item",
        },
        title: {
            text,
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
                data: [
                    {value: 1, name: "#Proactive"},
                    {value: 16, name: "#Influential"},
                    {value: 9, name: "#Actionable"},
                    {value: 4, name: "#Problem-solving"},
                    {value: 12, name: "#Strategic"},
                    {value: 5, name: "#Creative"},
                    {value: 4, name: "#Expressive"},
                    {value: 3, name: "#Receptive"},
                    {value: 4, name: "#Flexible"},
                    {value: 15, name: "#Aware"},
                    {value: 2, name: "#Disciplined"},
                    {value: 4, name: "#Stress-resistant"},
                ],
                color: colorPalette,
            },
        ],
    };

    return options;
};

export default function DoughnutChart({text}: {text: string}) {
    return (
        <div className="w-[32rem] h-[20rem] relative bg-white shadow-2xl rounded-2xl">
            <ReactEcharts
                option={getOption(text)}
                className="!h-[22rem] !w-full m-auto absolute -top-3"
            />
        </div>
    );
}
