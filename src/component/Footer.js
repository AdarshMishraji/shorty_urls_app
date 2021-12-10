import * as React from "react";

import { ThemeContext } from "../context";
import { ToggleSwitch } from ".";

import { DarkMode, LightMode, Love } from "../assets";

export const Footer = React.memo(() => {
    const {
        state: { theme },
        setTheme,
    } = React.useContext(ThemeContext);

    return (
        <footer className="flex items-center justify-between p-3 w-full" style={{ background: "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)" }}>
            <div className="inline-block text-white text-xl">
                Made with <Love className="mx-2 inline" /> by Adarsh Mishra
            </div>
            <ToggleSwitch
                isActive={theme === "dark"}
                setStatus={(status) => {
                    if (status) setTheme("dark");
                    else setTheme("light");
                }}
                OffIcon={DarkMode}
                OnIcon={LightMode}
                offColor="#FF5733"
                on
            />
        </footer>
    );
});
