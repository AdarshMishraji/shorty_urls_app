import React, { useReducer, useState } from "react";
import { Dropdown, Option } from "./Dropdown";
import { months, noMonths } from "../constants";
import { useOutsideAlerter } from "../hooks";

const currDate = new Date();

export const GraphDropdown = ({ type, month, year, setType, setMonth, setYear, smallestYear }) => {
    const [isMonth, setIsMonth] = useState(false);
    const [isYear, setIsYear] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);

    let typesRef = React.createRef();
    let monthsRef = React.createRef();
    let yearsRef = React.createRef();

    useOutsideAlerter(typesRef, () => {
        setIsOpen(false);
    });
    useOutsideAlerter(monthsRef, () => {
        setIsMonthOpen(false);
    });
    useOutsideAlerter(yearsRef, () => {
        setIsYearOpen(false);
    });

    return (
        <div className="flex flex-row flex-wrap">
            <Dropdown
                ref={typesRef}
                isOpen={isOpen}
                isVisible={true}
                onSelect={() => {
                    setIsOpen(!isOpen);
                    setIsMonthOpen(false);
                    setIsYearOpen(false);
                }}
                value={type.charAt(0).toUpperCase() + type.slice(1)}
                title="Select"
            >
                <Option
                    text="Yearly"
                    hint="(Past 5 Years)"
                    onClick={() => {
                        setType("yearly");
                        setIsMonth(false);
                        setIsYear(false);
                        setIsOpen(false);
                    }}
                />
                <Option
                    text="Monthly"
                    onClick={() => {
                        setType("monthly");
                        setYear(currDate.getFullYear());
                        setIsMonth(false);
                        setIsYear(true);
                        setIsOpen(false);
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
                        setIsOpen(false);
                    }}
                    last
                />
            </Dropdown>
            <Dropdown
                ref={monthsRef}
                isOpen={isMonthOpen}
                isVisible={isMonth}
                onSelect={() => {
                    setIsOpen(false);
                    setIsMonthOpen(!isMonthOpen);
                    setIsYearOpen(false);
                }}
                value={month}
                title="Month"
            >
                {months.map((ele, index) => {
                    return (
                        <Option
                            text={ele}
                            onClick={() => {
                                setMonth(ele);
                                setIsOpen(false);
                                setIsMonthOpen(!false);
                                setIsYearOpen(false);
                            }}
                            last={index === 11}
                        />
                    );
                })}
            </Dropdown>

            <Dropdown
                ref={yearsRef}
                isOpen={isYearOpen}
                isVisible={isYear}
                onSelect={() => {
                    setIsOpen(false);
                    setIsMonthOpen(false);
                    setIsYearOpen(!isYearOpen);
                }}
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
                                    setIsOpen(false);
                                    setIsMonthOpen(false);
                                    setIsYearOpen(true);
                                }}
                                last={parseInt(smallestYear) + index === currDate.getFullYear()}
                            />
                        );
                    })}
            </Dropdown>
        </div>
    );
};
