import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Context as AuthContext } from "../context";
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

const Header = () => {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const [accountMenu, setAccountMenu] = useState(false);
    const history = useHistory();
    const { state, clearUserData } = useContext(AuthContext);

    const toggleMenu = () => {
        setHamburgerOpen(!hamburgerOpen);
    };

    return (
        <header className="absolute top-0  w-full text-white">
            <div className="flex justify-between py-2 px-2 bg-transparent">
                <div className="flex justify-start items-center md:ml-5 ml-2 cursor-pointer" onClick={() => history?.push("/home")}>
                    <img src={Logo} height="50" width="50" className="bg-white rounded-full p-2 mr-3" />
                    <h3 className="font-bold md:text-2xl text-sm"> Shorty URLs </h3>
                </div>
                <div className="flex-row items-center justify-center md:flex hidden">
                    <Link text="History" onPress={() => history?.push("/history")} />
                    <img
                        src={state.photo_img || account}
                        style={{ display: state.name ? "block" : "none" }}
                        className="bg-white rounded-3xl p-1"
                        height="50"
                        width="50"
                        onClick={() => setAccountMenu(!accountMenu)}
                    />
                </div>
                <div className="md:hidden flex items-center text-gray-600 md:mr-10 mr-2" onClick={toggleMenu}>
                    <button className="rounded-3xl focus:outline-none border-0" style={{ height: 40, width: 40 }}>
                        <img src={hamburgerOpen ? HamburgerClose : Hamburger} height={hamburgerOpen ? 35 : 40} width={hamburgerOpen ? 35 : 40} />
                    </button>
                </div>
            </div>

            <div
                className="menu opacity-95 md:hidden p-3 self-center mt-2 absolute right-5 bg-white rounded-2xl z-10"
                style={{ display: accountMenu ? "block" : "none", boxShadow: "0px 0px 25px 5px black" }}
            >
                <button
                    className=" my-2 w-full pb-1 px-4 rounded-xl mr-10 text-black
                        hover:bg-gray-300 transition duration-300 ease-in-out text-lg font-bold cursor-pointer"
                    onClick={() => {
                        setAccountMenu(false);
                        history?.push("/account");
                    }}
                >
                    Edit Profile
                </button>
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
                className="menu p-3 mt-2 absolute right-5 flex-col bg-gray-200 rounded-2xl z-10 opacity-95"
                style={{ display: hamburgerOpen ? "flex" : "none", boxShadow: "0px 0px 25px 5px black" }}
            >
                <h1
                    className=" my-2 w-full py-1 px-4 rounded-xl mr-10 text-black
                        hover:bg-gray-300 transition duration-300 ease-in-out text-lg font-bold cursor-pointer"
                    onClick={() => {
                        setHamburgerOpen(false);
                        history?.push("/history");
                    }}
                >
                    History
                </h1>
                <h1
                    style={{ display: state.name ? "block" : "none" }}
                    className=" my-2 w-full py-1 px-4 rounded-xl mr-10 text-black
                        hover:bg-gray-300 transition duration-300 ease-in-out text-lg font-bold cursor-pointer"
                    onClick={() => {
                        setHamburgerOpen(false);
                        history?.push("/account");
                    }}
                >
                    Edit Profile
                </h1>
                <h1
                    style={{ display: state.name ? "block" : "none" }}
                    className="bg-blue-500 w-full py-1 px-4 rounded-xl mr-10 text-white z-50
                        hover:bg-blue-600 transition duration-300 ease-in-out text-lg font-bold"
                    onClick={() => {
                        clearUserData();
                        setAccountMenu(false);
                        history?.push("/login");
                    }}
                >
                    Logout
                </h1>
            </div>
        </header>
    );
};

export default Header;
