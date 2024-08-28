type DoughnutProps = {
    name: string;
    value: string;
};

type StackedProps = {
    name: string;
    data: number[];
    type: "bar";
    stack: string;
};

export type Doughnut = {
    _data: DoughnutProps[];
    text: string;
};

export type Stacked = StackedProps[];

export type TrackingData = {
    id: string;
    name: string;
    code: string;
    count: number;
    hashtags: {
        doughnut: Doughnut;
        stacked: Stacked;
    };
};
