import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ReactMapGL, { Marker } from 'react-map-gl';

import logo from '../../images/logo-dummy.png';
import share from '../../images/share-ico.svg';
import performanceBG from '../../images/performance-bg.png';
import performancecircle from '../../images/performance-circle.png';
import CircleCo from '../../images/radius.png';
import BusinessFooter from '../../components/BusinessFooter';
import Loader from '../../components/Loader';
import PerformanceGif from '../../images/perfomance.gif';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { getUserData, removeUserData } from '../../Functions/Functions';
import StarRatings from 'react-star-ratings';
import CustomCircularProgressBar from '../../components/CircularProgressBar';
import { ProgressNetworkBars } from '../../components/business/progressNetworkbars';
import { BusinessDetailsShareLink } from './BusinessDetailsShareLink';

export default function BusinessHome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [QRcode, setQRcode] = useState();
  const [preview, setPreview] = useState();
  const [user, setUser] = useState();
  const [menuShow, setMenuShow] = useState();
  const [loader, setLoader] = useState(false);
  const [isMapstate, setIsMapstate] = useState(false);
  const [Mapstate, setMapstate] = useState();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [BusinesData, setBusinesData] = useState('');
  const [Mapstatecategory, setMapstatecategory] = useState('own');
  const [visible, setVisible] = useState(1);
  const [viewport, setViewport] = React.useState({
    latitude: 30.3753,
    longitude: 69.3451,
    zoom: 12,
  });

  const [viewport2, setViewport2] = React.useState({
    latitude: 30.3753,
    longitude: 69.3451,
    zoom: 12,
  });

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      setLoader(true);
      BusinessQRcode(userData);
      PreviewBusiness(userData);
      BusinessView(userData, 'own');
    }
  }, []);

  function BusinessView(user, status) {
    //setLoader(true);
    var formData = new FormData();
    formData.append('business_id', user.business_id);
    formData.append('category', status);
    formData.append('distance', 5);

    ApiCall('Post', API.BusinessCategoryViewApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        //setLoader(false);
        console.log('erorr this api', error);
        //   reject(error.response);
      })
      .then((resp) => {
        //setLoader(false);
        // console.log("mapppp", resp);
        setMapstate(resp.data.data);
      });
  }

  function BusinessQRcode(user) {
    var formData = new FormData();

    formData.append('user_id', user.id);
    formData.append('business_id', user.business_id);
    ApiCall('Post', API.BusinessQR, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        //setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        //setLoader(false);
        console.log('QRCODE', resp.data.data);
        setQRcode(resp.data.data);
      });
  }
  function PreviewBusiness(user) {
    var formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('business_id', user.business_id);

    ApiCall('Post', API.businessPreviewApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        //setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        //setLoader(false);
        // storeUserData(resp.data.data);
        // console.log("previewresp", resp.data.data);
        setPreview(resp.data.data);
        setBusinesData(resp.data.data?.business_data);
        setViewport({
          latitude: parseFloat(resp.data.data?.business_details?.latitude),
          longitude: parseFloat(resp.data.data?.business_details?.longitude),
          zoom: 2,
        });
        setViewport2({
          latitude: parseFloat(resp.data.data?.business_details?.latitude),
          longitude: parseFloat(resp.data.data?.business_details?.longitude),
          zoom: 11,
        });
        setLoader(false);
        // alert(resp.data.message);
      });
  }

  console.log('business_Data', preview);
  return (
    <div class="container-fluid">
      {loader && <Loader />}

      <header class="top-bar">
        <div class="container">
          <div class="row">
            <div class="col-12 tob-bar-inner px-0">
              <button class="btn btn-menu" onClick={() => setMenuShow(!menuShow)}>
                <img class="img-fluid" src="./images/menu-ico.svg" alt="ico" />
              </button>
              <h6> {preview?.business_details?.business_name}</h6>
              <button class="btn d-flex">
                <img src="./images/home-ico.svg" />
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
                      <li>
                        <Link to={'/myPage'} class="dropdown-item">
                          <span class="d-flex align-items-center">{t('Menus.My BUSINESS Page')}</span>
                          <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                        </Link>
                      </li>
                      <li>
                        <Link to={'/Account'} state={{ preview: preview }} class="dropdown-item">
                          <span class="d-flex align-items-center">{t('Menus.Account')}</span>
                          <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                        </Link>
                      </li>
                      <li>
                        <Link to={'/election'} class="dropdown-item">
                          <span class="d-flex align-items-center">{t('Menus.My Elections')}</span>
                          <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                        </Link>
                      </li>
                      <li>
                        <Link to={'/customers'} class="dropdown-item">
                          <span class="d-flex align-items-center">{t('Menus.Chat with customers')}</span>
                          <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                        </Link>
                      </li>
                      <li>
                        <a class="dropdown-item" href="javascript:;">
                          <span class="d-flex align-items-center">{t('Menus.Block chat')}</span>
                          <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="javascript:;">
                          <span class="d-flex align-items-center">{t('Menus.Language')}</span>
                          <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#how-it-modal">
                          <span class="d-flex align-items-center">{t('Menus.Help')}</span>
                          <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#how-it-modal-1">
                          <span class="d-flex align-items-center">{t('Menus.Third-party licenses')}</span>
                          <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="javascript:;">
                          <span class="d-flex align-items-center">{t('Menus.Change email - password')}</span>
                          <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                        </a>
                      </li>
                      <li>
                        <Link to={'/home'} onClick={() => removeUserData()} class="dropdown-item">
                          <span class="d-flex align-items-center">{t('Menus.Log-out')}</span>
                          <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Content Section Starts here --> */}

      {/* <!-- This Gift Section Starts here --> */}
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        <div class="product-wrap item-snippet full-view-img">
          <div class="product-list">
            <div class="product-overflow">
              <div class="prod-snip business h-reduced">
                <div class="img-wrap full-view">
                  <img
                    class="img-fluid"
                    src={
                      preview?.business_place_images[0]?.picture
                        ? preview?.business_place_images[0]?.picture
                        : 'images/business-thumb.jpg'
                    }
                    alt="ico"
                  />
                </div>
                <div class="cont tri-clip">
                  <div class="logo-sec">
                    <img
                      class="img-fluid"
                      src={preview?.business_details?.avatar ? preview?.business_details?.avatar : logo}
                      alt="logo"
                    />
                  </div>
                  <h4 class="text-truncate">{preview?.business_details?.business_name}</h4>
                  <div class="rating-sec">
                    <div>
                      <StarRatings
                        rating={preview?.business_details?.ratings}
                        starRatedColor="#FFD306"
                        numberOfStars={5}
                        name="rating"
                        starDimension="20px"
                        starSpacing="1px"
                      />
                      <span style={{ marginLeft: '10px' }}>
                        {preview?.business_details?.ratings?.toFixed(1)} ({preview?.business_details?.from_people})
                      </span>
                    </div>
                    <div className="share">
                      <div className="link" data-bs-toggle={'modal'} data-bs-target={'#share-modal'}>
                        <img className="img-fluid" src={share} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="product-wrap mt-4">
            <div class=" mb-3">
              {/* <img class="ico" src={fun} alt="" /> */}
              <h3> {t('businessPage.Performance')} </h3>
            </div>
            <div
              class="performance-secc"
              style={{
                backgroundImage: `url(${performanceBG})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              {/* <img class="bg-perf" src={} alt="ico" /> */}
              {!isMapstate ? (
                <div style={{ width: '100%', height: '100%' }}>
                  <div class="per-cont dd" style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    <button class="btn btn-empty" data-bs-toggle="modal" data-bs-target="#info-modal">
                      <img class="img-fluid" src="./images/info-green.png" alt="ico" />
                    </button>
                    <div class="cont-circle c1">
                      {/* <img class="img-fluid" src={performancecircle} alt="" /> */}
                      <CustomCircularProgressBar percentage={preview?.performance?.not_started_progress} />

                      <div class="cont">
                        <img class="ico opacity-25" src="./images/grid-elect-ico.svg" alt="ico" />
                        <span class="count">{preview?.performance?.elections_not_stated}</span>
                        <p>
                          {t('businessPage.ELECTIONs')}
                          <br />
                          {t('businessPage.NOT STARTED')}
                        </p>
                      </div>
                      <img class="img-fluid tail-ico" src="images/tail-ico.png" alt="ico" />
                    </div>
                    <div class="cont-circle c2">
                      {/* <img class="img-fluid" src="images/performance-circle-1.png" alt="" /> */}
                      <CustomCircularProgressBar percentage={preview?.performance?.started_progress} />

                      <div class="cont">
                        <img class="ico" src="images/grid-elect-ico.svg" alt="ico" />
                        <span class="count"> {preview?.performance?.elections_started}</span>
                        <p>
                          {t('businessPage.ELECTIONs')}
                          <br />
                          {t('businessPage.STARTED')}
                        </p>
                      </div>
                      <img class="img-fluid tail-ico" src="images/tail-ico-1.png" alt="ico" />
                    </div>
                    <div class="cont-circle c3">
                      {/* <img class="img-fluid" src="images/performance-circle-2.png" alt="" /> */}
                      <CustomCircularProgressBar percentage={preview?.performance?.ended_progress} />

                      <div class="cont">
                        <img class="ico" src="images/gift-ico.svg" alt="ico" />
                        <span class="count">{preview?.performance?.elections_ended}</span>
                        <p>
                          {t('businessPage.ELECTIONs')}
                          <br />
                          {t('businessPage.ENDED')}
                        </p>
                      </div>
                      <img class="img-fluid tail-ico" src="images/tail-ico-2.png" alt="ico" />
                    </div>
                    <div
                      class="big-circle business-circle"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -56%)',
                      }}
                    >
                      {/* <img class="img-fluid" src="images/performance-circle-big.png" alt="ico" /> */}
                      <CustomCircularProgressBar percentage={Mapstate?.better_than_region} max={100} />
                      <div class="cont">
                        <span class="yellow"> {t('businessPage.VF Value')} </span>
                        <h5>
                          <img class="ico" src="images/candidate-logo.png" alt="ico" />
                          {Mapstate?.vf_value}
                        </h5>
                        <hr />
                        <ProgressNetworkBars
                          number={preview?.performance?.better_than}
                          // number={preview?.performance?.vf_value}
                        />
                        {/* <img class="chart-img img-fluid" src="images/bar-chat.png" alt="ico" /> */}
                        <hr />
                        <span class="yellow">{t('businessPage.Better than')}</span>
                        <h5>{Mapstate?.better_than_region} %</h5>
                        <span class="yellow"> {t('businessPage.Of Shops')} </span>
                      </div>
                    </div>
                    <div class="cont-circle c4">
                      {/* <img class="img-fluid" src="images/performance-circle-3.png" alt="" /> */}
                      <CustomCircularProgressBar percentage={preview?.performance?.votes_progress} />

                      <div class="cont">
                        <img class="ico" src="images/vote-btn-ico.png" alt="ico" />
                        <span class="count">{preview?.performance?.total_votes}</span>
                        <p>
                          {t('businessPage.TOTAL')}
                          <br />
                          {t('businessPage.VOTE')}
                        </p>
                      </div>
                      <img class="img-fluid tail-ico" src="./images/tail-ico-3.png" alt="ico" />
                    </div>
                    <div class="cont-circle c5">
                      {/* <img class="img-fluid" src="images/performance-circle-4.png" alt="" /> */}
                      <CustomCircularProgressBar percentage={preview?.performance?.candidates_progress} />

                      <div class="cont">
                        <img class="ico" src="images/my-acc-ico.svg" alt="ico" />
                        <span class="count">{preview?.performance?.total_candidates}</span>
                        <p>
                          {t('businessPage.TOTAL')}
                          <br />
                          {t('businessPage.CANDIDATE')}
                        </p>
                      </div>
                      <img class="img-fluid tail-ico" src="images/tail-ico-4.png" alt="ico" />
                    </div>
                  </div>
                </div>
              ) : (
                <div class="per-cont dd" style={{ top: 8, margin: '0 auto', position: 'absolute' }}>
                  <p className="See-detail-vf" style={{ 'fontSize': '18px' }}>
                    {t('businessPage.VF VALUE')}
                    <img
                      class="ico"
                      style={{ paddingLeft: 20 }}
                      height={'15px'}
                      src="./images/candidate-logo.png"
                      alt="ico"
                    />
                    {Mapstate?.vf_value}
                  </p>
                  {preview?.business_details?.latitude && preview?.business_details?.longitude && (
                    <div class="map-sec-category mx-auto">
                      <ReactMapGL
                        touchAction="pan-y"
                        mapStyle="mapbox://styles/mapbox/light-v10"
                        mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
                        {...viewport}
                        width="92%"
                        height="100%"
                        onViewportChange={(viewport) => {
                          setViewport(viewport);
                        }}
                        dragPan={false}
                        scrollZoom={false}
                        style={{ margin: '0 auto' }}
                      >
                        <Marker
                          anchor="center"
                          latitude={
                            preview?.business_details?.latitude
                              ? parseFloat(preview?.business_details?.latitude)
                              : 34.0151
                          }
                          longitude={
                            preview?.business_details?.longitude
                              ? parseFloat(preview?.business_details?.longitude)
                              : 71.5249
                          }
                        >
                          {/* <button class="btn btn-link"> */}
                          {/* <img class="img-fluid " src={'images/flag.svg'} width="60px" height="40px" alt="" /> */}
                          <span className="map-flag" style={{ 'bottom': '10px', 'right': '-20px' }}>
                            {' '}
                            {preview?.business_details?.region}
                          </span>
                          {/* </button> */}
                        </Marker>
                      </ReactMapGL>
                    </div>
                  )}

                  <p className="See-detail-vf">
                    <span className="see-detail-color">{t('businessPage.Better than')}</span>{' '}
                    {Mapstate?.better_than_region}%{' '}
                    <span className="see-detail-color">{t('businessPage.of shops IN')}</span>{' '}
                    {preview?.business_details?.region.toUpperCase()}
                  </p>
                  {preview?.business_details?.latitude && preview?.business_details?.longitude && (
                    <div className="map-sec-category" style={{ 'height': '240px' }}>
                      <ReactMapGL
                        touchAction="pan-y"
                        mapStyle="mapbox://styles/mapbox/streets-v12"
                        mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
                        {...viewport2}
                        width="92%"
                        height="100%"
                        onViewportChange={(viewport) => {
                          setViewport2(viewport);
                        }}
                        dragPan={false}
                        scrollZoom={false}
                        style={{ margin: '0 auto' }}
                      >
                        <Marker
                          anchor="top"
                          latitude={
                            preview?.business_details?.latitude
                              ? parseFloat(preview?.business_details?.latitude)
                              : 34.0151
                          }
                          longitude={
                            preview?.business_details?.longitude
                              ? parseFloat(preview?.business_details?.longitude)
                              : 71.5249
                          }
                          className="business-pin-marker"
                        >
                          <button
                            class="btn btn-link"
                            style={{
                              backgroundImage: `url(${CircleCo})`,
                              width: '230px',
                              height: '230px',
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <img
                              class="img-fluid"
                              src={'./images/businessPin.png'}
                              width="20px"
                              height="20px"
                              alt=""
                              style={{}}
                            />
                          </button>
                          {/* <button class="btn btn-link">
                            <img
                              class="img-fluid"
                              src={'images/businessPin.png'}
                              width="20px"
                              height="20px"
                              alt=""
                              style={{ 'position': 'absolute' }}
                            />
                            <img
                              class="img-fluid"
                              src={'images/radius.png'}
                              width="260px"
                              height="260px"
                              alt=""
                              style={{ 'position': 'relative', 'right': '45%', 'bottom': '100px' }}
                            />
                          </button> */}
                        </Marker>
                      </ReactMapGL>
                    </div>
                  )}
                  <p className="See-detail-vf">
                    <span className="see-detail-color">{t('businessPage.Better than')}</span>{' '}
                    {Mapstate?.better_than_area}%{' '}
                    <span className="see-detail-color">{t('businessPage.of shops IN')}</span>{' '}
                    {t('businessPage.your AREA')} (5 KM)
                  </p>
                  <div class="see-detail-btn">
                    <div class="circle-btn">
                      <button
                        class={Mapstatecategory == 'own' ? 'no' : ''}
                        onClick={() => {
                          BusinessView(user, 'own');
                          setMapstatecategory('own');
                        }}
                      >
                        {t('businessPage.YOUR CATEGORY')}
                      </button>
                    </div>

                    <div class="circle-btn">
                      <button
                        class={Mapstatecategory == 'all' ? 'no' : ''}
                        onClick={() => {
                          BusinessView(user, 'all');
                          setMapstatecategory('all');
                        }}
                      >
                        {t('businessPage.ALL CATEGORY')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="see-link mt-2" style={!isMapstate ? { transform: 'translate(-50%, 0px)' } : {}}>
                <a onClick={() => setIsMapstate(!isMapstate)}>
                  {!isMapstate ? t('businessPage.SEE DETAILS') : t('businessPage.back')}
                </a>
              </div>
            </div>
          </div>
          <div class="product-wrap mt-4">
            <div class=" mb-3">
              {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
              <h3>{t('businessPage.Impove your Performance')}</h3>
            </div>
            <p class="small">
              {t('businessPage.To improve you performance we reccomand you to do any of the action below')}
            </p>
            <div class="btn-clip-wrap mb-5">
              <Link to={'/newElection'} className={`btn btn-clip mt-0 ${'btn-yellow'}`}>
                <span>
                  <img class="ico" src="./images/add-new-elec-ico.svg" alt="ico" />
                  {t('businessPage.ADD NEW ELECTION')}
                </span>
                <img class="arrow" src="./images/arrow-ico.svg" alt="ico" />
              </Link>
              <button
                disabled={!preview?.business_details?.share_election_status}
                onClick={() => navigate('/electionShare')}
                class={`btn btn-clip mt-0 ${
                  preview?.business_details?.share_election_status ? 'btn-yellow' : 'btn-gray'
                }`}
              >
                <span>
                  <img class="ico" src="./images/share-black-ico.svg" alt="ico" />
                  {preview?.business_details?.share_election_status
                    ? t('businessPage.SHARE ELECTION')
                    : t('businessPage.NO_ELECTION')}
                </span>
                <img class="arrow" src="./images/arrow-ico.svg" alt="ico" />
              </button>
              <button
                disabled={!preview?.business_details?.give_gift_status}
                onClick={() => navigate('/ElectionGifts')}
                className={`btn btn-clip mt-0 ${
                  preview?.business_details?.give_gift_status ? 'btn-yellow' : 'btn-gray'
                }`}
              >
                <span>
                  <img class="ico" src="./images/gift-black-ico.svg" alt="ico" />
                  {preview?.business_details?.give_gift_status
                    ? t('businessPage.GIVE GIFT')
                    : t('businessPage.NO_GIFT')}
                </span>
                <img class="arrow" src="./images/arrow-ico.svg" alt="ico" />
              </button>
              <Link to={'/VFvalue'} state={{ preview: preview }} class="btn btn-yellow btn-clip mt-0">
                <span>
                  <img class="ico" src="./images/candidate-logo.png" alt="ico" />
                  {t('businessPage.PURCHASE VF CREDITS')}
                </span>
                <img class="arrow" src="./images/arrow-ico.svg" alt="ico" />
              </Link>
            </div>
            <Link to={'/customers'} class="btn btn-black w-100 my-3 py-2">
              {t('businessPage.Chat with customers')}
            </Link>
            <button class="btn btn-black w-100 my-3 py-2" data-bs-toggle="modal" data-bs-target="#qr-modal">
              {t('businessPage.My QR-CODE')}
            </button>
            <button
              disabled={!preview?.business_details?.payment_due_status}
              onClick={() => navigate('/Account')}
              state={{ preview: preview }}
              className={`btn w-100 mt-3 mb-5 py-2 ${
                preview?.business_details?.payment_due_status ? 'btn-black' : 'btn-white'
              }`}
            >
              {preview?.business_details?.payment_due_status ? (
                <>
                  {t('businessPage.ACCOUNT')}
                  <span class="text-danger">{t('businessPage.Something shall be paid')}</span>
                </>
              ) : (
                t('businessPage.ACCOUNT')
              )}
            </button>
          </div>
        </div>
      </section>
      {/* <!-- Footer Starts here --> */}
      <BusinessFooter />
      {/* <!-- Footer Ends here --> */}
      {/* <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="info-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="performace-modal">
              <h5>
                {t('businessPage.PERFORMANCE')}
                <br />
                {t('businessPage.How does it work?')}
              </h5>
              <img src={PerformanceGif} width={'100%'} style={{ marginBottom: '20px' }} />
              {/* {visible === 1 ? (
                <div class="it-work performance-1">
                  <div class="thumb-sec">
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb active" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                  </div>
                  <div class="big-circle">
                    <img class="img-fluid" src="images/performance-modal-cirlce-1.png" alt="ico" />
                    <div class="cont">
                      <span class="yellow dark">{t('businessPage.VF Value')}</span>
                      <h5>
                        <img class="ico" src="images/candidate-logo.png" alt="ico" />
                        123
                      </h5>
                      <hr />
                      <img class="chart-img img-fluid" src="images/bar-chat.png" alt="ico" />
                      <hr />
                      <span class="yellow">{t('businessPage.Better than')}</span>
                      <h5>18%</h5>
                      <span class="yellow">{t('businessPage.Of Shops')}</span>
                      <img class="tail-ico" src="images/tail-modal-ico-1.png" alt="ico" />
                    </div>
                  </div>
                  <button class="btn btn-txt" onClick={() => setVisible(2)}>
                    {t('businessPage.TRY HERE')}
                  </button>
                </div>
              ) : (
                ''
              )}
              {visible === 2 ? (
                <div class="it-work performance-2">
                  <div class="thumb-sec">
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb active" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                  </div>
                  <div class="big-circle" style={{ 'margin': '20px 0px 0 11px' }}>
                    <img class="img-fluid" src="images/performance-modal-cirlce-2.png" alt="ico" />
                    <div class="cont">
                      <span class="yellow dark">{t('businessPage.VF Value')}</span>
                      <h5>
                        <img class="ico" src="images/candidate-logo.png" alt="ico" />
                        237
                      </h5>
                      <hr />
                      <img class="chart-img img-fluid" src="images/bar-chat.png" alt="ico" />
                      <hr />
                      <span class="yellow">{t('businessPage.Better than')}</span>
                      <h5>54%</h5>
                      <span class="yellow">{t('businessPage.Of Shops')}</span>
                      <img class="tail-ico" src="images/tail-modal-ico-2.png" alt="ico" style={{ 'top': '37px' }} />
                    </div>
                  </div>
                  <button class="btn btn-txt" onClick={() => setVisible(3)}>
                    {t('businessPage.TRY HERE')}
                  </button>
                </div>
              ) : (
                ''
              )}
              {visible === 3 ? (
                <div class="it-work performance-3">
                  <div class="thumb-sec">
                    <img class="thumb active" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                    <img class="thumb" src="images/election-skeleton.png" alt="Thumb" />
                  </div>
                  <div class="big-circle">
                    <img class="img-fluid" src="images/performance-modal-cirlce-3.png" alt="ico" />
                    <div class="cont">
                      <span class="yellow dark">{t('businessPage.VF Value')}</span>
                      <h5>
                        <img class="ico" src="images/candidate-logo.png" alt="ico" />
                        1234
                      </h5>
                      <hr />
                      <img class="chart-img img-fluid" src="images/bar-chat.png" alt="ico" />
                      <hr />
                      <span class="yellow">{t('businessPage.Better than')}</span>
                      <h5>100%</h5>
                      <span class="yellow">{t('businessPage.Of Shops')}</span>
                      <img
                        class="tail-ico"
                        src="images/tail-modal-ico-3.png"
                        alt="ico"
                        style={{ 'left': '-34px', 'top': '-120px' }}
                      />
                    </div>
                  </div>
                  <button class="btn btn-txt" onClick={() => setVisible(1)}>
                    {t('businessPage.TRY HERE')}
                  </button>
                </div>
              ) : (
                ''
              )} */}
              <p>
                {t(
                  "businessPage.Your VF VALUE will be compared with the other Business' VF VALUEs and based on it, will be set the preliminary position of your pages.",
                )}

                <strong>
                  {t(
                    'businessPage.Remeber! Higher is your page position, higher is the visibility and clients you will have!!!',
                  )}
                </strong>
              </p>
              <p>
                {t('businessPage.VF VALUE is calculated on the five factors you can see at your Performance Page.')}
              </p>
              <p>
                {t(
                  'businessPage.Make sure to keep your VF VALUE the highest possible!!! To do so you can: ADD NEW ELECTION, SHARE ELECTION, GIVE GIFT ...or if you need some help, you can also PURCHASE VF CREDITS.',
                )}
              </p>
              <p class="mb-1">{t("businessPage.Whatever you decide, let's have fun!")}</p>
              <p class="text-end">{t('businessPage.and ofcourse you more CLIENTs')}</p>
              <button class="btn btn-close-x p-0" onClick={() => setVisible(1)}>
                <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="qr-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="alert-bubble-img qr-wrap">
              <div class="avatar-img business">
                <img src={QRcode?.avatar ? QRcode?.avatar : 'images/logo-dummy.png'} alt="Username" />
              </div>
              <h5>{QRcode?.business_name}</h5>
              <div class="qr-img m-auto mt-5">
                <img src={'data:image/png;base64,' + QRcode?.qr_image} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here --> */}

      <div class="modal bg-blur" id="how-it-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="privacy-wrapper">
              <div class="container">
                <div class="col-12 privacy-sec">
                  <img src="images/help-skew-img.svg" alt="How Does It Work" class="img-fluid mt-2 mb-2" />
                  <p class="fs-12">{t('alerts.help')}</p>
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

      {/* Share Business Link Modal */}

      <div class="modal bg-blur" id="share-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-5 lay-7 elect-lay">
              <img class="img-fluid" src="/images/layout-4-bg.png" alt="images" />
              <div class="cont">
                <div class="prod-thumb">
                  <div class="thumb-in">
                    <img
                      class="prod-img img-fluid"
                      src={preview?.business_details?.avatar ? preview?.business_details?.avatar : logo}
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img src={preview?.business_details?.avatar ? preview?.business_details?.avatar : logo} alt="" />
                    </div>
                    {/* <div class="pls-vote-badge">
                      <img class="img-fluid" src="/images/pls-vote-vertical-badge.png" alt="img" />
                    </div> */}
                  </div>
                </div>
                <button class="btn btn-black border">
                  {t('Buttons.CLICK TO')}
                  <br />
                  {t('Buttons.ENTER')}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            <BusinessDetailsShareLink
              modalElection={preview}
              // shareImage={shareimage}

              setLoading={setLoader}
            />

            <button class="btn btn-close-x">
              <img class="img-fluid" src="./images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>

      {preview?.business_incomplete && (
        <div
          class="modal bg-blur show"
          style={{
            display: preview?.business_incomplete ? 'block' : 'none',
            backgroundColor: 'rgba(222, 223, 222 , 0.9)',
          }}
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content minh-unset" data-bs-dismiss="modal">
              <div class="alert-bubble-img">
                <img class="img-fluid" src="images/alert-msg-bubble.png" alt="ico" />
                <div class="cont">
                  <h5 style={{ 'color': '#fff', 'font-size': '16px', 'margin-top': '8px' }}>{t('alerts.Hi!')}</h5>
                  <p
                    style={{
                      'color': '#080708',
                      'font-size': '14px',
                      'padding': '0px',
                      'margin-left': '-12px',
                      'margin-top': '20px',
                    }}
                  >
                    {t("alerts.let's update your incomplete business details")}
                  </p>
                  <p
                    style={{ 'cursor': 'pointer' }}
                    onClick={() => {
                      setIsOpen(false);
                      //navigate("/myPage");
                      navigate('/myPage', {
                        state: {
                          business_Data: BusinesData,
                        },
                      });
                    }}
                  >
                    {t('alerts.click here')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
