import * as React from "react";
import { Context as AuthContext } from "../context";
import GoogleIcon from "../google_icon.svg";
import "../configs/firebaseConfig";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useHistory } from "react-router";
import axios from "axios";
import { Authorization, BASE_URL } from "../configs/constants";
import Link from "../assets/svgs/link.svg";

const Auth = () => {
    const { state, setUserDetails, tryLocalLogin } = React.useContext(AuthContext);
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

    const onLogin = () => {
        setLoading(true);
        const googleAuthProvider = new GoogleAuthProvider();

        signInWithPopup(getAuth(), googleAuthProvider)
            .then((res) => {
                res.user.getIdToken().then((token) => {
                    axios.post(`${BASE_URL}authenticate`, { token }, { headers: { Authorization } }).then((res1) => {
                        console.log(res1.data.token);
                        setUserDetails({ ...res.user, token: res1.data.token });
                        history.replace("/home");
                        setLoading(false);
                    });
                });
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };

    return (
        <div className="bg-white">
            <div
                className="flex flex-col items-center justify-center h-screen"
                style={{
                    background: "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)",
                    boxShadow: "0px 5px 40px 2px black",
                }}
            >
                <div className="absolute top-20 left-0" style={{ transform: "rotate(90deg)" }}>
                    <img src={Link} height={150} width={150} />
                </div>
                <div className="absolute bottom-20 right-0" style={{ transform: "rotate(180deg)" }}>
                    <img src={Link} height={200} width={200} />
                </div>
                <div
                    className="flex flex-col justify-center items-center px-5 py-4 bg-white rounded-3xl mx-2 z-20"
                    style={{ boxShadow: "0px 0px 15px 0.5px blue" }}
                >
                    <h1 className="text-3xl font-bold mb-3 text-gray-800 text-center">Sign Up / Log In</h1>
                    <button
                        style={{ boxShadow: "0px 0px 15px 0.5px blue", width: "20rem" }}
                        className="flex items-center bg-white p-3 rounded-3xl font-bold text-xl"
                        onClick={() => {
                            if (!loading) {
                                onLogin();
                            }
                        }}
                    >
                        <img src={GoogleIcon} height="50px" width="50px" className="mr-3" />

                        {loading ? (
                            <svg
                                class="animate-spin h-8 w-8 mx-auto text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path
                                    class="opacity-75"
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
                </div>
            </div>
        </div>
    );
};

export default Auth;
