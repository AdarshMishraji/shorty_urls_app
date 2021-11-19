import * as React from "react";
import { Trophy } from "./Trophy";

export const TopLinks = React.memo(({ title, url, short_url, color }) => {
    return (
        <div
            className={`px-4 py-2 rounded-xl mx-2 flex flex-1 justify-between items-center my-2`}
            style={{
                backgroundColor: `${color}aa`,
            }}
        >
            <div className="whitespace-nowrap overflow-scroll">
                <h1 className="text-lg text-blue-600 font-bold " style={{ minWidth: 100 }}>
                    {title}
                </h1>
                <h1 className="text-sm text-blue-600 font-bold" style={{ minWidth: 100 }}>
                    {url}
                </h1>
                <h1 className="text-sm text-gray-700">{short_url}</h1>
            </div>
            <div className="rounded-full bg-white flex items-center justify-center p-2 ml-2">
                <Trophy color={color} />
            </div>
        </div>
    );
});
