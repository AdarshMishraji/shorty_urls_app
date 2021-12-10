import * as React from "react";
import qr from "qrcode";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import moment from "moment";

import { AuthContext, ThemeContext } from "../context";
import { Dropdown, ToggleSwitch, Option, ThemedButton, Container } from ".";
import { useOutsideAlerter } from "../hooks";
import { toastConfig } from "../configs";
import { BASE_URL, changeAlias, changeStatus, deleteURL, removePassword, setExpiration, updatePassword } from "../api";
import { afterTokenExpire } from "../helpers";

import { ChangePassword, Clock, Copy, Delete, Edit, KeyOff, KeyOn, QrCode, Warning } from "../assets";

const CommonIconProp = { color: "grey", height: "30px", width: "30px", className: "mx-2 cursor-pointer border-none outline-none" };

export const ExpirationModalContent = React.memo(({ onSelect, onClose, theme }) => {
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
                        <input type="radio" title="After" name="type" checked={type === 0} />
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
                            className=" p-2 rounded-xl border-blue-400 outline-none bg-transparent text-blue-600 text-lg border-2"
                            onChange={(e) => {
                                if (e.target.valueAsNumber - Date.now() > 10800) setTimestamp(e.target.valueAsNumber);
                                else {
                                    e.target.value = "";
                                    toast("🤨 Select expiration time after 3 Hrs", {
                                        type: "error",
                                        ...toastConfig,
                                        theme,
                                        position: "top-center",
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center mt-3 self-center">
                    <ThemedButton title="Cancel" onClickHandler={onClose} color="bg-red-500" className="mx-2" />
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

export const PasswordModalContent = React.memo(({ onClose, onSubmit, theme }) => {
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const onOK = React.useCallback(() => {
        if (password.length >= 8) {
            if (password === confirmPassword) {
                onSubmit(password);
            } else {
                toast("🤨 Password is not same as Confirm Password", {
                    type: "error",
                    ...toastConfig,
                    theme,
                    position: "top-center",
                });
            }
        } else {
            toast("🤨 Password must be more than equals to 8 characters", {
                type: "error",
                ...toastConfig,
                theme,
                position: "top-center",
            });
        }
    }, [password, confirmPassword]);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-gray-500 text-2xl mb-2 text-center">Enter Password</h1>
            <div className="flex flex-col justify-between rounded-xl p-2 text-xl mb-2" style={{ zIndex: 2 }}>
                <input
                    className=" p-2 rounded-xl border-blue-400 outline-none bg-transparent text-blue-600 text-lg border-2 mb-2"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            onOK();
                        }
                    }}
                />
                <input
                    className=" p-2 rounded-xl border-blue-400 outline-none bg-transparent text-blue-600 text-lg border-2"
                    placeholder="Confirm Password"
                    type="password"
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            onOK();
                        }
                    }}
                />
                <div className="flex flex-row self-center mt-3">
                    <ThemedButton title="Cancel" onClickHandler={onClose} color="bg-red-500" className="mx-2" />
                    <ThemedButton title="OK" onClickHandler={onOK} className="mx-2" color="bg-green-500" />
                </div>
            </div>
        </div>
    );
});

export const ChangeAliasModalContent = React.memo(({ prevAlias, onClose, onSubmit }) => {
    const [alias, setAlias] = React.useState(prevAlias);
    return (
        <div className="flex flex-col items-center justify-cente">
            <h1 className="text-gray-500 text-2xl mb-2 text-center ">Change the Alias</h1>
            <div className="flex flex-col items-center justify-center rounded-2xl mx-2">
                <span className=" p-2 overflow-scroll whitespace-nowrap rounded-xl w-11/12 text-blue-600 border-2 border-blue-400">{BASE_URL}</span>
                <label className="mt-2 mb-1 text-gray-500 text-lg w-11/12 text-left pl-2">Alias</label>
                <input
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="outline-none p-2 rounded-2xl  w-11/12"
                    className=" p-2 rounded-xl border-blue-400 outline-none bg-transparent text-blue-600 text-lg border-2"
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            onSubmit(alias);
                        }
                    }}
                />
            </div>
            <div className="flex mt-3">
                <ThemedButton title="Cancel" onClickHandler={onClose} color="bg-red-500" className="mx-2" />
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
        const [isPasswordProtected, setPasswordProtected] = React.useState(Boolean(item?.is_password_protected));
        const [expirationTime, setExpirationTime] = React.useState(item.expired_at);
        const [disabled, setDisabled] = React.useState(false);
        const [shortURL, setShortURL] = React.useState(item.short_url);

        const { state, clearUserData } = React.useContext(AuthContext);

        const {
            state: { theme },
        } = React.useContext(ThemeContext);

        const history = useHistory();

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
                changeStatus(
                    item._id,
                    status,
                    state.token,
                    (val) => {
                        setActive(status);
                        toast("👍 Success", {
                            type: "success",
                            ...toastConfig,
                            theme,
                        });
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
                    },
                    () => {
                        setDisabled(false);
                    }
                );
            },
            [item, state]
        );

        const onDelete = React.useCallback(() => {
            setDisabled(true);
            deleteURL(
                item._id,
                state.token,
                (val) => {
                    reFetch();
                    toast("👍 Success", {
                        type: "success",
                        ...toastConfig,
                        theme,
                    });
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
                },
                () => {
                    setDisabled(false);
                }
            );
        }, [state, item]);

        const setPassword = React.useCallback(
            (password) => {
                setDisabled(true);
                updatePassword(
                    item._id,
                    password,
                    state.token,
                    (val) => {
                        setPasswordProtected(true);
                        toast("👍 Success", {
                            type: "success",
                            ...toastConfig,
                            theme,
                        });
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
                    },
                    () => {
                        setDisabled(false);
                    }
                );
            },
            [state, item]
        );

        const onRemovePassword = React.useCallback(() => {
            setDisabled(true);
            removePassword(
                item._id,
                state.token,
                (val) => {
                    setPasswordProtected(false);
                    toast("👍 Success", {
                        type: "success",
                        ...toastConfig,
                        theme,
                    });
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
                },
                () => {
                    setDisabled(false);
                }
            );
        }, [state, item]);

        const setExpireDuration = React.useCallback(
            (expired_at) => {
                setDisabled(true);
                setExpiration(
                    item._id,
                    expired_at === "Infinite" ? false : expired_at,
                    state.token,
                    (val) => {
                        setExpirationTime(expired_at === "Infinite" ? false : expired_at);
                        toast("👍 Success", {
                            type: "success",
                            ...toastConfig,
                            theme,
                        });
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
                    },
                    () => {
                        setDisabled(false);
                    }
                );
            },
            [state, item]
        );

        const changeAliasName = React.useCallback(
            (alias) => {
                setDisabled(true);
                changeAlias(
                    item._id,
                    alias,
                    state.token,
                    (val) => {
                        setShortURL(BASE_URL + alias);
                        toast("👍 Success", {
                            type: "success",
                            ...toastConfig,
                            theme,
                        });
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
                    },
                    () => {
                        setDisabled(false);
                    }
                );
            },
            [state, item]
        );

        return (
            <Container ref={ref} className="m-3 zoom-container ">
                <ReactTooltip />
                <div className="relative">
                    <div className="flex justify-between items-center">
                        <ToggleSwitch isActive={active} setStatus={onChangeStatus} className="mb-3" disbled={disabled} />
                        {disabled ? (
                            <div className="flex items-center justify-center" style={{ opacity: 0.7 }}>
                                <div className="spinner-grow mr-3 dark:text-white text-black" role="status" style={{ height: 35, width: 35 }}>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="border-b-2 pb-3 border-gray-500">
                        <h1
                            className="text-gray-600 font-bold overflow-scroll whitespace-nowrap py-1"
                            style={{ display: item?.meta_data?.title ? "block" : "none" }}
                        >
                            {item?.meta_data?.title}
                        </h1>
                        <h1
                            className="text-gray-500 font-bold overflow-scroll whitespace-nowrap pt-1 pb-3"
                            style={{ display: item?.meta_data?.title ? "block" : "none" }}
                        >
                            {item?.meta_data?.description}
                        </h1>
                        <h1
                            className="text-gray-500 overflow-scroll whitespace-nowrap"
                            onClick={() => {
                                window.open(item.url, "_blank");
                            }}
                        >
                            {item.url}
                        </h1>
                        <h1
                            className="text-blue-500 overflow-scroll whitespace-nowrap cursor-pointer"
                            onClick={() => {
                                window.open(shortURL, "_blank");
                            }}
                        >
                            {shortURL}
                        </h1>
                        <h1 className="text-blue-500 overflow-scroll whitespace-nowrap mt-2">
                            <span className="text-gray-600 font-bold">Created At: </span>{" "}
                            {moment(item?.created_at).format("YYYY - MMM - DD, hh:mm A")}
                        </h1>
                        {item.last_clicked_at && (
                            <h1 className="text-blue-500 overflow-scroll whitespace-nowrap mt-2">
                                <span className="text-gray-600 font-bold">Last Clicked At: </span>{" "}
                                {moment(item?.last_clicked_at).format("YYYY - MMM - DD, hh:mm A")}
                            </h1>
                        )}
                        {expirationTime ? (
                            <h1 className="text-blue-500 mt-2">
                                <span className="text-gray-600 font-bold">Expired At: </span>{" "}
                                {moment(expirationTime).format("YYYY - MMM - DD, hh:mm A")}
                            </h1>
                        ) : null}
                    </div>
                    <div className="items-center md:justify-between flex  md:flex-row flex-col">
                        <div className={`flex items-center my-3 md:${showBtn ? "justify-start" : "justify-center"}  overflow-scroll w-full`}>
                            <Copy
                                ref={copyRef}
                                data-tip="Copy the URL"
                                {...CommonIconProp}
                                onClick={() => {
                                    navigator.clipboard.writeText(shortURL);
                                    toast("👍 Copied", {
                                        type: "success",
                                        ...toastConfig,
                                        theme: theme,
                                    });
                                }}
                            />
                            {isPasswordProtected ? (
                                <KeyOff
                                    ref={keyoffRef}
                                    data-tip="Remove Password Protection"
                                    {...CommonIconProp}
                                    onClick={() => {
                                        if (!disabled)
                                            setModalContent(
                                                <div className="flex flex-col items-center justify-center">
                                                    <Warning height={75} width={75} />
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
                                <ChangePassword
                                    ref={keyeditRef}
                                    data-tip="Update Password"
                                    {...CommonIconProp}
                                    onClick={() => {
                                        if (!disabled)
                                            setModalContent(
                                                <PasswordModalContent
                                                    theme={theme}
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
                                <KeyOn
                                    ref={keyRef}
                                    data-tip="Add Password Protection"
                                    {...CommonIconProp}
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
                            <Edit
                                ref={editRef}
                                data-tip="Edit Alias Name"
                                {...CommonIconProp}
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
                            <Clock
                                ref={timerRef}
                                data-tip="Set Expiration Time"
                                {...CommonIconProp}
                                onClick={() => {
                                    if (!disabled)
                                        setModalContent(
                                            <ExpirationModalContent
                                                theme={theme}
                                                onClose={() => setModalContent()}
                                                onSelect={(res) => {
                                                    setExpireDuration(res);
                                                    setModalContent();
                                                }}
                                            />
                                        );
                                }}
                            />
                            <QrCode
                                ref={qrcodeRef}
                                data-tip="Show QR Code"
                                {...CommonIconProp}
                                onClick={() => {
                                    if (!disabled)
                                        qr.toDataURL(shortURL, { type: "image/png" }).then((value) => {
                                            setModalContent(
                                                <div className="flex flex-col items-center justify-center">
                                                    <img src={value} className="md:h-64 md:w-64 w-40 h-40 mb-2 rounded-xl" alt="zxcvbnm" />
                                                    <h1 className="text-blue-500 overflow-scroll text-center" aria-multiline>
                                                        {shortURL}
                                                    </h1>
                                                </div>
                                            );
                                        });
                                }}
                            />
                            <Delete
                                ref={deletRef}
                                data-tip="Delete the URL"
                                {...CommonIconProp}
                                onClick={() => {
                                    if (!disabled) {
                                        setModalContent(
                                            <div className="flex flex-col items-center justify-center">
                                                <Warning height={75} width={75} />
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
                        {showBtn ? (
                            <ThemedButton
                                onClickHandler={() => history.push(`/url/${item._id}`)}
                                title="Statistics"
                                color="bg-blue-500"
                                disabled={disabled}
                            />
                        ) : null}
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
            </Container>
        );
    })
);
// export const URLItem = RenderItem;
