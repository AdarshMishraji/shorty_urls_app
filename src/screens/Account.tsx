import * as React from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AuthContext } from "../context";
import { Container, Header } from "../component";

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
        <div className="z-10 flex justify-center min-h-screen">
            <ToastContainer />
            <Header requireBackground />
            <div className="flex flex-col justify-center items-center mt-28 md:w-auto  self-center">
                <Container extraStyle={{ maxWidth: "90vw" }} className="p-5 items-center">
                    <div className="flex p-1 mb-3 rounded-full" style={{ boxShadow: "0px 0px 15px 1px blue" }}>
                        <img src={state.profile_img} height={100} width={100} style={{ borderRadius: 50 }} alt="zxcvbnm" />
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
                </Container>
            </div>
        </div>
    );
};

export default Account;
