import * as React from "react";
import { Doughnut, Chart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { Container } from ".";

Chart.register(ChartDataLabels);

const options = {
    responsive: true,

    plugins: {
        ...ChartDataLabels,
        datalabels: {
            backgroundColor: "#5151ff",
            borderRadius: 10,
            color: "white",
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
                    "rgba(255, 99, 132)",
                    "rgba(54, 162, 235)",
                    "rgba(255, 206, 86)",
                    "rgba(75, 192, 192)",
                    "rgba(153, 102, 255)",
                    "rgba(255, 159, 64)",
                ],
                borderColor: [
                    "rgba(255, 99, 102, 1)",
                    "rgba(54, 162, 255, 1)",
                    "rgba(255, 255, 86, 1)",
                    "rgba(75, 225, 192, 1)",
                    "rgba(183, 102, 255, 1)",
                    "rgba(255, 179, 84, 1)",
                ],
                borderWidth: 2,
            },
        ],
    };

    return (
        <Container className="my-3 w-full md:w-5/12 text-blue-500 text-2xl text-center zoom-container">
            <h1 className="my-2 text-gray-600">{title}</h1>
            {Object.keys(data).length > 0 ? (
                <Doughnut data={dataSet} options={options} style={{ maxHeight: "40vh", marginTop: ".5rem" }} />
            ) : (
                <h1 className="text-red-600">Not Available</h1>
            )}
        </Container>
    );
});
