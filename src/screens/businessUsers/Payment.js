import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import TopHeader from "../../components/BusinessHeader";
import BusinessFooter from "../../components/BusinessFooter";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import { getUserData } from "../../Functions/Functions";

export default function Election() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [cardNumber, setCardNumber] = useState();
  const [cardMonth, setCardmonth] = useState();
  const [cardyear, setCardyear] = useState();
  const [cardcvv, setCardcvv] = useState();
  const [cardHolder, setCardHolder] = useState();
  const [cardSave, setCardSave] = useState(false);
  const [cardElection, setCardElection] = useState();
  const [user, setUser] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
    }
    const electionId = [];
    if (location?.state?.acountlist) {
      location?.state?.acountlist?.ended_elections.map((item) => {
        electionId.push(item.election_id);
      });
      setCardElection(electionId.join());
      console.log("electionId", electionId.join());
    }
  }, []);
  console.log("loc", location?.state);
  function payment(user) {
    var formData = new FormData();
    formData.append(
      "business_id",
      location?.state?.preview?.business_details?.business_id
    );
    formData.append("card_number", cardNumber);
    formData.append("card_expiry_month", cardMonth);
    formData.append("card_expiry_year", cardyear);
    formData.append("card_cvv", cardcvv);
    formData.append("card_holder_name", cardHolder);
    formData.append(
      "amount",
      location?.state?.status == "account"
        ? location?.state?.acountlist?.total_due_amount
        : 2
    );

    formData.append("save_status", cardSave ? 1 : 0);
    formData.append(
      "payment_for",
      location?.state?.status == "account" ? "Outstanding" : "VFPurchase"
    );
    if (location?.state?.status == "account") {
      formData.append("election_ids", cardElection);
    } else {
      formData.append("purchased_vf_value", cardSave ? 1 : 0);
    }

    ApiCall("Post", API.BusinessPurchasePayment, formData, {
      Authorization: "Bearer " + user?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log("Election list", resp.data);
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t("Header.PAYMENT")} />
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row yellow-bg with-gray pb-5">
        <div class="login-wrap election-form">
          <h5 class="text-center my-5">{t("Header.PAYMENT")}</h5>
          <div class="col-12">
            {/* <h6>SELECT PAYMENT METHODS</h6> */}
            <div class="payment-type-btn">
              <img class="img-fluid" src="images/card-ico.svg" alt="ico" />
              {t("Payment.Stripe")}
            </div>
            {/* <div class="btn-clip-wrap row payment-btns">
              <div class="col-4">
                <div class="btn-border">
                  <button class="btn btn-clip">
                    <img src="images/paypal-ico.svg" alt="ico" />
                    Pay
                  </button>
                </div>
              </div>
              <div class="col-4">
                <div class="btn-border">
                  <button class="btn btn-clip">
                    <img src="images/apple-ico.svg" alt="ico" />
                    Pay
                  </button>
                </div>
              </div>
              <div class="col-4">
                <div class="btn-border">
                  <button class="btn btn-clip">
                    <img src="images/google-ico.svg" alt="ico" />
                    Pay
                  </button>
                </div>
              </div>
            </div> */}
            <hr class="mx-5 my-4" />
            {/* <form action="" class="payment-form"> */}
            <div class="row mb-3">
              <div class="form-group disable col-12">
                <label for=""> {t("Payment.Card Number")}</label>
                <div class="input-border">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="****    ****    ****    7911"
                    // placeholder={t("placeHolders.password")}
                    onChange={(text) => setCardNumber(text.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div class="row mb-4">
              <div class="form-group col-6">
                <label for="">{t("Payment.Expiry date")}</label>
                <div class="input-border">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="MM/YYYY"
                    // placeholder={t("placeHolders.password")}
                    onChange={(text) => setCardmonth(text.target.value)}
                    required
                  />
                </div>
              </div>
              <div class="form-group col-6">
                <label for="">{t("Payment.CVV")}</label>
                <div class="input-border">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="cvv"
                    //   placeholder={t("placeHolders.password")}
                    onChange={(text) => setCardcvv(text.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="form-group col-12">
                <label for="">{t("Payment.Card Holder Name")}</label>
                <div class="input-border">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Aftabul Islam Samudro"
                    //   placeholder={t("placeHolders.password")}
                    onChange={(text) => setCardHolder(text.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div class="row save-card">
              <label for="">{t("Payment.Save card information")}</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  onChange={(e) => setCardSave(e.target.value)}
                  defaultChecked={cardSave}
                />
              </div>
            </div>
            {/* </form> */}
          </div>
          <div class="row mt-4">
            <div class="total-amt mt-3">
              <p>
                {t("Payment.TOTAL DUE AMOUNT")}{" "}
                <strong>
                  {location?.state?.status == "account"
                    ? location?.state?.acountlist.total_due_amount +
                      location?.state?.acountlist.currency
                    : 2}
                </strong>
              </p>
            </div>
          </div>
          <div class="col-12 px-3 mb-5">
            <button
              onClick={() => payment()}
              class="btn btn-black w-100 py-2 mb-3"
            >
              {t("Payment.PAY NOW")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
