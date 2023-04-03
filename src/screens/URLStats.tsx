import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import ContentLoader from "react-content-loader";
import ReactTooltip from "react-tooltip";

import { AuthContext, ThemeContext } from "../context";
import { ClicksGraph, Container, Header, Loader, ModalContainer, PieChart, TypeSelector, URLItem } from "../component";
import { toastConfig } from "../configs";
import { fetchMyParticularURL } from "../api";
import { afterTokenExpire } from "../helpers";

import { Browser, Clock, Device, IP, Location, OS } from "../assets";

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
                            className="my-3 w-full xl:w-1/5 justify-between"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                            foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                            className="my-3 w-full xl:w-1/5 justify-between"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                            foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                            className="my-3 w-full xl:w-1/5 justify-between"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor={theme === "dark" ? "rgba(17, 24, 39,1)" : "#f3f3f3"}
                            foregroundColor={theme === "dark" ? "#223344" : "#cccccc"}
                            className="my-3 w-full xl:w-1/5 justify-between"
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

const Timeline = React.memo(({ display, data }) => {
    const currentMonth = React.useRef();
    const currentYear = React.useRef();
    currentMonth.current = -1;
    currentYear.current = -1;

    const TimelineRow = React.memo(({ sno, ip, clicked_at, browser, device, os, location, monthRequired, yearRequired }) => {
        return (
            <div className={monthRequired ? "pt-4" : ""}>
                <ReactTooltip />
                <div className="z-0 border-l-2 ml-4 border-gray-500 relative">
                    <div
                        className="rounded-full h-7 w-7 absolute top-10"
                        style={{ background: "linear-gradient(-45deg,#05f05f 10%,#0fffff 90%)", left: -15, boxShadow: "0px 0px 20px 0.5px green" }}
                    ></div>
                    <div className="p-3 z-10 flex">
                        <Container className="ml-3 w-full zoom-container">
                            <p
                                className="font-bold my-2 text-gray-600 whitespace-nowrap overflow-scroll"
                                data-tip="IP Address"
                                style={{ cursor: "alias" }}
                            >
                                <IP color="grey" height={30} width={30} className="inline-block mx-3" />
                                <span>{ip || "NA"}</span>
                            </p>
                            <p
                                className="font-bold my-2 text-gray-600 whitespace-nowrap overflow-scroll"
                                data-tip="Clicked At"
                                style={{ cursor: "alias" }}
                            >
                                <Clock color="grey" height={30} width={30} className="inline-block mx-3" />
                                <span>{moment(clicked_at).format("YYYY MMMM DD, hh:mm A")}</span>
                            </p>
                            <p
                                className="font-bold my-2 text-gray-600 whitespace-nowrap overflow-scroll"
                                data-tip="Browser"
                                style={{ cursor: "alias" }}
                            >
                                <Browser color="grey" height={30} width={30} className="inline-block mx-3" />
                                <span>{browser}</span>
                            </p>
                            <p
                                className="font-bold my-2 text-gray-600 whitespace-nowrap overflow-scroll"
                                data-tip="Device"
                                style={{ cursor: "alias" }}
                            >
                                <Device color="grey" height={30} width={30} className="inline-block mx-3" />
                                <span>{device}</span>
                            </p>
                            <p
                                className="font-bold my-2 text-gray-600 whitespace-nowrap overflow-scroll"
                                data-tip="Operating System"
                                style={{ cursor: "alias" }}
                            >
                                <OS color="grey" height={30} width={30} className="inline-block mx-3" />
                                <span>{os}</span>
                            </p>
                            <p
                                className="font-bold my-2 text-gray-600 whitespace-nowrap overflow-scroll"
                                data-tip="Geo Location"
                                style={{ cursor: "alias" }}
                            >
                                <Location color="grey" height={30} width={30} className="inline-block mx-3" />
                                <span>{location}</span>
                            </p>
                        </Container>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <Container className="m-3" extraStyle={{ display: display ? "flex" : "none" }}>
            {data.map((value, index) => {
                let date = moment(value.requested_at).format("YYYY-MM");
                let monthRequired = false;
                let yearRequired = false;
                console.log(value.requested_at);
                let [cY, cM] = date.split("-");
                let currYear = parseInt(cY);
                let currMon = parseInt(cM);
                if (currYear > currentYear.current) {
                    currentYear.current = currYear;
                    yearRequired = true;
                }
                if (currMon > currentMonth.current) {
                    currentMonth.current = currMon;
                    monthRequired = true;
                }

                return (
                    <div>
                        <h1 className="text-gray-600 font-bold text-3xl">{yearRequired ? currYear : null}</h1>
                        <div className="border-l-2 ml-3 border-gray-500">
                            {monthRequired ? (
                                <div className="relative">
                                    <div className="flex items-center relative pt-4">
                                        <div
                                            className="rounded-full h-7 w-7 absolute"
                                            style={{
                                                background: "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)",
                                                left: -15,
                                                boxShadow: "0px 0px 20px 0.5px blue",
                                            }}
                                        ></div>
                                        <span className="text-gray-600 text-2xl ml-10 font-bold">
                                            {monthRequired ? moment(value.requested_at).format("MMMM") : null}
                                        </span>
                                    </div>
                                    <div className="bg-gray-500 absolute w-0.5 h-8 left-3" style={{ transform: "rotate(-55deg)" }}></div>
                                </div>
                            ) : null}
                            <TimelineRow
                                key={index}
                                sno={index + 1}
                                ip={value?.ip || "NA"}
                                clicked_at={value?.requested_at}
                                browser={value?.client_info?.client_name || "NA"}
                                device={value?.client_info?.device_type?.[0].toUpperCase() + value?.client_info?.device_type?.slice(1) || "NA"}
                                os={value?.client_info?.OS || "NA"}
                                location={value?.location ? `${value.location.city}, ${value?.location?.country}. ${value?.location?.zipCode}` : "NA"}
                                monthRequired={monthRequired}
                                yearRequired={yearRequired}
                            />
                        </div>
                    </div>
                );
            })}
        </Container>
    );
});

const URLStats = () => {
    const history = useHistory();
    const { urlID } = useParams();

    const [loading, setLoading] = React.useState(true);
    const [URLData, setURLData] = React.useState({});
    const [modalContent, setModalContent] = React.useState();
    const [timelineDisplay, setTimelineView] = React.useState(false);

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
                                    isFirst={!timelineDisplay}
                                    setType={(type) => setTimelineView(type === 1 ? false : true)}
                                    text1="Statistics"
                                    text2="Timeline"
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
                                    display={!timelineDisplay}
                                    year_month_day_click={URLData?.meta?.year_month_day_click}
                                    browser_clicks={URLData?.meta?.browser_clicks}
                                    os_clicks={URLData?.meta?.os_clicks}
                                    device_clicks={URLData?.meta?.device_clicks}
                                    country_clicks={URLData?.meta?.country_clicks}
                                />
                                <Timeline display={timelineDisplay} data={URLData?.info?.from_visited} />
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
