import * as React from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context as AuthContext } from "../context";
import { useHistory } from "react-router";
import { Authorization, BASE_URL } from "../configs/constants";
import { URLItem, ModalContainer, toastConfig } from "../component/URLItems";
import Header from "../component/Header";

const URLs = () => {
    const [loading, setLoading] = React.useState();
    const [urls, setURLs] = React.useState([]);
    const [isAtEnd, setIsAtEnd] = React.useState(false);
    const [modalContent, setModalContent] = React.useState();
    const [hasMore, setMore] = React.useState(true);

    const { state, tryLocalLogin } = React.useContext(AuthContext);
    const nav = useHistory();

    const observer = React.useRef();

    const fetchHistory = React.useCallback(
        (skipCount) => {
            const url = `${BASE_URL}urls?limit=10&skip=${skipCount}`;
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
                        if (value.data?.urls.length === 0) {
                            setMore(false);
                        } else {
                            if (skipCount) setURLs([...urls, ...value.data.urls]);
                            else {
                                setURLs(value.data.urls);
                            }
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                        toast("😵 Internal Error", {
                            type: "error",
                            ...toastConfig,
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                        setIsAtEnd(false);
                    });
            }
        },
        [urls, state]
    );

    React.useEffect(() => {
        tryLocalLogin(
            () => {
                if (state.token) {
                    setLoading(true);
                    fetchHistory();
                }
            },
            () => {
                nav.replace("/login");
            }
        );
    }, [state.token]);

    const lastElementRef = React.useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setIsAtEnd(true);
                    console.log("at end");
                    if (state.token) fetchHistory(urls.length);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, urls.length, hasMore]
    );

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
                        <h1>Fetching Your URLs</h1>
                    </div>
                ) : (
                    <div className="flex flex-col list lg:mx-40" onScroll={(e) => {}}>
                        {urls.length == 0 && (
                            <div>
                                <h1 className="text-blue-500 text-2xl overflow-scroll text-center mb-3">No URLs found</h1>
                                <h1 className="text-9xl text-center">😵</h1>
                            </div>
                        )}
                        {urls?.map((ele, index) => {
                            if (index === urls.length - 1) {
                                return (
                                    <URLItem
                                        item={ele}
                                        key={index}
                                        setModalContent={setModalContent}
                                        reFetch={() => fetchHistory()}
                                        index={index}
                                        ref={lastElementRef}
                                        showBtn
                                    />
                                );
                            } else {
                                return (
                                    <URLItem
                                        item={ele}
                                        key={index}
                                        setModalContent={setModalContent}
                                        reFetch={() => fetchHistory()}
                                        index={index}
                                        showBtn
                                    />
                                );
                            }
                        })}
                        {isAtEnd ? (
                            <div className="w-full md:w-3/5 mx-auto p-4 text-center mb-4">
                                <h1 className="text-blue-500 text-2xl overflow-scroll text-center mb-3">Loading...</h1>
                                <svg
                                    class="animate-spin h-8 w-8 mx-auto text-blue-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            </div>
                        ) : (
                            <div className="mb-2">
                                {urls.length ? (
                                    <div>
                                        <h1 className="text-blue-500 text-2xl overflow-scroll text-center mb-3">No More is Here</h1>
                                        <h1 className="text-5xl text-center">😵</h1>
                                    </div>
                                ) : null}
                            </div>
                        )}
                        <ModalContainer onClose={() => setModalContent()} children={modalContent} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default URLs;
