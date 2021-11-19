import * as React from "react";
import ContentLoader from "react-content-loader";

export const Stats = React.memo(({ title, value, icon, color }) => {
    return (
        <div className={`px-4 py-2 rounded-xl ${color} mx-2 flex flex-1 justify-between items-center my-2`}>
            <div>
                <h1 className="text-sm text-blue-600 font-bold" style={{ minWidth: 100 }}>
                    {title}
                </h1>
                {typeof value === "number" ? (
                    <h1 className="text-sm text-gray-700">{value || 0}</h1>
                ) : (
                    <ContentLoader width="100%" height="16" className="rounded-xl" backgroundColor="#f3f3f3" foregroundColor="#cccccc">
                        <rect width="100%" height="16" />
                    </ContentLoader>
                )}
            </div>
            <img src={icon} height="35" width="35" className="bg-white rounded-full p-2 ml-3" />
        </div>
    );
});
