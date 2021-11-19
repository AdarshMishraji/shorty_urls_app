import * as React from "react";
import { Doughnut, Chart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

const options = {
    responsive: true,

    plugins: {
        ...ChartDataLabels,
        datalabels: {
            backgroundColor: function (context) {
                return context.dataset.backgroundColor;
            },
            borderRadius: 10,
            color: "black",
            font: {
                weight: "bold",
            },
            formatter: Math.round,
            padding: 6,
            borderColor: function (context) {
                return context.dataset.backgroundColor;
            },
            borderWidth: 1,
        },
    },
};

export const PieChart = React.memo(({ data, title }) => {
    const dataSet = {
        labels: Object.keys(data).map((key) => {
            return key[0].toUpperCase() + key.slice(1);
        }),
        datasets: [
            {
                data: Object.keys(data).map((key) => {
                    return data[key].count;
                }),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(153, 102, 255, 0.5)",
                    "rgba(255, 159, 64, 0.5)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="flex flex-col border-2 p-3 rounded-xl my-3 text-xl w-full md:w-5/12" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
            <h1 className="text-blue-500 text-2xl my-2 text-center">{title}</h1>
            <Doughnut data={dataSet} options={options} style={{ maxHeight: "40vh", marginTop: ".5rem" }} />
        </div>
    );
});
