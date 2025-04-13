'use client';

import {BarChart, type BarSeriesOption} from 'echarts/charts';
import {use as echartUse, type ComposeOption} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import dynamic from 'next/dynamic';
import {useMemo} from 'react';
import Box from '~/shared/components/legacy/box';
import ProgressIndicator from '~/shared/components/ui/progress';
import type {IStackedData} from '../types';

echartUse([CanvasRenderer, BarChart]);

const ReactEChart = dynamic(
  () => import('echarts-for-react').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <ProgressIndicator />
      </div>
    ),
  },
);

interface IEChartsOption extends ComposeOption<BarSeriesOption> {}

interface IBarChartOptions {
  xAxisData: string[];
  series: BarSeriesOption[];
}

interface IStackedBarChartProps {
  labels: string[];
  series: IStackedData['series'];
}

const getBarChartOptions = ({series, xAxisData}: IBarChartOptions) => {
  const options: IEChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {},
    xAxis: [
      {
        type: 'category',
        data: xAxisData,
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            type: 'dotted',
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
  series,
}: IStackedBarChartProps) {
  const option = useMemo(
    () =>
      getBarChartOptions({
        series: series,
        xAxisData: labels,
      }),
    [labels, series],
  );

  return (
    <Box fullWidth height={26} paddingY="10">
      <ReactEChart className="!h-full" option={option} />
    </Box>
  );
}
