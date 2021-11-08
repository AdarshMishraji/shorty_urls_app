import { Bar } from "react-chartjs-2";

const options = {
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            usePointStyle: true,
            callbacks: {
                label: (item) => {
                    return " " + item.raw;
                },
            },
        },
    },
    scales: {
        yAxes: {
            ticks: {
                beginAtZero: true,
                precision: 0,
            },
        },
        xAxes: { grid: { display: false } },
    },
};

export const ClicksGraph = ({ data }) => {
    const content = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
            {
                data: [
                    data?.["January"] || 0,
                    data?.["February"] || 0,
                    data?.["March"] || 0,
                    data?.["April"] || 0,
                    data?.["May"] || 0,
                    data?.["June"] || 0,
                    data?.["July"] || 0,
                    data?.["August"] || 0,
                    data?.["September"] || 0,
                    data?.["October"] || 0,
                    data?.["November"] || 0,
                    data?.["December"] || 0,
                ],
                backgroundColor: ["rgba(153, 102, 255, 0.2)"],
                borderColor: ["rgba(54, 162, 235, 1)"],
                borderWidth: 1,
                borderRadius: 10,
            },
            {
                type: "line",
                data: [
                    data?.["January"] || 0,
                    data?.["February"] || 0,
                    data?.["March"] || 0,
                    data?.["April"] || 0,
                    data?.["May"] || 0,
                    data?.["June"] || 0,
                    data?.["July"] || 0,
                    data?.["August"] || 0,
                    data?.["September"] || 0,
                    data?.["October"] || 0,
                    data?.["November"] || 0,
                    data?.["December"] || 0,
                ],
                cubicInterpolationMode: "monotone",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                borderJoinStyle: "miter",
                pointStyle: "circle",
            },
        ],
    };
    return <Bar style={{ maxHeight: "30vh" }} data={content} options={options} />;
};
