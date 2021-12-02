import * as React from "react";
import { useHistory } from "react-router";
import GoogleLogin from "react-google-login";
import { toast, ToastContainer } from "react-toastify";

import { Context as AuthContext } from "../context";
import Link from "../assets/svgs/link.svg";
import GoogleIcon from "../assets/svgs/google_icon.svg";
import { Header } from "../component";
import { authenticate } from "../api";
import { GOOGLE_CLIENT_ID, toastConfig } from "../configs";

const Auth = () => {
    const { setUserDetails, tryLocalLogin } = React.useContext(AuthContext);
    const [loading, setLoading] = React.useState(false);

    const history = useHistory();

    React.useEffect(() => {
        tryLocalLogin(
            () => {
                history.replace("/home");
            },
            () => {}
        );
    }, []);

    const onLogin = React.useCallback((response) => {
        authenticate(
            response.tokenId,
            (res1) => {
                setUserDetails({ token: res1.data.token });
                history.replace("/home");
                setLoading(false);
            },
            (e) => {
                console.log(e);
                setLoading(false);
            }
        );
    }, []);

    return (
        <div className="bg-white">
            <ToastContainer />
            <Header />
            <div
                className="flex flex-col items-center justify-center h-screen"
                style={{
                    background: "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)",
                    boxShadow: "0px 5px 40px 2px black",
                }}
            >
                <div className="absolute top-20 left-0" style={{ transform: "rotate(90deg)" }}>
                    <img src={Link} height={150} width={150} alt="zxcvbnm" />
                </div>
                <div className="absolute bottom-20 right-0" style={{ transform: "rotate(180deg)" }}>
                    <img src={Link} height={200} width={200} alt="zxcvbnm" />
                </div>
                <div
                    className="flex flex-col justify-center items-center px-5 py-4 bg-white rounded-3xl mx-2 z-20 w"
                    style={{ boxShadow: "0px 0px 15px 0.5px blue", maxWidth: "90vw" }}
                >
                    <h1 className="text-3xl font-bold mb-3 text-gray-800 text-center">Sign Up / Log In</h1>
                    <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        onFailure={(error) => {
                            console.log({ error });
                            setLoading(false);
                            toast("😵 " + "Unable to Sign you in!", {
                                type: "error",
                                ...toastConfig,
                            });
                        }}
                        render={({ onClick }) => (
                            <button
                                style={{ boxShadow: "0px 0px 15px 0.5px blue", maxWidth: "80vw", borderRadius: 50 }}
                                className="flex items-center bg-white rounded-3xl font-bold text-xl hover:bg-red-600"
                                onClick={() => {
                                    setLoading(true);
                                    onClick();
                                }}
                            >
                                <img src={GoogleIcon} height="50px" width="50px" className="mr-3" alt="zxcvbnm" />

                                {loading ? (
                                    <svg
                                        className="animate-spin h-8 w-8 mx-auto text-blue-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <h1 className="w-full md:mr-5 mr-0 text-gray-700 text-2xl">
                                        Log in <h1 className="md:inline-block hidden">using Google</h1>
                                    </h1>
                                )}
                            </button>
                        )}
                        onSuccess={onLogin}
                    />
                </div>
            </div>
        </div>
    );
};

export default Auth;
