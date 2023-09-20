import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import TopHeader from "../../components/BusinessHeader";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import { getUserData } from "../../Functions/Functions";

export default function Election() {
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();
  const [acountlist, setAccountList] = useState([]);
  const [user, setUser] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      OutstandingAccount(userData);
    }
  }, []);

  function OutstandingAccount(user) {
    var formData = new FormData();
    formData.append(
      "business_id",
      location?.state?.preview?.business_details?.business_id
    );

    ApiCall("Post", API.BusinessOutstanding, formData, {
      Authorization: "Bearer " + user?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log("setAccountList list", resp.data);
        setAccountList(resp.data.data);
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t("Header.OUTSTANDING PAYMENT")} />
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row yellow-bg with-gray pb-5">
        <div class="login-wrap election-form">
          <h5 class="text-center my-5">{t("Header.OUTSTANDING PAYMENT")}</h5>
          <div class="col-12">
            <div class="product-wrap">
              <div class=" mb-3 col-12">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t("businessPage.Election ENDED")} </h3>
              </div>
              <div class="col-12">
                {acountlist?.ended_elections?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() =>
                        navigate("/electionDetails", {
                          state: {
                            election_id: item.election_id,
                            election_date_time: item?.election_date_time,
                          },
                        })
                      }
                      class="payment-snip mb-2"
                    >
                      <div class="img-wrap">
                        <img
                          src={
                            item.gift_images[0]?.picture
                              ? item.gift_images[0]?.picture
                              : "images/product-img.jpg"
                          }
                          alt="img"
                        />
                      </div>
                      <div class="cont">
                        <h6>{item.gift_title}</h6>
                        <p>
                          <img src="images/vote-ico.svg" alt="ico" />
                          {item.votes_count} {t("businessPage.Total Votes")}
                        </p>
                      </div>
                      <a href="javacsript:;" class="arrow">
                        <img
                          class="img-fluid"
                          src="images/arrow-ico.svg"
                          alt="ico"
                        />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="total-amt mb-2 py-2 white">
              <p>
                {t("businessPage.TOTAL VOTES RECEIVED")}
                <strong>{acountlist?.total_votes_received}</strong>
              </p>
            </div>
            <div class="total-amt mb-0 py-2 white">
              <p>
                {t("businessPage.DUE AMOUNT FOR VOTES")}
                <strong>
                  {acountlist?.votes_due_amount} {acountlist?.currency}
                </strong>
              </p>
            </div>
            <p class="text-center mb-2">
              <small>{t("businessPage.Rate applied")} 0.01 SGD/Vote</small>
            </p>
            <div class="total-amt mb-3 py-2 white">
              <p>
                {t("businessPage.VOTE & FUN DISCOUNT")}
                <strong>
                  {acountlist?.vf_discount} {acountlist?.currency}
                </strong>
              </p>
            </div>
            <div class="total-amt">
              <p>
                {t("businessPage.TOTAL DUE AMOUNT")}{" "}
                <strong>
                  {acountlist?.total_due_amount} {acountlist?.currency}
                </strong>
              </p>
            </div>
          </div>
          <div class="col-12 px-3 mb-5">
            <Link
              to={"/Payment"}
              state={{
                preview: location.state?.preview,
                status: "account",
                acountlist: acountlist,
              }}
              class="btn btn-black w-100 py-2 mb-3"
            >
              {t("Buttons.PROCEED TO PAYMENT")}
            </Link>
          </div>
        </div>
      </section>
      {/* <!-- Content Section Ends here -->
        <!-- Footer Starts here --> */}
    </div>
  );
}
