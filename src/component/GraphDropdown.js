import { useState } from "react";
import ExpandMore from "../assets/svgs/expand_less.svg";
import ExpandLess from "../assets/svgs/expand_more.svg";
import { months, noMonths } from "../constants";

const Option = ({ text, hint, onClick, last }) => {
    return (
        <h1
            className="cursor-pointer text-lg font-bold"
            style={{
                paddingBottom: last ? "0rem" : "0.25rem",
                borderBottomWidth: last ? "0px" : "2px",
            }}
            onClick={onClick}
        >
            {text}{" "}
            <h1 className="text-sm font-normal" style={{ display: hint ? "block" : "none" }}>
                {hint}
            </h1>
        </h1>
    );
};

const currDate = new Date();

export const GraphDropdown = ({ type, month, year, setType, setMonth, setYear, smallestYear }) => {
    const [isMonth, setIsMonth] = useState(false);
    const [isYear, setIsYear] = useState(true);
    const [isOpen, setOpen] = useState(false);
    const [isMonthOpen, setMonthtOpen] = useState(false);
    const [isYearOpen, setYearOpen] = useState(false);

    return (
        <div className="flex flex-row flex-wrap root_graph_dropdow">
            <div className="relative w-32 bg-blue-200 rounded-2xl p-2 my-3" onClick={() => setOpen(!isOpen)} style={{ marginLeft: 20 }}>
                <h1 className="text-lg text-black font-bold mb-2 inline">Select</h1>
                <div className="flex">
                    <h1 className="text-xl text-gray-500 font-bold mb-2 inline">{type.charAt(0).toUpperCase() + type.slice(1)}</h1>
                    <img src={isOpen ? ExpandLess : ExpandMore} />
                </div>
                <div
                    className="absolute right-0 bottom-16 z-20 rounded-2xl flex-col text-black p-2 bg-white"
                    style={{ boxShadow: "0px 8px 16px 0px black", display: isOpen ? "flex" : "none" }}
                >
                    <Option
                        text="Yearly"
                        hint="(Past 3 Years)"
                        onClick={() => {
                            setType("yearly");
                            setIsMonth(false);
                            setIsYear(false);
                            setOpen(false);
                        }}
                    />
                    <Option
                        text="Monthly"
                        onClick={() => {
                            setType("monthly");
                            setYear(currDate.getFullYear());
                            setIsMonth(false);
                            setIsYear(true);
                            setOpen(false);
                        }}
                    />
                    <Option
                        text="Daily"
                        onClick={() => {
                            setType("daily");
                            setMonth(noMonths[currDate.getMonth() + 1]);
                            setYear(currDate.getFullYear());
                            setIsMonth(true);
                            setIsYear(true);
                            setOpen(false);
                        }}
                        last
                    />
                </div>
            </div>

            <div
                className="relative w-36 bg-blue-200 rounded-2xl p-2 my-3"
                onClick={() => setMonthtOpen(!isMonthOpen)}
                style={{ display: isMonth ? "block" : "none", marginLeft: 20 }}
            >
                <h1 className="text-lg text-black font-bold mb-2 inline">Month</h1>
                <div className="flex">
                    <h1 className="text-xl text-gray-500 font-bold mb-2 inline">{month}</h1>
                    <img src={isMonthOpen ? ExpandLess : ExpandMore} />
                </div>
                <div
                    className="absolute right-0 bottom-16 z-20 rounded-2xl flex-col text-black p-2 bg-white overflow-auto"
                    style={{ boxShadow: "0px 8px 16px 0px black", display: isMonthOpen ? "flex" : "none", maxHeight: "25vh" }}
                >
                    {months.map((ele, index) => {
                        return (
                            <Option
                                text={ele}
                                onClick={() => {
                                    setMonth(ele);
                                    setMonthtOpen(false);
                                }}
                                last={index === 11}
                            />
                        );
                    })}
                </div>
            </div>

            <div
                className="relative w-26 bg-blue-200 rounded-2xl p-2 my-3"
                onClick={() => setYearOpen(!isYearOpen)}
                style={{ display: isYear ? "block" : "none", marginLeft: 20 }}
            >
                <h1 className="text-lg text-black font-bold mb-2 inline">Year</h1>
                <div className="flex">
                    <h1 className="text-xl text-gray-500 font-bold mb-2 inline">{year}</h1>
                    <img src={isYearOpen ? ExpandLess : ExpandMore} />
                </div>
                <div
                    className="absolute right-0 bottom-14 z-20 rounded-2xl flex-col text-black p-2 bg-white overflow-auto"
                    style={{ boxShadow: "0px 8px 16px 0px black", display: isYearOpen ? "flex" : "none", maxHeight: "25vh" }}
                >
                    {Array(smallestYear ? currDate.getFullYear() + 1 - parseInt(smallestYear) : 0)
                        .fill()
                        .map((_, index) => {
                            return (
                                <Option
                                    text={parseInt(smallestYear) + index}
                                    onClick={() => {
                                        setYear(parseInt(smallestYear) + index);
                                        setYearOpen(false);
                                    }}
                                    last={parseInt(smallestYear) + index === currDate.getFullYear()}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
