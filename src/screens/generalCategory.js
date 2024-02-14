import React, { useState, useEffect, useCallback } from 'react';

import { useNavigate, useLocation, Link } from 'react-router-dom';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import Loader, { CustomModal } from '../components/Loader';
import GeneralElection from '../components/GeneralElection';
import BusinessBox from '../components/BusinessBox';
import GeneralUser from '../components/GeneralUser';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';

import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';

import { getUserData, getUserLatitude, getUserLongitude } from '../Functions/Functions';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loader, setLoader] = useState(false);
  const [category, setCategory] = useState(location.state.searchData);
  const [categories, setCategories] = useState();
  const [selectCategories, setSelectCategories] = useState();

  const [type, setType] = useState(location?.state?.type);
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState();
  const [menuShow, setMenuShow] = useState(false);
  const [menuShow2, setMenuShow2] = useState(false);
  const [sort, setSort] = useState('');
  const [menuShowCategory, setMenuShowCategory] = useState(false);
  const [electionStatus, setElectionStatus] = useState();
  const [delivery, setdelivery] = useState();

  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  useEffect(async () => {
    const userData = await getUserData();
    const userlongitude = await getUserLongitude();
    const userlatitude = await getUserLatitude();
    if (userlatitude && userlongitude) {
      setLongitude(userlongitude);
      setLatitude(userlatitude);
    }
    if (userData) {
      setUser(userData);
      CateforyList(userData);
    }
  }, []);

  const [showScroll, setShowScroll] = useState(true);

  const [y, setY] = useState(window.scrollY);

  const handleNavigation = useCallback(
    (e) => {
      const window = e.currentTarget;
      if (y > window.scrollY) {
        // console.log("scrolling up");
        setShowScroll(true);
      } else if (y < window.scrollY) {
        setShowScroll(false);
        // console.log("scrolling down");
      }
      setY(window.scrollY);
    },
    [y],
  );

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

  function ElectionsList(user, latitude, longitude, filterShow) {
    setLoader(true);
    var formData = new FormData();
    // formData.append("category", id);

    formData.append('user_id', user?.user_id);

    if (filterShow == 'category') {
      formData.append('category', selectCategories);
    }
    if (filterShow == 'noncategory') {
      if (electionStatus) {
        formData.append('election_status', electionStatus == 1 ? 'started' : 'not_started');
      }
      if (delivery) {
        formData.append('delivery_option', delivery);
      }
    }
    if (sort != '' && filterShow == 'sort') formData.append('sort_by', `${sort}`);
    // formData.append("user_latitude", `${"34.0066304"}`);
    // formData.append("user_longitude", `${"71.5620352"}`);
    formData.append('latitude', `${latitude}`);
    formData.append('longitude', `${longitude}`);
    formData.append('user_id', user?.user_id);
    formData.append('batch_number', 0);
    formData.append('list_ids', '0');

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
        setCategory(resp.data.data);
        console.log('categorycategory', resp.data);
        setLoader(false);
        setMenuShowCategory(false);
        setMenuShow(false);
        setMenuShow2(false);
      });
  }

  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener('scroll', handleNavigation);

    return () => {
      window.removeEventListener('scroll', handleNavigation);
    };
  }, [handleNavigation]);
  const [loginModal, setLoginModal] = useState(false);

  return (
    <div class="container-fluid">
      <TopHeader title={location.state.header} />
      {loader && <Loader />}

      <section class="content-sec row">
        {/* <!-- This Gift Section Starts here --> */}
        <div class="product-wrap item-snippet">
          {/* {showScroll && ( */}
          <div className={showScroll ? 'fadeIn row' : 'fadeOut row'}>
            <div class="col-12 general-filter">
              <button
                class="btn"
                onClick={() => {
                  setMenuShow2(!menuShow2);
                }}
              >
                {t('filter.ORGANIZE')}
                <img src="images/organize-ico.svg" alt="ico" />
              </button>
              <button
                class="btn"
                onClick={() => {
                  setMenuShow(!menuShow);
                }}
              >
                {t('filter.FILTER')}
                <img src="images/filter-gray-ico.svg" alt="ico" />
              </button>
            </div>
          </div>
          {menuShow && (
            <div class="filter-sidebar show">
              <div class="filter-hdr">
                <div class="head">
                  <button
                    class="btn close"
                    onClick={() => {
                      if (menuShowCategory) {
                        setMenuShowCategory(false);
                      } else setMenuShow(!menuShow);
                    }}
                  >
                    <img src="images/close-ico.svg" alt="" />
                  </button>
                  <h4>{t('filter.Filter')}</h4>
                </div>
                <a
                  onClick={() => {
                    setMenuShow(!menuShow);
                  }}
                >
                  {t('filter.Reset All')}
                </a>
              </div>
              <div class="filter-cont">
                <a class="by-cate" onClick={() => setMenuShowCategory(!menuShowCategory)}>
                  {t('filter.Filter by Category')}
                  <img src="images/yellow-arrow.svg" alt="ico" />
                </a>
                {menuShowCategory ? (
                  categories?.map((item, index) => {
                    return (
                      <a
                        key={index}
                        class="by-cate"
                        style={{
                          fontWeight: selectCategories == item.category_id ? 'bold' : 'normal',
                        }}
                        onClick={() => setSelectCategories(item.category_id)}
                      >
                        {item.name}
                        <img src="images/yellow-arrow.svg" alt="ico" />
                      </a>
                    );
                  })
                ) : (
                  <form>
                    <div class="group">
                      <h5>{t('filter.Election Status')}</h5>
                      <div class="form-check mb-2">
                        <input
                          class={`form-check-input ${electionStatus == 1 ? 'checked' : ''}`}
                          type="radio"
                          name="status"
                          checked={electionStatus == 1 ? true : false}
                          onChange={() => {
                            setElectionStatus(1);
                          }}
                        />
                        <label class="form-check-label" for="">
                          {t('filter.Started')}
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class={`form-check-input ${electionStatus == 2 ? 'checked' : ''}`}
                          type="radio"
                          name="status"
                          checked={electionStatus == 2 ? true : false}
                          onChange={() => {
                            setElectionStatus(2);
                          }}
                        />
                        <label class="form-check-label" for="">
                          {t('filter.To be Started')}
                        </label>
                      </div>
                    </div>
                    <div class="group">
                      <h5>{t('filter.Delivery Option')}</h5>
                      <div class="form-check mb-2">
                        <input
                          class={`form-check-input ${delivery == 1 ? 'checked' : ''}`}
                          type="radio"
                          name="status"
                          checked={delivery == 1 ? true : false}
                          onChange={() => {
                            setdelivery(1);
                          }}
                        />
                        <label class="form-check-label" for="">
                          {t('filter.Shipped')}
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class={`form-check-input ${delivery == 2 ? 'checked' : ''}`}
                          type="radio"
                          name="status"
                          checked={delivery == 2 ? true : false}
                          onChange={() => {
                            setdelivery(2);
                          }}
                        />

                        <label class="form-check-label" for="">
                          {t('filter.On-line delivery')}
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class={`form-check-input ${delivery == 3 ? 'checked' : ''}`}
                          type="radio"
                          name="status"
                          checked={delivery == 3 ? true : false}
                          onChange={() => {
                            setdelivery(3);
                          }}
                        />

                        <label class="form-check-label" for="">
                          {t('filter.Self Collection at the place')}
                        </label>
                      </div>
                    </div>
                    {/* <div class="group border-bottom-0">
                      <h5>{t("filter.Distance From you")}</h5>
                      <div class="range-blk">
                        <span>5 km</span>
                        <span class="right">{t("filter.All World")}</span>
                        <input
                          type="range"
                          class="form-range"
                          id="customRange"
                        />
                      </div>
                    </div> */}
                  </form>
                )}
              </div>
              <div class="filter-ftr border-0">
                <a
                  onClick={() =>
                    ElectionsList(user, latitude, longitude, menuShowCategory ? 'category' : 'noncategory')
                  }
                >
                  {t('filter.Apply Filter')}
                </a>
              </div>
            </div>
          )}
          {menuShow2 && (
            <div class="filter-sidebar head-dd show">
              <div class="filter-hdr">
                <div class="head">
                  <button
                    class="btn close"
                    onClick={() => {
                      setMenuShow2(!menuShow2);
                    }}
                  >
                    <img src="images/close-ico.svg" alt="" />
                  </button>
                  <h4> {t('filter.Organize by')}</h4>
                </div>
                <a
                  onClick={() => {
                    setMenuShow2(!menuShow2);
                  }}
                >
                  {t('filter.Reset All')}
                </a>
              </div>
              <div class="filter-cont">
                <ul class="dropdown-menu">
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => {
                        setSort('ending_soon');
                        ElectionsList(user, latitude, longitude, 'sort');
                      }}
                    >
                      <span class="d-flex align-items-center">
                        <img class="img-black img-fluid" src="images/dd-down-green-arrow.svg" alt="ico" />
                        <img class="img-fluid" src="images/dd-clock-red-ico.svg" alt="ico" />
                        {t('filter.Ending soon')}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => {
                        setSort('ending_later');
                        ElectionsList(user, latitude, longitude, 'sort');
                      }}
                    >
                      <span class="d-flex align-items-center">
                        <img class="img-black img-fluid" src="images/dd-up-green-arrow.svg" alt="ico" />
                        <img class="img-fluid" src="images/dd-clock-red-ico.svg" alt="ico" />
                        {t('filter.Ending Later')}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => {
                        setSort('starting_soon');
                        ElectionsList(user, latitude, longitude, 'sort');
                      }}
                    >
                      <span class="d-flex align-items-center">
                        <img class="img-fluid" src="images/dd-down-green-arrow.svg" alt="ico" />
                        <img class="img-fluid img-black" src="images/dd-clock-red-ico.svg" alt="ico" />
                        {t('filter.Starting soon')}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => {
                        setSort('starting_later');
                        ElectionsList(user, latitude, longitude, 'sort');
                      }}
                    >
                      <span class="d-flex align-items-center">
                        <img class="img-fluid" src="images/dd-up-green-arrow.svg" alt="ico" />
                        <img class="img-fluid img-black" src="images/dd-clock-red-ico.svg" alt="ico" />
                        {t('filter.Starting later')}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => {
                        setSort('highest_value_first');
                        ElectionsList(user, latitude, longitude, 'sort');
                      }}
                    >
                      <span class="d-flex align-items-center">
                        <img class="img-fluid img-black" src="images/dd-down-green-arrow.svg" alt="ico" />
                        <img class="mx-1 img-fluid" src="images/dd-dollor-gray-ico.svg" alt="ico" />
                        {t('filter.Highest value first')}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => {
                        setSort('lowest_value_first');
                        ElectionsList(user, latitude, longitude, 'sort');
                      }}
                    >
                      <span class="d-flex align-items-center">
                        <img class="img-fluid img-black" src="images/dd-up-green-arrow.svg" alt="ico" />
                        <img class="mx-1 img-fluid" src="images/dd-dollor-gray-ico.svg" alt="ico" />
                        {t('filter.Lowest value first')}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => {
                        setSort('lowest_vote_first');
                        ElectionsList(user, latitude, longitude, 'sort');
                      }}
                    >
                      <span class="d-flex align-items-center">
                        <img class="img-fluid" src="images/dd-down-green-arrow.svg" alt="ico" />
                        <img class="img-fluid" src="images/dd-vote-ico.svg" alt="ico" />
                        {t('filter.Lowest votes first')}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => {
                        setSort('lowest_candidate_first');
                        ElectionsList(user, latitude, longitude, 'sort');
                      }}
                    >
                      <span class="d-flex align-items-center">
                        <img class="img-fluid" src="images/dd-down-green-arrow.svg" alt="ico" />
                        <img class="mx-1 img-fluid" src="images/dd-people-ico.svg" alt="ico" />
                        {t('filter.Lowest candidates first')}
                      </span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* )} */}

          {type == 'election' && (
            <div class="row pt-3 mt-3">
              {category.map((item, index) => {
                return (
                  <GeneralElection
                    items={item}
                    indexs={index}
                    user={user && user}
                    loader={loader}
                    setLoader={setLoader}
                  />
                );
              })}
              <p className="mt-5">{t('Vote_Screen.Empty_category')}</p>
            </div>
          )}
          {type == 'business' && (
            <div class="row my-3">
              <div class="product-list mt-4">
                <div class="mt-5">
                  {category.map((item, index) => {
                    return (
                      <BusinessBox
                        item={item}
                        index={index}
                        user={user && user}
                        loader={loader}
                        style={'business-general'}
                        setLoader={setLoader}
                        HomeFtn={() => {}}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {type == 'user' && (
            <div class="product-wrap mt-4" id="friend-chat">
              <div class="row">
                <div class="col-12">
                  {category?.map((item, index) => {
                    return <GeneralUser item={item} index={index} user={user && user} />;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <!-- This Gift Section Ends here --> */}
      </section>
      <CustomModal topClassName="minh-unset" showClose={false} open={loginModal} setOpen={setLoginModal}>
        <div class="alert-bubble-img">
          <img class="img-fluid" src="./images/alert-msg-bubble.png" alt="ico" />
          <div class="cont py-3">
            <h5>
              {t('alerts.Hi!')} <br />
              {t('alerts.you are still visitor')}
            </h5>
            <h5 class="dark">{t('alerts.Click to log-in!!!')}</h5>
          </div>
        </div>
        <div class="button-btm-sec">
          <Link class="btn btn-yellow text-uppercase w-100" to={'/login'}>
            {t('Buttons.Log-in')}
          </Link>
        </div>
      </CustomModal>
      {/* <div class="modal reg-modal bg-blur" id="login-message">
        <div class="modal-dialog modal-dialog-centered">
          <div
            class="modal-content minh-unset"
            data-bs-dismiss="modal"
           
          >
          </div>
        </div>
      </div> */}
      <Footer user={user && user} />
      {/* <!-- Footer Ends here --> */}
    </div>
  );
}
