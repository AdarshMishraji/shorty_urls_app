import * as React from "react";

import Love from "../assets/svgs/love.svg";

export const Footer = React.memo(() => {
    return (
        <footer className="flex items-center p-3 w-full" style={{ background: "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)" }}>
            <div className="inline-block text-white text-xl">
                Made with <img src={Love} className="mx-2 inline" alt="zxcvbnm" /> by Adarsh Mishra
            </div>
        </footer>
    );
});
