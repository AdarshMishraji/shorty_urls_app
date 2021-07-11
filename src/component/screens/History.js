import { useEffect, useState } from "react";
import validator from "validator";
import ThemedButton from "../ThemedButton";
import "../../styles/History.css";
import "../../styles/App.css";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import HistoryDetailsModal from "../HistoryDetailsModal";

const BASEURL = "https://shorty--urls-server.herokuapp.com/";
const AUTHORIZATION = "05d5f47ab1314523bffef0e918afd3cb";

const History = () => {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState("10");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const fetchHistory = () => {
    setError("");
    if ((validator.isInt(limit) && parseInt(limit) >= 0) || limit === "") {
      setLoading(true);
      const url = `${BASEURL}history${
        limit === "" ? "?limit=" : "?limit=" + limit
      }`;
      console.log(url);
      axios
        .get(url, {
          headers: {
            Authorization: AUTHORIZATION,
          },
        })
        .then((value) => {
          console.log("value", value.data.history);
          let dataToSend = [];
          for (let i = 0; i < value.data.history.length; i++) {
            const { created_at } = value.data.history[i];
            const dateString = new Date(created_at);
            const created_at_date = dateString.getDate();
            const created_at_month = dateString.getMonth();
            const created_at_year = dateString.getFullYear();
            const created_at_hour = dateString.getHours();
            const created_at_min = dateString.getMinutes();

            dataToSend.push({
              ...value.data.history[i],
              created_at: `${created_at_date}/${created_at_month}/${created_at_year} - ${created_at_hour}:${created_at_min}`,
            });
          }
          setHistory(dataToSend);
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
    <div class="body" class="historyRoot">
      <Header
        navText="Home"
        onNavClick={() => {
          window.location.pathname = "/";
        }}
      />
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
                  <input
                    class="column column1 header-col"
                    value="URL"
                    disabled
                  />
                  <span> | </span>
                  <input
                    class="column column2 header-col"
                    value="Short URL"
                    contentEditable="false"
                    disabled
                  />
                  <span> | </span>
                  <input
                    class="column column3 header-col"
                    value="Created At"
                    disabled
                  />
                  <span> | </span>
                  <input
                    class="column column4 header-col"
                    value="Visits"
                    disabled
                  />
                </div>
                <div class="table-data-root">
                  {history.map((data, index) => {
                    return (
                      <div
                        class="table-row"
                        key={index}
                        onClick={() => {
                          setHistoryIndex(index);
                          setShowModal(true);
                          console.log("clicking", index, showModal);
                        }}
                      >
                        <input
                          title={data.url}
                          class="column column1"
                          value={data.url}
                          contentEditable={false}
                          disabled
                        />
                        <span> | </span>
                        <input
                          class="column column2"
                          value={data.short_url}
                          title={data.short_url}
                          contentEditable={false}
                          disabled
                        />
                        <span> | </span>
                        <input
                          class="column column3"
                          value={data.created_at}
                          contentEditable={false}
                          disabled
                        />
                        <span> | </span>
                        <input
                          class="column column4"
                          value={data.num_of_visits}
                          contentEditable={false}
                          disabled
                        />
                      </div>
                    );
                  })}
                </div>
                <div class="mainbox-footer">
                  <div>
                    <p class="error">{error}</p>
                  </div>
                  <div class="div_2">
                    <label>Limit: </label>
                    <input
                      class="number-input"
                      value={limit}
                      placeholder="All"
                      onChange={(e) => {
                        if (e.target.value <= 0) {
                          setLimit("");
                        } else {
                          setLimit(e.target.value);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          fetchHistory();
                        }
                      }}
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
      <Footer />
      <HistoryDetailsModal
        data={historyIndex !== -1 ? history[historyIndex] : null}
        visible={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        fetchHistory={fetchHistory}
      />
    </div>
  );
};
export default History;
