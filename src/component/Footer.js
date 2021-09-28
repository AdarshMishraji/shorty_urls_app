import { useContext } from "react";
import { useHistory } from "react-router";
import { Context as AuthContext } from "../context";

const Footer = ({ name }) => {
    const { state, clearUserData } = useContext(AuthContext);
    const nav = useHistory();
    return (
        <footer>
            <div>
                Made with{" "}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" color="red">
                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>{" "}
                by Adarsh Mishra
            </div>
            <div>
                {name}
                {state.token && state.token !== "" ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        height="25px"
                        viewBox="0 0 24 24"
                        width="25px"
                        fill="#ffffff"
                        style={{ marginLeft: "10px" }}
                        onClick={() => {
                            clearUserData();
                            nav.replace("/login");
                        }}
                    >
                        <g>
                            <path d="M0,0h24v24H0V0z" fill="none" />
                        </g>
                        <g>
                            <path d="M17,8l-1.41,1.41L17.17,11H9v2h8.17l-1.58,1.58L17,16l4-4L17,8z M5,5h7V3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h7v-2H5V5z" />
                        </g>
                    </svg>
                ) : null}
            </div>
        </footer>
    );
};

export default Footer;
