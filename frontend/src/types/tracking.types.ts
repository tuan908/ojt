type InternalDoughnutData = {
    name: string;
    value: string;
};

export type StackedData = {
    name: string;
    data: number[];
    type: "bar";
    stack: string;
};

export type DoughnutData = {
    _data: InternalDoughnutData[];
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
