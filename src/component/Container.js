import * as React from "react";

export const Container = React.memo(
    React.forwardRef(({ children, extraStyle, className }, ref) => {
        return (
            <div
                className={`flex flex-col p-3 rounded-xl text-xl  ${className} transition transform duration-500`}
                style={{ boxShadow: "0px 0px 15px 0.5px blue", ...extraStyle }}
                ref={ref}
            >
                {children}
            </div>
        );
    })
);
