import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import BusinessFooter from '../../components/BusinessFooter';
import Loader from '../../components/Loader';

import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { getUserData, removeUserData } from '../../Functions/Functions';
import moment from 'moment';

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
  const [menuShow, setMenuShow] = useState();
  const [showLanguage, setShowLanguage] = useState(false);
  const [currentLanguage, setLanguage] = useState('en');

  const changeLanguage = (value) => {
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value))
      .catch((err) => console.log(err));
  };

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

    formData.append('user_id', user.id);
    formData.append('business_id', user.business_id);
    ApiCall('Post', API.BusinessFreindsList, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log('frinds', resp.data.data);
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
        <button class="btn btn-menu" onClick={() => setMenuShow(!menuShow)}>
          <img class="img-fluid" src="images/menu-ico.svg" alt="ico" />
        </button>
        <form class="search-form" action="">
          <input class="form-control" type="text" placeholder="Search Friend" />
        </form>
        <button class="btn btn-home" onClick={() => navigate('/businessHome')}>
          <img class="img-fluid" src="images/home-ico.svg" alt="" />
        </button>

        {menuShow && (
          <div class="filter-sidebar head-dd main-menu show">
            <div class="filter-hdr">
              <div class="head">
                <button class="btn close" onClick={() => setMenuShow(!menuShow)}>
                  <img src="images/close-ico.svg" alt="" />
                </button>
                <h4>{t('Menus.MAIN MENU')}</h4>
              </div>
            </div>
            <div class="filter-cont">
              <ul class="dropdown-menu">
                {user?.login_as == 'visitor' && (
                  <li>
                    <Link class="dropdown-item" to={'/login'}>
                      <span class="d-flex align-items-center">{t('Menus.Login')}</span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </Link>
                  </li>
                )}
                {(user?.login_as == 'manual' || user?.login_as == 'google' || user?.login_as == 'facebook') && (
                  <>
                    <li>
                      <Link class="dropdown-item" to={'/userProfile'}>
                        <span class="d-flex align-items-center">{t('Menus.My User Page')}</span>
                        <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                      </Link>
                    </li>
                    <li>
                      <Link class="dropdown-item" to={'/userProfile'}>
                        <span class="d-flex align-items-center">{t('Menus.My QR-CODE')}</span>
                        <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                      </Link>
                    </li>
                    <li>
                      <Link class="dropdown-item" to={'/userFavourite'}>
                        <span class="d-flex align-items-center">{t('Menus.Favourites')}</span>
                        <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                      </Link>
                    </li>
                    <li>
                      <Link class="dropdown-item" to="/UserGiftCollect" state={{ user_id: user?.user_id }}>
                        <span class="d-flex align-items-center">{t('Menus.Gift to be collected')}</span>
                        <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                      </Link>
                    </li>
                    <li>
                      <Link class="dropdown-item" to={'/home'}>
                        <span class="d-flex align-items-center">{t('Menus.Block chat')}</span>
                        <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <button
                    class="dropdown-item bg-transparent  w-full"
                    onClick={() => {
                      setShowLanguage(!showLanguage);
                      setMenuShow(false);
                    }}
                  >
                    <span class="d-flex align-items-center">
                      {t('Menus.Language')} ({currentLanguage})
                    </span>
                    <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                  </button>
                </li>

                <li>
                  <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#how-it-modal">
                    <span class="d-flex align-items-center">{t('Menus.Help')}</span>
                    <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#how-it-modal-1">
                    <span class="d-flex align-items-center">{t('Menus.Third-Party Licenses')}</span>
                    <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                  </a>
                </li>
                {(user?.login_as == 'manual' || user?.login_as == 'google' || user?.login_as == 'facebook') && (
                  <>
                    <li>
                      <Link to={'/login'} class="dropdown-item">
                        <span class="d-flex align-items-center">{t('Menus.Change email - password')}</span>
                        <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                      </Link>
                    </li>
                    <li>
                      <Link to={'/splash'} onClick={() => removeUserData()} class="dropdown-item">
                        <span class="d-flex align-items-center">{t('Menus.Log-out')}</span>
                        <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
        {showLanguage && (
          <div class="filter-sidebar head-dd main-menu show">
            <div class="filter-hdr">
              <div class="head">
                <button class="btn close" onClick={() => setShowLanguage(!showLanguage)}>
                  <img src="./images/close-ico.svg" alt="" />
                </button>
                <h4>{t('Menus.SELECT LANGUAGE')}</h4>
              </div>
            </div>
            <div class="filter-cont">
              <ul class="dropdown-menu">
                <li>
                  <button
                    class="dropdown-item bg-transparent w-full"
                    onClick={() => {
                      changeLanguage('en');
                      setShowLanguage(false);
                    }}
                  >
                    <span class="d-flex align-items-center">{t('Menus.English')}</span>
                    <img class="arrow" src="./images/arrow_back_ios-24px.svg" />
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item bg-transparent w-full"
                    onClick={() => {
                      changeLanguage('hi');
                      setShowLanguage(false);
                    }}
                  >
                    <span class="d-flex align-items-center">{t('Menus.italian')}</span>
                    <img class="arrow" src="./images/arrow_back_ios-24px.svg" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </header>
      {/* <!-- Header Ends here -->
        <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        <div class="product-wrap mt-4" id="candidate-chat">
          <div class="row">
            <div class="col-12">
              <div class=" mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t('Chat.Election Candidate')} </h3>
              </div>
              {friendsElection?.map((item, index) => {
                return (
                  <>
                    <div
                      class="candidate-snippet chat-snippet"
                      onClick={() =>
                        navigate('/friendChat', {
                          state: {
                            chatUser: item,
                          },
                        })
                      }
                    >
                      <div class="user-img">
                        <img src={item?.picture ? item?.picture : 'images/avatar-img-2.png'} alt="Name" />
                      </div>
                      <div class="avatar-cont">
                        <div class="ac-lft">
                          <h6 class="text-truncate">{item.username}</h6>
                          <span class="elec">
                            <img src="images/grid-elect-ico.svg" alt="ico" />
                            {t('Chat.Election as candidate')} <strong>{item.election_as_candidate}</strong>
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
                          <span class="time">
                            {item.last_message_time && moment(item.last_message_time).format('LT')}
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
                <h3>{t('Chat.Customers')} </h3>
              </div>
              {friendsCustomer?.map((item, index) => {
                return (
                  <>
                    <div
                      class="candidate-snippet chat-snippet"
                      onClick={() =>
                        navigate('/friendChat', {
                          state: {
                            chatUser: item,
                          },
                        })
                      }
                    >
                      <div class="user-img">
                        <img src={item?.picture ? item?.picture : 'images/avatar-img-2.png'} alt="Name" />
                      </div>
                      <div class="avatar-cont">
                        <div class="ac-lft">
                          <h6 class="text-truncate">{item.username}</h6>
                          <span class="elec">
                            <img src="images/grid-elect-ico.svg" alt="ico" />
                            {t('Chat.Election as candidate')} <strong>{item.election_as_candidate}</strong>
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
                          <span class="time">
                            {item.last_message_time && moment(item.last_message_time).format('LT')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}

              <div
                class="candidate-snippet chat-snippet"
                onClick={() =>
                  navigate('/friendChat', {
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
