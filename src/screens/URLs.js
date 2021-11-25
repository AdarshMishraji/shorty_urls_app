import * as React from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router";

import { Context as AuthContext } from "../context";
import { Authorization, BASE_URL, toastConfig } from "../configs";
import { Header, Loader, ModalContainer, SearchBar, URLItem } from "../component";

const URLs = () => {
    const [loading, setLoading] = React.useState();
    const [urls, setURLs] = React.useState([]);
    const [isAtEnd, setIsAtEnd] = React.useState(false);
    const [modalContent, setModalContent] = React.useState();
    const [hasMore, setMore] = React.useState(true);
    const [isSearchMode, setSearchMode] = React.useState(false);

    const { state, tryLocalLogin } = React.useContext(AuthContext);
    const nav = useHistory();

    const observer = React.useRef();

    const fetchHistory = React.useCallback(
        (skipCount, query) => {
            const url = `${BASE_URL}urls?limit=10&skip=${skipCount}${query ? `&query=${query}` : null}`;
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
                            if (skipCount) {
                                const reversed = value.data?.urls?.reverse();
                                setURLs([...urls, ...reversed]);
                            } else {
                                setURLs(value.data?.urls?.reverse());
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
            if (isSearchMode && urls.length <= 10) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setIsAtEnd(true);
                    console.log("at end");
                    if (state.token) fetchHistory(urls?.length);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, isSearchMode, urls.length, hasMore]
    );

    return (
        <div className="bg-white z-10">
            <ToastContainer className="z-50 text-center" />
            <Header requireBackground />
            <div className="flex flex-col mt-20 md:mx-5 lg:mx-40">
                <SearchBar
                    isVisible={true}
                    onClose={() => {
                        setLoading(true);
                        setSearchMode(false);
                        setMore(true);
                        fetchHistory();
                    }}
                    onSubmit={(query) => {
                        if (urls.length === 0) {
                            return;
                        }
                        setLoading(true);
                        setURLs([]);
                        setSearchMode(true);
                        fetchHistory(undefined, query);
                    }}
                />
                <Loader display={loading} />
                {loading ? null : (
                    <div className="flex flex-col list" onScroll={(e) => {}}>
                        {urls?.length == 0 && (
                            <div>
                                <h1 className="text-blue-500 text-2xl overflow-scroll text-center mb-3">No URLs found</h1>
                                <h1 className="text-9xl text-center">😵</h1>
                            </div>
                        )}
                        {urls?.map((ele, index) => {
                            if (index === urls?.length - 1) {
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
                        <Loader display={isAtEnd} />
                        <div className="mb-2 items-center justify-center" style={{ display: isAtEnd ? "none" : "flex" }}>
                            <div style={{ display: urls?.length ? "flex" : "none" }} className="flex flex-col items-center justify-center">
                                <h1 className="text-blue-500 text-2xl overflow-scroll text-center mb-3">No More is Here</h1>
                                <h1 className="text-5xl text-center">😵</h1>
                            </div>
                        </div>
                        <ModalContainer onClose={() => setModalContent()} children={modalContent} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default URLs;
