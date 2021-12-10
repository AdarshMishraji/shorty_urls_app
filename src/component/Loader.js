import * as React from "react";
import ContentLoader from "react-content-loader";

import { Container, ThemedButton, ToggleSwitch } from ".";
import { ThemeContext } from "../context";

export const Loader = React.memo(
    React.forwardRef((props, ref) => {
        const {
            state: { theme },
        } = React.useContext(ThemeContext);

        return (
            <Container extraStyle={{ display: props.display ? "flex" : "none" }} className="m-3" ref={ref}>
                <div className="relative">
                    <div className="flex justify-between items-center">
                        <ToggleSwitch isActive className="mb-3" disabled />
                    </div>
                    <div className="border-b-2 pb-3 border-gray-500">
                        <ContentLoader
                            height="100%"
                            width="100%"
                            className="rounded-xl"
                            backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                            foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                        >
                            <rect y="0.25rem" height="1.75rem" width="75%" rx="12" />
                            <rect y="2.25rem" height="1.75rem" width="75%" rx="12" />
                            <rect y="5.5rem" height="1.75rem" width="50%" rx="12" />
                            <rect y="7.5rem" height="1.75rem" width="50%" rx="12" />
                        </ContentLoader>
                    </div>
                    <div className={`flex ${props.requiredButton ? "md:flex-row" : "flex-col"} flex-col items-center mt-3 justify-between`}>
                        <div className="flex items-center justify-center overflow-scroll whitespace-nowrap mx-2 md:my-0 my-2">
                            <ContentLoader
                                height="2.5rem"
                                width="100%"
                                className="rounded-xl"
                                backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                                foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                            >
                                <rect height="2.25rem" width="100%" rx="12" />
                            </ContentLoader>
                        </div>
                        <div style={{ display: props.requiredButton ? "block" : "none" }}>
                            <ThemedButton title="Statistics" color="bg-blue-500" disabled={true} />
                        </div>
                    </div>
                </div>
            </Container>
        );
    })
);
