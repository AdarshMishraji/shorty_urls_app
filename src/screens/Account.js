import * as React from "react";
import { useHistory } from "react-router";
import { ToastContainer } from "react-toastify";

import { Context as AuthContext } from "../context";
import "../configs/firebaseConfig";
import { Header } from "../component";

const Account = () => {
    const { state, tryLocalLogin } = React.useContext(AuthContext);

    const history = useHistory();

    React.useEffect(() => {
        tryLocalLogin(
            () => {},
            () => {
                history.replace("/login");
            }
        );
    }, []);

    return (
        <div className="bg-white z-10 flex justify-center">
            <ToastContainer />
            <Header requireBackground />
            <div className="flex flex-col justify-center items-center mt-28 md:w-auto border-2 self-center">
                <div
                    className="flex flex-col border-2 p-5 rounded-xl text-xl items-center justify-center"
                    style={{ boxShadow: "0px 0px 15px 0.5px blue", maxWidth: "90vw" }}
                >
                    <div className="flex p-1 mb-3 rounded-full" style={{ boxShadow: "0px 0px 15px 1px blue" }}>
                        <img src={state.photo_img} height={100} width={100} style={{ borderRadius: 50 }} alt="zxcvbnm" />
                    </div>
                    <div className="flex flex-col md:w-100 items-center justify-center" style={{ maxWidth: "70vw" }}>
                        <p
                            className="text-xl text-white bg-gray-600 py-2 px-3 my-2 rounded-xl pl-3 flex-1  whitespace-nowrap overflow-scroll"
                            style={{ maxWidth: "80vw" }}
                        >
                            {state.name}
                        </p>
                        <p
                            className="text-xl text-white bg-gray-600 py-2 px-3 my-2 rounded-xl pl-3 flex-1 whitespace-nowrap overflow-scroll"
                            style={{ maxWidth: "80vw" }}
                        >
                            {state.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
