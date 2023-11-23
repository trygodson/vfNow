import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import '../languages/i18n';

import Loader from '../components/Loader';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';

import menu from '../images/menu-ico.svg';
import around from '../images/around-u.png';
import privacy from '../images/privacy-ico.svg';
import redSkew from '../images/red-skew.png';
import ques from '../images/vf-ques-ico.svg';
import yellowSkew from '../images/yellow-skew.png';
import greySkew from '../images/gray-skew.png';
import tealSkew from '../images/teal-skew.png';
import shop from '../images/shop-ico.svg';
import happy from '../images/most-happy-ico.svg';

import cateyellow from '../images/cate-yellow-bg.png';
import catearound from '../images/cate-around-ico.png';
import categrey from '../images/cate-gray-bg.png';
import cateteal from '../images/cate-teal-bg.png';
import catered from '../images/red-skew.png';

import Map from '../components/Map';
import ElectionBox from '../components/EelectionBox';
import BusinessBox from '../components/BusinessBox';
import Footer from '../components/Footer';
import axios from 'axios';

import {
  getUserData,
  removeUserData,
  getUserLatitude,
  getUserLongitude,
  storeUserLatitude,
  storeUserLongitude,
  GetAppTrackFunction,
} from '../Functions/Functions';

function Home() {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const [user, setUser] = useState();
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [categories, setCategories] = useState();
  const [startSoon, setStartSoon] = useState();
  const [justAdded, setJustAdded] = useState();
  const [businessPlaces, setbusinessPlaces] = useState();
  const [menuShow, setMenuShow] = useState();
  const [howDoesitWork, sethowDoesitWork] = useState(false);
  const [reload, setreload] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('election');
  const [showLanguage, setShowLanguage] = useState(false);
  const [ip, setIP] = useState('');
  const [currentLanguage, setLanguage] = useState('en');
  const [searchHistory, setSearchHistory] = useState([]);

  const [y, setY] = useState(window.scrollY);

  const handleNavigation = useCallback(
    (e) => {
      const window = e.currentTarget;
      if (y > window.scrollY) {
        setSearching(false);
      } else if (y < window.scrollY) {
        setSearching(false);
        setSearch('');
        setY(window.scrollY);
      }
    },
    [y],
  );

  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener('scroll', handleNavigation);

    return () => {
      window.removeEventListener('scroll', handleNavigation);
    };
  }, [handleNavigation]);

  const changeLanguage = (value) => {
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value))
      .catch((err) => console.log(err));
  };

  function Searchftn(search, type) {
    var formData = new FormData();
    setLoader(true);
    formData.append('search_text', search);
    formData.append('type', type);

    ApiCall('Post', API.searchApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        navigate('/category', {
          state: {
            searchData: resp.data.data,
            type: type,
            header: search,
          },
        });
      });
  }

  function SearchHistoryftn(search) {
    var formData = new FormData();

    formData.append('search_text', search);
    // formData.append("type", type);

    ApiCall('Post', API.searchHistoryApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr search hostory', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // console.log("historyyy test ::", resp.data.data);
        setSearchHistory(resp.data.data);
      });
  }

  const getData = async () => {
    const res = await axios.get('https://geolocation-db.com/json/');
    // console.log(res.data);
    if (res.data.IPv4) {
      VisitorLogin(res.data.IPv4);
    }
    setIP(res.data.IPv4);
  };

  async function VisitorLogin(ip) {
    var formData = new FormData();

    formData.append('ip_address', ip);
    formData.append('device_type', 'test');
    formData.append('device_token', '1234567');
    formData.append('device_id', 'jshdjsdh878');

    ApiCall('Post', API.VisitorLoginApi, formData)
      .catch((error) => {
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        const jsonValue = JSON.stringify(resp.data.data);
        localStorage.setItem('user', jsonValue);
        setreload(!reload);
        navigate(0);
        // console.log("vistor", resp.data.data);
      });
  }

  const getGeoInfo = async (userData) => {
    const userlongitude = await getUserLongitude();
    const userlatitude = await getUserLatitude();
    console.log('user current location 2 hey', navigator.geolocation, userlatitude, userlongitude);

    if (userlatitude && userlongitude) {
      console.log('user current test', navigator.geolocation, userlatitude, userlongitude);
      setLongitude(userlongitude);
      setLatitude(userlatitude);
      StartSoonList(userData, userlatitude, userlongitude);
      JustAddedList(userData, userlatitude, userlongitude);
      BestBuisnessplacesList(userData, userlatitude, userlongitude);
    }
    // else {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function (position) {
    //       console.log("user current location heloo", position);
    //       storeUserLatitude(position.coords.latitude);
    //       storeUserLongitude(position.coords.longitude);
    //     });
    //   }
    // }
    setLoader(false);
    // StartSoonList(userData, "34.0151", "71.5249");
    // JustAddedList(userData, "34.0151", "71.5249");
    // BestBuisnessplacesList(userData, "34.0151", "71.5249");
  };

  useEffect(async () => {
    const userData = await getUserData();
    console.log('userDatauserDatauserData', userData);
    if (userData) {
      setUser(userData);
      setLoader(true);
      getGeoInfo(userData);
      CateforyList(userData);
    } else {
      getData();
    }
  }, [reload]);

  function HomeFtn() {
    setLoader(true);
    StartSoonList(user, latitude, longitude);
    JustAddedList(user, latitude, longitude);
    BestBuisnessplacesList(user, latitude, longitude);
  }

  function CateforyList(user) {
    var formData = new FormData();

    ApiCall('Post', API.categoryListApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
      })
      .then((resp) => {
        setCategories(resp.data.data);
        console.log('resp.data.data catgeiurs resp.data.data', resp.data.data);
      });
  }

  function StartSoonList(user, latitude, longitude) {
    var formData = new FormData();
    formData.append('user_latitude', `${latitude}`);
    formData.append('user_longitude', `${longitude}`);
    formData.append('user_id', user?.user_id);
    formData.append('batch_number', 0);
    formData.append('list_ids', '0');
    console.log('formData', formData);
    ApiCall('Post', API.HomestartingSoonApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
        setLoader(false);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        // console.log("startingsoon", resp.data);
        setStartSoon(resp.data.data);
      });
  }

  function JustAddedList(user, latitude, longitude) {
    var formData = new FormData();
    formData.append('user_latitude', `${latitude}`);
    formData.append('user_longitude', `${longitude}`);
    formData.append('user_id', user?.user_id);

    formData.append('batch_number', 0);
    formData.append('list_ids', '0');
    console.log('formData', formData);
    ApiCall('Post', API.HomejustAddedApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
        //   reject(error.response);
        setLoader(false);
      })
      .then((resp) => {
        // console.log(resp.data);
        setLoader(false);
        setJustAdded(resp.data.data);
      });
  }

  function BestBuisnessplacesList(user, latitude, longitude) {
    var formData = new FormData();
    formData.append('user_latitude', `${latitude}`);
    formData.append('user_longitude', `${longitude}`);
    formData.append('user_id', user?.user_id);
    formData.append('batch_number', 0);
    formData.append('list_ids', '0');
    console.log('formData', formData);
    ApiCall('Post', API.HomebestShopApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
        setLoader(false);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log('business', resp?.data);
        setLoader(false);
        setbusinessPlaces(resp?.data?.data);
      });
  }

  function CategoryElectionsList(user, id, category) {
    GetAppTrackFunction(user?.user_id, category, user?.access_token);
    setLoader(true);
    var formData = new FormData();
    formData.append('category', id);

    formData.append('user_id', user?.user_id);

    ApiCall('Post', API.categoryElections, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
        setLoader(false);
        //   reject(error.response);
      })
      .then((resp) => {
        navigate('/category', {
          state: {
            searchData: resp.data.data,
            type: 'election',
            header: category,
          },
        });
        console.log('category', resp.data);
        setLoader(false);
      });
  }

  return (
    <div>
      {loader && <Loader />}

      {/* <!-- Wrapper Starts here --> */}
      <div class="container-fluid">
        {/* <!-- Header Starts here --> */}
        <header class="row">
          <button class="btn btn-menu" onClick={() => setMenuShow(!menuShow)}>
            <img class="img-fluid" src={menu} alt="ico" />
          </button>
          <div class="search-form" style={{ width: !searching ? '100%' : '' }}>
            <input
              class="form-control"
              type="text"
              placeholder={t('placeHolders.Search')}
              onChange={(text) => {
                SearchHistoryftn(text.target.value);
                setSearch(text.target.value);
                setSearching(true);
                if (text.target.value == '') {
                  setSearching(false);
                }
              }}
              value={search}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  Searchftn(search, type);
                  GetAppTrackFunction(user?.user_id, 'search', user?.access_token);
                }
              }}
              onTouchStart={(e) => setSearching(true)}
            />
          </div>
          {searching && (
            <button
              onClick={() => {
                setSearching(false);
                setSearch('');
              }}
              class="btn btn-home"
            >
              <img class="img-fluid" src="images/home-ico.svg" alt="" />
            </button>
          )}

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
        {searching && (
          <div
            class="modal bg-blur reg-modal show animate"
            role="dialog"
            aria-hidden="true"
            style={{
              display: searching ? 'block' : 'none',
              backgroundColor: 'rgba(222, 223, 222 , 0.9)',
              marginTop: 60,
              transition: 'all 5s ease-in',
              height: 'auto',
            }}
            // onClick={() => setSearching(false)}
          >
            <div class="modal-content minh-unset" data-bs-dismiss="modal">
              <section class="">
                <div class="row top-search-category">
                  <div class="search-row">
                    <div class="form-check">
                      <label class="form-check-label">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="search-cat"
                          checked={type == 'business' ? true : false}
                          onChange={() => {
                            setType('business');
                          }}
                        />
                        {t('Buttons.Business')}
                      </label>
                    </div>
                    <div class="form-check">
                      <label class="form-check-label">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="search-cat"
                          checked={type == 'election' ? true : false}
                          onChange={() => {
                            setType('election');
                          }}
                        />
                        {t('Buttons.Election')}
                      </label>
                    </div>
                    <div class="form-check">
                      <label class="form-check-label">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="search-cat"
                          checked={type == 'user' ? true : false}
                          onChange={() => {
                            setType('user');
                          }}
                        />
                        {t('Buttons.User')}
                      </label>
                    </div>
                  </div>
                </div>
                {searchHistory?.length > 0 && (
                  <section class="content-sec mt-5 pb-0">
                    <div class="search-listing">
                      <h6 className="m-2"> {t('Buttons.History')}</h6>
                      <ul class="list-unstyled search-item">
                        {searchHistory?.map((item, index) => {
                          return (
                            <li key={index} className="d-flex justify-content-between my-2">
                              <button
                                className="bg-transparent border-0"
                                onClick={() => Searchftn(item.keyword, item.type)}
                              >
                                <img class="img-fluid" src="images/clock_icon_history.svg" alt="" />{' '}
                                {item.type + ' : ' + item.keyword}
                              </button>
                              <img class="img-fluid" src="images/arrow_up_history.svg" alt="" />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </section>
                )}
              </section>
            </div>
          </div>
        )}
        <section
          class="content-sec row"
          onClick={() => {
            if (searching) {
              setSearching(false);
              setSearch('');
            }
          }}
        >
          {/* <!-- Top Menu Starts here --> */}
          <div class="topmenu-wrap">
            <div class="top-menu">
              <div class="top-overflow">
                {categories?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (!searching) {
                          CategoryElectionsList(user, item.category_id, item.name);
                        }
                      }}
                      class="btn-circle"
                    >
                      <div class="img-wrap">
                        <img class="img-fluid" src={item?.picture ? item?.picture : around} alt="img" />
                      </div>
                      <p>{item.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {latitude && longitude && (
            <Map
              startSoon={startSoon}
              latitude={latitude}
              longitude={longitude}
              user={user && user}
              searching={searching}
              loader={loader}
              setLoader={setLoader}
            />
          )}

          <div class="skew-snippet-wrap">
            <div class="skew-snip" data-bs-toggle="modal" data-bs-target="#privacy-modal">
              <img class="img-fluid w-100" src={redSkew} alt="" />
              <div class="cont">
                <img class="ico" src={privacy} alt="ico" />
                <h6> {t('Home.Privacy')}</h6>
              </div>
            </div>
            <div class="skew-snip" data-bs-toggle="modal" data-bs-target="#how-it-modal">
              <img class="img-fluid w-100" src={yellowSkew} alt="" />
              <div class="cont">
                <img class="ico big" src={ques} alt="ico" />
                <h6 className="mb-0">{t('Home.How Does')}</h6>
                <h6 className="top-height">{t('Home.it work?')}</h6>
              </div>
            </div>
            <Link class="skew-snip" to={'/happyWinner'}>
              <img class="img-fluid w-100" src={greySkew} alt="" />
              <div class="cont">
                <img class="ico" src={happy} alt="ico" />
                <h6 className="mb-0">{t('Home.The Most')}</h6>
                <h6 className="top-height">
                  {t('Home.Happy Winner')}
                  <small>{t('Home.s')}</small>
                </h6>
              </div>
            </Link>
            <Link
              class="skew-snip"
              to={'/homeMapCloset'}
              state={{
                businessPlaces: businessPlaces,
                latitude: latitude ? latitude : 30.3753,
                longitude: longitude ? longitude : 69.3451,
                user: user,
              }}
            >
              <img class="img-fluid w-100" src={tealSkew} alt="" />
              <div class="cont">
                <img class="ico" src={shop} alt="ico" />
                <h6>
                  {t('Home.The Best Shop')}
                  <small>{t('Home.s')}</small>
                </h6>
              </div>
            </Link>
          </div>
          {/* <!-- Skew Snippets Ends here -->
            <!-- Product Wrap Starts here --> */}
          {startSoon?.length > 0 && (
            <div class="product-wrap">
              <div class="">
                {/* <img class="ico" src={fun} alt="" /> */}
                <h3>{t('Home.Starting soon')}</h3>
              </div>

              <div class="row my-3">
                <div class="product-list">
                  <div class="product-overflow">
                    {startSoon?.map((item, index) => {
                      return (
                        <ElectionBox
                          item={item}
                          index={index}
                          user={user && user}
                          loader={loader}
                          setLoader={setLoader}
                          HomeFtn={HomeFtn}
                        />
                      );
                    })}
                  </div>
                </div>
                <div class="col-12 text-end">
                  <Link
                    to={'/category'}
                    state={{
                      searchData: startSoon,
                      type: 'election',
                      header: t('Home.Starting soon'),
                    }}
                    class="text-link"
                  >
                    {t('Home.See more')}...
                  </Link>
                </div>
              </div>
            </div>
          )}
          {/* <!-- Product Wrap Ends here -->
            <!-- Product Wrap Starts here --> */}
          {justAdded?.length > 0 && (
            <div class="product-wrap">
              <div class="">
                {/* <img class="ico" src={fun} alt="" /> */}
                <h3>{t('Home.Just Added')}</h3>
              </div>
              <div class="row my-3">
                <div class="product-list">
                  <div class="product-overflow">
                    {justAdded?.map((item, index) => {
                      return (
                        <ElectionBox
                          item={item}
                          index={index}
                          user={user && user}
                          loader={loader}
                          setLoader={setLoader}
                          HomeFtn={HomeFtn}
                        />
                      );
                    })}
                  </div>
                </div>
                <div class="col-12 text-end">
                  <Link
                    to={'/category'}
                    state={{
                      searchData: justAdded,
                      type: 'election',
                      header: t('Home.Just Added'),
                    }}
                    class="text-link"
                  >
                    {t('Home.See more')}...
                  </Link>
                </div>
              </div>
            </div>
          )}
          {businessPlaces?.length > 0 && (
            <div class="product-wrap">
              <div class="">
                {/* <img class="ico" src={fun} alt="" /> */}
                <h3>{t('Home.The Best Business places')}</h3>
              </div>
              <div class="row my-3">
                <div class="product-list">
                  <div class="product-overflow">
                    {businessPlaces?.map((item, index) => {
                      return (
                        <BusinessBox
                          item={item}
                          index={index}
                          user={user && user}
                          loader={loader}
                          setLoader={setLoader}
                          HomeFtn={HomeFtn}
                        />
                      );
                    })}
                  </div>
                </div>
                <div class="col-12 text-end">
                  <Link
                    to={'/category'}
                    state={{
                      searchData: businessPlaces,
                      type: 'business',
                      header: t('Home.The Best Business places'),
                    }}
                    class="text-link"
                  >
                    {t('Home.See more')}...
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* <!-- Category Wrap Ends here --> */}

          <div class="product-wrap">
            <div class="">
              {/* <img class="ico" src={fun} alt="" /> */}
              <h3>{t('Home.Categories')}</h3>
            </div>
            <div class="skew-snippet-wrap">
              <div class="w-50 d-flex flex-wrap">
                {categories?.map((item, index) => {
                  return (
                    index < categories?.length / 2 && (
                      <div
                        class="skew-snip"
                        onClick={() => {
                          CategoryElectionsList(user, item.category_id, item.name);
                        }}
                      >
                        <img
                          class="img-fluid w-100"
                          src={
                            item.background_color == 'Yellow'
                              ? cateyellow
                              : item.background_color == 'Red'
                              ? catered
                              : item.background_color == 'Blue'
                              ? cateteal
                              : categrey
                          }
                          alt=""
                        />
                        <div class="cont">
                          <img
                            class="ico categories-img"
                            style={{
                              borderColor:
                                item.background_color == 'Yellow'
                                  ? '#D2BA4A'
                                  : item.background_color == 'Red'
                                  ? '#BB4547'
                                  : item.background_color == 'Blue'
                                  ? '#294C4E'
                                  : '#080708',
                            }}
                            src={item?.picture ? item?.picture : catearound}
                            alt="ico"
                          />
                          <h6>{item.name}</h6>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>

              <div class="w-50">
                {categories
                  ?.map((item, index) => {
                    return (
                      index >= categories?.length / 2 && (
                        <div
                          class="skew-snip"
                          onClick={() => {
                            CategoryElectionsList(user, item.category_id, item.name);
                          }}
                        >
                          <img
                            class="img-fluid w-100"
                            src={
                              item.background_color == 'Yellow'
                                ? cateyellow
                                : item.background_color == 'Red'
                                ? catered
                                : item.background_color == 'Blue'
                                ? cateteal
                                : categrey
                            }
                            alt=""
                          />
                          <div class="cont">
                            <img
                              class="ico categories-img"
                              style={{
                                borderColor:
                                  item.background_color == 'Yellow'
                                    ? '#D2BA4A'
                                    : item.background_color == 'Red'
                                    ? '#BB4547'
                                    : item.background_color == 'Blue'
                                    ? '#294C4E'
                                    : '#080708',
                              }}
                              src={item?.picture ? item?.picture : catearound}
                              alt="ico"
                            />
                            <h6>{item.name}</h6>
                          </div>
                        </div>
                      )
                    );
                  })
                  .reverse()}
              </div>
            </div>
          </div>
          {/* <!-- Category Wrap Ends here --> */}
        </section>

        {/* <!-- Content Section Ends here -->


        <!-- Footer Starts here --> */}
        <Footer user={user && user} />
        {/* <!-- Footer Ends here --> */}
      </div>

      <div class="modal bg-blur" id="privacy-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="privacy-wrapper">
              <div class="container">
                <div class="col-12 privacy-sec">
                  <img src="images/privacy1-img.png" alt="Privacy" class="img-fluid mt-5" />
                  <h3>{t('privacy.Vote and Fun privacy is very simple!!!')}</h3>
                  <p>
                    {t('privacy.We use only your')} <strong>{t('privacy.email - password')}</strong>
                    {t('privacy.to recognice you, your')} <strong>{t('privacy.position')}</strong>
                    {t(
                      'privacy.to help you to find the closest FREE GIFT! ...and ofcourse we do not share this with anybody!!!',
                    )}
                    <br />
                    <br />
                    {t('privacy.if you win a FREE GIFT that can be shipped to you, it may')} <br />
                    {t('privacy.required to provide an')}
                    <strong> {t('privacy.address.')}</strong>
                  </p>
                  <h4>{t('privacy.END!!!')}</h4>
                  <h4>{t('privacy.NO OTHER SENSITIVE DATA ARE SAVED SHARED OR USED!!!')}</h4>
                  <h6 class="text-center">
                    {t('privacy.We do not monitor your phone, computer, tablet, etc. We do not monitor your life!!!')}
                  </h6>
                </div>
                <div class="privacy-main-img">
                  <img src="images/privacy2-img.png" alt="Privacy" class="img-fluid privacy-badge" />
                  <button class="btn btn-close-x p-0 mb-5">
                    <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal bg-blur" id="how-it-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="privacy-wrapper">
              <div class="container">
                <div class="col-12 privacy-sec">
                  <img src="images/how-does-badge.svg" alt="How Does It Work" class="img-fluid mt-5 mb-2" />
                  {!howDoesitWork ? (
                    <>
                      <div class="cont-hiw">
                        <div class="numeric">1</div>
                        <div class="cont-rgt">
                          <h5>{t('does_work.Choose your gift')}</h5>
                          <p>
                            {t('does_work.find something')}
                            <strong> {t('does_work.HERE')}</strong>
                            <img class="img-fluid" src="images/location-ico.svg" alt="ico" />
                          </p>
                        </div>
                      </div>
                      <div class="cont-hiw">
                        <div class="numeric">2</div>
                        <div class="cont-rgt">
                          <h5>{t('does_work.JOIN AS CANDIDATE')}</h5>
                          <p>
                            {t('does_work.click on')}
                            <img class="img-fluid border" src="images/join-candidate-b-ico.svg" alt="ico" />
                          </p>
                        </div>
                      </div>
                      <div class="cont-hiw">
                        <div class="numeric">3</div>
                        <div class="cont-rgt">
                          <h5>{t('does_work.COLLECT VOTEs FROM OTHERs')}</h5>
                          <p>
                            {t('does_work.click on')}
                            <img class="img-fluid border" src="images/ask-vote-b-ico.svg" alt="ico" />
                            {t('does_work.to share the link of your page and ask people to vote you!!!')}
                          </p>
                        </div>
                      </div>
                      <div class="cont-hiw">
                        <div class="numeric">4</div>
                        <div class="cont-rgt">
                          <h5>{t('does_work.COLLECT VOTEs FROM THE BUSINESS PLACE')}</h5>
                          <p class="img-right">
                            {t(
                              'does_work.go to the business place and scan the QR-Code at there, to receive much more votes!!!',
                            )}
                            <img class="img-fluid" src="images/scan-btn-ico.svg" alt="ico" />
                          </p>
                        </div>
                      </div>
                      <div class="cont-hiw">
                        <div class="numeric">5</div>
                        <div class="cont-rgt">
                          <h5>{t('does_work.WIN')}</h5>
                          <p class="img-right">
                            {t(
                              'does_work.Collect more votes than other candidate to win and receive your free gift!!!',
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <video
                      src={'http://54.255.52.195/uploads/business/video/10add839cf2e83a907eafb542eef9458d8f3f890.mp4'}
                      controls="controls"
                      width={'95%'}
                      class="mt-5 m-2"
                      autoplay="true"
                    />
                  )}
                </div>
                <div class="static-btm">
                  <button class="btn btn-close-x p-0 static" onClick={() => sethowDoesitWork(false)}>
                    <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
                  </button>
                  {!howDoesitWork && (
                    <button onClick={() => sethowDoesitWork(!howDoesitWork)} className="bg-transparent border-0">
                      <p>{t('does_work.CONTINUE and WATCH THE VIDEO')}</p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Wrapper Ends here -->

    <!-- Modal Wraps Starts here -->
     <div class="modal bg-blur" id="how-it-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="privacy-wrapper">
              <div class="container">
                <div class="col-12 privacy-sec">
                  <img
                    src="images/help-skew-img.svg"
                    alt="How Does It Work"
                    class="img-fluid mt-2 mb-2"
                  />
                  <p class="fs-12">
                    Text here Text here Text here Text here Text here Text here
                    Text here Text here Text here Text here Text here Text here
                    Text here Text here Text here Text here Text here Text here
                    Text here Text here Text here Text here Text here Text here
                    Text here Text here Text here Text here Text here Text here
                    Text here Text here Text here Text here Text here Text here
                    Text here Text here Text here Text here Text here Text here
                    Text here Text here Text here Text here Text here Text here
                    Text here Text here Text here Text here Text here Text here
                    Text here Text here Text here{" "}
                  </p>
                </div>
                <div class="static-btm">
                  <button class="btn btn-close-x p-0 static">
                    <img
                      class="img-fluid"
                      src="images/close-x.svg"
                      alt="ico"
                      data-bs-dismiss="modal"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="how-it-modal-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="privacy-wrapper">
              <div class="container">
                <div class="col-12 privacy-sec">
                  <img src="images/third-party-skew-bg.svg" alt="How Does It Work" class="img-fluid mt-2 mb-2" />
                  <p class="fs-12">{t('alerts.thirdParty')}</p>
                </div>
                <div class="static-btm">
                  <button class="btn btn-close-x p-0 static">
                    <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
