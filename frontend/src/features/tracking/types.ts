import type {PieSeriesOption} from 'echarts/charts';
import type {TooltipComponentOption} from 'echarts/components';
import type {ComposeOption} from 'echarts/core';

export interface IEChartsOption
  extends ComposeOption<TooltipComponentOption | PieSeriesOption> {}

export interface IStackedData {
  xAxis: {data: string[]};
  series: {
    name: string;
    type: 'bar';
    stack: string;
    data: number[];
  }[];
}

export interface IDoughnutData {
  _data: PieSeriesOption['data'];
  text: string;
}

export interface ITrackingData {
  id: string;
  name: string;
  code: string;
  count: number;
  hashtags: {
    doughnut: IDoughnutData;
    stacked: IStackedData;
  };
}
