import { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../../context";
import Footer from "../Footer";
import Header from "../Header";
import GoogleIcon from "../../google_icon.svg";
import "../../styles/Auth.css";
import "../../config";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useHistory } from "react-router";
import axios from "axios";
import { Authorization, BASE_URL } from "../../constants";

export const Auth = () => {
    const { state, setUserDetails, tryLocalLogin } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    useEffect(() => {
        tryLocalLogin(
            () => {
                history.replace("/home");
            },
            () => {
                //  history.replace("/login");
            }
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
        <div class="body mainRoot">
            <Header />
            <div class="mainbox">
                <h1>Log In</h1>
                <button
                    id="google-login"
                    onClick={() => {
                        if (!loading) {
                            onLogin();
                        }
                    }}
                >
                    <img src={GoogleIcon} height="50px" width="50px" />

                    {loading ? (
                        <div
                            style={{
                                alignItems: "center",
                                width: "92%",
                                position: "absolute",
                            }}
                        >
                            <div class="spinner-border text-dark"></div>
                        </div>
                    ) : (
                        "Log in using Google"
                    )}
                </button>
            </div>
            <Footer />
        </div>
    );
};
