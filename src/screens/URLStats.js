import axios from "axios";
import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ModalContainer, toastConfig, URLItem } from "../component/URLItems";
import { BASE_URL, Authorization } from "../configs/constants";
import { Context as AuthContext } from "../context";
import { ClicksGraph } from "../component/ClicksGraph";
import { PieChart } from "../component/PieChart";
import Header from "../component/Header";
import { Loader } from "../component/Loader";
import ContentLoader from "react-content-loader";
import { TypeSelector } from "../component/TypesSelector";

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
                            className="flex flex-col my-3 text-xl md:mx-3 md:w-4/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#cccccc"
                            className="flex flex-col my-3 text-xl md:mx-3 md:w-4/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#cccccc"
                            className="flex flex-col my-3 text-xl md:mx-3 md:w-4/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                        <ContentLoader
                            width="100%"
                            height="50vh"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#cccccc"
                            className="flex flex-col my-3 text-xl md:mx-3 md:w-4/12"
                        >
                            <rect height="50vh" width="100%" rx="12" ry="12" />
                        </ContentLoader>
                    </div>
                </div>
            </div>
        </div>
    );
});

const Statistics = React.memo(({ year_month_day_click, browser_clicks, os_clicks, device_clicks, country_clicks }) => {
    return (
        <div className="flex flex-col border-2 p-3 rounded-xl m-3 text-xl" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
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

const History = React.memo(({ year_month_day_click, browser_clicks, os_clicks, device_clicks, country_clicks }) => {
    return (
        <div className="flex flex-col border-2 p-3 rounded-xl m-3 text-xl" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
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

const URLStats = () => {
    const nav = useHistory();
    const { urlID } = useParams();
    const { state, tryLocalLogin } = React.useContext(AuthContext);
    const [loading, setLoading] = React.useState(true);
    const [URLData, setURLData] = React.useState({});
    const [modalContent, setModalContent] = React.useState();
    const [tableDisplay, setTableDisplay] = React.useState(false);

    const fetchURL = React.useCallback(() => {
        const url = `${BASE_URL}url/${urlID}`;
        console.log(url);
        if (state.token) {
            axios
                .get(url, {
                    headers: {
                        Authorization,
                        accessToken: state.token,
                    },
                })
                .then((value) => {
                    console.log(value.data);
                    setURLData(value.data);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                    toast("😵 Internal Error", {
                        type: "error",
                        ...toastConfig,
                    });
                    setLoading(false);
                });
        }
    }, [state]);

    React.useEffect(() => {
        tryLocalLogin(
            () => {
                if (state.token) {
                    // setLoading(true);
                    if (urlID) {
                        // fetchURL();
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
            <div className="mt-20 md:mx-5 lg:mx-40">
                <ScreenLoader display={loading} />
                {loading ? null : (
                    <div className="flex flex-col list">
                        <URLItem item={URLData?.info} setModalContent={setModalContent} reFetch={() => nav.goBack()} />
                        <h1 className="text-blue-500 text-3xl my-2 text-center font-bold md:mx-5 mx-2">
                            {Object.keys(URLData?.meta)?.length ? (
                                <TypeSelector
                                    isFirst={!tableDisplay}
                                    setType={(type) => setTableDisplay(type === 1 ? false : true)}
                                    text1="Statistics"
                                    text2="History"
                                    className=""
                                    buttonClassName="w-50"
                                />
                            ) : (
                                "No Stats Available 🥲"
                            )}
                        </h1>
                        {Object.keys(URLData.meta).length ? (
                            <Statistics
                                year_month_day_click={URLData?.meta?.year_month_day_click}
                                browser_clicks={URLData?.meta?.browser_clicks}
                                os_clicks={URLData?.meta?.os_clicks}
                                device_clicks={URLData?.meta?.device_clicks}
                                country_clicks={URLData?.meta?.country_clicks}
                            />
                        ) : null}
                        <ModalContainer onClose={() => setModalContent()} children={modalContent} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default URLStats;
