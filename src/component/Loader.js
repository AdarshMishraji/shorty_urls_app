import * as React from "react";
import ContentLoader from "react-content-loader";
import { ThemedButton, ToggleSwitch } from ".";

export const Loader = React.memo(
    React.forwardRef((props, ref) => {
        return (
            <div
                className="flex flex-col border-2 p-3 rounded-xl m-3 text-xl lg:mx-20"
                style={{ boxShadow: "0px 0px 15px 0.5px blue", display: props.display ? "flex" : "none" }}
                ref={ref}
            >
                <div className="relative">
                    <div className="flex justify-between items-center">
                        <ToggleSwitch isActive className="mb-3" disabled />
                    </div>
                    <div className="border-b-2 pb-3">
                        <ContentLoader height="100%" width="100%" className="rounded-xl" backgroundColor="#f3f3f3" foregroundColor="#cccccc">
                            <rect y="0.25rem" height="1.75rem" width="75%" rx="12" />
                            <rect y="2.25rem" height="1.75rem" width="75%" rx="12" />
                            <rect y="5.5rem" height="1.75rem" width="50%" rx="12" />
                            <rect y="7.5rem" height="1.75rem" width="50%" rx="12" />
                        </ContentLoader>
                    </div>
                    <div className="flex items-center mt-2 justify-between">
                        <div className="flex items-center overflow-scroll whitespace-nowrap">
                            <ContentLoader height="2.5rem" width="100%" className="rounded-xl" backgroundColor="#f3f3f3" foregroundColor="#cccccc">
                                <rect height="2.25rem" width="75%" rx="12" />
                            </ContentLoader>
                        </div>
                        <div>
                            <ThemedButton title="Statistics" color="bg-blue-500" disabled={true} />
                        </div>
                    </div>
                </div>
            </div>
        );
    })
);
