"use client";

import OjtCard from "@/components/Card";
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
                stack: "Search Engine",
                data: [620, 732, 701, 734, 1090, 1130, 1120],
            },
            {
                name: "#Creative",
                type: "bar",
                stack: "Search Engine",
                data: [120, 132, 101, 134, 290, 230, 220],
            },
            {
                name: "#Strategic",
                type: "bar",
                stack: "Search Engine",
                data: [60, 72, 71, 74, 190, 130, 110],
            },
            {
                name: "Others",
                type: "bar",
                stack: "Search Engine",
                data: [62, 82, 91, 84, 109, 110, 120],
            },
        ],
    };

    return options;
};

export default function StackedBarChart({labels}: {labels: string[]}) {
    return (
        <OjtCard fullWidth height={24}>
            <ReactEcharts
                option={getBarChartOptions({
                    series: [],
                    xAxisData: labels,
                })}
            />
        </OjtCard>
    );
}
