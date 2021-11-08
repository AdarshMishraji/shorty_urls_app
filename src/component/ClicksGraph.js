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

const currDate = new Date();

export const ClicksGraph = ({ data }) => {
    const [type, setType] = useState("monthly");
    const [month, setMonth] = useState(noMonths[currDate.getMonth() + 1]);
    const [year, setYear] = useState(currDate.getFullYear());

    const content =
        type === "monthly"
            ? {
                  labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                  datasets: [
                      {
                          data: [
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
                          ],
                          backgroundColor: ["rgba(153, 102, 255, 0.2)"],
                          borderColor: ["rgba(54, 162, 235, 1)"],
                          borderWidth: 1,
                          borderRadius: 10,
                      },
                      {
                          type: "line",
                          data: [
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
                          ],
                          cubicInterpolationMode: "monotone",
                          borderColor: "rgba(54, 162, 235, 1)",
                          borderWidth: 1,
                          borderJoinStyle: "miter",
                          pointStyle: "circle",
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
                          data: [
                              data?.[currDate.getFullYear() - 4]?.count || 0,
                              data?.[currDate.getFullYear() - 3]?.count || 0,
                              data?.[currDate.getFullYear() - 2]?.count || 0,
                              data?.[currDate.getFullYear() - 1]?.count || 0,
                              data?.[currDate.getFullYear()]?.count || 0,
                          ],
                          backgroundColor: ["rgba(153, 102, 255, 0.2)"],
                          borderColor: ["rgba(54, 162, 235, 1)"],
                          borderWidth: 1,
                          borderRadius: 10,
                      },
                      {
                          type: "line",
                          data: [
                              data?.[currDate.getFullYear() - 4]?.coaunt || 0,
                              data?.[currDate.getFullYear() - 3]?.coaunt || 0,
                              data?.[currDate.getFullYear() - 2]?.coaunt || 0,
                              data?.[currDate.getFullYear() - 1]?.count || 0,
                              data?.[currDate.getFullYear()]?.count || 0,
                          ],
                          cubicInterpolationMode: "monotone",
                          borderColor: "rgba(54, 162, 235, 1)",
                          borderWidth: 1,
                          borderJoinStyle: "miter",
                          pointStyle: "circle",
                      },
                  ],
              }
            : {
                  labels: new Array(new Date(year, monthNo[month], 0).getDate() || 0).fill().map((_, idx) => {
                      return 1 + idx;
                  }),
                  datasets: [
                      {
                          data: [
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
                          ],
                          backgroundColor: ["rgba(153, 102, 255, 0.2)"],
                          borderColor: ["rgba(54, 162, 235, 1)"],
                          borderWidth: 1,
                          borderRadius: 10,
                      },
                      {
                          type: "line",
                          data: [
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
                          ],
                          cubicInterpolationMode: "monotone",
                          borderColor: "rgba(54, 162, 235, 1)",
                          borderWidth: 1,
                          borderJoinStyle: "miter",
                          pointStyle: "circle",
                      },
                  ],
              };

    return (
        <div className="relative">
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
    );
};
