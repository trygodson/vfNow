import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { getUserData } from "../../Functions/Functions";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import TopHeader from "../../components/TopHeader";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import GiveVoteRank from "./GiveVoteRank";
import GeneralElection from "../../components/GeneralElection";

import { Carousel } from "react-responsive-carousel";
import { useTranslation } from "react-i18next";
import "../../languages/i18n";

export default function GiveVote() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [VoteScreen, setVoteScreen] = useState(false);
  const [user, setUser] = useState(location?.state?.candidate);
  const [election, setElection] = useState(location?.state?.election);
  const [vote, setVote] = useState(0);
  const [voted, setVoted] = useState(false);
  const [votedwait, setVotedwait] = useState(false);
  const [visitorvote, setVisitorVote] = useState();
  const [timeLeft, setTimeLeft] = useState();
  const [users, setUsers] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUsers(userData);
      setLoader(true);
      GiveVoteDetail(userData);
    }
  }, []);

  const calculateTimeLeft = () => {
    if (visitorvote) {
      let diffTime = Math.abs(
        new Date().valueOf() - new Date(`${visitorvote}`).valueOf()
      );
      let days = diffTime / (24 * 60 * 60 * 1000);
      let hours = (days % 1) * 24;
      let minutes = (hours % 1) * 60;
      let secs = (minutes % 1) * 60;
      [days, hours, minutes, secs] = [
        Math.floor(days),
        Math.floor(hours),
        Math.floor(minutes),
        Math.floor(secs),
      ];
      if (Math.floor(days) == 0) {
        return hours + "h " + minutes + "m " + secs + "s";
      } else if (Math.floor(days) == 0 && Math.floor(hours) == 0)
        return minutes + "m " + secs + "s";
      else return days + "d " + hours + "h " + minutes + "m " + secs + "s";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  function GiveVoteDetail(users) {
    var formData = new FormData();

    formData.append("candidate_id", location?.state?.candidate?.candidate_id);
    formData.append("election_id", location?.state?.candidate?.election_id);
    formData.append("user_id", users?.user_id);

    ApiCall("Post", API.GiveVoteDetailApi, formData, {
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
        setVote(resp.data.data.election_details.votes_count);
        console.log("data View test", resp.data.data);
        setVisitorVote(
          resp.data.data?.election_details?.vote_date_time
        );
        // alert(resp.data.message);
      });
  }
  function VisitorVoteAdd(candidateid, electionID) {
    var formData = new FormData();
    setLoader(true);
    formData.append("user_id", users?.user_id);
    formData.append("candidate_id", candidateid);
    formData.append("election_id", electionID);

    ApiCall("Post", API.VisitorVoteAddApi, formData, {
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
        GiveVoteDetail(users);
        setVisitorVote(resp.data.data?.vote_date_time);
        setVoteScreen(!VoteScreen);
        // if (users?.login_as == "manual") {
        //   navigate("/GiveVoteRank", {
        //     state: {
        //       candidate_id: user?.candidate_id,
        //       election_id: user?.election_id,
        //     },
        //   });
        // }
        console.log("visitor vote View", resp.data.data);
      });
  }
  // console.log(visitorvote, "hello");
  return (
    <div class="container-fluid">
      {VoteScreen ? (
        <GiveVoteRank
          setVoteScreen={setVoteScreen}
          VoteScreen={VoteScreen}
          candidate_id={user?.candidate_id}
          election_id={user?.election_id}
          VisitorVoteAdd={() =>
            //VisitorVoteAdd(user?.candidate_id, user?.election_id)
            setVoteScreen(false)
          }
        />
      ) : (
        <>
          <TopHeader title={t("Header.Give a Vote")} />
          {loader && <Loader />}
          <section class="content-sec row">
            <div class="vote-sec px-0">
              <img
                class="w-100 img-fluid"
                src="images/vote-base-bg.jpg"
                alt="ico"
              />
              <div class="msg-bubble">
                <img src="images/msg-bubble.png" alt="img" />
                <div class="cont">
                  <p>
                    {t("alerts.you are voting for")}
                    <br />
                    {user?.username}
                  </p>
                </div>
              </div>
              <div class="avatar-img">
                <img
                  src={user?.avatar ? user?.avatar : "images/avatar-big-1.png"}
                  alt="img"
                />
              </div>
            </div>
            <h5 class="vote-user">{user?.username}</h5>
            <div class="voted-img">
              <img class="img-fluid" src="images/voted-bubble.png" alt="img" />
            </div>
            <div class="product-wrap item-snippet">
              <div class="row">
                <GeneralElection
                  items={election}
                  indexs={0}
                  user={user && user}
                  loader={loader}
                  setLoader={setLoader}
                />
              </div>
              {visitorvote && users?.login_as == "visitor" ? (
                <button
                  class="w-100 btn btn-yellow btn-inactive confirm-btn mb-3 pointer-event-unset"
                  onClick={() => {
                    setVotedwait(true);
                  }}
                >
                  {t("Buttons.CONFIRM VOTE in")} {timeLeft}
                </button>
              ) : (
                <>
                  {users?.login_as == "visitor" ? (
                    <button
                      class="w-100 btn btn-yellow text-uppercase mb-3"
                      onClick={() => {
                        VisitorVoteAdd(user?.candidate_id, user?.election_id);
                        setVoted(true);
                      }}
                    >
                      {t("Buttons.Confirm Vote")}
                    </button>
                  ) : (
                    <button
                      class="w-100 btn btn-yellow text-uppercase mb-3"
                      onClick={() =>
                        VisitorVoteAdd(user?.candidate_id, user?.election_id)
                      }
                    >
                      {t("Buttons.Confirm Vote")}
                    </button>
                  )}
                </>
              )}
              {visitorvote && (
                <p class="my-4 text-center">
                  <button
                    onClick={() => navigate(-1)}
                    class="transparent fw-bold border-0"
                  >
                    {t("Buttons.CONTINUE")}
                  </button>
                </p>
              )}
            </div>
          </section>
        </>
      )}

      <div
        class="modal bg-blur reg-modal show"
        role="dialog"
        aria-hidden="true"
        style={{
          display: voted ? "block" : "none",
          backgroundColor: "rgba(222, 223, 222 , 0.9)",
        }}
        onClick={() => {
          setVoted(false);
          setVoteScreen(true);
          // navigate("/GiveVoteRank", {
          //   state: {
          //     candidate_id: user?.candidate_id,
          //     election_id: user?.election_id,
          //   },
          // });
        }}
      >
        <div class="modal-dialog modal-dialog-centered heigh-cal">
          <div class="modal-content minh-unset">
            <div class="alert-bubble-img mt-0">
              <img
                class="img-fluid"
                src="images/alert-msg-bubble.png"
                alt="ico"
              />
              <div class="cont">
                <h5>{t("alerts.VOTED!!!")}</h5>
                <p>{t("alerts.LOG-IN to give more than 1 vote per time")}!!!</p>
              </div>
            </div>
            <div class="button-btm-sec margin-set">
              <Link
                data-bs-dismiss="modal"
                to={"/login"}
                class="btn btn-yellow text-uppercase w-100"
              >
                {t("Buttons.Sign-up")}
              </Link>
              <Link
                to={"/GiveVoteRank"}
                state={{
                  candidate_id: user?.candidate_id,
                  election_id: user?.election_id,
                }}
                data-bs-dismiss="modal"
                class="text-link text-uppercase font-bold"
              >
                {t("Buttons.Continue as Visitor")}
              </Link>
              {/* <a href="javascript:;" class="text-link">
                Continue as Visitor
              </a> */}
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal bg-blur show"
        style={{
          display: votedwait ? "block" : "none",
          backgroundColor: "rgba(222, 223, 222 , 0.9)",
        }}
        onClick={() => {
          setVotedwait(false);
        }}
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="alert-bubble-img mt-0">
              <img
                class="img-fluid"
                src="images/alert-msg-bubble.png"
                alt="ico"
              />
              <div class="cont">
                <h5> {t("alerts.OOOPS")}</h5>
                <p>
                  {t(
                    "alerts.You already voted. Please wait a bit more to vote again"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer user={users && users} />
    </div>
  );
}
