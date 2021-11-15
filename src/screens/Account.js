import * as React from "react";
import { Context as AuthContext } from "../context";
import "../configs/firebaseConfig";
import { useHistory } from "react-router";
import { ToastContainer } from "react-toastify";

const Account = () => {
    const { state, tryLocalLogin } = React.useContext(AuthContext);

    const history = useHistory();

    React.useEffect(() => {
        tryLocalLogin(
            () => {
                // history.replace("/home");
            },
            () => {
                history.replace("/login");
            }
        );
    }, []);

    return (
        <div className="bg-white z-10">
            <ToastContainer />
            <div
                className="flex flex-col items-center justify-center mb-5 rounded-b-2xl"
                style={{ background: "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)", boxShadow: "0px 5px 40px 2px blue", paddingBottom: 70 }}
            ></div>
            <div className="flex flex-col border-2 p-5 rounded-xl m-3 text-xl items-center" style={{ boxShadow: "0px 0px 15px 0.5px blue" }}>
                <div className="flex p-1 mr-2 mb-3 rounded-full" style={{ boxShadow: "0px 0px 15px 1px blue" }}>
                    <img src={state.photo_img} height={100} width={100} style={{ borderRadius: 50 }} />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col md:w-full items-center" style={{ maxWidth: "80vw" }}>
                        <p className="text-xl text-white bg-gray-600 py-2 px-3 my-2 rounded-xl pl-3 flex-1 md:w-100 w-full whitespace-nowrap overflow-scroll">
                            {state.name}
                        </p>
                    </div>
                    <div className="flex flex-col md:w-full items-center" style={{ maxWidth: "80vw" }}>
                        <p className="text-xl text-white bg-gray-600 py-2 px-3 my-2 rounded-xl pl-3 flex-1 md:w-100 w-full whitespace-nowrap overflow-scroll">
                            {state.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
