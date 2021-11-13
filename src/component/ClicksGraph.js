import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { GraphDropdown } from "./GraphDropdown";
import { noMonths, monthNo } from "../constants";

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

const commonStyle = {
    bar: {
        backgroundColor: ["rgba(54, 162, 235,0.25)"],
        borderColor: ["rgba(54,162,235,1)"],
        borderRadius: 10,
        borderWidth: 1,
    },
    line: {
        type: "line",
        cubicInterpolationMode: "monotone",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
        borderJoinStyle: "miter",
        pointStyle: "circle",
        fill: true,
    },
};

const TypeSelector = ({ isBar, setType, className }) => {
    return (
        <div className={className}>
            <div className="flex justify-around w-52 h-12 relative items-center">
                <h1
                    onClick={() => setType("bar")}
                    className="text-white left-0 w-28  rounded-l-2xl  text-center bg-blue-400 py-2 cursor-pointer"
                    style={{ backgroundColor: "#2254ff55" }}
                >
                    Bar
                </h1>
                <h1
                    onClick={() => setType("line")}
                    className="text-white right-0 w-28  rounded-r-2xl text-center  py-2 cursor-pointer"
                    style={{ backgroundColor: "#2254ff55" }}
                >
                    Line
                </h1>
                <div
                    className="absolute w-28 bg-blue-600 rounded-2xl text-center py-2 left-0 font-semibold"
                    style={{
                        transform: isBar ? "translateX(-5px)" : "translateX(100px)",
                        transition: "0.5s linear",
                        boxShadow: "0px 0px 20px 0.5px black",
                    }}
                >
                    {isBar ? "Bar" : "Line"}
                </div>
            </div>
        </div>
    );
};

const currDate = new Date();

export const ClicksGraph = ({ data }) => {
    const [barType, setBarType] = useState("line");
    const [type, setType] = useState("monthly");
    const [month, setMonth] = useState(noMonths[currDate.getMonth() + 1]);
    const [year, setYear] = useState(currDate.getFullYear());

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
                <TypeSelector isBar={barType === "bar"} setType={(type) => setBarType(type)} className="flex items-center justify-center" />
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
