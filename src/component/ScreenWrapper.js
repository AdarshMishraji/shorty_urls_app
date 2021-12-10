import * as React from "react";

import { ThemeContext } from "../context";

export const ScreenWrapper = ({ children }) => {
    const {
        state: { theme },
    } = React.useContext(ThemeContext);

    return (
        <div className={"min-h-screen" + theme === "dark" ? "dark" : ""}>
            <div
                style={{
                    opacity: "0.9",
                    transition: "all 1s ease-in-out",
                    ...(theme === "dark"
                        ? {
                              height: "200%",
                              width: "200%",
                          }
                        : {
                              height: 0,
                              width: 0,
                              borderTopLeftRadius: 9999,
                          }),
                    zIndex: -1,
                    backgroundColor: "rgba(0, 0, 10)",
                }}
                className="flex fixed bottom-0 md:-right-52 right-0"
            />
            {children}
        </div>
    );
};
