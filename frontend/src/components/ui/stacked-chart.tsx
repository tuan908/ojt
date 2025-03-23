"use client";

import type { StackedData } from "@/types/tracking";
import ReactEcharts from "echarts-for-react";
import { BarChart, type BarSeriesOption } from "echarts/charts";
import { use as echartUse, type ComposeOption } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import Box from "./legacy/box";

echartUse([CanvasRenderer, BarChart]);

type EChartsOption = ComposeOption<BarSeriesOption>;

type BarChartOptions = {
    xAxisData: string[];
    series: BarSeriesOption[];
};

type StackedBarChartProps = {
    labels: string[];
    data: StackedData[];
};

const getBarChartOptions = ({ series, xAxisData }: BarChartOptions) => {
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
        series,
    };

    return options;
};

export default function StackedBarChart({
    labels,
    data: series,
}: StackedBarChartProps) {
    return (
        <Box fullWidth height={24} paddingY="10">
            <ReactEcharts
                className="!h-full"
                option={getBarChartOptions({
                    series: series,
                    xAxisData: labels,
                })}
            />
        </Box>
    );
}
