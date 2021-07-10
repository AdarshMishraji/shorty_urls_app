import copy from "copy-to-clipboard";
import { useState } from "react";
import "../styles/HistoryDetailsModal.css";
import ThemedButton from "./ThemedButton";

const HistoryDetailsModal = ({ data, visible, onClose, fetchHistory }) => {
  console.log(data, visible, onClose);

  const [success, setSucess] = useState("");

  if (data && visible) {
    return (
      <div class="history-root">
        <div class="history-mainbox mainbox">
          <h1>Details</h1>
          <div class="history-details">
            <p>
              <label>URL :</label>
              <input
                value={data.url}
                title={data.url}
                contentEditable={false}
              />
              <ThemedButton
                title="Copy"
                onClickHandler={() => {
                  copy(data.url);
                  setSucess("Full-URL Copied.");
                  setTimeout(() => {
                    setSucess("");
                  }, 2000);
                }}
              />
            </p>
            <p>
              <label>Short URL :</label>
              <input
                value={data.short_url}
                title={data.short_url}
                contentEditable={false}
              />
              <ThemedButton
                title="Copy"
                onClickHandler={() => {
                  copy(data.short_url);
                  setSucess("Short-URL Copied");
                  setTimeout(() => {
                    setSucess("");
                  }, 2000);
                }}
              />
            </p>
            <p>
              <label>Created At :</label>
              <input value={data.created_at} contentEditable={false} />
            </p>
            <p>
              <label>No. of Visits :</label>
              <input value={data.num_of_visits} contentEditable={false} />
            </p>
            <p class="success" style={{ alignSelf: "center" }}>
              {success}
            </p>
            <ThemedButton
              title="Open URL"
              onClickHandler={() => {
                window.open(data.short_url, "_blank");
                fetchHistory();
              }}
            />
          </div>
          {data.num_of_visits > 0 ? (
            <div class="locations history-table">
              <h1>IP - Location</h1>
              <div class="table-row table-header">
                <input class="column column1 header-col" value="IP" />
                <span> | </span>
                <input class="column column2 header-col" value="Location" />
                <span> | </span>
                <input class="column column4 header-col" value="Requested At" />
              </div>
              {data.from_visited.map((value, index) => {
                const location = `${value.location.city}, ${value.location.country}. ${value.location.zipCode}`;
                const { requested_at } = value;
                const dateString = new Date(requested_at);
                const requested_at_date = dateString.getDate();
                const requested_at_month = dateString.getMonth();
                const requested_at_year = dateString.getFullYear();
                const requested_at_hour = dateString.getHours();
                const requested_at_min = dateString.getMinutes();
                const requested_at_date_string = `${requested_at_date}/${requested_at_month}/${requested_at_year} - ${requested_at_hour}:${requested_at_min}`;

                return (
                  <div class="table-row" key={index}>
                    <input
                      title={value.ip}
                      class="column column1"
                      value={value.ip}
                      contentEditable={false}
                    />
                    <span> | </span>
                    <input
                      title={location}
                      class="column column2"
                      value={location}
                      contentEditable={false}
                    />
                    <span> | </span>
                    <input
                      title={requested_at_date_string}
                      class="column column4"
                      value={requested_at_date_string}
                      contentEditable={false}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
          <div class="footer">
            <ThemedButton title="Close" onClickHandler={onClose} />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
export default HistoryDetailsModal;
