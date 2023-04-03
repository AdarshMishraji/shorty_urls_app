import * as React from "react";
import validator from "validator";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { AuthContext, ThemeContext } from "../context";
import { toastConfig } from "../configs";
import { ClicksGraph, Container, Header, Stats, ThemedButton, TopLinks } from "../component";
import { fetchMeta, generateURL } from "../api";
import { desc } from "../constants";
import { afterTokenExpire } from "../helpers";

import { Link, Cursor, NewLink, URL } from "../assets";

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

const Home = React.memo(() => {
    const currDate = new Date();
    const [url, setUrl] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [short_url, set_short_url] = React.useState();
    const [error, setError] = React.useState("");
    const [meta, setMeta] = React.useState({});
    let textRef = React.useRef();

    const { state, tryLocalLogin, clearUserData } = React.useContext(AuthContext);
    const {
        state: { theme },
    } = React.useContext(ThemeContext);
    const history = useHistory();

    const fetchMetaData = React.useCallback(
        (withoutAuth) => {
            if (withoutAuth || state.token)
                fetchMeta(
                    withoutAuth,
                    state.token,
                    (res) => {
                        setMeta(res.data);
                    },
                    (e) => {
                        toast("😵" + e?.response?.data?.error || "Internal Error", {
                            type: "error",
                            ...toastConfig,
                            theme,
                            onClose: () => {
                                afterTokenExpire(e, history, clearUserData);
                            },
                        });
                    }
                );
        },
        [state]
    );

    React.useEffect(() => {
        window.scrollTo({ top: 0 });
        tryLocalLogin(
            () => {
                if (state.token) fetchMetaData(false);
            },
            () => {
                fetchMetaData(true);
            }
        );
        textRef.current.focus();
    }, [state.token]);

    const onSubmit = React.useCallback(async () => {
        if (state.token) {
            setLoading(true);
            set_short_url();
            if (url) {
                if (validator.isURL(url)) {
                    const newURL = makeURLValid(url);
                    generateURL(
                        newURL,
                        state.token,
                        (value) => {
                            set_short_url(value.data.short_url);
                            toast("👍 Success", {
                                type: "success",
                                ...toastConfig,
                                theme,
                            });
                        },
                        (e) => {
                            if (e?.response?.status === 409) {
                                set_short_url(e.response.data.short_url);
                            }

                            toast("😵" + e?.response?.data?.error || "Internal Error", {
                                type: "error",
                                ...toastConfig,
                                theme,
                                onClose: () => {
                                    afterTokenExpire(e, history, clearUserData);
                                },
                            });
                        },
                        () => setLoading(false)
                    );
                } else {
                    setLoading(false);
                    setError("URL doesn't exists");
                    toast("😵 URL doesn't exists", {
                        type: "error",
                        ...toastConfig,
                        theme,
                    });
                }
            } else {
                setLoading(false);
                setError("Enter valid URL");
                toast("😵 Enter valid URL", {
                    type: "error",
                    ...toastConfig,
                    theme,
                });
            }
        } else {
            history.push("/login");
        }
    }, [state, url]);

    const onCopy = () => {
        navigator.clipboard.writeText(short_url);
        toast("👍 Copied", {
            type: "success",
            ...toastConfig,
            theme,
        });
    };

    const onOpenURL = () => {
        window.open(short_url, "_blank");
    };

    return (
        <div className="z-10">
            <ToastContainer />
            <Header requireBackground />
            <div
                className="flex flex-col items-center justify-center py-5 mb-5 rounded-b-2xl"
                style={{ background: "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)", boxShadow: "0px 5px 40px 2px blue" }}
            >
                <div className="flex flex-col items-center justify-center py-20 md:mx-0 mx-3">
                    <div className="absolute top-20 left-0" style={{ transform: "rotate(90deg)" }}>
                        <Link height={150} width={150} color="#ffffff40" />
                    </div>
                    <div className="absolute top-72 right-0" style={{ transform: "rotate(180deg)" }}>
                        <Link height={200} width={200} color="#ffffff40" />
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

            <div className="flex flex-col self-center text-white m-3 relative">
                <div className="lg:mx-40">
                    <Container>
                        <div className="flex flex-1 md:flex-row flex-col">
                            <Stats
                                title="ALL URLS"
                                value={meta?.all_links}
                                Icon={URL}
                                color="bg-green-400"
                                contentAvailable={meta?.all_links === 0 ? true : Boolean(meta?.all_links)}
                            />
                            <Stats
                                title="TOTAL CLICKS"
                                value={meta?.all_clicks}
                                Icon={Cursor}
                                color="bg-blue-400"
                                contentAvailable={meta?.all_clicks === 0 ? true : Boolean(meta?.all_clicks)}
                            />
                        </div>
                        <div className="flex flex-1 md:flex-row flex-col">
                            <Stats
                                title="LINKS ADDED THIS MONTH"
                                value={meta?.links_added?.[currDate.getFullYear()]?.[currDate.toLocaleString("default", { month: "long" })]?.count}
                                Icon={NewLink}
                                contentAvailable={Boolean(meta?.links_added)}
                                color="bg-red-400"
                            />
                            <Stats
                                title="LINKS ADDED THIS YEAR"
                                value={meta?.links_added?.[currDate.getFullYear()]?.count}
                                Icon={NewLink}
                                contentAvailable={Boolean(meta?.links_added)}
                                color="bg-yellow-400"
                            />
                        </div>
                        {state.token ? (
                            <div>
                                {meta?.top_three?.length > 0 ? (
                                    <h1 className="text-blue-500 text-2xl my-2 text-center border-t-2 pt-3 m-2">Most Clicked URLs</h1>
                                ) : null}
                                {meta?.top_three?.[0]?.url ? (
                                    <TopLinks
                                        title={meta?.top_three?.[0]?.title ?? ""}
                                        url={meta?.top_three?.[0]?.url ?? ""}
                                        short_url={meta?.top_three?.[0]?.short_url ?? ""}
                                        color="#FFD700"
                                    />
                                ) : null}
                                {meta?.top_three?.[1]?.url ? (
                                    <TopLinks
                                        title={meta?.top_three?.[1]?.title ?? ""}
                                        url={meta?.top_three?.[1]?.url ?? ""}
                                        short_url={meta?.top_three?.[1]?.short_url ?? ""}
                                        color="#C0C0C0"
                                    />
                                ) : null}
                                {meta?.top_three?.[2]?.url ? (
                                    <TopLinks
                                        title={meta?.top_three?.[2]?.title ?? ""}
                                        url={meta?.top_three?.[2]?.url ?? ""}
                                        short_url={meta?.top_three?.[2]?.short_url ?? ""}
                                        color="#CD7F32"
                                    />
                                ) : null}
                            </div>
                        ) : null}
                    </Container>
                    <Container className="mt-4">
                        <div className="flex items-center my-2">
                            <Cursor height="35px" width="35px" className="bg-blue-400 rounded-full p-2 mr-2 inline" />
                            <h1 className="text-2xl text-blue-500 font-bold inline">Clicks</h1>
                        </div>
                        <ClicksGraph data={meta?.clicks} />
                    </Container>
                </div>
                <div className="lg:mx-40">
                    <div className="text-center mx-3 mt-5 ">
                        <h1 className="text-xl my-3 text-gray-500">{desc}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Home;
