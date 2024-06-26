"use client";

import type {StackedData} from "@/types/tracking";
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
        series,
    };

    return options;
};

export default function StackedBarChart({
    labels,
    data: series,
}: {
    labels: string[];
    data: StackedData;
}) {
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
