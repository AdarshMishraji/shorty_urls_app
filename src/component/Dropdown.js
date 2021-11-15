import * as React from "react";
import ExpandMore from "../assets/svgs/expand_less.svg";
import ExpandLess from "../assets/svgs/expand_more.svg";

export const Dropdown = React.forwardRef(({ isOpen, isVisible, children, onSelect, value, title, isDown, disabled }, ref) => (
    <div
        ref={ref}
        className="relative w-40 p-2 mt-1"
        onClick={onSelect}
        style={{ display: isVisible ? "block" : "none", marginLeft: 20, opacity: disabled ? 0.5 : 1 }}
    >
        <h1 className="text-lg text-black font-bold mb-2 inline">{title}</h1>
        <div className="flex border-2 border-blue-400 justify-between rounded-xl px-2 py-1">
            <h1 className="text-xl text-blue-500 font-bold inline">{value}</h1>
            <img src={isOpen ? ExpandMore : ExpandLess} />
        </div>
        <div
            className={`absolute right-0 top-16 z-20 rounded-2xl flex-col text-blue-500 p-2 bg-white overflow-auto`}
            style={{ boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.5)", display: isOpen ? "flex" : "none", maxHeight: "25vh" }}
        >
            {children}
        </div>
    </div>
));

export const Option = ({ text, hint, onClick, last }) => {
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
