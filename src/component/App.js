import { useRef, useState } from "react";
import validator from "validator";
import ThemedButton from "./ThemedButton";
import "../styles/App.css";
import axios from "axios";

const BASE_URL = "https://shorty--urls-server.herokuapp.com/";
const AUTHORIZATION = `05d5f47a-b131-4523-bffe-f0e918afd3cb`;

export const App = () => {
  let url = useRef();
  const [loading, setLoading] = useState(false);
  const [short_url, set_short_url] = useState();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  let textAreaRef = useRef();

  const makeURLValid = () => {
    if (
      url.current.search("https://") === -1 &&
      url.current.search("http://") === -1
    ) {
      url.current = "https://" + url.current;
      console.log("new url", url);
    }
  };

  const onSubmit = () => {
    setLoading(true);
    set_short_url();
    if (url.current) {
      if (validator.isURL(url.current)) {
        makeURLValid();
        axios
          .post(
            `${BASE_URL}generate_short_url`,
            {
              url: url.current,
            },
            {
              headers: {
                Authorization: AUTHORIZATION,
              },
            }
          )
          .then((value) => {
            set_short_url(BASE_URL + value.data.short_url);
          })
          .catch((e) => {
            console.log("error", e.response);
            if (e.response) {
              if (e.response.status === 409) {
                set_short_url(BASE_URL + e.response.data.short_url);
              } else {
                setError("Unable to short this url. Try again.");
              }
            } else {
              setError("Unable to short this url. Try again.");
            }
          })
          .finally(() => setLoading(false));
      } else {
        console.log("invalid url");
        setLoading(false);
        setError("Enter valid URL");
      }
    } else {
      setError("Empty url not accepted.");
      setLoading(false);
    }
  };

  const onCopy = () => {
    textAreaRef.current.select();
    document.execCommand("copy");
    setSuccess("URL Copied!");
    setTimeout(() => {
      setSuccess("");
    }, 1500);
  };

  const onOpenURL = () => {
    window.open(short_url, "_blank");
  };

  return (
    <div id="body" class="mainRoot">
      <header>
        <h1> Shorty URLs </h1>
        <div class="nav">
          <p
            onClick={() => {
              window.location.pathname = "/history";
            }}
          >
            History
          </p>
        </div>
      </header>
      <div class="mainbox">
        <h1>Enter the URL</h1>
        <input
          class="root-entry"
          onChange={(e) => {
            setError("");
            if (short_url) {
              set_short_url();
            }
            url.current = e.target.value;
          }}
        />
        <p class="error">{error}</p>
        {loading ? (
          <div class="loading">
            <div class="spinner-grow" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <ThemedButton title="Submit URL" onClickHandler={onSubmit} />
        )}
        {short_url ? (
          <div class="after-short">
            <input
              class="root-entry"
              ref={textAreaRef}
              value={short_url}
              style={{
                marginTop: 25,
              }}
              contentEditable={false}
            />
            <p class="success">{success}</p>
            <div class="row-buttons">
              <ThemedButton title="Copy URL" onClickHandler={onCopy} />
              <ThemedButton title="Open URL" onClickHandler={onOpenURL} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
