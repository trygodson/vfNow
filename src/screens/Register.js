import React from "react";
import { Link } from "react-router-dom";

import TopHeader from "../components/TopHeader";

import register from "../images/register-user-ico.png";
import busines from "../images/register-business-ico.png";
import logo from "../images/logo-black.png";

import { useTranslation } from "react-i18next";
import "../languages/i18n";

function Register() {
  const { t } = useTranslation();

  return (
    <div class="container-fluid">
      <TopHeader title={t("registerMain_screen.register_title")} />
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row yellow-bg user-select">
        <div class="login-wrap">
          <img class="img-fluid sign-logo my-5" src={logo} alt="Vote and Fun" />
          <div class="select-register">
            <Link to={"/userRegister"} class="blk text-decoration-none">
              <img class="ico" src={register} alt="ico" />
              <div class="cont">
                <h5>{t("registerMain_screen.reg_user")}</h5>
                <p>{t("registerMain_screen.reg_user_desc")}</p>
              </div>
            </Link>

            <Link to={"/businessReg"} class="blk business text-decoration-none">
              <img class="ico" src={busines} alt="ico" />
              <div class="cont">
                <h5>{t("registerMain_screen.reg_business")}</h5>
                <p>{t("registerMain_screen.reg_business_desc")}</p>
              </div>
            </Link>
          </div>

          <p class="btm-line">
            {t("register_screen.acc_exist")}{" "}
            <Link to={"/login"}>
              <strong>{t("login_screen.Sign_In")}</strong>
            </Link>
          </p>
        </div>
      </section>

      {/* <!-- Content Section Ends here --> */}
    </div>
  );
}

export default Register;
