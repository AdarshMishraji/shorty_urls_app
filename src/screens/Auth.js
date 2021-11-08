import { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context";
import Footer from "../component/Footer";
import Header from "../component/Header";
import GoogleIcon from "../google_icon.svg";
// import "../../styles/Auth.css";
import "../configs/firebaseConfig";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useHistory } from "react-router";
import axios from "axios";
import { Authorization, BASE_URL } from "../configs/constants";

export const Auth = () => {
    const { state, setUserDetails, tryLocalLogin } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    useEffect(() => {
        tryLocalLogin(
            () => {
                history.replace("/home");
                //  history.replace("/login");
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
        <div className="bg-white pb-10">
            <Header />
            <div
                className="flex flex-col items-center justify-center mb-5 h-screen"
                style={{
                    background: "linear-gradient(-45deg,#2225ff 10%,#2254ff 90%)",
                    boxShadow: "0px 5px 40px 2px black",
                }}
            >
                <div className="flex flex-col justify-center items-center px-5 py-4 bg-white rounded-3xl mx-2">
                    <h1 className="text-3xl font-bold mb-3">Sign Up / Log In</h1>
                    <button
                        className="flex items-center bg-white p-3 rounded-3xl font-bold text-xl focus:outline-none focus:shadow-2xl"
                        style={{ boxShadow: "0px 2px 25px 5px black" }}
                        onClick={() => {
                            if (!loading) {
                                onLogin();
                            }
                        }}
                    >
                        <img src={GoogleIcon} height="50px" width="50px" className="mr-3" />

                        {loading ? (
                            <div className="spinner-border text-dark ml-5"></div>
                        ) : (
                            <h1>
                                Log in <h1 className="md:inline-block hidden">using Google</h1>
                            </h1>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
