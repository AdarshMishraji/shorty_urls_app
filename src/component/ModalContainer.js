import * as React from "react";

export const ModalContainer = React.memo(({ onClose, children }) => {
    const [showContent, setShowContent] = React.useState(false);
    const [showContainer, setShowContainer] = React.useState(false);
    React.useEffect(() => {
        if (children) {
            setShowContainer(true);
            setTimeout(() => {
                setShowContent(true);
            }, 50);
        } else {
            setShowContent(false);
            setTimeout(() => {
                setShowContainer(false);
            }, 250);
        }
    }, [children]);
    return (
        <div
            className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50"
            style={{
                display: showContainer ? "flex" : "none",
            }}
        >
            <div
                style={{
                    boxShadow: "0px 0px 15px 0.5px blue",
                    width: "95vw",
                    transition: "all 0.2s ease-in-out",
                    transform: showContent ? "scale(1)" : "scale(0)",
                }}
                className="p-3 rounded-xl z-20 flex items-center justify-center mx-5 md:max-w-md dark:bg-gray-900 bg-gray-100"
            >
                {children}
            </div>
            <div
                className="w-full h-full z-10 absolute top-0 right-0 bottom-0 left-0"
                style={{
                    backgroundColor: "rgba(0,0,0,0.25)",
                    transition: "1s ease-in-out",
                }}
                onClick={onClose}
            ></div>
        </div>
    );
});
