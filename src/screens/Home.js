import { useContext, useEffect, useRef, useState } from "react";
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
import BackgroundWave from "../assets/svgs/BackgroundWave.svg";
import Logo from "../assets/images/logo.png";
import Footer from "../component/Footer";
import { ClicksGraph } from "../component/ClicksGraph";
import { Stats } from "../component/Stats";

const makeURLValid = (url) => {
    let temp = url;
    if (temp.search("https://") === -1 && temp.search("http://") === -1) {
        const www_index = temp.search("www");
        if (www_index !== -1) {
            temp = temp.replace("www.", "");
        }
        return "https://" + temp;
    }
    return;
};

const isURLExists = async (url) => {
    // return await urlExists(url);
    return true;
};

export const Home = () => {
    const currDate = new Date();
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [short_url, set_short_url] = useState();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [meta, setMeta] = useState({});
    let textRef = useRef();

    const { state, tryLocalLogin } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        tryLocalLogin(
            () => {
                // history.replace("/home");
            },
            () => {
                history.replace("/login");
            }
        );
        textRef.current.focus();
    }, []);

    useEffect(() => {
        if (state.token) {
            axios
                .get(`${BASE_URL}meta`, {
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
        }
    }, [state]);

    console.log(state);
    const onSubmit = async () => {
        setLoading(true);
        set_short_url();
        if (url) {
            if (validator.isURL(url)) {
                const newURL = makeURLValid(url);
                if (await isURLExists(newURL)) {
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
                        })
                        .catch((e) => {
                            console.log("error", e.response);
                            if (e.response) {
                                if (e.response.status === 409) {
                                    set_short_url(e.response.data.short_url);
                                } else {
                                    setError("Unable to short this url. Try again.");
                                }
                            } else {
                                setError("Unable to short this url. Try again.");
                            }
                        })
                        .finally(() => setLoading(false));
                    console.log("image exists");
                } else {
                    console.log("url not exists");
                    setLoading(false);
                    setError("URL doesn't exists");
                }
            } else {
                console.log("invalid url");
                setLoading(false);
                setError("Enter valid URL");
            }
        } else {
            setLoading(false);
            setError("Empty url not accepted.");
        }
    };

    const onCopy = () => {
        copy(short_url);
        setSuccess("URL Copied!");
        setTimeout(() => {
            setSuccess("");
        }, 2000);
    };

    const onOpenURL = () => {
        window.open(short_url, "_blank");
    };

    return (
        <div className="bg-white z-10">
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
                            <ThemedButton title="Shorten" onClickHandler={onSubmit} />
                        )}
                    </div>
                    <div
                        className="flex flex-col items-center justify-center bg-white rounded-2xl px-3 py-2 mx-2"
                        style={{ display: error || short_url ? "flex" : "none", zIndex: 2 }}
                    >
                        <p className="text-red-600 text-xl text-center">{error}</p>
                        {short_url ? (
                            <div className="flex flex-col w-full">
                                <input
                                    className="text-xl text-white bg-gray-600 py-2 rounded-xl px-3 my-2 w-full"
                                    value={short_url}
                                    contentEditable={false}
                                />
                                <p className="text-blue-600 text-xl text-center mb-2">{success}</p>
                                <div className="flex justify-around items-center">
                                    <ThemedButton title="Copy" onClickHandler={onCopy} />
                                    <ThemedButton title="Open" onClickHandler={onOpenURL} />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="flex flex-col self-center bg-white text-white p-3">
                <div className="flex md:flex-row flex-col border-2 p-2 rounded-xl mb-3" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
                    <Stats title="ALL URLS" value={meta?.allLinks} icon={Logo} color="bg-green-200" />
                    <Stats title="TOTAL CLICKS" value={meta?.allClicks} icon={Cursor} color="bg-blue-200" />
                    <Stats
                        title="LINKS ADDED THIS MONTH"
                        value={meta?.monthlyClicks?.[currDate.getFullYear()]?.[currDate.toLocaleString("default", { month: "long" })]}
                        icon={NewLink}
                        color="bg-blue-200"
                    />
                </div>
                <div className="flex flex-col border-2 p-2 rounded-xl mb-3" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
                    <h1 className="text-xl text-gray-500 font-bold mb-2">
                        <img src={Cursor} height="35" width="35" className="bg-blue-300 rounded-full p-2 mr-2 inline" />
                        Monthly Clicks (This Year)
                    </h1>
                    <ClicksGraph data={meta?.monthlyClicks?.[currDate.getFullYear()]} />
                </div>
            </div>
            <Footer />
        </div>
    );
};
