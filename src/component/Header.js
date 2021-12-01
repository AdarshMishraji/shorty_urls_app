import * as React from "react";
import { useHistory } from "react-router";

import { Context as AuthContext } from "../context";
import { useOutsideAlerter } from "../hooks";

import Logo from "../assets/images/logo.png";
import account from "../assets/svgs/account.svg";
import Hamburger from "../assets/svgs/hamburger.svg";
import HamburgerClose from "../assets/svgs/close.svg";

const Link = ({ text, onPress, last }) => {
    return (
        <div className={`mr-10 cursor-pointer text-2xl hover:border-gray-100 border-b-2 border-opacity-0`}>
            <p onClick={onPress} className="whitespace-nowrap">
                {text}
            </p>
        </div>
    );
};

const ButtonLinks = ({ onClick, text }) => {
    return (
        <button
            className="bg-blue-500 w-full py-1 px-4 rounded-xl mr-10 text-white z-50
                        text-lg font-bold"
            onClick={onClick}
        >
            {text}
        </button>
    );
};

const MenuLinks = ({ onClick, text }) => {
    return (
        <h1 className={`z-20 rounded-2xl flex-col text-blue-500 p-2 my-1 overflow-auto cursor-pointer `} onClick={onClick}>
            {text}
        </h1>
    );
};

export const Header = React.memo(({ requireBackground }) => {
    const [hamburgerOpen, setHamburgerOpen] = React.useState(false);
    const [accountMenu, setAccountMenu] = React.useState(false);
    const history = useHistory();
    const { state, clearUserData } = React.useContext(AuthContext);

    const hamburgerRef = React.createRef();
    const accountMenuRef = React.createRef();

    useOutsideAlerter(accountMenuRef, () => {
        setAccountMenu(false);
    });

    useOutsideAlerter(hamburgerRef, () => {
        setHamburgerOpen(false);
    });

    return (
        <header
            className="fixed top-0  w-full text-white rounded-b-2xl z-50"
            style={{
                background: requireBackground ? "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)" : "transparent",
                boxShadow: requireBackground ? "0px 5px 40px 2px blue" : "none",
            }}
        >
            <div className="flex justify-between py-2 px-2 bg-transparent">
                <div className="flex justify-start items-center md:ml-5 ml-2 cursor-pointer" onClick={() => history?.push("/home")}>
                    <img src={Logo} height="50" width="50" className="bg-white rounded-full p-2 mr-3" alt="" />
                    <h3 className="font-bold sm:text-2xl text-lg"> Shorty URLs </h3>
                </div>
                <div className="flex-row items-center justify-center md:flex hidden">
                    <Link text="URLs" onPress={() => history?.push("/urls")} />
                    {state.token ? (
                        <img
                            src={state.profile_img || account}
                            style={{ display: state.name ? "block" : "none" }}
                            className="bg-white rounded-3xl p-1 mr-3"
                            height="50"
                            width="50"
                            alt="zxcvbnm"
                            onClick={() => setAccountMenu(!accountMenu)}
                        />
                    ) : (
                        <Link text="Login / Signup" onPress={() => history?.push("/login")} />
                    )}
                </div>
                <div className="md:hidden flex items-center text-gray-600 md:mr-10 mr-2 z-50 relative">
                    <div className="rounded-3xl focus:outline-none border-0" style={{ height: 40, width: 40 }} onClick={() => setHamburgerOpen(true)}>
                        <img src={Hamburger} height={hamburgerOpen ? 35 : 40} width={hamburgerOpen ? 35 : 40} alt="zxcvbnm" />
                    </div>
                </div>

                <div
                    ref={accountMenuRef}
                    className="menu p-3 mt-2 absolute top-2 right-5 flex-col bg-gray-200 rounded-2xl z-50 flex"
                    style={{
                        transform: accountMenu ? "scale(1)" : "scale(0)",
                        transition: "all 0.2s ease-in-out",
                        boxShadow: "0px 0px 25px 5px black",
                    }}
                >
                    <img
                        src={HamburgerClose}
                        height={40}
                        width={40}
                        alt="zxcvbnm"
                        className="bg-gray-600 self-end rounded-full p-1 cursor-pointer"
                        onClick={() => setAccountMenu(false)}
                    />
                    <MenuLinks
                        onClick={() => {
                            setAccountMenu(false);
                            history?.push("/account");
                        }}
                        text="View Profile"
                    />
                    <ButtonLinks
                        text="Logout"
                        onClick={() => {
                            clearUserData();
                            setAccountMenu(false);
                            history?.push("/login");
                        }}
                    />
                </div>

                <div
                    ref={hamburgerRef}
                    className="menu p-3 mt-2 absolute top-2 right-5 flex flex-col bg-gray-200 rounded-2xl z-50"
                    style={{
                        transform: hamburgerOpen ? "scale(1)" : "scale(0)",
                        transition: "all 0.2s ease-in-out",
                        boxShadow: "0px 0px 25px 5px black",
                    }}
                >
                    <img
                        src={HamburgerClose}
                        height={40}
                        width={40}
                        alt="zxcvbnm"
                        className="bg-gray-600 rounded-full p-1 cursor-pointer self-end"
                        onClick={() => setHamburgerOpen(false)}
                    />
                    <MenuLinks
                        onClick={() => {
                            setHamburgerOpen(false);
                            history?.push("/urls");
                        }}
                        text="URLs"
                    />
                    {state.token ? (
                        <MenuLinks
                            onClick={() => {
                                setAccountMenu(false);
                                history?.push("/account");
                            }}
                            text="View Profile"
                        />
                    ) : null}
                    <ButtonLinks
                        text={state.token ? "Logout" : "Login / Signup"}
                        onClick={() => {
                            clearUserData();
                            setHamburgerOpen(false);
                            history?.push("/login");
                        }}
                    />
                </div>
            </div>
        </header>
    );
});
