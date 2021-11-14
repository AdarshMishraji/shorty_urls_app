import React, { useContext, useEffect, useRef, useState } from "react";
import validator from "validator";
import axios from "axios";
import copy from "copy-to-clipboard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import qr from "qrcode";
import ReactTooltip from "react-tooltip";

import ThemedButton from "../component/ThemedButton";
import HistoryDetailsModal from "../component/HistoryDetailsModal";
import { Context as AuthContext } from "../context";
import { useHistory } from "react-router";
import { Authorization, BASE_URL } from "../configs/constants";
import { ToggleSwitch } from "../component/ToggleSwitch";

import Copy from "../assets/svgs/copy.svg";
import Delete from "../assets/svgs/delete.svg";
import Clock from "../assets/svgs/clock.svg";
import Key from "../assets/svgs/key.svg";
import KeyOff from "../assets/svgs/keyoff.svg";
import QrCode from "../assets/svgs/qrcode.svg";
import Edit from "../assets/svgs/edit.svg";
import Warning from "../assets/svgs/warning.svg";
import ChangePassword from "../assets/svgs/changePassword.svg";
import { Dropdown, Option } from "../component/Dropdown";
import { useOutsideAlerter } from "../hooks";

const toastConfig = {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const ModalContainer = ({ onClose, children }) => {
    return (
        <div
            className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50"
            style={{
                display: children ? "flex" : "none",
            }}
        >
            <div
                style={{ boxShadow: "0px 0px 15px 0.5px blue", width: "95vw" }}
                className="p-3 rounded-xl bg-white z-20 flex items-center justify-center mx-5 md:max-w-md"
            >
                {children}
            </div>
            <div
                className="w-full h-full z-10 absolute top-0 right-0 bottom-0 left-0"
                style={{
                    backgroundColor: "rgba(0,0,0,0.25)",
                    transition: "1s ease-in-out",
                }}
                onClick={onClose}
            ></div>
        </div>
    );
};

const ExpirationModalContent = ({ onSelect, onClose }) => {
    const [type, setType] = useState(0);
    const [afterIndex, setAfterIndex] = useState(0);

    const [days, setDays] = useState(1);
    const [months, setMonths] = useState(1);
    const [years, setYears] = useState(1);

    let daysRef = React.createRef();
    let monthsRef = React.createRef();
    let yearsRef = React.createRef();

    const [daysOpen, setDaysOpen] = useState(false);
    const [monthsOpen, setMonthsOpen] = useState(false);
    const [yearsOpen, setYearsOpen] = useState(false);

    const [timestamp, setTimestamp] = useState();

    useOutsideAlerter(daysRef, () => {
        setDaysOpen(false);
    });
    useOutsideAlerter(monthsRef, () => {
        setMonthsOpen(false);
    });
    useOutsideAlerter(yearsRef, () => {
        setYearsOpen(false);
    });

    return (
        <div className="mx-3">
            <ReactTooltip />
            <div className="flex flex-col items-start">
                <div>
                    <div onClick={() => setType(0)} className="cursor-pointer">
                        <input type="radio" title="After" name="type" checked={type === 0} />{" "}
                        <span className="text-xl text-blue-500 font-bold inline ml-2">After</span>
                    </div>
                    <div className="flex flex-wrap" style={{ opacity: type === 0 ? 1 : 0.5 }}>
                        <Dropdown
                            ref={daysRef}
                            isDown
                            isOpen={daysOpen}
                            isVisible={true}
                            onSelect={() => {
                                if (type === 0) {
                                    setAfterIndex(0);
                                    setMonthsOpen(false);
                                    setYearsOpen(false);
                                    setDaysOpen(!daysOpen);
                                }
                            }}
                            value={days}
                            title="Days"
                            disabled={afterIndex !== 0}
                        >
                            {Array(30)
                                .fill()
                                .map((_, index) => {
                                    return (
                                        <Option
                                            text={1 + index}
                                            onClick={() => {
                                                setDays(1 + index);
                                            }}
                                            last={index === 29}
                                        />
                                    );
                                })}
                        </Dropdown>
                        <Dropdown
                            data-tip="Month is considered as 30 days"
                            ref={monthsRef}
                            isDown
                            isOpen={monthsOpen}
                            isVisible={true}
                            onSelect={() => {
                                if (type === 0) {
                                    setAfterIndex(1);
                                    setDaysOpen(false);
                                    setYearsOpen(false);
                                    setMonthsOpen(!monthsOpen);
                                }
                            }}
                            value={months}
                            title="Months"
                            disabled={afterIndex !== 1}
                        >
                            {Array(12)
                                .fill()
                                .map((_, index) => {
                                    return (
                                        <Option
                                            text={1 + index}
                                            onClick={() => {
                                                setMonths(1 + index);
                                            }}
                                            last={index === 11}
                                        />
                                    );
                                })}
                        </Dropdown>
                        <Dropdown
                            data-tip="Year is considered as 365 days"
                            ref={yearsRef}
                            isDown
                            isOpen={yearsOpen}
                            isVisible={true}
                            onSelect={() => {
                                if (type === 0) {
                                    setAfterIndex(2);
                                    setDaysOpen(false);
                                    setMonthsOpen(false);
                                    setYearsOpen(!yearsOpen);
                                }
                            }}
                            value={years}
                            title="Years"
                            disabled={afterIndex !== 2}
                        >
                            {Array(5)
                                .fill()
                                .map((_, index) => {
                                    return (
                                        <Option
                                            text={index === 4 ? "Infinite" : 1 + index}
                                            onClick={() => {
                                                if (index <= 4) setYears(1 + index);
                                                else setYears("Infinite");
                                            }}
                                            last={index === 4}
                                        />
                                    );
                                })}
                        </Dropdown>
                    </div>
                </div>
                <div className="mt-3">
                    <div onClick={() => setType(1)} className="cursor-pointer">
                        <input type="radio" title="Select Date-Time" name="type" checked={type === 1} height={50} width={50} />
                        <span className="text-xl text-blue-500 font-bold inline ml-2">Select Date-Time</span>
                    </div>
                    <div style={{ opacity: type === 1 ? 1 : 0.5 }} className="ml-3 mt-2">
                        <input
                            defaultValue={Date.now() + 10800}
                            disabled={type === 0}
                            type="datetime-local"
                            className="border-2 p-2 rounded-xl border-blue-400"
                            onChange={(e) => {
                                if (e.target.valueAsNumber - Date.now() > 10800) setTimestamp(e.target.valueAsNumber);
                                else {
                                    e.target.value = "";
                                    toast("🤨 Select expiration time after 3 Hrs", {
                                        type: "error",
                                        ...toastConfig,
                                        position: "top-center",
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center mt-3 self-center">
                    <div
                        className="flex justify-between items-center text-xl py-2 px-3 mx-2 rounded-xl bg-gray-500 text-white cursor-pointer"
                        onClick={onClose}
                    >
                        <h1>Cancel</h1>
                    </div>
                    <div
                        className="flex justify-between items-center text-xl py-2 px-3 mx-2 rounded-xl bg-green-500 text-white cursor-pointer"
                        onClick={() => {
                            const current = Date.now();
                            onSelect(
                                type === 0
                                    ? afterIndex === 0
                                        ? current + days * 86400000
                                        : afterIndex === 1
                                        ? current + months * 2592000000
                                        : afterIndex === 2
                                        ? years !== "Infinite"
                                            ? current + years * 31536000000
                                            : years
                                        : null
                                    : type === 1
                                    ? timestamp
                                    : null
                            );
                        }}
                    >
                        <h1>OK</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

const URLItem = ({ item, index, setModalContent, reFetch }) => {
    const [active, setActive] = useState(item.is_active);
    const [isPasswordProtected, setPasswordProtected] = useState(Boolean(item?.protection?.password));
    const [expirationTime, setExpirationTime] = useState(item?.expired_at);
    const [disabled, setDisabled] = useState(false);
    const { state } = useContext(AuthContext);

    let copyRef = useRef();
    let keyoffRef = useRef();
    let keyeditRef = useRef();
    let keyRef = useRef();
    let editRef = useRef();
    let timerRef = useRef();
    let qrcodeRef = useRef();
    let deletRef = useRef();

    const onChangeStatus = (status) => {
        setDisabled(true);
        axios
            .patch(
                `${BASE_URL}update_url_status`,
                { urlID: item._id, status },
                {
                    headers: {
                        Authorization,
                        accessToken: state.token,
                    },
                }
            )
            .then((val) => {
                setActive(status);
                setDisabled(false);
            })
            .catch((e) => {
                console.log(e);
                setDisabled(false);
                toast("😵 Internal Error", {
                    type: "error",
                    ...toastConfig,
                });
            });
    };

    const onDelete = () => {
        setDisabled(true);
        axios
            .delete(`${BASE_URL}delete_url`, {
                data: {
                    urlID: item._id,
                },
                headers: {
                    Authorization,
                    accessToken: state.token,
                },
            })
            .then((val) => {
                setDisabled(false);
                reFetch();
            })
            .catch((e) => {
                console.log(e);
                setDisabled(false);
                toast("😵 Internal Error", {
                    type: "error",
                    ...toastConfig,
                });
            })
            .finally(() => {
                setModalContent();
            });
    };

    const setPassword = (password) => {
        setDisabled(true);
        axios
            .patch(
                `${BASE_URL}update_password`,
                { urlID: item._id, password },
                {
                    headers: {
                        Authorization,
                        accessToken: state.token,
                    },
                }
            )
            .then((val) => {
                setDisabled(false);
                setPasswordProtected(true);
            })
            .catch((e) => {
                console.log(e);
                setDisabled(false);
                toast("😵 Internal Error", {
                    type: "error",
                    ...toastConfig,
                });
            })
            .finally(() => {
                setModalContent();
            });
    };

    const onRemovePassword = () => {
        setDisabled(true);
        axios
            .delete(`${BASE_URL}remove_password`, {
                headers: {
                    Authorization,
                    accessToken: state.token,
                },
                data: {
                    urlID: item._id,
                },
            })
            .then((val) => {
                setDisabled(false);
                setPasswordProtected(false);
            })
            .catch((e) => {
                console.log(e);
                setDisabled(false);
                toast("😵 Internal Error", {
                    type: "error",
                    ...toastConfig,
                });
            })
            .finally(() => {
                setModalContent();
            });
    };

    const setExpireDuration = (expired_at) => {
        setDisabled(true);
        axios
            .patch(
                `${BASE_URL}set_expiration_time`,
                {
                    urlID: item._id,
                    expired_at,
                },
                {
                    headers: {
                        Authorization,
                        accessToken: state.token,
                    },
                }
            )
            .then((val) => {
                setExpirationTime(expired_at);
                setDisabled(false);
            })
            .catch((e) => {
                console.log(e);
                setDisabled(false);
                toast("😵 Internal Error", {
                    type: "error",
                    ...toastConfig,
                });
            })
            .finally(() => {
                setModalContent();
            });
    };

    return (
        <div className="flex flex-col border-2 p-3 rounded-xl m-3 text-xl" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
            <ReactTooltip />
            <div className="relative">
                <div className="flex justify-between items-center">
                    <ToggleSwitch isActive={active} setStatus={onChangeStatus} className="mb-3" disbled={disabled} />
                    {disabled ? (
                        <div className="flex items-center justify-center" style={{ opacity: 0.7 }}>
                            <div className="spinner-grow mr-3" role="status" style={{ color: "black", height: 35, width: 35 }}>
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className="border-b-2 pb-3">
                    <h1 className="text-gray-800 font-bold overflow-scroll whitespace-nowrap py-1">{item.title}</h1>
                    <h1 className="text-gray-500 font-bold overflow-scroll whitespace-nowrap pt-1 pb-3">{item.description}</h1>
                    <h1 className="text-gray-500 overflow-scroll whitespace-nowrap">{item.url}</h1>
                    <h1 className="text-blue-500 overflow-scroll whitespace-nowrap">{item.short_url}</h1>
                    {expirationTime ? (
                        <h1 className="text-blue-500 overflow-scroll whitespace-nowrap mt-2">
                            <span className="text-gray-700">Expired At: </span> {new Date(item?.expired_at).toString()}
                        </h1>
                    ) : null}
                </div>
                <div className="flex items-center mt-2 justify-between">
                    <div className="flex items-center overflow-scroll whitespace-nowrap">
                        <img
                            ref={copyRef}
                            src={Copy}
                            height="30"
                            width="30"
                            data-tip="Copy the URL"
                            className="mr-3 cursor-pointer"
                            onClick={() => {
                                copy(item.short_url);
                                toast("👍 Copied", {
                                    type: "success",
                                    ...toastConfig,
                                });
                            }}
                        />
                        {isPasswordProtected ? (
                            <div className="flex">
                                <img
                                    data-tip="Remove Password Protection"
                                    ref={keyoffRef}
                                    src={KeyOff}
                                    height="30"
                                    width="30"
                                    className="mr-3 cursor-pointer"
                                    onClick={() => {
                                        setModalContent(
                                            <div className="flex flex-col items-center justify-center">
                                                <img src={Warning} height={75} width={75} />
                                                <h1 className="text-red-500 overflow-scroll text-center">
                                                    Are you sure to remove password protection for this url?
                                                </h1>
                                                <div className="flex items-center mt-2">
                                                    <div
                                                        className="flex justify-between items-center text-xl py-2 px-3 mx-2 rounded-xl bg-green-500 text-white cursor-pointer"
                                                        onClick={() => setModalContent()}
                                                    >
                                                        <h1>No</h1>
                                                    </div>
                                                    <div
                                                        className="flex justify-between items-center text-xl py-2 px-3 mx-2 rounded-xl bg-red-500 text-white cursor-pointer"
                                                        onClick={() => {
                                                            if (!disabled) onRemovePassword();
                                                        }}
                                                    >
                                                        <h1>Yes</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                                <img
                                    data-tip="Update Password"
                                    ref={keyeditRef}
                                    src={ChangePassword}
                                    height="30"
                                    width="30"
                                    className="mr-3 cursor-pointer"
                                    onClick={() => {
                                        setModalContent();
                                    }}
                                />
                            </div>
                        ) : (
                            <img
                                data-tip="Add Password Protection"
                                src={Key}
                                ref={keyRef}
                                height="30"
                                width="30"
                                className="mr-3 cursor-pointer"
                                onClick={() => {}}
                            />
                        )}
                        <img
                            data-tip="Edit Title, Description, Alias Name"
                            ref={editRef}
                            src={Edit}
                            height="30"
                            width="30"
                            className="mr-3 cursor-pointer"
                        />
                        <img
                            data-tip="Set Expiration Time"
                            ref={timerRef}
                            src={Clock}
                            height="30"
                            width="30"
                            className="mr-3 cursor-pointer"
                            onClick={() => {
                                setModalContent(
                                    <ExpirationModalContent
                                        onClose={() => setModalContent()}
                                        onSelect={(res) => {
                                            setExpireDuration(res);
                                        }}
                                    />
                                );
                            }}
                        />
                        <img
                            data-tip="Show QR Code"
                            ref={qrcodeRef}
                            src={QrCode}
                            height="30"
                            width="30"
                            className="mr-3 cursor-pointer"
                            onClick={() => {
                                if (!disabled)
                                    qr.toDataURL(item.short_url, { type: "image/png" }).then((value) => {
                                        setModalContent(
                                            <div className="flex flex-col items-center justify-center">
                                                <img src={value} className="md:h-64 md:w-64 w-40 h-40" />
                                                <h1 className="text-blue-500 overflow-scroll text-center" aria-multiline>
                                                    {item.short_url}
                                                </h1>
                                            </div>
                                        );
                                    });
                            }}
                        />
                        <img
                            data-tip="Delete the URL"
                            ref={deletRef}
                            src={Delete}
                            height="30"
                            width="30"
                            className="mr-3 cursor-pointer"
                            onClick={() => {
                                if (!disabled) {
                                    setModalContent(
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={Warning} height={75} width={75} />
                                            <h1 className="text-red-500 overflow-scroll whitespace-nowrap">Are you sure to delete?</h1>
                                            <div className="flex items-center mt-2">
                                                <div
                                                    className="flex justify-between items-center text-xl py-2 px-3 mx-2 rounded-xl bg-green-500 text-white cursor-pointer"
                                                    onClick={() => setModalContent()}
                                                >
                                                    <h1>No</h1>
                                                </div>
                                                <div
                                                    className="flex justify-between items-center text-xl py-2 px-3 mx-2 rounded-xl bg-red-500 text-white cursor-pointer"
                                                    onClick={onDelete}
                                                >
                                                    <h1>Yes</h1>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            }}
                        />
                    </div>
                    <div className="bg-blue-500 text-white rounded-xl p-2 cursor-pointer" style={{ boxShadow: "0px 0px 10px 0.25px blue" }}>
                        Statistics
                    </div>
                </div>
                {expirationTime && expirationTime < Date.now() ? (
                    <div className="flex flex-col items-center justify-center flex-1">
                        <h1>Link has Expired</h1>
                        <div
                            className="flex justify-between items-center text-xl py-2 px-3 mx-2 rounded-xl bg-green-500 text-white cursor-pointer my-2"
                            onClick={() =>
                                setModalContent(
                                    <ExpirationModalContent
                                        onClose={() => setModalContent()}
                                        onSelect={(res) => {
                                            setExpireDuration(res);
                                        }}
                                    />
                                )
                            }
                        >
                            <h1>Make Me Alive!</h1>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export const URLs = () => {
    const [loading, setLoading] = useState();
    const [limit, setLimit] = useState("10");
    const [error, setError] = useState("");
    const [urls, setURLs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [modalContent, setModalContent] = useState();

    const { state, tryLocalLogin } = useContext(AuthContext);
    const nav = useHistory();

    const fetchHistory = () => {
        setError("");
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
                        let dataToSend = [];
                        for (let i = 0; i < value.data.urls.length; i++) {
                            const { created_at } = value.data.urls[i];
                            const dateString = new Date(created_at);
                            const created_at_date = dateString.getDate();
                            const created_at_month = dateString.getMonth();
                            const created_at_year = dateString.getFullYear();
                            const created_at_hour = dateString.getHours();
                            const created_at_min = dateString.getMinutes();

                            dataToSend.push({
                                ...value.data.urls[i],
                                created_at: `${created_at_date}/${created_at_month}/${created_at_year} - ${created_at_hour}:${created_at_min}`,
                            });
                        }
                        console.log("value", dataToSend);
                        setURLs(dataToSend);
                    })
                    .catch((e) => {
                        console.log(e);
                        setError("Unable to fetch urls.");
                    })
                    .finally(() => setLoading(false));
            } else {
                setError("Limit must be positive integer.");
            }
        }
    };

    useEffect(() => {
        // document.querySelector("canvas").toDataURL();
        tryLocalLogin(
            () => {
                // if (state.token) fetchHistory();
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
                    {urls?.map((ele, index) => (
                        <URLItem index={index} item={ele} key={ele._id} setModalContent={setModalContent} reFetch={() => fetchHistory()} />
                    ))}
                </div>
            )}
            {/* 
                    <div class="historyBox mainbox">
                        <h1 style={{ marginBottom: 10 }}>History</h1>
                        {urls.length > 0 ? (
                            <div class="urls-table">
                                <div class="table-row table-header">
                                    <input class="column column1 header-col" value="URL" disabled />
                                    <span> | </span>
                                    <input class="column column2 header-col" value="Short URL" contentEditable="false" disabled />
                                    <span> | </span>
                                    <input class="column column3 header-col" value="Created At" disabled />
                                    <span> | </span>
                                    <input class="column column4 header-col" value="Visits" disabled />
                                </div>
                                <div class="table-data-root">
                                    {urls.map((data, index) => {
                                        return (
                                            <div
                                                class="table-row"
                                                key={index}
                                                onClick={() => {
                                                    setHistoryIndex(index);
                                                    setShowModal(true);
                                                    console.log("clicking", index, showModal);
                                                }}
                                            >
                                                <input title={data.url} class="column column1" value={data.url} contentEditable={false} disabled />
                                                <span> | </span>
                                                <input
                                                    class="column column2"
                                                    value={data.short_url}
                                                    title={data.short_url}
                                                    contentEditable={false}
                                                    disabled
                                                />
                                                <span> | </span>
                                                <input class="column column3" value={data.created_at} contentEditable={false} disabled />
                                                <span> | </span>
                                                <input class="column column4" value={data.num_of_visits} contentEditable={false} disabled />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div class="mainbox-footer">
                                    <div>
                                        <p class="error">{error}</p>
                                    </div>
                                    <div class="div_2">
                                        <label>Limit: </label>
                                        <input
                                            class="number-input"
                                            value={limit}
                                            placeholder="All"
                                            onChange={(e) => {
                                                if (e.target.value <= 0) {
                                                    setLimit("");
                                                } else {
                                                    setLimit(e.target.value);
                                                }
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    fetchHistory();
                                                }
                                            }}
                                        />
                                        <ThemedButton title="Fetch" onClickHandler={fetchHistory} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p class="no-urls">No URLs</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Footer name={state.name} />
            <HistoryDetailsModal
                data={historyIndex !== -1 ? urls[historyIndex] : null}
                visible={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
                fetchHistory={fetchHistory}
            /> */}
            <ModalContainer onClose={() => setModalContent()} children={modalContent} />
        </div>
    );
};
