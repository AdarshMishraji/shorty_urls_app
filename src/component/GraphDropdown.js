import { useReducer, useState } from "react";
import ExpandMore from "../assets/svgs/expand_less.svg";
import ExpandLess from "../assets/svgs/expand_more.svg";
import { months, noMonths } from "../constants";

const currDate = new Date();

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "set_isMonth": {
            return { ...state, isMonth: payload };
        }
        case "set_isYear": {
            return { ...state, isYear: payload };
        }
        case "set_isOpen": {
            return { ...state, isOpen: payload };
        }
        case "set_isMonthOpen": {
            return { ...state, isMonthOpen: payload };
        }
        case "set_isYearOpen": {
            return { ...state, isYearOpen: payload };
        }
        case "on_daily_select": {
            return { ...state, isMonth: true, isYear: true, isOpen: false };
        }
        case "on_monthly_select": {
            return { ...state, isMonth: false, isYear: true, isOpen: false };
        }
        case "on_yearly_select": {
            return { ...state, isMonth: false, isYear: false, isOpen: false };
        }
        default:
            return state;
    }
};

export const GraphDropdown = ({ type, month, year, setType, setMonth, setYear, smallestYear }) => {
    const [state, dispatch] = useReducer(reducer, {
        isMonth: false,
        isYear: true,
        isOpen: false,
        isMonthOpen: false,
        isYearOpen: false,
    });

    const { isMonth, isYear, isOpen, isMonthOpen, isYearOpen } = state;

    console.log(state);

    return (
        <div className="flex flex-row flex-wrap root_graph_dropdow">
            <Dropdown
                isOpen={isOpen}
                isVisible={true}
                // onSelect={() => setOpen(!isOpen)}
                onSelect={() => dispatch({ type: "set_isOpen", payload: !isOpen })}
                value={type.charAt(0).toUpperCase() + type.slice(1)}
                title="Select"
            >
                <Option
                    text="Yearly"
                    hint="(Past 5 Years)"
                    onClick={() => {
                        setType("yearly");
                        dispatch({ type: "on_yearly_select" });
                    }}
                />
                <Option
                    text="Monthly"
                    onClick={() => {
                        setType("monthly");
                        setYear(currDate.getFullYear());
                        dispatch({ type: "on_monthly_select" });
                    }}
                />
                <Option
                    text="Daily"
                    onClick={() => {
                        setType("daily");
                        setMonth(noMonths[currDate.getMonth() + 1]);
                        setYear(currDate.getFullYear());
                        dispatch({ type: "on_daily_select" });
                    }}
                    last
                />
            </Dropdown>

            <Dropdown
                isOpen={isMonthOpen}
                isVisible={isMonth}
                onSelect={() => dispatch({ type: "set_isMonthOpen", payload: !isMonthOpen })}
                value={month}
                title="Month"
            >
                {months.map((ele, index) => {
                    return (
                        <Option
                            text={ele}
                            onClick={() => {
                                setMonth(ele);
                                dispatch({ type: "set_isMonthOpen", payload: false });
                            }}
                            last={index === 11}
                        />
                    );
                })}
            </Dropdown>

            <Dropdown
                isOpen={isYearOpen}
                isVisible={isYear}
                onSelect={() => dispatch({ type: "set_isYearOpen", payload: !isYearOpen })}
                value={year}
                title="Year"
            >
                {Array(smallestYear ? currDate.getFullYear() + 1 - parseInt(smallestYear) : 0)
                    .fill()
                    .map((_, index) => {
                        return (
                            <Option
                                text={parseInt(smallestYear) + index}
                                onClick={() => {
                                    setYear(parseInt(smallestYear) + index);
                                    dispatch({ type: "set_isYearOpen", payload: false });
                                }}
                                last={parseInt(smallestYear) + index === currDate.getFullYear()}
                            />
                        );
                    })}
            </Dropdown>
        </div>
    );
};

const Dropdown = ({ isOpen, isVisible, children, onSelect, value, title }) => {
    return (
        <div className="relative w-40 p-2 mt-1" onClick={onSelect} style={{ display: isVisible ? "block" : "none", marginLeft: 20 }}>
            <h1 className="text-lg text-black font-bold mb-2 inline">{title}</h1>
            <div className="flex border-2 border-blue-400 justify-between rounded-xl px-2 py-1">
                <h1 className="text-xl text-blue-500 font-bold inline">{value}</h1>
                <img src={isOpen ? ExpandLess : ExpandMore} />
            </div>
            <div
                className="absolute right-0 bottom-16 z-20 rounded-2xl flex-col text-blue-500 p-2 bg-white overflow-auto"
                style={{ boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.5)", display: isOpen ? "flex" : "none", maxHeight: "25vh" }}
            >
                {children}
            </div>
        </div>
    );
};

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
