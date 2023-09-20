import React from "react";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import BusinessFooter from "../../components/BusinessFooter";

export default function Customer() {
  const { t } = useTranslation();
  return (
    <div class="container-fluid">
      <section class="content-sec row pb-0 mt-0">
        <div class="scan-sec">
          <span class="placeholder-text">
            {t("Scan_Screen.SCAN")} <br />
            {t("Scan_Screen.QR-CODE")} <br />
            {t("Scan_Screen.AREA")}
          </span>
          <span class="info-text">
            {t(
              "Scan_Screen.Scan QR-CODE to easily find your FRIENDS, BUSINESS PLACE or"
            )}
            <br />
            {t("Scan_Screen.to receive VOTES AT THE BUSINESS PLACE")}!!!
          </span>
        </div>
      </section>
      <BusinessFooter />
    </div>
  );
}
