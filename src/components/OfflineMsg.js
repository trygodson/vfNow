import React from "react";

import { useTranslation } from "react-i18next";
import "../languages/i18n";
function Offline({ error, setError, title }) {
  const { t } = useTranslation();
  return (
    <div
      class="modal bg-blur reg-modal show"
      role="dialog"
      aria-hidden="true"
      style={{
        display: error ? "block" : "none",
        backgroundColor: "white",
      }}
      //   onClick={() => setError(false)}
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content minh-unset" data-bs-dismiss="modal">
          <div class="alert-bubble-img">
            <img
              class="img-fluid"
              src="images/alert-msg-bubble.png"
              alt="ico"
            />
            <div class="cont">
              <h5>{t("alerts.OOOPS")}</h5>
              <p>{t("alerts.you are off-line")}</p>
              <p>{t("alerts.Please go online to continue to navigate")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Offline;
