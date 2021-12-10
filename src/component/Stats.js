import * as React from "react";
import ContentLoader from "react-content-loader";

import { ThemeContext } from "../context";

export const Stats = React.memo(({ title, value, Icon, color, contentAvailable }) => {
    const {
        state: { theme },
    } = React.useContext(ThemeContext);
    return (
        <div
            className={`px-4 py-2 rounded-xl ${color} mx-2 flex flex-1 justify-between items-center my-2 zoom-container transition transform duration-500`}
        >
            <div>
                <h1 className="text-sm text-blue-600 font-bold" style={{ minWidth: 100 }}>
                    {title}
                </h1>
                {contentAvailable ? (
                    <h1 className="text-sm text-gray-700">{value || 0}</h1>
                ) : (
                    <ContentLoader
                        width="100%"
                        height="16"
                        className="rounded-xl"
                        backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                        foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                    >
                        <rect width="100%" height="16" />
                    </ContentLoader>
                )}
            </div>
            <Icon height="35" width="35" color="black" className="bg-white rounded-full p-2 ml-3" />
        </div>
    );
});
