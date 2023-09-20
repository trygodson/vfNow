import React from "react";

import { useTranslation } from "react-i18next";
import "../languages/i18n";
function ModifyMsg({
  error,
  setError,
  title,
  UpdateUser,
  setImagePreview,
  setUsername,
}) {
  const { t } = useTranslation();
  return (
    <div
      class="modal bg-blur reg-modal show"
      role="dialog"
      aria-hidden="true"
      style={{
        display: error ? "block" : "none",
        backgroundColor: "rgba(222, 223, 222 , 0.9)",
      }}
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content minh-unset" data-bs-dismiss="modal">
          <div class="alert-bubble-img">
            <div class="cont">
              <p>{t("alerts.You are going to modify your") + "  " + title}</p>
              <p>
                {t(
                  "alerts.If you confirm modification your friend may not easily recognize you…"
                )}
              </p>
              <p>
                {t("alerts.Are you sure to modify your") + "  " + title + "?"}
              </p>
              <div className="plus18-button">
                <button
                  className="bg-transparent border-0"
                  onClick={() => {
                    UpdateUser();
                    setError(false);
                  }}
                >
                  <p>{t("placeHolders.radio_yes")}</p>
                </button>
                <button
                  className="bg-transparent border-0"
                  onClick={() => {
                    setError(false);
                    setImagePreview();
                    setUsername("");
                  }}
                >
                  <p> {t("placeHolders.radio_no")}</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModifyMsg;
