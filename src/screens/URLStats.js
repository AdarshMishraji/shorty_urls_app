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

const URLStats = () => {
    const nav = useHistory();
    const { urlID } = useParams();
    const { state, tryLocalLogin } = React.useContext(AuthContext);
    const [loading, setLoading] = React.useState(true);
    const [URLData, setURLData] = React.useState({});
    const [modalContent, setModalContent] = React.useState();

    const fetchURL = React.useCallback(() => {
        setLoading(true);
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
            <div className="mt-20">
                {loading ? (
                    <div className="flex items-center justify-center" style={{ opacity: 0.7 }}>
                        <div className="spinner-grow mr-3" role="status" style={{ color: "black", height: 75, width: 75 }}>
                            <span class="sr-only">Loading...</span>
                        </div>
                        <h1>Fetching URL stats</h1>
                    </div>
                ) : (
                    <div className="flex flex-col list">
                        <URLItem item={URLData?.info} setModalContent={setModalContent} reFetch={() => nav.goBack()} />
                        <h1 className="text-blue-500 text-3xl my-2 text-center font-bold">
                            {Object.keys(URLData.meta).length ? "Statistics" : "No Stats Available 🥲"}
                        </h1>
                        {Object.keys(URLData.meta).length ? (
                            <div className="flex flex-col border-2 p-3 rounded-xl m-3 text-xl" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
                                <ClicksGraph data={URLData?.meta?.year_month_day_click} />
                                <div className="flex justify-around md:my-5 flex-wrap items-center">
                                    <PieChart data={URLData?.meta?.browser_clicks} title="Browsers Clicks" />
                                    <PieChart data={URLData?.meta?.os_clicks} title="System (OS) Clicks" />
                                    <PieChart data={URLData?.meta?.device_clicks} title="Devices Clicks" />
                                    <PieChart data={URLData?.meta?.country_clicks} title="Geo Locations Clicks" />
                                </div>
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
