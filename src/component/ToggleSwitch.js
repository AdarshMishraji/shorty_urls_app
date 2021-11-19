import * as React from "react";
import Done from "../assets/svgs/done.svg";
import Close from "../assets/svgs/close.svg";

export const ToggleSwitch = React.memo(({ isActive, setStatus, className, disabled }) => {
    return (
        <div className={className}>
            <div
                className="flex justify-around w-20 h-10 relative items-center rounded-full"
                style={{ backgroundColor: isActive ? "#22ff55aa" : "#ff2255aa" }}
            >
                <div
                    onClick={() => {
                        if (!disabled) {
                            setStatus(true);
                        }
                    }}
                    className="flex items-center text-white left-0 w-20  text-center py-2 cursor-pointer"
                >
                    <img src={Close} className="ml-2" />
                </div>
                <div
                    onClick={() => {
                        if (!disabled) {
                            setStatus(false);
                        }
                    }}
                    className="flex items-center justify-center text-white right-0 w-20  text-center  py-2 cursor-pointer"
                >
                    <img src={Done} className="mr-2" />
                </div>
                <div
                    className="absolute w-6 h-6 bg-gray-300 rounded-full text-center py-2 left-0 font-semibold"
                    style={{
                        transform: isActive ? "translateX(10px)" : "translateX(46px)",
                        transition: "0.5s linear",
                        boxShadow: "0px 0px 10px 0.5px black",
                    }}
                ></div>
            </div>
        </div>
    );
});
