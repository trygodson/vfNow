import React from "react";

import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../languages/i18n";

export default function BusinessFooter() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <footer>
      <div class="footer-btm border-top">
        <div class="ftr-btn">
          <Link
            to={"/myPage"}
            class={`link  ${location.pathname == "/myPage" ? "active" : ""} `}
          >
            <span class="ico-blk">
              <img src="images/home-btm-ico.svg" alt="ico" />
            </span>
            <p>{t("Footer.My Page")}</p>
          </Link>
          <Link
            to={"/election"}
            class={`link  ${location.pathname == "/election" ? "active" : ""} `}
          >
            <span class="ico-blk">
              <img src="images/election-btm-ico.svg" alt="" />
            </span>
            <p>{t("Footer.Election")}</p>
          </Link>
        </div>
        <div class="ftr-btn">
          <Link
            to={"/newElection"}
            class={`link  ${
              location.pathname == "/newElection" ? "active" : ""
            } `}
          >
            <span class="ico-blk">
              <img src="images/election-add-btm-ico.svg" alt="" />
            </span>
            <p>{t("Footer.Add Election")}</p>
          </Link>
          <Link
            to={"/customers"}
            class={`link  ${
              location.pathname == "/customers" ? "active" : ""
            } `}
          >
            <span class="ico-blk">
              <img src="images/friends-ico.svg" alt="" />
            </span>
            <p>{t("Footer.Friends")}</p>
          </Link>
        </div>
        <Link to={"/Scan"} class="btn btn-scan">
          <span>
            <img class="img-fluid" src="images/qr-ico.svg" alt="" />
            {t("Footer.Scan")}
          </span>
        </Link>
      </div>
    </footer>
  );
}
