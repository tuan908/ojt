export type TrackingData = {
    id: string;
    name: string;
    code: string;
    count: number;
    hashtags: {
        doughnut: {
            _data: Array<{name: string; value: number}>;
            text: number;
        };
        stacked: Array<{
            name: string;
            data: number[];
            type: "bar";
            stack: string;
        }>;
    };
};

export type DoughnutData = TrackingData["hashtags"]["doughnut"];
export type StackedData = TrackingData["hashtags"]["stacked"];
