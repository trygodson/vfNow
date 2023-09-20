import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import moment from 'moment';

import { getUserData } from '../../Functions/Functions';

export default function UserFriendList() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [userFriend, setUserFriend] = useState();
  const [userFriendBusiness, setUserFriendBusiness] = useState();
  const [userVfAssistance, setUserVfAssistance] = useState();
  const [userFriendSearch, setUserFriendSearch] = useState();
  const [userFriendBusinessSearch, setUserFriendBusinessSearch] = useState();
  const [user, setUser] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      GetUsergiftData(userData);
    }

    //passing getData method to the lifecycle method
  }, []);

  const SearchFilter = (text) => {
    // this.setState({searchInput: true})
    const newData = userFriendSearch.filter((item) => {
      const itemData = `${item?.username?.toUpperCase()}`;
      const textData = text?.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    const newData1 = userFriendBusinessSearch.filter((item) => {
      const itemData = `${item?.username?.toUpperCase()}`;
      const textData = text?.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setUserFriend(newData);
    setUserFriendBusiness(newData1);
  };

  function GetUsergiftData(user) {
    var formData = new FormData();

    formData.append('user_id', user?.user_id);
    ApiCall('Post', API.userFriendlistApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log('setUserProfile View', resp.data.data);
        setLoader(false);
        setUserFriend(resp.data.data.user_friend);
        setUserFriendBusiness(resp.data.data.business_friend);
        setUserVfAssistance(resp.data.data.vf_assistance);
        setUserFriendSearch(resp.data.data.user_friend);
        setUserFriendBusinessSearch(resp.data.data.business_friend);
      });
  }

  return (
    <div class="container-fluid position-relative">
      {/* <!-- Header Starts here --> */}
      <header class="row">
        <button class="btn btn-menu">
          <img class="img-fluid" src="images/menu-ico.svg" alt="ico" />
        </button>
        <div class="search-form">
          <input
            class="form-control"
            type="text"
            // placeholder="Search Friend"
            placeholder={t('placeHolders.Search')}
            onChange={(text) => {
              SearchFilter(text.target.value);
            }}
          />
        </div>
        <Link class="btn btn-home" to={'/home'}>
          <img class="img-fluid" src="images/home-ico.svg" alt="" />
        </Link>
      </header>

      {/* <!-- Header Ends here -->
        <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        {/* <!-- This Product Section Starts here --> */}
        <div class="product-wrap mt-4" id="friend-chat">
          <div class="row">
            <div class="col-12">
              <div class=" mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3> {t('Chat.User Friend')}</h3>
              </div>
              {userFriend?.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() =>
                      navigate('/UserChat', {
                        state: {
                          chatUser: item,
                        },
                      })
                    }
                    class="candidate-snippet chat-snippet"
                  >
                    <div class="user-img">
                      <img src={item.picture ? item.picture : 'images/avatar-img-2.png'} alt="Name" />
                    </div>
                    <div class="avatar-cont">
                      <div class="ac-lft">
                        <h6 class="text-truncate">{item.username}</h6>
                        <span class="elec">
                          <img src="images/grid-elect-ico.svg" alt="ico" />
                          {t('Chat.Election as candidate')} <strong>{item.election_as_candidate}</strong>
                        </span>
                        <p class="msg text-success text-truncate">{t('Chat.Last message will be here')}...</p>
                      </div>
                      <div class="unread">
                        <div class="ico">
                          <img class="img-fluid" src="images/chat-bubble-ico.svg" alt="ico" />
                          {item?.unread_message_count > 0 && <span class="count">{item?.unread_message_count}</span>}
                        </div>
                        <span class="time">
                          {item.last_message_time && moment(item.last_message_time).format('LT')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <p className="mt-5">{t('Chat.user_para')}</p>
            </div>
          </div>
        </div>
        {/* <!-- This Product Section Ends here -->
            <!-- This Business Section Starts here --> */}
        <div class="product-wrap item-snippet mt-5" id="business-chat">
          <div class=" mb-3">
            {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
            <h3> {t('Chat.Business Friend')}</h3>
          </div>
          {userFriendBusiness?.map((item, index) => {
            return (
              <div
                key={index}
                class="candidate-snippet chat-snippet"
                onClick={() =>
                  navigate('/UserChat', {
                    state: {
                      chatUser: item,
                    },
                  })
                }
              >
                <div class="user-img logo">
                  <img src={item.picture ? item.picture : 'images/logo-dummy.png'} alt="BusinessName" />
                </div>
                <div class="avatar-cont">
                  <div class="ac-lft">
                    <h6 class="text-truncate">{item.username}</h6>
                    <span class="elec">
                      <img src="images/grid-elect-ico.svg" alt="ico" />
                      {t('Chat.Election active')} <strong>{item.election_active}</strong>
                    </span>
                    {item?.unread_message_count > 0 && (
                      <p class="msg text-truncate text-success">{t('Chat.Last message will be here')}...</p>
                    )}
                  </div>
                  <div class="unread">
                    <div class="ico">
                      <img class="img-fluid" src="images/chat-bubble-ico.svg" alt="ico" />
                      {item?.unread_message_count > 0 && <span class="count">{item?.unread_message_count}</span>}
                    </div>
                    <span class="time">{item.last_message_time && moment(item.last_message_time).format('LT')}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            class="candidate-snippet chat-snippet"
            onClick={() =>
              navigate('/UserChat', {
                state: {
                  chatUser: userVfAssistance,
                },
              })
            }
          >
            <div class="user-img logo">
              <img src="images/vf-txt-logo.png" alt="BusinessName" />
            </div>
            <div class="avatar-cont">
              <div class="ac-lft">
                <h6 class="text-truncate">{t('Chat.VF ASSISTANCE')}</h6>
                {userVfAssistance?.unread_message_count > 0 && (
                  <p class="msg text-truncate text-success">{t('Chat.Last message will be here')}...</p>
                )}
              </div>
              <div class="unread">
                <div class="ico">
                  <img class="img-fluid" src="images/chat-bubble-ico.svg" alt="ico" />
                  {userVfAssistance?.unread_message_count > 0 && (
                    <span class="count">{userVfAssistance?.unread_message_count}</span>
                  )}
                </div>
                <span class="time">
                  {userVfAssistance?.last_message_time && moment(userVfAssistance?.last_message_time).format('LT')}
                </span>
              </div>
            </div>
          </div>
          {/* <p className="friend-text">{t("Chat.busi_para")}</p> */}
          <p className="mt-5">{t('Chat.busi_para')}</p>
        </div>

        {/* <!-- This Business Section Ends here --> */}
      </section>
      {/* <!-- Content Section Ends here -->
        <!-- Footer Starts here --> */}
      <div class="ftr-top dual-btn chat_button">
        <a href="#friend-chat" class="btn btn-black anchor-link">
          {t('Chat.FRIENDS')}
        </a>
        <a href="#business-chat" class="btn btn-black anchor-link">
          {t('Chat.BUSINESS')}
        </a>
      </div>
      <Footer user={user && user} />
      {loader && <Loader />}
      {/* <!-- Footer Ends here --> */}
    </div>
  );
}
