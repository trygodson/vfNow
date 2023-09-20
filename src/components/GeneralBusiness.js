import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import '../languages/i18n';
import { getUserLatitude, getUserLongitude } from '../Functions/Functions';

import { Carousel } from 'react-responsive-carousel';
import ImageView from '../components/ImageView';
import MessageBox from '../components/MessageBox';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';
import StarRatings from 'react-star-ratings';
import ReactMapGL, { Marker } from 'react-map-gl';

import call from '../images/call-ico.svg';
import tick from '../images/tick-circle-ico.svg';
import web from '../images/web-ico.svg';
import clock from '../images/clock-ico.svg';

import logo from '../images/logo-dummy.png';
import msg from '../images/message-ico.svg';
import { CopyToClipboard } from 'react-copy-to-clipboard';

var weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
var day = new Date().getDay();
const BusinessBox = ({ preview, location, user, setLoader, HomeFtn }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = React.useState(false);
  const [isImageView, setIsImageView] = React.useState(false);
  const [imageView, setImageView] = React.useState(false);
  const [workingHours, setWorkingHours] = React.useState(false);

  const [error_title, seterror_title] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [position, setPosition] = useState();
  const [viewport, setViewport] = React.useState({
    latitude: parseFloat(preview?.business_details?.latitude),
    longitude: parseFloat(preview?.business_details?.longitude),
    zoom: 13,
  });

  useEffect(async () => {
    getGeoInfo();
  }, []);

  const getGeoInfo = async () => {
    const userlongitude = await getUserLongitude();
    const userlatitude = await getUserLatitude();
    setLongitude(userlongitude);
    setLatitude(userlatitude);
    // setViewport({
    //   latitude: userlatitude,
    //   longitude: userlongitude,
    //   zoom: 6,
    // });
  };

  function UserFavBusinessAdd(businessID, status, item) {
    var formData = new FormData();
    setLoader(true);
    formData.append('user_id', user?.user_id);
    formData.append('business_id', businessID);
    formData.append('status', status);
    ApiCall('Post', API.AddfavBusinessApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
        setLoader(false);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        if (resp.data.success) {
          item.favourite = status;
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  function businessReclaimApiFtn() {
    var formData = new FormData();
    setLoader(true);
    formData.append('user_id', user?.user_id);
    formData.append(
      'business_id',
      location.state?.business_id ? location.state?.business_id : location.state.business.business_id,
    );

    ApiCall('Post', API.businessReclaimApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
      })
      .then((resp) => {
        setLoader(false);
        if (resp.data.success) {
          setError(true);
          seterror_title(resp.data.message);
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  function ClipBoardFtn() {
    navigator.clipboard.writeText(
      preview?.business_details.street_address +
        ' ' +
        preview?.business_details.zip_code +
        ' ' +
        preview?.business_details.city +
        ' ' +
        preview?.business_details.region,
    );
  }

  return (
    <div class="product-wrap item-snippet full-view-img">
      {isImageView && (
        <ImageView
          imageView={imageView}
          arrayItems={
            preview?.business_place_images
              ? preview?.business_place_images
              : preview?.business_details?.business_place_images
          }
          setIsImageView={setIsImageView}
        />
      )}
      <div class="product-list">
        <div class="product-overflow">
          <div class="prod-snip business">
            <div class="img-wrap full-view">
              <img
                class="img-fluid"
                src={
                  preview?.business_place_images?.[0]?.picture
                    ? preview?.business_place_images?.[0]?.picture
                    : preview?.business_details?.business_place_images?.[0]?.picture
                    ? preview?.business_details?.business_place_images?.[0]?.picture
                    : 'images/business-thumb.jpg'
                }
                alt="ico"
              />
            </div>
            <div class="cont tri-clip">
              <div
                class="logo-sec"
                onClick={() => {
                  navigate('/businessDetail', {
                    state: {
                      business: preview?.business_details,
                    },
                  });
                }}
              >
                <img
                  class="img-fluid"
                  src={preview?.business_details?.avatar ? preview?.business_details?.avatar : logo}
                  alt="logo"
                />
              </div>
              <h4 class="text-truncate">{preview?.business_details?.business_name}</h4>
              <div class="rating-sec">
                <div class="rating">
                  <StarRatings
                    rating={preview?.business_details?.ratings}
                    starRatedColor="#FFD306"
                    numberOfStars={5}
                    name="rating"
                    starDimension="20px"
                    starSpacing="2px"
                  />
                  <span>
                    {preview?.business_details?.ratings?.toFixed(1)} ({preview?.business_details?.from_people})
                  </span>
                </div>
                <div class="share">
                  <button
                    onClick={() =>
                      UserFavBusinessAdd(
                        preview?.business_details?.business_id,
                        preview?.business_details?.favourite ? 0 : 1,
                        preview?.business_details,
                      )
                    }
                    class={`link bg-transparent border-0 ${
                      preview?.business_details?.favourite == true ? 'yellow-ellipse' : ''
                    }`}
                  >
                    <img class="img-fluid" src="images/heart-ico.svg" alt="" />
                  </button>
                  <a href="javascript:;" class="link">
                    <img class="img-fluid" src="images/share-ico.svg" alt="" />
                  </a>
                </div>
              </div>
              <div class="motto">
                <h5>{preview?.business_details?.motto}</h5>
                <p class="h75-p px-0">{preview?.business_details?.description}</p>
              </div>
            </div>

            <div class="shop-carousel">
              <div class="img-wrap shop-img">
                {/* <Link
                  to="/LoadBusinessshopImages"
                  state={{
                    user: user,
                    business_place_images: preview?.business_place_images
                      ? preview?.business_place_images
                      : preview?.business_details?.business_place_images,
                  }}
                  class="img-count"
                >
                  <img src={camera} alt="" />
                  {preview?.business_place_images?.length
                    ? preview?.business_place_images?.length
                    : preview?.business_details?.business_place_images?.length}
                </Link> */}

                <Carousel
                  showArrows={false}
                  showThumbs={false}
                  showStatus={false}
                  preventMovementUntilSwipeScrollTolerance={true}
                  swipeScrollTolerance={50}
                >
                  {preview?.business_place_images
                    ? preview?.business_place_images?.slice(1)?.map((item, index) => {
                        return (
                          <div
                            className="carousel-height-election"
                            key={index}
                            onClick={() => {
                              setIsImageView(!isImageView);
                              setImageView(index);
                            }}
                          >
                            <img class="img-fluid" src={item?.picture} alt="Thumbnail" />
                          </div>
                        );
                      })
                    : preview?.business_details?.business_place_images.slice(1)?.map((item, index) => {
                        return (
                          <div
                            className="carousel-height-election"
                            key={index}
                            onClick={() => {
                              setIsImageView(!isImageView);
                              setImageView(index);
                            }}
                          >
                            <img class="img-fluid" src={item?.picture} alt="Thumbnail" />
                          </div>
                        );
                      })}
                </Carousel>
              </div>
            </div>

            <div class={`map-sec ${preview?.business_details?.is_only_online == 0 ? 'business-map' : ''}`}>
              {viewport && (
                <ReactMapGL
                  touchAction="pan-y"
                  mapStyle="mapbox://styles/mapbox/streets-v10"
                  mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
                  {...viewport}
                  width="100%"
                  height={300}
                  dragPan={false}
                  scrollZoom={false}
                  onViewportChange={(viewport) => {
                    setViewport(viewport);
                  }}
                  onClick={() => {
                    if (preview?.business_details.is_only_online == 0) {
                      navigate('/BusinessMap', {
                        state: {
                          business_details: preview?.business_details,
                          userlatitude: latitude,
                          userlongitude: longitude,
                        },
                      });
                    }
                  }}
                >
                  <Marker
                    anchor="center"
                    latitude={
                      preview?.business_details?.latitude ? parseFloat(preview?.business_details?.latitude) : 34.0151
                    }
                    longitude={
                      preview?.business_details?.longitude ? parseFloat(preview?.business_details?.longitude) : 71.5249
                    }
                    draggable
                    className="business-pin-marker"
                  >
                    <div
                      class="map-location-contain"
                      onClick={() => {
                        if (preview?.business_details?.is_only_online == 0) {
                          navigate('/BusinessMap', {
                            state: {
                              business_details: preview?.business_details,
                              userlatitude: latitude,
                              userlongitude: longitude,
                            },
                          });
                        }
                      }}
                    >
                      <div class="map-location-wrap">
                        <div class="location-logo">
                          <img
                            src={preview?.business_details?.avatar ? preview?.business_details?.avatar : logo}
                            class="location-logo-img"
                          />
                        </div>
                        <div class="location-content">
                          <h4> {preview?.business_details?.business_name}</h4>
                          {preview?.business_details?.is_only_online == 1 ? (
                            <p>{preview?.business_details?.website}</p>
                          ) : (
                            <>
                              <p>{preview?.business_details.street_address + ' '}</p>
                              <p>{preview?.business_details.city + ' ' + preview?.business_details.region}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* {preview?.business_details.is_only_online == 0 && (
                    // <div class="location-marker">
                    <button class="btn btn-link map-btn">
                      <img
                        class="img-fluid"
                        src={"images/businessPin.png"}
                        width="20px"
                        height="20px"
                        alt=""
                      />
                    </button>
                    // </div>
                  )} */}
                  </Marker>
                </ReactMapGL>
              )}

              {/* {preview?.business_details.is_only_online == 0 && (
                <button
                  class="btn btn-black text-uppercase"
                  onClick={() => ClipBoardFtn()}
                >
                  {t("Buttons.Copy Address")}
                </button>
              )} */}
              {preview?.business_details?.is_only_online == 0 && (
                <CopyToClipboard
                  text={
                    preview?.business_details.street_address +
                    ' ' +
                    preview?.business_details.zip_code +
                    ' ' +
                    preview?.business_details.city +
                    ' ' +
                    preview?.business_details.region
                  }
                  onCopy={() => console.log('Copied!')}
                >
                  <button
                    class="btn btn-black text-uppercase"
                    // onClick={() => ClipBoardFtn()}
                  >
                    {t('Buttons.Copy Address')}
                  </button>
                </CopyToClipboard>
              )}
            </div>

            <div class="shop-detail">
              <div class="p-row">
                <img src={tick} alt="ico" />
                <p>{preview?.business_details?.category.name}</p>
              </div>
              <div class="p-row">
                <img src={web} alt="ico" />
                <p>
                  {preview?.business_details?.website}{' '}
                  <a href={preview?.business_details?.website} target="_blank">
                    {t('business_preview_screen.website')}
                  </a>
                </p>
              </div>
              <div class="p-row">
                <img src={call} alt="ico" />
                <p>
                  {preview?.business_details?.phone_number}{' '}
                  <a href={`tel:${preview?.business_details?.phone_number}`}>{t('business_preview_screen.Call')}</a>
                </p>
              </div>
              <div class="p-row">
                <img src={clock} alt="ico" />
                <p style={{ borderWidth: workingHours ? 0 : 1 }}>
                  {t('business_preview_screen.closed')} 16:00{' '}
                  {!workingHours && (
                    <button className="bg-transparent border-0" onClick={() => setWorkingHours(!workingHours)}>
                      {t('business_preview_screen.Details')}
                    </button>
                  )}
                </p>
              </div>
              {workingHours && (
                <div className="m-2 working-hour-container">
                  {preview?.business_working_hours
                    ? preview?.business_working_hours?.map((item, index) => {
                        return (
                          <div
                            class="working-hour"
                            style={{
                              fontWeight: weekday[day] == item.day ? 'bold' : 'normal',
                              fontSize: 15,
                            }}
                            key={index}
                          >
                            <span>{item.day}</span>
                            <span>{item.from_1 + ' - ' + item.to_1}</span>
                            <span className="text-end">{item.from_2 + ' - ' + item.to_2}</span>
                          </div>
                        );
                      })
                    : preview?.business_details?.business_working_hours?.map((item, index) => {
                        return (
                          <div class="working-hour" key={index}>
                            <span>{item.day}</span>
                            <span>{item.from_1 + ' - ' + item.to_1}</span>
                            <span className="text-end">{item.from_2 + ' - ' + item.to_2}</span>
                          </div>
                        );
                      })}
                  <button className="bg-transparent border-0" onClick={() => setWorkingHours(!workingHours)}>
                    <p> {t('business_preview_screen.Close')}</p>
                  </button>
                </div>
              )}

              <div class="rating-row">
                <div class="rate">
                  <h2>{preview?.business_details?.ratings?.toFixed(1)}</h2>
                  <div class="rating">
                    <Link to="/shopFeedback" state={{ user: preview?.business_details }}>
                      <StarRatings
                        rating={preview?.business_details?.ratings}
                        starRatedColor="#FFD306"
                        numberOfStars={5}
                        name="rating"
                        starDimension="20px"
                        starSpacing="2px"
                      />
                    </Link>
                    <p>
                      {t('Week_Days.from')} {preview?.business_details?.from_people}{' '}
                      {t('business_preview_screen.people')}
                    </p>
                  </div>
                </div>
                <h6>
                  <Link to="/shopFeedback" state={{ user: preview?.business_details }} class="view-all">
                    {t('business_preview_screen.feedback')}
                  </Link>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        class={`btn btn-black w-100 text-uppercase mb-4 ${
          preview?.business_details?.user_registered == 0 ? 'opacity-50' : ''
        }`}
      >
        <img class="img-fluid me-2" src={msg} alt="ico" />
        <small> {t('Buttons.Contact_Business')}</small>
      </button>
      {preview?.business_details?.user_registered == 0 && (
        <>
          <div class="col-12 px-3">
            <img class="img-fluid" src="images/business-not-registered.png" alt="Modal" />
          </div>
          <button onClick={() => businessReclaimApiFtn()} class="btn btn-white text-uppercase mt-4 mb-5 py-2 w-100">
            {t('Buttons.Reclaim Business')}
          </button>
        </>
      )}
      {error && <MessageBox error={error} setError={setError} title={error_title} />}
    </div>
  );
};

export default BusinessBox;
