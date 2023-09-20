import React from "react";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";

function RemoveCandidateModal({ error, setError, title, ftn, color }) {
  const { t, i18n } = useTranslation();
  const [isstate, setIsState] = React.useState(false);
  return (
    <div
      class="modal bg-blur reg-modal show"
      role="dialog"
      aria-hidden="true"
      style={{
        display: error ? "block" : "none",
        backgroundColor: "rgba(222, 223, 222 , 0.9)",
      }}
      onClick={() => {
        if (isstate) {
          setError(false);
          ftn();
        }
      }}
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-contain-desk">
          <div class="free-gift-info mt-4">
            <img
              class="finger-ico img-fluid mb-3 mt-3"
              src="images/alert-finger-ico.png"
              alt="ico"
            />
            <h5 class="text-center mb-5">{t("Buttons.REMOVE CANDIDATE")}</h5>
            {!isstate ? (
              <>
                <p class="fs-16 mb-5">{t("election.alert-candidate-msg2")}</p>

                <h5 class="text-center mb-5 ">
                  <strong>{t("election.alert-candidate-ques")}</strong>
                </h5>
              </>
            ) : (
              <p class="fs-16 mb-5">{t("election.alert-candidate-msg")}</p>
            )}
            {!isstate && (
              <div class="yes-no-btn">
                <div class="circle-btn">
                  <button class="no" onClick={() => setIsState(true)}>
                    {t("alerts.YES")}
                  </button>
                  {/* <p>
                  CONFIRM LESS THAN
                  <br />5 STAR
                </p> */}
                </div>

                <div class="circle-btn">
                  <button onClick={() => setError(false)}>
                    {t("placeHolders.radio_no")}
                  </button>
                  {/* <p>
                  INCREASE THE
                  <br /> NUMBER OF STAR
                </p> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RemoveCandidateModal;
