import * as React from "react";

export const TypeSelector = React.memo(({ isFirst, setType, className, buttonClassName, text1, text2 }) => {
    return (
        <div className={className}>
            <div className="flex justify-around h-12 relative items-center">
                <h1
                    onClick={() => setType(1)}
                    className={`text-white left-0 w-28  rounded-l-2xl  text-center bg-blue-400 py-2 cursor-pointer ${buttonClassName}`}
                    style={{ backgroundColor: "#2254ff55" }}
                >
                    {text1}
                </h1>
                <h1
                    onClick={() => setType(2)}
                    className={`text-white right-0 w-28  rounded-r-2xl text-center  py-2 cursor-pointer ${buttonClassName}`}
                    style={{ backgroundColor: "#2254ff55" }}
                >
                    {text2}
                </h1>
                <div
                    className={`absolute w-28 bg-blue-600 rounded-2xl text-center py-2 left-0 font-semibold text-white ${buttonClassName}`}
                    style={{
                        transform: isFirst ? "translateX(0%)" : "translateX(100%)",
                        transition: "0.2s linear",
                        boxShadow: "0px 0px 20px 0.5px black",
                    }}
                >
                    {isFirst ? text1 : text2}
                </div>
            </div>
        </div>
    );
});
