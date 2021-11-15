export const TypeSelector = ({ isBar, setType, className, text1, text2 }) => {
    return (
        <div className={className}>
            <div className="flex justify-around w-52 h-12 relative items-center">
                <h1
                    onClick={() => setType("bar")}
                    className="text-white left-0 w-28  rounded-l-2xl  text-center bg-blue-400 py-2 cursor-pointer"
                    style={{ backgroundColor: "#2254ff55" }}
                >
                    {text1}
                </h1>
                <h1
                    onClick={() => setType("line")}
                    className="text-white right-0 w-28  rounded-r-2xl text-center  py-2 cursor-pointer"
                    style={{ backgroundColor: "#2254ff55" }}
                >
                    {text2}
                </h1>
                <div
                    className="absolute w-28 bg-blue-600 rounded-2xl text-center py-2 left-0 font-semibold text-white"
                    style={{
                        transform: isBar ? "translateX(-5px)" : "translateX(100px)",
                        transition: "0.5s linear",
                        boxShadow: "0px 0px 20px 0.5px black",
                    }}
                >
                    {isBar ? text1 : text2}
                </div>
            </div>
        </div>
    );
};
