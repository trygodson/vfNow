import React from "react";

import { Link, useLocation } from "react-router-dom";

import QR from "../images/qr-ico.svg";
import acc from "../images/my-acc-ico.svg";
import favbtn from "../images/fav-btm-ico.svg";
import locationicon from "../images/location-ico.svg";
import friends from "../images/friends-ico.svg";
import fun from "../images/fun-ico.svg";
import { useTranslation } from "react-i18next";
import "../languages/i18n";

export default function Footer({ user }) {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <div class="modal reg-modal bg-blur" id="login-message">
        <div class="modal-dialog modal-dialog-centered">
          <div
            class="modal-content minh-unset"
            data-bs-dismiss="modal"
            data-bs-dismiss="modal"
          >
            <div class="alert-bubble-img">
              <img
                class="img-fluid"
                src="images/alert-msg-bubble.png"
                alt="ico"
              />
              <div class="cont py-3">
                <h5>
                  {t("alerts.Hi!")} <br />
                  {t("alerts.you are still visitor")}
                </h5>
                <h5 class="dark">{t("alerts.Click to log-in!!!")}</h5>
              </div>
            </div>
            <div class="button-btm-sec">
              <Link class="btn btn-yellow text-uppercase w-100" to={"/login"}>
                {t("Buttons.Log-in")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer>
        {user?.login_as == "visitor" && (
          <Link class="ftr-top" to={"/login"}>
            <img class="fun-ico" src={fun} alt="" />
            <p>{t("Footer.title")}</p>
            <button class="btn">{t("Footer.LOG-IN")}</button>
          </Link>
        )}
        <div class="footer-btm">
          <div class="ftr-btn">
            {user?.login_as == "visitor" ? (
              <div
                data-bs-toggle="modal"
                data-bs-target="#login-message"
                class="link"
              >
                <span class="ico-blk">
                  <img src={acc} alt="" />
                </span>
                <p>{t("Footer.My Account")}</p>
              </div>
            ) : (
              <Link
                to={"/UserProfile"}
                class={`link  ${
                  location.pathname == "/UserProfile" ? "active" : ""
                } `}
              >
                <span class="ico-blk">
                  <img src={acc} alt="" />
                </span>
                <p>{t("Footer.My Account")}</p>
              </Link>
            )}

            {/* {user?.login_as == "visitor" ? (
              <div
                data-bs-toggle="modal"
                data-bs-target="#login-message"
                class="link"
              >
                <span class="ico-blk">
                  <img src={favbtn} alt="" />
                </span>
                <p>{t("Footer.Favorites")}</p>
              </div>
            ) : ( */}
            <Link
              to={"/UserFavourite"}
              class={`link  ${
                location.pathname == "/UserFavourite" ? "active" : ""
              } `}
            >
              <span class="ico-blk">
                <img src={favbtn} alt="" />
              </span>
              <p>{t("Footer.Favorites")}</p>
            </Link>
            {/* )} */}
          </div>
          <div class="ftr-btn">
            <Link
              to={"/homeMap"}
              class={`link  ${
                location.pathname == "/homeMap" ? "active" : ""
              } `}
            >
              <span class="ico-blk">
                <img src={locationicon} alt="" />
              </span>
              <p>{t("Footer.By Location")}</p>
            </Link>
            {user?.login_as == "visitor" ? (
              <div
                data-bs-toggle="modal"
                data-bs-target="#login-message"
                class="link"
              >
                <span class="ico-blk">
                  <img src={friends} alt="" />
                </span>
                <p>{t("Footer.Friends")}</p>
              </div>
            ) : (
              <Link
                to={"/UserFriendList"}
                class={`link  ${
                  location.pathname == "/UserFriendList" ? "active" : ""
                } `}
              >
                <span class="ico-blk">
                  <img src={friends} alt="" />
                </span>
                <p>{t("Footer.Friends")}</p>
              </Link>
            )}
          </div>
          <Link to={"/Scan"} class="btn btn-scan">
            <span>
              <img class="img-fluid" src={QR} alt="" />
              {t("Footer.Scan")}
            </span>
          </Link>
        </div>
      </footer>
    </>
  );
}
