'use client';

import {PieChart} from 'echarts/charts';
import {TitleComponent, TooltipComponent} from 'echarts/components';
import {use as echartUse} from 'echarts/core';
import {LabelLayout} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import dynamic from 'next/dynamic';
import {memo, useMemo} from 'react';
import ProgressIndicator from '~/shared/components/ui/progress';
import type {IDoughnutData, IEChartsOption} from '../types';

// Register ECharts components once outside the component
echartUse([
  TooltipComponent,
  TitleComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

// Dynamic import with loading state
const ReactEchart = dynamic(
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

// Move color palette outside to prevent recreation on each render
const COLOR_PALETTE = [
  '#4ad295',
  '#f2b2bf',
  '#fb5252',
  '#fca120',
  '#edb183',
  '#fcdb7e',
  '#92cdfa',
  '#1273eb',
  '#8080f1',
  '#bac8d3',
  '#58595b',
  '#bdd333',
];

interface IDoughnutChartProps {
  data: IDoughnutData;
  width?: string;
  height?: string;
  className?: string;
}

const DoughnutChart = memo(
  ({
    data,
    width = '32rem',
    height = '20rem',
    className = '',
  }: IDoughnutChartProps) => {
    // Memoize chart options to prevent recalculations on re-renders
    const chartOptions = useMemo((): IEChartsOption => {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        title: {
          text: data.text,
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: 40,
          },
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 1,
            itemStyle: {
              borderRadius: 10,
              borderWidth: 2,
            },
            label: {
              show: true,
              position: 'inside',
              formatter: params => String(params.value || ''),
              color: '#ffffff',
            },
            emphasis: {
              disabled: true,
            },
            labelLine: {
              show: false,
            },
            data: data._data,
            color: COLOR_PALETTE,
          },
        ],
      };
    }, [data]);

    return (
      <div
        className={`relative bg-white shadow-2xl rounded-2xl ${className}`}
        style={{width, height}}>
        <ReactEchart
          option={chartOptions}
          style={{height: `calc(${height} + 2rem)`, width: '100%'}}
          className="absolute -top-3"
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    );
  },
);

DoughnutChart.displayName = 'DoughnutChart';

export default DoughnutChart;
