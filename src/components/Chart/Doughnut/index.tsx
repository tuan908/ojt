"use client";

import Card from "@/components/Card";
import {ArcElement, Chart as ChartJS, Tooltip, type Plugin} from "chart.js";
import {Doughnut} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const data = {
    labels: [
        "#Proactive",
        "#Influential",
        "#Actionable",
        "#Problem-solving",
        "#Strategic",
        "#Creative",
        "#Expressive",
        "#Receptive",
        "#Flexible",
        "#Aware",
        "#Disciplined",
        "#Stress-resistant",
    ],
    datasets: [
        {
            label: "Point",
            data: [1, 16, 9, 4, 12, 5, 4, 3, 4, 15, 12, 4],
            backgroundColor: [
                "#4ad295",
                "#f2b2bf",
                "#fb5252",
                "#fca120",
                "#edb183",
                "#fcdb7e",
                "#92cdfa",
                "#1273eb",
                "#8080f1",
                "#bac8d3",
                "#58595b",
                "#bdd333",
            ],
        },
    ],
};

const loadPlugins = (text: string) => {
    const plugin: Plugin<"doughnut"> = {
        id: "my-doughnut-chart",
        beforeDraw: ({width, height, ctx}) => {
            ctx.restore();
            const fontSize = (height / 160).toFixed(2);
            ctx.font = `${fontSize}em san-serif`;
            ctx.textBaseline = "middle";
            const textX = (width - ctx.measureText(text).width) / 2;
            const textY = height * 0.5;
            ctx.fillText(text, textX, textY);
            ctx.shadowColor = "#fca120";
            ctx.save();
        },
    };

    return [plugin];
};

export default function DoughnutChart({text}: {text: string}) {
    return (
        <Card width={32} height={20}>
            <Doughnut
                data={data}
                plugins={loadPlugins(text)}
                options={{
                    maintainAspectRatio: false,
                }}
            />
        </Card>
    );
}
