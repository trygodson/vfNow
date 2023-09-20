import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import BusinessFooter from "../../components/BusinessFooter";
import Loader from "../../components/Loader";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import { getUserData } from "../../Functions/Functions";
import moment from "moment";

export default function Customer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [friendsElection, setfriendsElection] = useState();
  const [searchFriendsElection, setSearchfriendsElection] = useState();
  const [friendsCustomer, setfriendsCustomer] = useState();
  const [userVfAssistance, setUserVfAssistance] = useState();
  const [searchFriendsCustomer, setSearchfriendsCustomer] = useState();
  const [preview, setPreview] = useState();
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      setLoader(true);
      BusinessFriends(userData);
    }
  }, []);

  function BusinessFriends(user) {
    var formData = new FormData();

    formData.append("user_id", user.id);
    formData.append("business_id", user.business_id);
    ApiCall("Post", API.BusinessFreindsList, formData, {
      Authorization: "Bearer " + user?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log("frinds", resp.data.data);
        setfriendsElection(resp.data.data.election_candidates);
        setSearchfriendsElection(resp.data.data.election_candidates);
        setfriendsCustomer(resp.data.data.customers);
        setUserVfAssistance(resp.data.data.vf_assistance);
        setSearchfriendsCustomer(resp.data.data.customers);
      });
  }

  const SearchFilter = (text) => {
    const { SearchArrays } = this.state;
    // this.setState({searchInput: true})
    const newData = SearchArrays.filter((item) => {
      const itemData = `${item.verses.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({ Note_Array: newData });
  };

  return (
    <div class="container-fluid">
      {loader && <Loader />}
      {/* <!-- Header Starts here --> */}
      <header class="row">
        <button class="btn btn-menu">
          <img class="img-fluid" src="images/menu-ico.svg" alt="ico" />
        </button>
        <form class="search-form" action="">
          <input class="form-control" type="text" placeholder="Search Friend" />
        </form>
        <button class="btn btn-home" onClick={() => navigate("/businessHome")}>
          <img class="img-fluid" src="images/home-ico.svg" alt="" />
        </button>
      </header>
      {/* <!-- Header Ends here -->
        <!-- Content Section Starts here --> */}
      <section class="content-sec row">
      <div class="product-wrap mt-4" id="candidate-chat">
          <div class="row">
            <div class="col-12">
              <div class=" mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t("Chat.Election Candidate")} </h3>
              </div>
              {friendsElection?.map((item, index) => {
                return (
                  <>
                    <div
                      class="candidate-snippet chat-snippet"
                      onClick={() =>
                        navigate("/friendChat", {
                          state: {
                            chatUser: item,
                          },
                        })
                      }
                    >
                      <div class="user-img">
                        <img
                          src={
                            item?.picture
                              ? item?.picture
                              : "images/avatar-img-2.png"
                          }
                          alt="Name"
                        />
                      </div>
                      <div class="avatar-cont">
                        <div class="ac-lft">
                          <h6 class="text-truncate">{item.username}</h6>
                          <span class="elec">
                            <img src="images/grid-elect-ico.svg" alt="ico" />
                            {t("Chat.Election as candidate")}{" "}
                            <strong>{item.election_as_candidate}</strong>
                          </span>
                            {item?.unread_message_count > 0 && (
                            <p class="msg text-truncate text-success">
                              {t("Chat.Last message will be here")}...
                            </p>
                            )}
                        </div>
                        <div class="unread">
                          <div class="ico">
                            <img
                              class="img-fluid"
                              src="images/chat-bubble-ico.svg"
                              alt="ico"
                            />
                            {item?.unread_message_count > 0 && (
                            <span class="count">
                              {item?.unread_message_count}
                            </span>
                            )}
                          </div>
                          <span class="time">
                              {item.last_message_time &&
                                moment(item.last_message_time).format("LT")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}

            </div>
          </div>
        </div>

        {/* <!-- This Product Section Starts here --> */}
        <div class="product-wrap mt-4" id="customer-chat">
          <div class="row">
            <div class="col-12">
              <div class=" mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t("Chat.Customers")} </h3>
              </div>
              {friendsCustomer?.map((item, index) => {
                return (
                  <>
                    <div
                      class="candidate-snippet chat-snippet"
                      onClick={() =>
                        navigate("/friendChat", {
                          state: {
                            chatUser: item,
                          },
                        })
                      }
                    >
                      <div class="user-img">
                        <img
                          src={
                            item?.picture
                              ? item?.picture
                              : "images/avatar-img-2.png"
                          }
                          alt="Name"
                        />
                      </div>
                      <div class="avatar-cont">
                        <div class="ac-lft">
                          <h6 class="text-truncate">{item.username}</h6>
                          <span class="elec">
                            <img src="images/grid-elect-ico.svg" alt="ico" />
                            {t("Chat.Election as candidate")}{" "}
                            <strong>{item.election_as_candidate}</strong>
                          </span>
                            {item?.unread_message_count > 0 && (
                            <p class="msg text-truncate text-success">
                              {t("Chat.Last message will be here")}...
                            </p>
                            )}
                        </div>
                        <div class="unread">
                          <div class="ico">
                            <img
                              class="img-fluid"
                              src="images/chat-bubble-ico.svg"
                              alt="ico"
                            />
                            {item?.unread_message_count > 0 && (
                            <span class="count">
                              {item?.unread_message_count}
                            </span>
                            )}
                          </div>
                          <span class="time">
                            {item.last_message_time &&
                            moment(item.last_message_time).format("LT")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}

              <div class="candidate-snippet chat-snippet"
                onClick={() =>
                    navigate("/friendChat", {
                        state: {
                            chatUser: userVfAssistance,
                        },
                    })
                }>
                <div class="user-img logo">
                  <img src="images/vf-txt-logo.png" alt="BusinessName" />
                </div>
                <div class="avatar-cont">
                  <div class="ac-lft">
                    <h6 class="text-truncate">{t("Chat.VF ASSISTANCE")}</h6>
                    {userVfAssistance?.unread_message_count > 0 && (
                    <p class="msg text-truncate text-success">
                      {t("Chat.Last message will be here")}...
                    </p>
                    )}
                  </div>
                  <div class="unread">
                    <div class="ico">
                      <img
                        class="img-fluid"
                        src="images/chat-bubble-ico.svg"
                        alt="ico"
                      />
                      {userVfAssistance?.unread_message_count > 0 && (
                        <span class="count">{userVfAssistance?.unread_message_count}</span>
                      )}
                    </div>
                    <span class="time">
                      {userVfAssistance?.last_message_time &&
                      moment(userVfAssistance?.last_message_time).format("LT")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- This Product Section Ends here --> */}
      </section>
      <BusinessFooter />
      {/* <!-- Footer Ends here --> */}
    </div>
  );
}
