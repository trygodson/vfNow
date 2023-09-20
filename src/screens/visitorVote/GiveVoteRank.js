import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { storeUserData, getUserData } from "../../Functions/Functions";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";

import TopHeader from "../../components/TopHeader";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import ProgressBar from "../../components/ProgressBar";
import { useTranslation } from "react-i18next";
import "../../languages/i18n";

export default function GiveVote({
  setVoteScreen,
  VoteScreen,
  candidate_id,
  election_id,
  VisitorVoteAdd,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState();
  const [rank, setRank] = useState();

  const [loader, setLoader] = useState(false);
  const [users, setUsers] = useState();

  // console.log("location?.state", location?.state);
  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUsers(userData);
      setLoader(true);
      VisitorVoteRank(userData, candidate_id, election_id);
    }
  }, []);

  function VisitorVoteRank(users, candidateid, electionID) {
    var formData = new FormData();

    formData.append("candidate_id", candidateid);
    formData.append("election_id", electionID);

    ApiCall("Post", API.VisitorVoteRankApi, formData, {
      Authorization: `Bearer ` + users?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        setRank(resp.data.data);
        console.log("ranllll View", resp.data.data);
      });
  }

  return (
    <div>
      <TopHeader
        title={t("Header.Give a Vote")}
        backarrow={true}
        backarrowftn={() => setVoteScreen(false)}
      />
      {loader && <Loader />}
      <section class="content-sec row">
        <div class="vote-sec px-0">
          <img
            class="w-100 img-fluid"
            src="images/vote-base-bg.svg"
            alt="ico"
          />
          <div class="msg-bubble">
            <img src="images/msg-bubble.png" alt="img" />
            <div class="cont">
              <p>
                {t("alerts.THANK YOU!!!")}
                <br />
                {t("alerts.vote again!")}
              </p>
            </div>
          </div>
          {rank?.candidate_id == rank?.rankings[0]?.candidate_id ? (
            <div class="winner-sec">
              <div class="winner-img">
                <img
                  onClick={() =>
                    navigate("/VoteUser", {
                      state: {
                        user_id: rank?.candidate_id,
                      },
                    })
                  }
                  src={rank?.avatar ? rank?.avatar : "images/avatar-big-1.png"}
                  alt="username"
                />
              </div>
              <div class="winner-badge">
                <div class="badge-cont">
                  <span class="win">01</span>
                  <h6>{rank?.username}</h6>
                  <p>
                    <img src="images/vote-ico.svg" alt="ico" />{" "}
                    {rank?.vote_count}
                  </p>
                </div>
                <img
                  class="img-fluid"
                  src="images/winner-badge-trimmed.png"
                  alt="image"
                />
              </div>
            </div>
          ) : (
            <div class="winner-sec">
              <div
                class="winner-img"
                onClick={() =>
                  navigate("/VoteUser", {
                    state: {
                      user_id: rank?.candidate_id,
                    },
                  })
                }
              >
                <img
                  src={rank?.avatar ? rank?.avatar : "images/avatar-big-1.png"}
                  alt="username"
                />
              </div>
              <div class="winner-badge">
                <div class="badge-cont">
                  <span class="win">{rank?.vote_count}</span>
                  <h6>{rank?.username}</h6>
                  <p>
                    <img src="images/vote-ico.svg" alt="ico" />{" "}
                    {rank?.vote_count}
                  </p>
                </div>
                <img
                  class="img-fluid move-up"
                  src="images/not-winner-badge.png"
                  alt="image"
                />
              </div>
            </div>
          )}

          <div class="col-12 px-4 my-4">
            <button class="btn btn-black w-100 text-uppercasepy-2">
              <img
                class="img-fluid me-2"
                src="images/message-ico.svg"
                alt="ico"
              />
              {t("Buttons.Send a message")}
            </button>
          </div>
        </div>

        <div class="product-wrap ">
          <div class=" mb-3">
            {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
            <h3> {t("Buttons.Ranking")}</h3>
          </div>
          {rank?.rankings?.map((item, index) => {
            return (
              <div
                key={index}
                class={`candidate-snippet m-0 w-100 ${
                  item.candidate_id == rank.candidate_id ? "bordered" : ""
                } `}
              >
                <div
                  class="user-img"
                  onClick={() =>
                    navigate("/VoteUser", {
                      state: {
                        user_id: item?.user_id,
                      },
                    })
                  }
                >
                  <img
                    src={
                      item?.avatar ? item?.avatar : "images/avatar-img-2.png"
                    }
                    alt="Name"
                  />
                </div>
                <div class="avatar-cont">
                  <div class="ac-lft">
                    <h6 class="text-truncate">{item.username}</h6>
                    <div class="vote-count">
                      <img src="images/vote-ico.svg" alt="ico" />
                      {item.votes_count}
                    </div>
                    <ProgressBar
                      position={item?.position}
                      remaining={
                        rank?.rankings &&
                        parseInt(rank?.rankings[0]?.votes_count) -
                          parseInt(item?.votes_count)
                      }
                    />
                  </div>
                  <button class="btn btn-empty">
                    <img
                      class="img-fluid"
                      src="images/vote-button-active.svg"
                      alt="ico"
                    />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => {
              VisitorVoteAdd();
            }}
            style={{ width: "92%" }}
            class="btn btn-yellow text-uppercase"
          >
            {t("Buttons.Vote Again")}
          </button>
        </div>
      </section>
      <Footer user={users && users} />
    </div>
  );
}
