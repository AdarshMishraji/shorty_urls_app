import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../context";
import { toastConfig } from "../configs";
import { Header, Loader, ModalContainer, URLItem } from "../component";
import { fetchMyURLs } from "../api";
import { afterTokenExpire } from "../helpers";

const URLs = () => {
    const [loading, setLoading] = React.useState();
    const [urls, setURLs] = React.useState([]);
    const [isAtEnd, setIsAtEnd] = React.useState(false);
    const [modalContent, setModalContent] = React.useState();
    const [hasMore, setMore] = React.useState(true);

    const { state, tryLocalLogin, clearUserData } = React.useContext(AuthContext);
    const history = useHistory();

    const observer = React.useRef();

    const fetchHistory = React.useCallback(
        (skipCount, query) => {
            if (state.token) {
                fetchMyURLs(
                    10,
                    skipCount,
                    query,
                    state.token,
                    (value) => {
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
                        setIsAtEnd(false);
                    }
                );
            }
        },
        [urls, state]
    );

    React.useEffect(() => {
        window.scrollTo({ top: 0 });
        tryLocalLogin(
            () => {
                if (state.token) {
                    setLoading(true);
                    fetchHistory();
                }
            },
            () => {
                history.replace("/login");
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
                    if (state.token) fetchHistory(urls?.length);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, urls.length, hasMore]
    );

    return (
        <div className="z-10">
            <ToastContainer className="z-50 text-center" />
            <Header requireBackground />
            <div className="flex flex-col mt-20 md:mx-5 lg:mx-40 min-h-screen">
                <Loader display={loading} requiredButton />
                {loading ? null : (
                    <div className="flex flex-col list" onScroll={(e) => {}}>
                        {urls?.length === 0 && (
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
                                        showBtn={true}
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
                                        showBtn={true}
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
