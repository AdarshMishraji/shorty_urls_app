import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import ContentLoader from "react-content-loader";

import { Context as AuthContext } from "../context";
import { ClicksGraph, Header, Loader, ModalContainer, PieChart, TypeSelector, URLItem } from "../component";
import { toastConfig } from "../configs";
import { fetchMyParticularURL } from "../api";

const ScreenLoader = React.memo(({ display }) => {
    return (
        <div style={{ display: display ? "block" : "none" }}>
            <Loader display={true} />
            <div className="flex flex-col items-center justify-center m-3">
                <ContentLoader height={40} width="75%" className="rounded-xl" backgroundColor="#f3f3f3" foregroundColor="#cccccc">
                    <rect height="100%" width="100%" />
                </ContentLoader>
                <div className="flex flex-1 w-full flex-col p-3 rounded-xl m-3 text-xl" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
                    <ContentLoader width="100%" y="55vh" height="50vh" backgroundColor="#f3f3f3" foregroundColor="#cccccc">
                        <rect height="50vh" width="100%" rx="12" ry="12" />
                    </ContentLoader>
                    <div className="flex justify-around md:my-5 flex-wrap items-center">
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#cccccc"
                            className="flex flex-col my-3 text-xl w-full md:w-5/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#cccccc"
                            className="flex flex-col my-3 text-xl w-full md:w-5/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#cccccc"
                            className="flex flex-col my-3 text-xl w-full md:w-5/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#cccccc"
                            className="flex flex-col my-3 text-xl w-full md:w-5/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                    </div>
                </div>
            </div>
        </div>
    );
});

const Statistics = React.memo(({ year_month_day_click, browser_clicks, os_clicks, device_clicks, country_clicks, display }) => {
    return (
        <div
            className="flex flex-col p-3 rounded-xl m-3 text-xl"
            style={{ boxShadow: "0px 0px 15px 0.5px blue", display: display ? "flex" : "none" }}
        >
            <ClicksGraph data={year_month_day_click} />
            <div className="flex justify-around md:my-5 flex-wrap items-center">
                <PieChart data={browser_clicks} title="Browsers Clicks" />
                <PieChart data={os_clicks} title="System (OS) Clicks" />
                <PieChart data={device_clicks} title="Devices Clicks" />
                <PieChart data={country_clicks} title="Geo Locations Clicks" />
            </div>
        </div>
    );
});

const History = React.memo(({ display, data }) => {
    const Row = React.memo(({ sno, ip, clicked_at, browser, device, OS, location }) => {
        return (
            <div className={`w-max border-b-2 rounded-2xl ${sno === 1 ? "border-t-2" : null}`}>
                <span className=" text-center w-24 inline-block font-bold my-2">{sno}</span>
                <span className="font-bold inline-block"> | </span>
                <span className=" text-center w-64 inline-block font-bold my-2">{ip || "NA"}</span>
                <span className="font-bold inline-block"> | </span>
                <span className=" text-center w-64 inline-block font-bold my-2">{clicked_at}</span>
                <span className=" font-bold inline-block"> | </span>
                <span className=" text-center w-64 inline-block font-bold my-2">{browser}</span>
                <span className=" font-bold inline-block"> | </span>
                <span className=" text-center w-64 inline-block font-bold my-2">{device}</span>
                <span className=" font-bold inline-block"> | </span>
                <span className=" text-center w-64 inline-block font-bold my-2">{OS}</span>
                <span className=" font-bold inline-block"> | </span>
                <span className=" text-center w-64 inline-block font-bold my-2">{location}</span>
            </div>
        );
    });

    return (
        <div
            className="flex flex-col p-3 rounded-xl m-3 text-xl"
            style={{ boxShadow: "0px 0px 15px 0.5px blue", display: display ? "flex" : "none" }}
        >
            {data?.length > 0 ? (
                <div>
                    <div className="flex flex-col rounded-xl text-xl py-3 whitespace-nowrap overflow-scroll text-gray-700">
                        <div className="mb-3 w-max border-2 rounded-xl bg-blue-500 text-white">
                            <Row
                                sno="S No."
                                ip="IP"
                                clicked_at="Clicked At"
                                browser="Browser"
                                device="Device"
                                OS="System (OS)"
                                location="Geo Location"
                            />
                        </div>
                        {data?.map((value, index) => {
                            const location = value?.location
                                ? `${value.location.city}, ${value?.location?.country}. ${value?.location?.zipCode}`
                                : "NA";
                            const date = moment(value?.requested_at).format("YYYY - MMM - DD, hh:mm A");

                            return (
                                <Row
                                    key={index}
                                    sno={index + 1}
                                    ip={value?.ip || "NA"}
                                    clicked_at={date}
                                    browser={value?.client_info?.client_name || "NA"}
                                    device={value?.client_info?.device_type?.[0].toUpperCase() + value?.client_info?.device_type?.slice(1) || "NA"}
                                    OS={value?.client_info?.OS || "NA"}
                                    location={location}
                                />
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
});

const URLStats = () => {
    const nav = useHistory();
    const { urlID } = useParams();
    const { state, tryLocalLogin } = React.useContext(AuthContext);
    const [loading, setLoading] = React.useState(true);
    const [URLData, setURLData] = React.useState({});
    const [modalContent, setModalContent] = React.useState();
    const [tableDisplay, setTableDisplay] = React.useState(false);

    const fetchURL = React.useCallback(() => {
        if (state.token) {
            fetchMyParticularURL(
                urlID,
                state.token,
                (value) => {
                    setURLData(value.data);
                },
                (e) => {
                    console.log(e);
                    toast("😵 Internal Error", {
                        type: "error",
                        ...toastConfig,
                    });
                },
                () => {
                    setLoading(false);
                }
            );
        }
    }, [state]);

    React.useEffect(() => {
        tryLocalLogin(
            () => {
                if (state.token) {
                    if (urlID) {
                        fetchURL();
                    } else {
                        nav.replace("/urls");
                    }
                }
            },
            () => {
                nav.replace("/login");
            }
        );
    }, [state.token]);
    return (
        <div className="bg-white z-10">
            <ToastContainer className="z-50 text-center" />
            <Header requireBackground />
            <div className="flex flex-col mt-20 md:mx-5 lg:mx-40">
                <ScreenLoader display={loading} />
                {loading ? null : (
                    <div className="flex flex-col list">
                        <URLItem item={URLData?.info} setModalContent={setModalContent} reFetch={() => nav.goBack()} />
                        <h1 className="text-blue-500 text-xl my-2 text-center font-bold mx-5">
                            {URLData?.meta && Object.keys(URLData?.meta)?.length > 0 ? (
                                <TypeSelector
                                    isFirst={!tableDisplay}
                                    setType={(type) => setTableDisplay(type === 1 ? false : true)}
                                    text1="Statistics"
                                    text2="Histories"
                                    className=""
                                    buttonClassName="w-50"
                                />
                            ) : (
                                "No One Visited Yet 🥲"
                            )}
                        </h1>
                        {URLData?.meta && Object.keys(URLData?.meta).length > 0 ? (
                            <div>
                                <Statistics
                                    display={!tableDisplay}
                                    year_month_day_click={URLData?.meta?.year_month_day_click}
                                    browser_clicks={URLData?.meta?.browser_clicks}
                                    os_clicks={URLData?.meta?.os_clicks}
                                    device_clicks={URLData?.meta?.device_clicks}
                                    country_clicks={URLData?.meta?.country_clicks}
                                />
                                <History display={tableDisplay} data={URLData?.info?.from_visited} />
                            </div>
                        ) : null}
                        <ModalContainer onClose={() => setModalContent()} children={modalContent} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default URLStats;
