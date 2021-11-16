import * as React from "react";
import validator from "validator";
import ThemedButton from "../component/ThemedButton";
import axios from "axios";
import copy from "copy-to-clipboard";
import { Context as AuthContext } from "../context";
import { useHistory } from "react-router";
import { Authorization, BASE_URL } from "../configs/constants";
import Link from "../assets/svgs/link.svg";
import Cursor from "../assets/svgs/cursor.svg";
import NewLink from "../assets/svgs/newLink.svg";
import Logo from "../assets/images/logo.png";
import Footer from "../component/Footer";
import { ClicksGraph } from "../component/ClicksGraph";
import { Stats } from "../component/Stats";
import { TopLinks } from "../component/TopLinks";
import { toast, ToastContainer } from "react-toastify";
import { toastConfig } from "../component/URLItems";
import Header from "../component/Header";

const makeURLValid = (url) => {
    let temp = url;
    if (temp.search("https://") === -1 && temp.search("http://") === -1) {
        const www_index = temp.search("www");
        if (www_index !== -1) {
            temp = temp.replace("www.", "");
        }
        return "https://" + temp;
    }
    return url;
};

const Home = () => {
    const currDate = new Date();
    const [url, setUrl] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [short_url, set_short_url] = React.useState();
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const [meta, setMeta] = React.useState({});
    let textRef = React.useRef();

    const { state, tryLocalLogin } = React.useContext(AuthContext);
    const history = useHistory();

    const fetchMetaData = React.useCallback(
        (withoutAuth) => {
            if (withoutAuth || state.token)
                axios
                    .get(`${BASE_URL}meta?withoutAuth=${withoutAuth}`, {
                        headers: {
                            Authorization,
                            accessToken: state.token,
                        },
                    })
                    .then((res) => {
                        setMeta(res.data);
                        console.log(res.data);
                    })
                    .catch((e) => console.log(e));
        },
        [state]
    );

    React.useEffect(() => {
        tryLocalLogin(
            () => {
                console.log("called");
                if (state.token) fetchMetaData(false);
            },
            () => {
                fetchMetaData(true);
            }
        );
        textRef.current.focus();
    }, [state.token]);

    const onSubmit = async () => {
        if (state.token) {
            setLoading(true);
            set_short_url();
            if (url) {
                if (validator.isURL(url)) {
                    const newURL = makeURLValid(url);
                    axios
                        .post(
                            `${BASE_URL}generate_short_url`,
                            {
                                url: newURL,
                            },
                            {
                                headers: {
                                    Authorization,
                                    accessToken: state.token,
                                },
                            }
                        )
                        .then((value) => {
                            set_short_url(value.data.short_url);
                            toast("👍 Success", {
                                type: "success",
                                ...toastConfig,
                            });
                        })
                        .catch((e) => {
                            console.log("error", e?.response);
                            if (e?.response?.status === 409) {
                                set_short_url(e.response.data.short_url);
                            }

                            toast("😵 " + e?.response?.data?.error, {
                                type: "error",
                                ...toastConfig,
                            });
                        })
                        .finally(() => setLoading(false));
                } else {
                    console.log("url not exists");
                    setLoading(false);
                    setError("URL doesn't exists");
                    toast("😵 URL doesn't exists", {
                        type: "error",
                        ...toastConfig,
                    });
                }
            } else {
                console.log("invalid url");
                setLoading(false);
                setError("Enter valid URL");
                toast("😵 Enter valid URL", {
                    type: "error",
                    ...toastConfig,
                });
            }
        } else {
            history.push("/login");
        }
    };

    const onCopy = () => {
        copy(short_url);
        toast("👍 Copied", {
            type: "success",
            ...toastConfig,
        });
    };

    const onOpenURL = () => {
        window.open(short_url, "_blank");
    };

    return (
        <div className="bg-white z-10">
            <ToastContainer />
            <Header requireBackground />
            <div
                className="flex flex-col items-center justify-center py-5 mb-5 rounded-b-2xl"
                style={{ background: "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)", boxShadow: "0px 5px 40px 2px blue" }}
            >
                <div className="flex flex-col items-center justify-center py-20 md:mx-0 mx-3">
                    <div className="absolute top-20 left-0" style={{ transform: "rotate(90deg)" }}>
                        <img src={Link} height={150} width={150} />
                    </div>
                    <div className="absolute top-72 right-0" style={{ transform: "rotate(180deg)" }}>
                        <img src={Link} height={200} width={200} />
                    </div>
                    <div className="flex flex-col flex-1 self-start text-white mb-10" style={{ zIndex: 2 }}>
                        <h1 className=" text-gray-300 text-xl">URL Shortener</h1>
                        <h1 className="text-3xl font-bold">Have full control on your links</h1>
                        <h1 className="text-xl text-gray-200">Shorten, manage and track you links</h1>
                    </div>
                    <h1 className="text-white text-2xl self-start mb-2">Enter the URL</h1>
                    <div className="flex justify-between bg-white rounded-xl p-2 border-0 text-xl mb-2" style={{ zIndex: 2 }}>
                        <input
                            ref={textRef}
                            value={url}
                            className="focus:outline-none focus:shadow-2xl rounded-xl pl-3 flex-1 mr-2 md:w-96 w-full"
                            placeholder="e.g. https://example.com"
                            onChange={(e) => {
                                setError("");
                                if (short_url) {
                                    set_short_url();
                                }
                                setUrl(e.target.value);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    onSubmit();
                                }
                            }}
                        />
                        {loading ? (
                            <div className="py-1 rounded-xl w-24 flex items-center justify-center">
                                <div className="spinner-grow " role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <ThemedButton title="Shorten" onClickHandler={onSubmit} color="bg-blue-600 ml-2" />
                        )}
                    </div>
                    <div
                        className="flex flex-col items-center justify-center bg-white rounded-2xl px-3 py-2 mx-2"
                        style={{ display: error || short_url ? "flex" : "none", zIndex: 2 }}
                    >
                        <p className="text-red-600 text-xl text-center">{error}</p>
                        {short_url ? (
                            <div className="flex flex-col md:w-full" style={{ maxWidth: "80vw" }}>
                                <p className="text-xl text-white bg-gray-600 py-2 px-3 my-2 rounded-xl pl-3 flex-1 mr-2 md:w-100 w-full whitespace-nowrap overflow-scroll">
                                    {short_url}
                                </p>
                                <p className="text-blue-600 text-xl text-center mb-2">{success}</p>
                                <div className="flex justify-around items-center">
                                    <ThemedButton title="Copy" onClickHandler={onCopy} color="bg-blue-500" />
                                    <ThemedButton title="Open" onClickHandler={onOpenURL} color="bg-green-500" />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="text-center mx-3 mb-4">
                <h1 className="text-3xl font-bold text-center text-blue-500">{state.token ? "Your Statistics" : "Our Statistics"}</h1>
            </div>

            <div className="flex flex-col self-center bg-white text-white m-3 relative">
                <div className="lg:mx-40">
                    <div className="flex flex-col border-2 p-2 rounded-xl mb-3" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
                        <div className="flex flex-1 md:flex-row flex-col">
                            <Stats title="ALL URLS" value={meta?.all_links} icon={Logo} color="bg-green-200" />
                            <Stats title="TOTAL CLICKS" value={meta?.all_clicks} icon={Cursor} color="bg-blue-200" />
                        </div>
                        <div className="flex flex-1 md:flex-row flex-col">
                            <Stats
                                title="LINKS ADDED THIS MONTH"
                                value={meta?.links_added?.[currDate.getFullYear()]?.[currDate.toLocaleString("default", { month: "long" })]?.count}
                                icon={NewLink}
                                color="bg-red-200"
                            />
                            <Stats
                                title="LINKS ADDED THIS YEAR"
                                value={meta?.links_added?.[currDate.getFullYear()]?.count}
                                icon={NewLink}
                                color="bg-yellow-200"
                            />
                        </div>
                        {state.token ? (
                            <div>
                                {meta?.top_three?.length > 0 ? (
                                    <h1 className="text-blue-500 text-2xl my-2 text-center border-t-2 pt-3 m-2">Most Clicked URLs</h1>
                                ) : null}
                                {meta?.top_three?.[0] ? (
                                    <TopLinks
                                        title={meta?.top_three?.[0]?.title}
                                        url={meta?.top_three?.[0]?.url}
                                        short_url={meta?.top_three?.[0]?.short_url}
                                        color="#FFD700"
                                    />
                                ) : null}
                                {meta?.top_three?.[0] ? (
                                    <TopLinks
                                        title={meta?.top_three?.[1]?.title}
                                        url={meta?.top_three?.[1]?.url}
                                        short_url={meta?.top_three?.[1]?.short_url}
                                        color="#C0C0C0"
                                    />
                                ) : null}
                                {meta?.top_three?.[0] ? (
                                    <TopLinks
                                        title={meta?.top_three?.[2]?.title}
                                        url={meta?.top_three?.[2]?.url}
                                        short_url={meta?.top_three?.[2]?.short_url}
                                        color="#CD7F32"
                                    />
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                    <div className="flex flex-col border-2 p-3 rounded-xl" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
                        <div className="flex items-center my-2">
                            <img src={Cursor} height="35px" width="35px" className="bg-blue-400 rounded-full p-2 mr-2 inline" />
                            <h1 className="text-2xl text-blue-500 font-bold inline">Clicks</h1>
                        </div>
                        <ClicksGraph data={meta?.clicks} />
                    </div>
                </div>
                <div className="lg:mx-40">
                    <div className="text-center mx-3 mt-5 ">
                        <h1 class="text-xl my-3 text-gray-500">
                            Shorty URLs allows you to measure the click-through rates of your links, so you can find out what is happening with your
                            links. Thanks to this, you can learn about the habits and preferences of your users and customers. This allows you to
                            improve and increase the click-through rate of your links to get the highest possible click-through and visit rates for
                            your website or store, and this will increase your sales. In addition, thanks to the ability to independently set
                            uniqueness in the link click-through analysis, you have one of the most advanced link management platforms at your
                            disposal. See features and pricing
                        </h1>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
