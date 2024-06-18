"use client";

import Box from "@/components/Box";
import ReactEcharts from "echarts-for-react";
import {BarChart, type BarSeriesOption} from "echarts/charts";
import {use, type ComposeOption} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";

use([CanvasRenderer, BarChart]);

type EChartsOption = ComposeOption<BarSeriesOption>;

const getBarChartOptions = ({
    series,
    xAxisData,
}: {
    xAxisData: string[];
    series: BarSeriesOption[];
}) => {
    const options: EChartsOption = {
        tooltip: {
            trigger: "axis",
        },
        legend: {},
        xAxis: [
            {
                type: "category",
                data: xAxisData,
            },
        ],
        yAxis: [
            {
                type: "value",
                axisLine: {
                    lineStyle: {
                        type: "dotted",
                    },
                },
            },
        ],
        series: [
            {
                name: "#Flexible",
                type: "bar",
                stack: "Hashtags",
                data: [620, 732, 701, 734, 1090, 1130, 1120],
            },
            {
                name: "#Creative",
                type: "bar",
                stack: "Hashtags",
                data: [120, 132, 101, 134, 290, 230, 220],
            },
            {
                name: "#Strategic",
                type: "bar",
                stack: "Hashtags",
                data: [
                    60, 72, 71, 74, 190, 130, 110, 60, 72, 71, 74, 190, 130,
                    110,
                ],
            },
            {
                name: "Others",
                type: "bar",
                stack: "Hashtags",
                data: [
                    62, 82, 91, 84, 109, 110, 120, 62, 82, 91, 84, 109, 110,
                    120,
                ],
            },
        ],
    };

    return options;
};

export default function StackedBarChart({labels}: {labels: string[]}) {
    return (
        <Box fullWidth height={24} paddingY="10">
            <ReactEcharts
                className="!h-full"
                option={getBarChartOptions({
                    series: [],
                    xAxisData: labels,
                })}
            />
        </Box>
    );
}
