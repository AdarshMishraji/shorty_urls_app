import * as React from "react";

import { ExpandLess, ExpandMore } from "../assets";

export const Dropdown = React.memo(
    React.forwardRef(({ isOpen, isVisible, children, onSelect, value, title, isDown, disabled }, ref) => (
        <div
            ref={ref}
            className="relative w-40 p-2 mt-1 flex items-center "
            onClick={onSelect}
            style={{ display: isVisible ? "block" : "none", marginLeft: 20, opacity: disabled ? 0.5 : 1 }}
        >
            <h1 className="text-lg text-black dark:text-white font-bold inline">{title}</h1>
            <div className="flex border-2 border-blue-400 justify-between rounded-xl px-2 pt-1">
                <h1 className="text-xl text-blue-500 font-bold flex items-center">{value}</h1>
                {isOpen ? <ExpandLess className="dark:text-white text-black" /> : <ExpandMore className="dark:text-white text-black" />}
            </div>
            <div
                className={`absolute right-0 top-16 z-20 rounded-2xl flex-col text-blue-500 p-2 bg-gray-100 dark:bg-gray-900  overflow-auto cursor-pointer`}
                style={{ boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.5)", display: isOpen ? "flex" : "none", maxHeight: "25vh" }}
            >
                {children}
            </div>
        </div>
    ))
);

export const Option = React.memo(({ text, hint, onClick, last }) => {
    return (
        <h1
            className="cursor-pointer text-lg font-bold dark:border-gray-600"
            style={{
                paddingBottom: last ? "0rem" : "0.25rem",
                borderBottomWidth: last ? "0px" : "2px",
            }}
            onClick={onClick}
        >
            {text}
            <h1 className="text-sm font-normal" style={{ display: hint ? "block" : "none" }}>
                {hint}
            </h1>
        </h1>
    );
});
