import React from "react";

import { Link, useNavigate } from "react-router-dom";

import home from "../images/home-ico.svg";
import icon from "../images/arrow_back_ios-24px.svg";

import "../languages/i18n";

function TopHeader({ title }) {
  const navigate = useNavigate();

  return (
    <header class="top-bar">
      <div class="container">
        <div class="row">
          <div class="col-12 tob-bar-inner">
            <button onClick={() => navigate(-1)} class="btn pe-0">
              <img src={icon} />
            </button>
            <h6>{title}</h6>

            <Link to={"/businessHome"} class="btn d-flex">
              <img
                src={home}
                className="w-full z-0 left-8 lazyload"
                alt="web3.0 browser"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
