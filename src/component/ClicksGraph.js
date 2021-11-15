import * as React from "react";
import { Bar, Chart } from "react-chartjs-2";
import { GraphDropdown } from "./GraphDropdown";
import { noMonths, monthNo } from "../constants";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { TypeSelector } from "./TypesSelector";

Chart.register(ChartDataLabels);

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
        datalabels: {
            backgroundColor: "white",
            color: "black",
            font: {
                weight: "bold",
            },
            borderRadius: 20,
            formatter: Math.round,
        },
    },
    elements: {
        line: {
            tension: 0.5,
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

const commonStyle = {
    bar: {
        backgroundColor: ["rgba(54, 162, 235,0.25)"],
        borderColor: ["rgba(54,162,235,1)"],
        borderRadius: 10,
        borderWidth: 1,
    },
    line: {
        type: "line",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
        pointStyle: "circle",
        fill: true,
    },
};

const currDate = new Date();

export const ClicksGraph = ({ data }) => {
    const [barType, setBarType] = React.useState("line");
    const [type, setType] = React.useState("monthly");
    const [month, setMonth] = React.useState(noMonths[currDate.getMonth() + 1]);
    const [year, setYear] = React.useState(currDate.getFullYear());

    const commonData =
        type === "monthly"
            ? [
                  data?.[year]?.["January"]?.count || 0,
                  data?.[year]?.["February"]?.count || 0,
                  data?.[year]?.["March"]?.count || 0,
                  data?.[year]?.["April"]?.count || 0,
                  data?.[year]?.["May"]?.count || 0,
                  data?.[year]?.["June"]?.count || 0,
                  data?.[year]?.["July"]?.count || 0,
                  data?.[year]?.["August"]?.count || 0,
                  data?.[year]?.["September"]?.count || 0,
                  data?.[year]?.["October"]?.count || 0,
                  data?.[year]?.["November"]?.count || 0,
                  data?.[year]?.["December"]?.count || 0,
              ]
            : type === "yearly"
            ? [
                  data?.[currDate.getFullYear() - 4]?.count || 0,
                  data?.[currDate.getFullYear() - 3]?.count || 0,
                  data?.[currDate.getFullYear() - 2]?.count || 0,
                  data?.[currDate.getFullYear() - 1]?.count || 0,
                  data?.[currDate.getFullYear()]?.count || 0,
              ]
            : type === "daily"
            ? [
                  data?.[year]?.[month]?.["01"] || 0,
                  data?.[year]?.[month]?.["02"] || 0,
                  data?.[year]?.[month]?.["03"] || 0,
                  data?.[year]?.[month]?.["04"] || 0,
                  data?.[year]?.[month]?.["05"] || 0,
                  data?.[year]?.[month]?.["06"] || 0,
                  data?.[year]?.[month]?.["07"] || 0,
                  data?.[year]?.[month]?.["08"] || 0,
                  data?.[year]?.[month]?.["09"] || 0,
                  data?.[year]?.[month]?.["10"] || 0,
                  data?.[year]?.[month]?.["11"] || 0,
                  data?.[year]?.[month]?.["12"] || 0,
                  data?.[year]?.[month]?.["13"] || 0,
                  data?.[year]?.[month]?.["14"] || 0,
                  data?.[year]?.[month]?.["15"] || 0,
                  data?.[year]?.[month]?.["16"] || 0,
                  data?.[year]?.[month]?.["17"] || 0,
                  data?.[year]?.[month]?.["18"] || 0,
                  data?.[year]?.[month]?.["19"] || 0,
                  data?.[year]?.[month]?.["20"] || 0,
                  data?.[year]?.[month]?.["21"] || 0,
                  data?.[year]?.[month]?.["22"] || 0,
                  data?.[year]?.[month]?.["23"] || 0,
                  data?.[year]?.[month]?.["24"] || 0,
                  data?.[year]?.[month]?.["25"] || 0,
                  data?.[year]?.[month]?.["26"] || 0,
                  data?.[year]?.[month]?.["27"] || 0,
                  data?.[year]?.[month]?.["28"] || 0,
                  data?.[year]?.[month]?.["29"] || 0,
                  data?.[year]?.[month]?.["30"] || 0,
                  data?.[year]?.[month]?.["31"] || 0,
              ]
            : null;

    const content =
        type === "monthly"
            ? {
                  labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                  datasets: [
                      {
                          data: barType === "line" ? [] : commonData,
                          ...commonStyle.bar,
                      },
                      {
                          data: barType === "bar" ? [] : commonData,
                          ...commonStyle.line,
                      },
                  ],
              }
            : type === "yearly"
            ? {
                  labels: [
                      currDate.getFullYear() - 4,
                      currDate.getFullYear() - 3,
                      currDate.getFullYear() - 2,
                      currDate.getFullYear() - 1,
                      currDate.getFullYear(),
                  ],
                  datasets: [
                      {
                          data: barType === "line" ? [] : commonData,
                          ...commonStyle.bar,
                      },
                      {
                          data: barType === "bar" ? [] : commonData,
                          ...commonStyle.line,
                      },
                  ],
              }
            : {
                  labels: new Array(new Date(year, monthNo[month], 0).getDate() || 0).fill().map((_, idx) => {
                      return 1 + idx;
                  }),
                  datasets: [
                      {
                          data: barType === "line" ? [] : commonData,
                          ...commonStyle.bar,
                      },
                      {
                          data: barType === "bar" ? [] : commonData,
                          ...commonStyle.line,
                      },
                  ],
              };

    return (
        <div className="relative">
            <div style={{ filter: data ? "none" : "blur(8px)" }}>
                <TypeSelector
                    isBar={barType === "bar"}
                    setType={(type) => setBarType(type)}
                    className="flex items-center justify-center pt-3"
                    text1="Bars"
                    text2="Lines"
                />
                <h1 className="text-blue-500 text-2xl mb-2 mt-3 text-center">{type[0].toUpperCase() + type.slice(1)} Clicks</h1>
                <Bar style={{ maxHeight: "40vh", marginTop: ".5rem" }} data={content} options={options} />
                <div>
                    <GraphDropdown
                        type={type}
                        month={month}
                        year={year}
                        setType={(x) => setType(x)}
                        setMonth={(x) => setMonth(x)}
                        setYear={(x) => setYear(x)}
                        smallestYear={Object.keys(data || {})?.[0]}
                    />
                </div>
            </div>
            <div
                className="flex w-full h-full z-50 absolute top-0 rounded-2xl items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.2)", filter: "blur(0.5px)", display: data ? "none" : "flex" }}
            >
                <div className="spinner-grow text-white" role="status" style={{ height: 100, width: 100 }}>
                    <span class="sr-only">Loading...</span>
                </div>
                <span className="text-2xl ml-2">Loading...</span>
            </div>
        </div>
    );
};
