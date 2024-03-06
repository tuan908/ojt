"use client";

import Card from "@/components/Card";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Tooltip,
} from "chart.js";
import {Bar} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement);

const data = {
    labels() {
        const arr = [];
        for (let i = 1; i <= 12; i++) {
            arr.push(`Grade ${i}`);
        }

        return arr;
    },
};

export default function StackedBarChart({labels}: {labels: string[]}) {
    return (
        <Card fullWidth height={24}>
            <Bar
                data={{
                    labels,
                    datasets: [],
                }}
                options={{
                    maintainAspectRatio: false,
                }}
            />
        </Card>
    );
}
