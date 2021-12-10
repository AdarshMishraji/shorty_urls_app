import * as React from "react";

import { Close, Done } from "../assets";

export const ToggleSwitch = React.memo(
    ({ isActive, setStatus, className, disabled, OnIcon = Close, OffIcon = Done, onColor = "#00cc7f", offColor = "#ff2255" }) => {
        return (
            <div className={className}>
                <div
                    className="flex justify-around w-20 h-10 relative items-center rounded-full"
                    style={{ backgroundColor: isActive ? onColor : offColor }}
                >
                    <div
                        onClick={() => {
                            if (!disabled) {
                                setStatus(true);
                            }
                        }}
                        className="flex items-center text-white left-0 w-20  text-center py-2 cursor-pointer"
                    >
                        <OnIcon className="ml-2" height={25} width={25} />
                    </div>
                    <div
                        onClick={() => {
                            if (!disabled) {
                                setStatus(false);
                            }
                        }}
                        className="flex items-center justify-center text-white right-0 w-20  text-center  py-2 cursor-pointer"
                    >
                        <OffIcon className="mr-2" height={25} width={25} />
                    </div>
                    <div
                        onClick={() => {
                            if (!disabled) {
                                setStatus(!isActive);
                            }
                        }}
                        className="absolute w-6 h-6 bg-gray-300 rounded-full text-center py-2 left-0 font-semibold"
                        style={{
                            transform: isActive ? "translateX(10px)" : "translateX(46px)",
                            transition: "0.2s linear",
                            boxShadow: "0px 0px 10px 0.5px black",
                        }}
                    ></div>
                </div>
            </div>
        );
    }
);
