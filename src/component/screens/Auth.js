import { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../../context";
import Footer from "../Footer";
import Header from "../Header";
import GoogleIcon from "../../google_icon.svg";
import "../../styles/Auth.css";
import "../../config";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useHistory } from "react-router";

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
                    setUserDetails({ ...res.user, token });
                    history.push("/home");
                    setLoading(false);
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
                {/* <input
                    ref={textRef}
                    class="root-entry"
                    placeholder="e.g. https://example.com"
                    onChange={(e) => {
                        setError("");
                        if (short_url) {
                            set_short_url();
                        }
                        url.current = e.target.value;
                    }}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            onSubmit();
                        }
                    }}
                /> */}
                {/* <p class="error">{error}</p> */}
                {/* {loading ? (
                    <div class="loading">
                        <div class="spinner-grow" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <ThemedButton title="Generate URL" onClickHandler={onSubmit} />
                )} */}
            </div>
            <Footer />
        </div>
    );
};
