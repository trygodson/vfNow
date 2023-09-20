import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import TopHeader from "../../components/BusinessHeader";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import { getUserData } from "../../Functions/Functions";

export default function Election() {
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const [performance, setPerformance] = useState(
    location?.state?.preview?.performance
  );
  const [user, setUser] = useState();
  const [percent, setPercent] = useState();
  const [vfValue, setVfvalue] = useState();
  const [amount, setAmount] = useState();
  const [calculate, setCalculate] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      console.log("userData", userData);
      //   CategoryList(userData);
    }
  }, []);

  function Calculate() {
    var formData = new FormData();
    formData.append(
      "business_id",
      location?.state?.preview?.business_details?.business_id
    );
    formData.append("better_than_percent", percent);
    formData.append("additional_vf", vfValue);
    formData.append("amount_paid", amount);

    ApiCall("Post", API.BusinessPurchaseCalculate, formData, {
      Authorization: "Bearer " + user?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setCalculate(resp.data.data);
        console.log("Election list", resp.data);
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t("businessPage.VF Value")} />
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row yellow-bg with-gray pb-5">
        <div class="login-wrap election-form px-3">
          <h5 class="text-center">{t("Payment.PURCHASE VF VALUE")}</h5>
          <div class="performance-sec">
            <div class="per-cont">
              <div class="big-circle">
                <img
                  class="img-fluid"
                  src="images/performance-circle-big-dotted.png"
                  alt="ico"
                />
                <div class="cont">
                  <span class="yellow"> {t("businessPage.VF Value")}</span>
                  <h5>
                    <img
                      class="ico"
                      src="images/candidate-logo.png"
                      alt="ico"
                    />
                    {performance?.vf_value}
                  </h5>
                  <hr />
                  <img
                    class="chart-img img-fluid"
                    src="images/bar-chat.png"
                    alt="ico"
                  />
                  <hr />
                  <span class="yellow">{t("businessPage.Better than")}</span>
                  <h5>
                    {" "}
                    {/* {calculate?.better_than_other
                      ? calculate?.better_than_other
                      : performance?.better_than}{" "} */}
                    {calculate?.better_than_other} %
                  </h5>
                  <span class="yellow">{t("Payment.Of Business")}</span>
                </div>
              </div>
            </div>
            <span class="status">{t("Payment.CURRENT STATUS")}</span>
          </div>

          <span class="val">{t("Payment.ENTER ONE OF THE VALUE")}</span>
          <h6 class="mt-3">
            <strong>{t("Payment.Better than other Business places")}</strong>
          </h6>
          <div class="form-group bg minh-unset p-0 mb-2">
            <input
              type="text"
              class="form-control"
              placeholder="Enter final %"
              // placeholder={t("placeHolders.password")}
              onChange={(text) => setPercent(text.target.value)}
              required
            />
          </div>
          <h6 class="mt-4">
            <strong>{t("Payment.Additional VF Value")}</strong>
          </h6>
          <div class="form-group bg minh-unset p-0 mb-2">
            <input
              type="text"
              class="form-control"
              placeholder="Enter VF value"
              // placeholder={t("placeHolders.password")}
              onChange={(text) => setVfvalue(text.target.value)}
              required
            />
          </div>
          <h6 class="mt-4">
            <strong>{t("Payment.Amount to be paid")}</strong>
          </h6>
          <div class="form-group bg minh-unset p-0">
            <input
              type="text"
              class="form-control"
              placeholder="Enter amount (SGD)"
              // placeholder={t("placeHolders.password")}
              onChange={(text) => setAmount(text.target.value)}
              required
            />
          </div>
          <span class="rate-tag">
            {t("Payment.Rate applied")}{" "}
            {calculate?.rate_applied ? calculate?.rate_applied : "0.01"} SGD/VF
          </span>
          <div class="col-12 mt-4 text-center mb-5">
            <button class="btn btn-gray px-4" onClick={() => Calculate()}>
              {t("Payment.Calculate")}
            </button>
          </div>

          <div class="total-amt">
            <p>
              {t("businessPage.TOTAL DUE AMOUNT")}{" "}
              <strong>
                {calculate?.total_due_amount} {calculate?.currency}
              </strong>
            </p>
          </div>
          <div class="col-12 px-3 mb-5">
            <Link
              to={"/Payment"}
              state={{
                preview: location.state?.preview,
                status: "vfValue",
                acountlist: calculate,
              }}
              class="btn btn-black w-100 py-2 mb-3"
            >
              {t("Buttons.PROCEED TO PAYMENT")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
