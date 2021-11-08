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

export const Account = () => {
    const { state, tryLocalLogin } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    useEffect(() => {
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
        <div class="body mainRoot">
            <Header>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div class="nav" style={{ marginRight: "50px" }}>
                        <p onClick={() => history.push("/home")}>Home</p>
                    </div>
                    <div class="nav">
                        <p onClick={() => history.push("/history")}>History</p>
                    </div>
                </div>
            </Header>
            <div class="mainbox" style={{ display: "flex", justifyContent: "space-around", flexDirection: "row" }}>
                <div style={{ width: 125, display: "flex", justifyContent: "center" }}>
                    <img src={state.photo_img} height={100} width={100} style={{ borderRadius: 50, boxShadow: "0px 5px 20px 5px black" }} />
                </div>
                <div style={{ alignItems: "center" }}>
                    <p style={{ flexDirection: "row", display: "flex" }}>
                        <label style={{ fontWeight: "bold", width: "150px", fontSize: "25px", color: "white" }}>Name :</label>
                        <input
                            value={state.name}
                            title="Name"
                            contentEditable={false}
                            disabled
                            style={{
                                borderRadius: "25px",
                                outline: "none",
                                border: "none",
                                padding: "5px 15px",
                                width: "60%",
                                marginRight: "20px",
                                boxShadow: "0px 5px 20px 5px black",
                                backgroundColor: "#e3f2fd",
                            }}
                        />
                    </p>
                    <p style={{ flexDirection: "row", display: "flex" }}>
                        <label style={{ fontWeight: "bold", width: "150px", fontSize: "25px", color: "white" }}>Email :</label>
                        <input
                            value={state.email}
                            title="Email"
                            contentEditable={false}
                            disabled
                            style={{
                                borderRadius: "25px",
                                outline: "none",
                                border: "none",
                                padding: "5px 15px",
                                width: "60%",
                                marginRight: "20px",
                                boxShadow: "0px 5px 20px 5px black",
                                backgroundColor: "#e3f2fd",
                            }}
                        />
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};
