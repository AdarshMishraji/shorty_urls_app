import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import ContentLoader from "react-content-loader";

import { AuthContext, ThemeContext } from "../context";
import { ClicksGraph, Container, Header, Loader, ModalContainer, PieChart, TypeSelector, URLItem } from "../component";
import { toastConfig } from "../configs";
import { fetchMyParticularURL } from "../api";
import { afterTokenExpire } from "../helpers";

const ScreenLoader = React.memo(({ display }) => {
    const {
        state: { theme },
    } = React.useContext(ThemeContext);

    return (
        <div style={{ display: display ? "block" : "none" }}>
            <Loader display={true} requiredButton={false} />
            <div className="flex flex-col items-center justify-center m-3">
                <ContentLoader
                    height={40}
                    width="75%"
                    className="rounded-xl"
                    backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                    foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                >
                    <rect height="100%" width="100%" />
                </ContentLoader>
                <Container className="m-3 w-full">
                    <ContentLoader
                        width="100%"
                        y="55vh"
                        height="50vh"
                        backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                        foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                    >
                        <rect height="50vh" width="100%" rx="12" ry="12" />
                    </ContentLoader>
                    <div className="flex justify-around md:my-5 flex-wrap items-center">
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                            foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                            className="flex flex-col my-3 text-xl w-full md:w-5/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                            foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                            className="flex flex-col my-3 text-xl w-full md:w-5/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                            foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                            className="flex flex-col my-3 text-xl w-full md:w-5/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                            foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                            className="flex flex-col my-3 text-xl w-full md:w-5/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                    </div>
                </Container>
            </div>
        </div>
    );
});

const Statistics = React.memo(({ year_month_day_click, browser_clicks, os_clicks, device_clicks, country_clicks, display }) => {
    return (
        <Container extraStyle={{ display: display ? "flex" : "none" }} className="m-3 ">
            <ClicksGraph data={year_month_day_click} />
            <div className="flex justify-around md:my-5 flex-wrap items-center">
                <PieChart data={browser_clicks} title="Browsers Clicks" />
                <PieChart data={os_clicks} title="System (OS) Clicks" />
                <PieChart data={device_clicks} title="Devices Clicks" />
                <PieChart data={country_clicks} title="Geo Locations Clicks" />
            </div>
        </Container>
    );
});

const History = React.memo(({ display, data }) => {
    const Row = React.memo(({ sno, ip, clicked_at, browser, device, OS, location }) => {
        return (
            <div className={`w-max border-b-2 rounded-2xl flex items-center ${sno === 1 ? "border-t-2" : null}`}>
                <span className=" text-center whitespace-normal overscroll-none w-24 inline-block font-bold my-2">{sno}</span>
                <span className="font-bold inline-block"> | </span>
                <span className=" text-center whitespace-normal overscroll-none w-72 inline-block font-bold my-2">{ip || "NA"}</span>
                <span className="font-bold inline-block"> | </span>
                <span className=" text-center whitespace-normal overscroll-none w-72 inline-block font-bold my-2">{clicked_at}</span>
                <span className=" font-bold inline-block"> | </span>
                <span className=" text-center whitespace-normal overscroll-none w-72 inline-block font-bold my-2">{browser}</span>
                <span className=" font-bold inline-block"> | </span>
                <span className=" text-center whitespace-normal overscroll-none w-72 inline-block font-bold my-2">{device}</span>
                <span className=" font-bold inline-block"> | </span>
                <span className=" text-center whitespace-normal overscroll-none w-72 inline-block font-bold my-2">{OS}</span>
                <span className=" font-bold inline-block"> | </span>
                <span className=" text-center whitespace-normal overscroll-none w-72 inline-block font-bold my-2">{location}</span>
            </div>
        );
    });

    return (
        <Container extraStyle={{ display: display ? "flex" : "none" }} className="my-4 mx-3">
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
        </Container>
    );
});

const URLStats = () => {
    const history = useHistory();
    const { urlID } = useParams();

    const [loading, setLoading] = React.useState(true);
    const [URLData, setURLData] = React.useState({});
    const [modalContent, setModalContent] = React.useState();
    const [tableDisplay, setTableDisplay] = React.useState(false);

    const { state, tryLocalLogin, clearUserData } = React.useContext(AuthContext);

    const fetchURL = React.useCallback(() => {
        if (state.token) {
            fetchMyParticularURL(
                urlID,
                state.token,
                (value) => {
                    setURLData(value.data);
                },
                (e) => {
                    toast("😵" + e?.response?.data?.error || "Internal Error", {
                        type: "error",
                        ...toastConfig,
                        onClose: () => {
                            afterTokenExpire(e, history, clearUserData);
                        },
                    });
                },
                () => {
                    setLoading(false);
                }
            );
        }
    }, [state]);

    React.useEffect(() => {
        window.scrollTo({ top: 0 });
        tryLocalLogin(
            () => {
                if (state.token) {
                    if (urlID) {
                        fetchURL();
                    } else {
                        history.replace("/urls");
                    }
                }
            },
            () => {
                history.replace("/login");
            }
        );
    }, [state.token]);
    return (
        <div className="z-10 min-h-screen">
            <ToastContainer className="z-50 text-center" />
            <Header requireBackground />
            <div className="flex flex-col mt-20 md:mx-5 lg:mx-40">
                <ScreenLoader display={loading} />
                {loading ? null : (
                    <div className="flex flex-col list">
                        <URLItem item={URLData?.info} setModalContent={setModalContent} reFetch={() => history.goBack()} />
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
