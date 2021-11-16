import * as React from "react";
import { useHistory } from "react-router";
import { Context as AuthContext } from "../context";
import Logo from "../assets/images/logo.png";
import account from "../assets/svgs/account.svg";
import Hamburger from "../assets/svgs/hamburger.svg";
import HamburgerClose from "../assets/svgs/close.svg";
import { useOutsideAlerter } from "../hooks";

const Link = ({ text, onPress, last }) => {
    return (
        <div className={`mr-10 cursor-pointer text-2xl hover:border-gray-100 border-b-2 border-opacity-0`}>
            <p onClick={onPress} className="whitespace-nowrap">
                {text}
            </p>
        </div>
    );
};

const Header = ({ requireBackground }) => {
    const [hamburgerOpen, setHamburgerOpen] = React.useState(false);
    const [accountMenu, setAccountMenu] = React.useState(false);
    const history = useHistory();
    const { state, clearUserData } = React.useContext(AuthContext);

    const toggleMenu = () => {
        setHamburgerOpen(!hamburgerOpen);
    };

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
                    <img src={Logo} height="50" width="50" className="bg-white rounded-full p-2 mr-3" />
                    <h3 className="font-bold sm:text-2xl text-lg"> Shorty URLs </h3>
                </div>
                <div className="flex-row items-center justify-center md:flex hidden">
                    <Link text="URLs" onPress={() => history?.push("/urls")} />
                    {state.token ? (
                        <img
                            src={state.photo_img || account}
                            style={{ display: state.name ? "block" : "none" }}
                            className="bg-white rounded-3xl p-1"
                            height="50"
                            width="50"
                            onClick={() => setAccountMenu(!accountMenu)}
                        />
                    ) : (
                        <Link text="Login / Signup" onPress={() => history?.push("/login")} />
                    )}
                </div>
                <div className="md:hidden flex items-center text-gray-600 md:mr-10 mr-2 z-" onClick={toggleMenu}>
                    <div className="rounded-3xl focus:outline-none border-0" style={{ height: 40, width: 40 }}>
                        {hamburgerOpen ? (
                            <img src={HamburgerClose} height={hamburgerOpen ? 35 : 40} width={hamburgerOpen ? 35 : 40} />
                        ) : (
                            <img src={Hamburger} height={hamburgerOpen ? 35 : 40} width={hamburgerOpen ? 35 : 40} />
                        )}
                    </div>
                </div>
            </div>

            <div
                ref={accountMenuRef}
                className="menu opacity-95 md:hidden p-3 self-center mt-2 absolute right-5 bg-white rounded-2xl z-10"
                style={{ display: accountMenu ? "block" : "none", boxShadow: "0px 0px 25px 5px black" }}
            >
                <h1
                    className=" my-2 w-full py-1 px-4 rounded-xl mr-10 text-black
                        hover:bg-gray-300 transition duration-300 ease-in-out text-lg font-bold cursor-pointer"
                    onClick={() => {
                        setAccountMenu(false);
                        history?.push("/account");
                    }}
                >
                    View Profile
                </h1>
                <button
                    className="bg-blue-500 w-full py-1 rounded-xl mr-10 text-white 
                    hover:bg-blue-600 transition duration-300 ease-in-out text-lg font-bold"
                    onClick={() => {
                        clearUserData();
                        setAccountMenu(false);
                        history?.push("/login");
                    }}
                >
                    Logout
                </button>
            </div>

            <div
                ref={hamburgerRef}
                className="menu p-3 mt-2 absolute right-5 flex-col bg-gray-200 rounded-2xl z-10 opacity-95"
                style={{ display: hamburgerOpen ? "flex" : "none", boxShadow: "0px 0px 25px 5px black" }}
            >
                <h1
                    className=" my-2 w-full py-1 px-4 rounded-xl mr-10 text-black
                        hover:bg-gray-300 transition duration-300 ease-in-out text-lg font-bold cursor-pointer"
                    onClick={() => {
                        setHamburgerOpen(false);
                        history?.push("/urls");
                    }}
                >
                    URLs
                </h1>
                <h1
                    style={{ display: state.token ? "block" : "none" }}
                    className=" my-2 w-full py-1 px-4 rounded-xl mr-10 text-black
                        hover:bg-gray-300 transition duration-300 ease-in-out text-lg font-bold cursor-pointer"
                    onClick={() => {
                        setHamburgerOpen(false);
                        history?.push("/account");
                    }}
                >
                    View Profile
                </h1>
                <button
                    // style={{ display: state.token ? "block" : "none" }}
                    className="bg-blue-500 w-full py-1 px-4 rounded-xl mr-10 text-white z-50
                        hover:bg-blue-600 transition duration-300 ease-in-out text-lg font-bold"
                    onClick={() => {
                        clearUserData();
                        setHamburgerOpen(false);
                        history?.push("/login");
                    }}
                >
                    {state.token ? "Logout" : "Login / Signup"}
                </button>
            </div>
        </header>
    );
};

export default Header;
