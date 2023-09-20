import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import logo from "../images/logo-black.png";
import badge from "../images/free-badge-ico.svg";
import { useTranslation } from "react-i18next";
import "../languages/i18n";

function Splash() {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/splash");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div class="splash-wrap container-fluid">
      <div class="container">
        <img class="img-fluid" src={logo} alt="Vote and Fun" />
        <img class="free-badge" src={badge} alt="ico" />
      </div>
    </div>
  );
}

export default Splash;
