import * as React from "react";

import Search from "../assets/svgs/search.svg";
import Close from "../assets/svgs/close.svg";

export const SearchBar = React.memo(({ isVisible, onSubmit, onClose }) => {
    let inputRef = React.useRef();
    const [showCross, setShowCross] = React.useState(false);

    return (
        <div style={{ display: isVisible ? "flex" : "none" }} className="justify-center">
            <div className="flex justify-between items-center text-white text-xl relative self-center mx-2 bg-blue-500 rounded-2xl px-2 ring-2 focus-within:ring">
                {showCross && (
                    <img
                        src={Close}
                        height="25"
                        width="25"
                        onClick={() => {
                            setShowCross(false);
                            onClose();
                            inputRef.current.value = null;
                        }}
                    />
                )}
                <input
                    name="search"
                    ref={inputRef}
                    placeholder="Search your URL"
                    autoComplete="off"
                    className="bg-blue-500 rounded-2xl outline-none pl-3 py-2 focus:bg-blue-500 hover:bg-blue-500 md:w-72 w-48 mr-2 shadow-none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && inputRef.current.value?.length !== 0) {
                            setShowCross(true);
                            onSubmit(inputRef.current.value);
                        }
                    }}
                />
                <img
                    src={Search}
                    height="25"
                    width="25"
                    onClick={() => {
                        if (inputRef.current.value?.length !== 0) {
                            setShowCross(true);
                            onSubmit(inputRef.current.value);
                        }
                    }}
                />
            </div>
        </div>
    );
});
