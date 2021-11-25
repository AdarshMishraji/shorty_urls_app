import * as React from "react";
import qr from "qrcode";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router";
import moment from "moment";

import { Context as AuthContext } from "../context";
import { Dropdown, ToggleSwitch, Option, ThemedButton } from ".";
import { useOutsideAlerter } from "../hooks";

import Copy from "../assets/svgs/copy.svg";
import Delete from "../assets/svgs/delete.svg";
import Clock from "../assets/svgs/clock.svg";
import Key from "../assets/svgs/key.svg";
import KeyOff from "../assets/svgs/keyoff.svg";
import QrCode from "../assets/svgs/qrcode.svg";
import Edit from "../assets/svgs/edit.svg";
import Warning from "../assets/svgs/warning.svg";
import ChangePassword from "../assets/svgs/changePassword.svg";
import { Authorization, BASE_URL, toastConfig } from "../configs";

export const ModalContainer = React.memo(({ onClose, children }) => {
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
});

export const ExpirationModalContent = React.memo(({ onSelect, onClose }) => {
    const [type, setType] = React.useState(0);
    const [afterIndex, setAfterIndex] = React.useState(0);

    const [days, setDays] = React.useState(1);
    const [months, setMonths] = React.useState(1);
    const [years, setYears] = React.useState(1);

    let daysRef = React.createRef();
    let monthsRef = React.createRef();
    let yearsRef = React.createRef();

    const [daysOpen, setDaysOpen] = React.useState(false);
    const [monthsOpen, setMonthsOpen] = React.useState(false);
    const [yearsOpen, setYearsOpen] = React.useState(false);

    const [timestamp, setTimestamp] = React.useState();

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
                                                if (index < 4) setYears(1 + index);
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
                            className="border-2 p-2 rounded-xl border-blue-400 outline-none"
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
                    <ThemedButton title="Cancel" onClickHandler={onClose} color="bg-gray-500" className="mx-2" />
                    <ThemedButton
                        title="OK"
                        onClickHandler={() => {
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
                        className="mx-2"
                        color="bg-green-500"
                    />
                </div>
            </div>
        </div>
    );
});

export const PasswordModalContent = React.memo(({ onClose, onSubmit }) => {
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-white text-2xl mb-2 text-center"></h1>Enter Password
            <div className="flex flex-col justify-between bg-white rounded-xl p-2 border-0 text-xl mb-2" style={{ zIndex: 2 }}>
                <input
                    className="outline-none focus:shadow-2xl rounded-xl pl-3 flex-1 mr-2 md:w-96 w-full border-b-2 mb-2"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <input
                    className="outline-none focus:shadow-2xl rounded-xl pl-3 flex-1 mr-2 md:w-96 w-full border-b-2"
                    placeholder="Confirm Password"
                    type="password"
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                />
                <div className="flex flex-row self-center mt-3">
                    <ThemedButton title="Cancel" onClickHandler={onClose} color="bg-gray-500" className="mx-2" />
                    <ThemedButton
                        title="OK"
                        onClickHandler={() => {
                            if (password.length >= 8) {
                                if (password === confirmPassword) {
                                    onSubmit(password);
                                } else {
                                    toast("🤨 Password is not same as Confirm Password", {
                                        type: "error",
                                        ...toastConfig,
                                        position: "top-center",
                                    });
                                }
                            } else {
                                toast("🤨 Password must be more than equals to 8 characters", {
                                    type: "error",
                                    ...toastConfig,
                                    position: "top-center",
                                });
                            }
                        }}
                        className="mx-2"
                        color="bg-green-500"
                    />
                </div>
            </div>
        </div>
    );
});

export const ChangeAliasModalContent = React.memo(({ prevAlias, onClose, onSubmit }) => {
    const [alias, setAlias] = React.useState(prevAlias);
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-gray-500 text-2xl mb-2 text-center">Change the Alias</h1>
            <div className="flex flex-col items-center justify-center rounded-2xl mx-2">
                <span className="border-2 p-2 overflow-scroll whitespace-nowrap rounded-2xl w-11/12">{BASE_URL}</span>
                <label className="mt-2 mb-1 text-gray-500 text-lg w-11/12 text-left pl-2">Alias</label>
                <input value={alias} onChange={(e) => setAlias(e.target.value)} className="outline-none p-2 rounded-2xl border-2 w-11/12" />
            </div>
            <div className="flex mt-3">
                <ThemedButton title="Cancel" onClickHandler={onClose} color="bg-gray-500" className="mx-2" />
                <ThemedButton
                    title="Change It"
                    onClickHandler={() => {
                        onSubmit(alias);
                    }}
                    className="mx-2"
                    color="bg-green-500"
                />
            </div>
        </div>
    );
});

export const URLItem = React.memo(
    React.forwardRef(({ item, index, setModalContent, reFetch, showBtn }, ref) => {
        const [active, setActive] = React.useState(item.is_active);
        const [isPasswordProtected, setPasswordProtected] = React.useState(Boolean(item?.protection?.password));
        const [expirationTime, setExpirationTime] = React.useState(item.expired_at);
        const [disabled, setDisabled] = React.useState(false);
        const [shortURL, setShortURL] = React.useState(item.short_url);
        const { state } = React.useContext(AuthContext);
        const nav = useHistory();

        let copyRef = React.useRef();
        let keyoffRef = React.useRef();
        let keyeditRef = React.useRef();
        let keyRef = React.useRef();
        let editRef = React.useRef();
        let timerRef = React.useRef();
        let qrcodeRef = React.useRef();
        let deletRef = React.useRef();

        const onChangeStatus = React.useCallback(
            (status) => {
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
                        toast("👍 Success", {
                            type: "success",
                            ...toastConfig,
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                        setDisabled(false);
                        toast("😵 " + e?.response?.data?.error, {
                            type: "error",
                            ...toastConfig,
                        });
                    });
            },
            [item, state]
        );

        const onDelete = React.useCallback(() => {
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
                    toast("👍 Success", {
                        type: "success",
                        ...toastConfig,
                    });
                })
                .catch((e) => {
                    console.log(e);
                    setDisabled(false);
                    toast("😵 " + e?.response?.data?.error, {
                        type: "error",
                        ...toastConfig,
                    });
                });
        }, [state, item]);

        const setPassword = React.useCallback(
            (password) => {
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
                        toast("👍 Success", {
                            type: "success",
                            ...toastConfig,
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                        setDisabled(false);
                        toast("😵 " + e?.response?.data?.error, {
                            type: "error",
                            ...toastConfig,
                        });
                    });
            },
            [state, item]
        );

        const onRemovePassword = React.useCallback(() => {
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
                    toast("👍 Success", {
                        type: "success",
                        ...toastConfig,
                    });
                })
                .catch((e) => {
                    console.log(e);
                    setDisabled(false);
                    toast("😵 " + e?.response?.data?.error, {
                        type: "error",
                        ...toastConfig,
                    });
                });
        }, [state, item]);

        const setExpireDuration = React.useCallback(
            (expired_at) => {
                setDisabled(true);
                axios
                    .patch(
                        `${BASE_URL}set_expiration_time`,
                        {
                            urlID: item._id,
                            expired_at: expired_at === "Infinite" ? false : expired_at,
                        },
                        {
                            headers: {
                                Authorization,
                                accessToken: state.token,
                            },
                        }
                    )
                    .then((val) => {
                        setExpirationTime(expired_at === "Infinite" ? false : expired_at);
                        setDisabled(false);
                        toast("👍 Success", {
                            type: "success",
                            ...toastConfig,
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                        setDisabled(false);
                        toast("😵 " + e?.response?.data?.error, {
                            type: "error",
                            ...toastConfig,
                        });
                    });
            },
            [state, item]
        );

        const changeAliasName = React.useCallback(
            (alias) => {
                setDisabled(true);
                axios
                    .patch(
                        `${BASE_URL}change_alias`,
                        {
                            urlID: item._id,
                            alias,
                        },
                        {
                            headers: {
                                Authorization,
                                accessToken: state.token,
                            },
                        }
                    )
                    .then((val) => {
                        setShortURL(BASE_URL + alias);
                        setDisabled(false);
                        toast("👍 Success", {
                            type: "success",
                            ...toastConfig,
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                        setDisabled(false);
                        toast("😵" + e?.response?.data?.message || e?.response?.data?.error || "Internal Error", {
                            type: "error",
                            ...toastConfig,
                        });
                    });
            },
            [state, item]
        );

        return (
            <div className="flex flex-col border-2 p-3 rounded-xl m-3 text-xl" style={{ boxShadow: "0px 0px 15px 0.5px blue" }} ref={ref}>
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
                        <h1
                            className="text-gray-800 font-bold overflow-scroll whitespace-nowrap py-1"
                            style={{ display: item.title ? "block" : "none" }}
                        >
                            {item.title}
                        </h1>
                        <h1
                            className="text-gray-500 font-bold overflow-scroll whitespace-nowrap pt-1 pb-3"
                            style={{ display: item.title ? "block" : "none" }}
                        >
                            {item.description}
                        </h1>
                        <h1 className="text-gray-500 overflow-scroll whitespace-nowrap">{item.url}</h1>
                        <h1
                            className="text-blue-500 overflow-scroll whitespace-nowrap cursor-pointer"
                            onClick={() => {
                                window.open(shortURL, "_blank");
                            }}
                        >
                            {shortURL}
                        </h1>
                        <h1 className="text-blue-500 overflow-scroll whitespace-nowrap mt-2">
                            <span className="text-gray-600 font-bold">Created At: </span> {moment(item.created_at).format("YYYY - MMM - DD, hh:mm A")}
                        </h1>
                        {expirationTime ? (
                            <h1 className="text-blue-500 overflow-scroll whitespace-nowrap mt-2">
                                <span className="text-gray-600 font-bold">Expired At: </span>{" "}
                                {moment(expirationTime).format("YYYY - MMM - DD, hh:mm A")}
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
                                    navigator.clipboard.writeText(shortURL);
                                    toast("👍 Copied", {
                                        type: "success",
                                        ...toastConfig,
                                    });
                                }}
                            />
                            {isPasswordProtected ? (
                                <img
                                    data-tip="Remove Password Protection"
                                    ref={keyoffRef}
                                    src={KeyOff}
                                    height="30"
                                    width="30"
                                    className="mr-3 cursor-pointer"
                                    onClick={() => {
                                        if (!disabled)
                                            setModalContent(
                                                <div className="flex flex-col items-center justify-center">
                                                    <img src={Warning} height={75} width={75} />
                                                    <h1 className="text-red-500 overflow-scroll text-center">
                                                        Are you sure to remove password protection for this url?
                                                    </h1>
                                                    <div className="flex items-center mt-2">
                                                        <ThemedButton
                                                            title="No"
                                                            onClickHandler={() => setModalContent()}
                                                            color="bg-green-500"
                                                            className="mx-2"
                                                        />
                                                        <ThemedButton
                                                            title="Yes"
                                                            onClickHandler={() => {
                                                                onRemovePassword();
                                                                setModalContent();
                                                            }}
                                                            className="mx-2"
                                                            color="bg-red-500"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                    }}
                                />
                            ) : null}
                            {isPasswordProtected ? (
                                <img
                                    data-tip="Update Password"
                                    ref={keyeditRef}
                                    src={ChangePassword}
                                    height="30"
                                    width="30"
                                    className="mr-3 cursor-pointer"
                                    onClick={() => {
                                        if (!disabled)
                                            setModalContent(
                                                <PasswordModalContent
                                                    onClose={() => setModalContent()}
                                                    onSubmit={(password) => {
                                                        setPassword(password);
                                                        setModalContent();
                                                    }}
                                                />
                                            );
                                    }}
                                />
                            ) : null}
                            {!isPasswordProtected ? (
                                <img
                                    data-tip="Add Password Protection"
                                    src={Key}
                                    ref={keyRef}
                                    height="30"
                                    width="30"
                                    className="mr-3 cursor-pointer"
                                    onClick={() => {
                                        if (!disabled)
                                            setModalContent(
                                                <PasswordModalContent
                                                    onClose={() => setModalContent()}
                                                    onSubmit={(password) => {
                                                        setPassword(password);
                                                        setModalContent();
                                                    }}
                                                />
                                            );
                                    }}
                                />
                            ) : null}
                            <img
                                data-tip="Edit Alias Name"
                                ref={editRef}
                                src={Edit}
                                height="30"
                                width="30"
                                className="mr-3 cursor-pointer"
                                onClick={() => {
                                    if (!disabled) {
                                        const prevAlias = shortURL.split("/").splice(-1)[0];
                                        setModalContent(
                                            <ChangeAliasModalContent
                                                onClose={() => setModalContent()}
                                                onSubmit={(alias) => {
                                                    changeAliasName(alias);
                                                    setModalContent();
                                                }}
                                                prevAlias={prevAlias}
                                            />
                                        );
                                    }
                                }}
                            />
                            <img
                                data-tip="Set Expiration Time"
                                ref={timerRef}
                                src={Clock}
                                height="30"
                                width="30"
                                className="mr-3 cursor-pointer"
                                onClick={() => {
                                    if (!disabled)
                                        setModalContent(
                                            <ExpirationModalContent
                                                onClose={() => setModalContent()}
                                                onSelect={(res) => {
                                                    setExpireDuration(res);
                                                    setModalContent();
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
                                        qr.toDataURL(shortURL, { type: "image/png" }).then((value) => {
                                            setModalContent(
                                                <div className="flex flex-col items-center justify-center">
                                                    <img src={value} className="md:h-64 md:w-64 w-40 h-40" />
                                                    <h1 className="text-blue-500 overflow-scroll text-center" aria-multiline>
                                                        {shortURL}
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
                                                    <ThemedButton
                                                        title="No"
                                                        onClickHandler={() => setModalContent()}
                                                        color="bg-green-500"
                                                        className="mx-2"
                                                    />
                                                    <ThemedButton
                                                        title="Yes"
                                                        onClickHandler={() => {
                                                            onDelete();
                                                            setModalContent();
                                                        }}
                                                        className="mx-2"
                                                        color="bg-red-500"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }
                                }}
                            />
                        </div>
                        <div>
                            {showBtn ? (
                                <ThemedButton
                                    onClickHandler={() => nav.push(`/url/${item._id}`)}
                                    title="Statistics"
                                    color="bg-blue-500"
                                    disabled={disabled}
                                />
                            ) : null}
                        </div>
                    </div>
                    {expirationTime && expirationTime < Date.now() ? (
                        <div className="flex flex-col items-center justify-center flex-1">
                            <h1 className="mb-2">Link has been Expired</h1>
                            <ThemedButton
                                title="Make Me Alive!"
                                onClickHandler={() => {
                                    if (!disabled)
                                        setModalContent(
                                            <ExpirationModalContent
                                                onClose={() => setModalContent()}
                                                onSelect={(res) => {
                                                    setExpireDuration(res);
                                                    setModalContent();
                                                }}
                                            />
                                        );
                                }}
                                disabled={disabled}
                                color="bg-green-500"
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        );
    })
);
// export const URLItem = RenderItem;
