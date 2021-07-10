import { useEffect, useState } from "react";
import validator from "validator";
import ThemedButton from "./ThemedButton";
import "../styles/History.css";
import "../styles/App.css";
import axios from "axios";

const BASEURL = "https://shorty--urls-server.herokuapp.com/";
const AUTHORIZATION = `05d5f47a-b131-4523-bffe-f0e918afd3cb`;

const HistoryModal = () => {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState("10");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const fetchHistory = () => {
    if ((validator.isInt(limit) && parseInt(limit) >= 0) || limit === "") {
      setLoading(true);
      const url = `${BASEURL}history/${limit === "" ? null : limit}`;
      console.log(url);
      axios
        .get(url, {
          headers: {
            Authorization: AUTHORIZATION,
          },
        })
        .then((value) => {
          console.log("value", value.data);
          setHistory(value.data.history);
        })
        .catch((e) => setError("Unable to fetch history."))
        .finally(() => setLoading(false));
    } else {
      setError("Limit must be positive integer.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div id="body" class="historyRoot">
      <header class="historyHeader">
        <h1> Shorty URLs </h1>
        <div class="nav">
          <p
            onClick={() => {
              window.location.pathname = "/";
            }}
          >
            Home
          </p>
        </div>
      </header>
      {loading ? (
        <div class="historyBox mainbox loader" style={{ opacity: 0.7 }}>
          <h1>History</h1>
          <div
            class="spinner-grow"
            role="status"
            style={{ color: "white", height: 75, width: 75 }}
          >
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div
          style={{
            flexDirection: "column",
            margin: "auto",
          }}
        >
          <div class="historyBox mainbox">
            <h1 style={{ marginBottom: 10 }}>History</h1>
            {history.length > 0 ? (
              <div class="history-table">
                <div class="table-row table-header">
                  <input class="column column1 header-col" value="URL" />
                  <span> | </span>
                  <input
                    class="column column2 header-col"
                    value="Short URL"
                    contentEditable="false"
                    onDoubleClick={() => {}}
                  />
                  <span> | </span>
                  <input class="column column3 header-col" value="Created At" />
                  <span> | </span>
                  <input class="column column4 header-col" value="Visits" />
                </div>
                {history.map((data, index) => {
                  const created_at = new Date(data.created_at);
                  const created_at_date = created_at.getDate();
                  const created_at_month = created_at.getMonth();
                  const created_at_year = created_at.getFullYear();
                  const created_at_hour = created_at.getHours();
                  const created_at_min = created_at.getMinutes();
                  return (
                    <div class="table-row" key={index}>
                      <input class="column column1" value={data.url} />
                      <span> | </span>
                      <input
                        class="column column2"
                        value={`${BASEURL}${data.short_url}`}
                        contentEditable="false"
                      />
                      <span> | </span>
                      <input
                        class="column column3"
                        value={`${created_at_date}/${created_at_month}/${created_at_year} - ${created_at_hour}:${created_at_min}`}
                      />
                      <span> | </span>
                      <input
                        class="column column4"
                        value={data.num_of_visits}
                      />
                    </div>
                  );
                })}
                <div class="mainbox-footer">
                  <div>
                    <p class="error">{error} </p>
                  </div>
                  <div>
                    <label>Limit: </label>
                    <input
                      class="number-input"
                      value={limit}
                      placeholder={limit === "" ? "All" : ""}
                      onChange={(e) => setLimit(e.target.value)}
                    />
                    <ThemedButton title="Fetch" onClickHandler={fetchHistory} />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p class="no-urls">No URLs</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default HistoryModal;
