import type { PieSeriesOption } from "echarts/charts";
import type { TooltipComponentOption } from "echarts/components";
import type { ComposeOption } from "echarts/core";

export type EChartsOption = ComposeOption<
    TooltipComponentOption | PieSeriesOption
>;

export type StackedData = {
    name: string;
    data: number[];
    type: "bar";
    stack: string;
};

export type DoughnutData = {
    _data: PieSeriesOption["data"];
    text: string;
};

export type TrackingData = {
    id: string;
    name: string;
    code: string;
    count: number;
    hashtags: {
        doughnut: DoughnutData;
        stacked: StackedData[];
    };
};
