import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import TopHeader from "../../components/BusinessHeader";
import BusinessFooter from "../../components/BusinessFooter";
import Loader from "../../components/Loader";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import { getUserData } from "../../Functions/Functions";

export default function Election() {
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();
  const [electionVotelist, setElectionVoteList] = useState([]);

  const [user, setUser] = useState();

  const [loader, setLoader] = useState(false);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState("");

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      VoteHistoryList(userData);
    }
  }, []);

  function VoteHistoryList(user) {
    console.log("user", user);
    var formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("type", "user");
    formData.append("election_id", location?.state?.election_id);

    ApiCall("Post", API.VoteHistory, formData, {
      Authorization: "Bearer " + user?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        setError(true);
        seterror_title("Error!");
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log("Election list", resp.data);
        setElectionVoteList(resp.data.data);
        if (resp.data.success) {
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  return (
    <div class="container-fluid p-0">
      {loader && <Loader />}
      <TopHeader title={t("Header.VOTE HISTORY")} />
      {/* <!-- Content Section Starts here --> */}

      <section class="content-sec w-100 row mx-0">
        {/* <!-- Desk title start here --> */}

        {/* <!-- Desk title Ends here --> */}
        <div class="w-50-desk mx-auto-desk-top px-0">
          <div class="vote-sec vote-visitor-step-desk px-0">
            <img
              class="w-100 img-fluid"
              src="images/vote-base-bg.svg"
              alt="ico"
            />

            <div class="winner-sec">
              <div
                class="winner-img"
                onClick={() => {
                  navigate("/VoteUser", {
                    state: {
                      user_id: electionVotelist?.user?.user_id,
                    },
                  });
                }}
              >
                <img
                  src={
                    electionVotelist?.user?.avatar
                      ? electionVotelist?.user?.avatar
                      : "images/avatar-big-2.png"
                  }
                  alt="username"
                />
              </div>
              {location?.state?.status == 1 ? (
                <div class="winner-badge">
                  <div class="badge-cont">
                    <span class="win">01</span>
                    <h6>{electionVotelist?.user?.username}</h6>
                    <p>
                      <img src="images/vote-ico.svg" alt="ico" />{" "}
                      {electionVotelist?.user?.vote_count == ""
                        ? "0"
                        : electionVotelist?.user?.vote_count}
                    </p>
                  </div>
                  <img
                    class="img-fluid"
                    src="images/winner-badge-trimmed.png"
                    alt="image"
                  />
                </div>
              ) : (
                <div class="winner-badge">
                  <div class="badge-cont">
                    <span class="win">{location?.state?.status}</span>
                    <h6>{electionVotelist?.user?.username}</h6>
                    <p>
                      <img src="images/vote-ico.svg" alt="ico" />
                      {electionVotelist?.user?.vote_count == ""
                        ? "0"
                        : electionVotelist?.user?.vote_count}
                    </p>
                  </div>
                  <img
                    class="img-fluid move-up"
                    src="images/not-winner-badge.png"
                    alt="image"
                  />
                </div>
              )}
              <div class="vote-contain vote-first-place">
                <div
                  class={`${
                    location?.state?.status == 1
                      ? "count-content"
                      : "count-content count-content-99"
                  }`}
                  onClick={() => {
                    navigate("/VoteUser", {
                      state: {
                        user_id: electionVotelist?.user?.user_id,
                      },
                    });
                  }}
                >
                  <img src="images/count-visitor.svg" alt="countvisitor" />
                  <h4>{electionVotelist?.vote_from_visitor}</h4>
                  <p>{t("Vote_Screen.Vote from VISITOR")}</p>
                </div>
                <div class="vote-add">
                  <img src="images/vote-plus-icon.svg" />
                </div>
                <div
                  class={`${
                    location?.state?.status == 1
                      ? "count-content"
                      : "count-content count-content-99"
                  }`}
                >
                  <img src="images/count-visitor.svg" alt="countvisitor" />
                  <h4>{electionVotelist?.vote_from_friend}</h4>
                  <p>{t("Vote_Screen.Vote from FRIEND")}</p>
                </div>
                <div class="vote-add">
                  <img src="images/vote-plus-icon.svg" />
                </div>

                <div
                  class={`${
                    location?.state?.status == 1
                      ? "count-content"
                      : "count-content count-content-99"
                  }`}
                >
                  <img src="images/count-visitor.svg" alt="countvisitor" />
                  <h4>{electionVotelist?.vote_from_shop}</h4>
                  <p>{t("Vote_Screen.Vote from SHOP")}</p>
                </div>
              </div>
            </div>

            <div class="col-12 px-3 my-5">
              <button class="btn btn-yellow text-uppercase w-100 my-3">
                {t("Vote_Screen.ASK FOR MORE VOTE")}
              </button>
            </div>
          </div>

          <div class="product-wrap">
            {electionVotelist?.vote_history?.length > 0 && (
              <div class=" mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t("Vote_Screen.Vote history")}</h3>
              </div>
            )}
            {electionVotelist?.vote_history?.map((item, index) => {
              return (
                <div class="candidate-snippet" key={index}>
                  <div
                    class="user-img"
                    onClick={() => {
                      navigate("/VoteUser", {
                        state: {
                          user_id: item?.user_id,
                        },
                      });
                    }}
                  >
                    <img
                      src={item?.avatar ? item?.avatar : "images/VFAlien.png"}
                      alt="Name"
                    />
                  </div>
                  <div class="avatar-cont">
                    <div class="ac-lft">
                      <h6 class="text-truncate">{item?.username}</h6>
                      <div class="history-count">
                        <span>
                          {t("Vote_Screen.Vote from")} {item?.vote_from}
                        </span>
                        <span>
                          {t("Vote_Screen.Received on")} {item?.received_on}
                        </span>
                      </div>
                    </div>
                    <button class="btn btn-vote d-flex">
                      <img
                        class="img-fluid"
                        src="images/vote-hand.svg"
                        alt="ico"
                      />
                      <span>{item?.vote_count}</span>
                    </button>
                  </div>
                </div>
              );
            })}
            {electionVotelist?.vote_history?.length == 0 && (
              // <p className="Empty-text-msg">
              <p className="m-2 text-center">
                {t("Vote_Screen.There are no other votes to be showed")}
              </p>
            )}
          </div>
        </div>
      </section>
      <BusinessFooter />
    </div>
  );
}
