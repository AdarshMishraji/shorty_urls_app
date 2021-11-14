import React, { useContext, useEffect, useState } from "react";
import validator from "validator";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context as AuthContext } from "../context";
import { useHistory } from "react-router";
import { Authorization, BASE_URL } from "../configs/constants";
import { URLItem, ModalContainer, toastConfig } from "../component/URLItems";
import { useCallback } from "react/cjs/react.development";

export const URLs = () => {
    const [loading, setLoading] = useState();
    const [limit, setLimit] = useState("10");
    const [skipCount, setSkipCount] = useState(0);
    const [error, setError] = useState("");
    const [urls, setURLs] = useState([]);
    const [modalContent, setModalContent] = useState();

    const { state, tryLocalLogin } = useContext(AuthContext);
    const nav = useHistory();

    const fetchHistory = useCallback(() => {
        if ((validator.isInt(limit) && parseInt(limit) >= 0) || limit === "") {
            setLoading(true);
            const url = `${BASE_URL}urls${limit === "" ? "?limit=" : "?limit=" + limit}`;
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
                        setURLs(value.data.urls);
                    })
                    .catch((e) => {
                        console.log(e);
                        toast("😵 Internal Error", {
                            type: "error",
                            ...toastConfig,
                        });
                    })
                    .finally(() => setLoading(false));
            } else {
                setError("Limit must be positive integer.");
            }
        }
    }, [state]);

    useEffect(() => {
        tryLocalLogin(
            () => {
                if (state.token) fetchHistory();
            },
            () => {
                nav.replace("/login");
            }
        );
    }, [state.token]);

    return (
        <div className="bg-white z-10">
            <ToastContainer className="z-50 text-center" />
            <div
                className="flex flex-col items-center justify-center mb-5 rounded-b-2xl"
                style={{ background: "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)", boxShadow: "0px 5px 40px 2px blue", paddingBottom: 70 }}
            ></div>
            {loading ? (
                <div className="flex items-center justify-center" style={{ opacity: 0.7 }}>
                    <div className="spinner-grow mr-3" role="status" style={{ color: "black", height: 75, width: 75 }}>
                        <span class="sr-only">Loading...</span>
                    </div>
                    <h1>Fetching Your URLs</h1>
                </div>
            ) : (
                <div className="flex flex-col list">
                    {urls.length == 0 && (
                        <div>
                            <h1 className="text-blue-500 text-2xl overflow-scroll text-center mb-3">No URLs found</h1>
                            <h1 className="text-9xl text-center">😵</h1>
                        </div>
                    )}
                    {urls?.map((ele, index) => (
                        <URLItem index={index} item={ele} key={ele._id} setModalContent={setModalContent} reFetch={() => fetchHistory()} />
                    ))}
                </div>
            )}
            <ModalContainer onClose={() => setModalContent()} children={modalContent} />
        </div>
    );
};
