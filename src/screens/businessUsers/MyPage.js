import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import TopHeader from '../../components/BusinessHeader';
import AddressUpdate from '../../components/business/AddressUpdate';
import BusinessFooter from '../../components/BusinessFooter';
import BusinessCurrentLocation from '../BusinessCurrentLocation';
import ReactMapGL, { Marker } from 'react-map-gl';

import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';

import blackpin from '../../images/black.png';

import call from '../../images/call-ico.svg';
import tick from '../../images/tick-circle-ico.svg';
import web from '../../images/web-ico.svg';
import clock from '../../images/clock-ico.svg';

import { getUserData } from '../../Functions/Functions';
import { Carousel } from 'react-responsive-carousel';
import StarRatings from 'react-star-ratings';
import Loader from '../../components/Loader';

var weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
var day = new Date().getDay();

export default function BusinessHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [viewport, setViewport] = React.useState();
  const [preview, setPreview] = useState();
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState();
  const [locationmap, setlocationMap] = useState(false);
  const [address, setAddress] = useState(false);
  const [name, setName] = useState('');
  const [motto, setMotto] = useState('');
  const [category, setCategory] = useState('');
  const [categorylist, setCategoryList] = useState([]);

  const [description, setDescription] = useState();
  const [website, setWebsite] = useState('');
  const [phone_number, setPhone_number] = useState('');

  const [nameField, setNameField] = useState(false);
  const [mottoField, setMottoField] = useState(false);
  const [descField, setDescField] = useState(false);
  const [categoryField, setCategoryField] = useState(false);
  const [websiteField, setWebsiteField] = useState(false);
  const [phoneField, setPhoneField] = useState(false);

  const [image, setImages] = useState('');
  const [imagePreview, setImagePreview] = useState();
  const [openHours, setOpenHours] = useState(false);
  const [businessWorkingHours, setBusinessWorkingHours] = useState([]);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locations, setLocations] = useState([]);

  const onFileChange = (event) => {
    setImages(event.target.files[0]);
    setImagePreview(URL.createObjectURL(event.target.files[0]));
    ModifyBusiness(user, event.target.files[0]);
    // seterror_title("avatar");
    // setModifyMsg(true);
  };

  const ref = useRef(null);
  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      setLoader(true);
      PreviewBusiness(userData);
      CategoryList(userData);
    }
  }, []);

  function CategoryList(user) {
    var formData = new FormData();

    ApiCall('Post', API.categoryBusinessListApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log('categories', resp.data.data);
        setCategoryList(resp.data.data);
      });
  }

  function ModifyBusiness(user, avatar = '') {
    var formData = new FormData();
    formData.append('user_id', user.id);
    if (avatar) formData.append('picture', avatar);
    if (name) formData.append('name', name);
    if (motto) formData.append('motto', motto);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    if (website) formData.append('website', website);
    if (phone_number) formData.append('phone_number', phone_number);

    ApiCall('Post', API.BusinessModifyApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log('modifyy ', resp.data.data);
        setLoader(false);
        setNameField(false);
        setMottoField(false);
        setDescField(false);
        setCategoryField(false);
        setWebsiteField(false);
        setPhoneField(false);
        setPreview(resp.data.data);
      });
  }

  function ConfirmModification(user, avatar = '') {
    var formData = new FormData();
    formData.append('user_id', user.id);
    if (avatar) formData.append('picture', avatar);
    if (name) formData.append('name', name);
    if (motto) formData.append('motto', motto);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    if (website) formData.append('website', website);
    if (phone_number) formData.append('phone_number', phone_number);

    ApiCall('Post', API.BusinessModifyApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log('modifyy ', resp.data.data);
        setLoader(false);
        setNameField(false);
        setMottoField(false);
        setDescField(false);
        setCategoryField(false);
        setWebsiteField(false);
        setPhoneField(false);
        setPreview(resp.data.data);
        navigate('/businessHome');
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
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // console.log("preview resp.data.data", resp.data.data);
        console.log('working hrs ', resp.data.data.business_working_hours);
        setLoader(false);
        setPreview(resp.data.data);
        setViewport({
          latitude: resp.data.data?.business_details?.latitude
            ? parseFloat(resp.data.data?.business_details?.latitude)
            : 34.0151,
          longitude: resp.data.data?.business_details?.longitude
            ? parseFloat(resp.data.data?.business_details?.longitude)
            : 71.5249,
          zoom: 12,
        });
        setBusinessWorkingHours(resp.data.data.business_working_hours);
      });
  }

  function ClipBoardFtn() {
    navigator.clipboard.writeText(
      (preview?.business_details.business_name ? preview?.business_details.business_name : '') +
        '\n' +
        (locations.street_address
          ? locations.street_address
          : preview?.business_details.street_address
          ? preview?.business_details.street_address
          : '') +
        '\n' +
        (locations.city ? locations.city : preview?.business_details.city ? preview?.business_details.city : '') +
        '\n' +
        (locations.region
          ? locations.region
          : preview?.business_details.region
          ? preview?.business_details.region
          : '') +
        '\n' +
        (locations.zip_code
          ? locations.zip_code
          : preview?.business_details.zip_code
          ? preview?.business_details.zip_code
          : ''),
    );
  }

  console.log('=============================');
  console.log(locations);
  console.log(
    !preview?.business_details.latitude && !preview?.business_details.longitude && !preview?.business_details.region,
  );
  console.log(preview?.business_details.latitude);
  console.log(preview?.business_details.longitude);
  console.log(preview?.business_details.region);
  console.log('=============================');

  return (
    <>
      {address ? (
        <AddressUpdate
          loader={loader}
          setLoader={setLoader}
          address={address}
          setAddress={setAddress}
          locations={locations}
          setLocations={setLocations}
          locationmap={locationmap}
          setlocationMap={setlocationMap}
          business_details={preview?.business_details}
          preview={preview}
          user={user}
        />
      ) : locationmap ? (
        <BusinessCurrentLocation
          loader={loader}
          setLoader={setLoader}
          latitude={preview?.business_details?.latitude}
          setLatitude={setLatitude}
          longitude={preview?.business_details?.longitude}
          setLongitude={setLongitude}
          viewport={viewport}
          setViewport={setViewport}
          locationmap={locationmap}
          setlocationMap={setlocationMap}
          business_details={preview?.business_details}
        />
      ) : (
        <div class="container-fluid">
          <TopHeader title={t('Header.Mypage')} />
          {/* <!-- Content Section Starts here --> */}
          {loader && <Loader />}

          <section class="content-sec row">
            {/* <!-- This Gift Section Starts here --> */}
            <div class="product-wrap item-snippet full-view-img">
              <div class="product-list mb-5">
                <div class="product-overflow">
                  <div class="prod-snip business">
                    <div class="img-wrap full-view">
                      <img
                        class="img-fluid"
                        alt="ico"
                        src={
                          preview?.business_place_images?.[0]?.picture
                            ? preview?.business_place_images?.[0]?.picture
                            : 'images/business-thumb.jpg'
                        }
                      />

                      <a
                        onClick={() =>
                          navigate('/LoadBusinessshopImages', {
                            state: {
                              user: user,
                              business_place_images: preview?.business_place_images,
                              status: 'update',
                              business_Data: preview?.business_details,
                            },
                          })
                        }
                        class="edit-btn"
                      >
                        <img src="images/img-edit-ico.svg" alt="ico" />
                      </a>
                    </div>
                    <div class="cont tri-clip">
                      <div class="logo-sec">
                        <img
                          class="img-fluid"
                          src={
                            imagePreview
                              ? imagePreview
                              : preview?.business_details?.avatar
                              ? preview?.business_details?.avatar
                              : 'images/shop-placeholder.jpg'
                          }
                          alt="logo"
                        />
                      </div>
                      <a href="javascript:;" class="edit-btn logo-edit">
                        <img src="images/img-edit-ico.svg" alt="ico" />
                        <div class="wrapper wrapper-img" style={{ 'width': '20px', 'height': '20px', 'left': '0' }}>
                          <input type="file" onChange={onFileChange} />
                        </div>
                      </a>

                      <h4>
                        {nameField || !preview?.business_details?.business_name ? (
                          <input
                            type="text"
                            class="text-truncate text-uppercase"
                            placeholder={t('placeHolders.business_name')}
                            onChange={(text) => setName(text.target.value)}
                            style={
                              preview?.business_details?.business_name
                                ? { 'background-color': '#eefbfb', 'border': '2px solid transparent' }
                                : { 'background-color': '#eefbfb', 'border': '2px solid red' }
                            }
                            value={name ? name : preview?.business_details?.business_name}
                            onMouseOut={(e) => {
                              ModifyBusiness(user);
                            }}
                            required
                          />
                        ) : (
                          <span>{name ? name : preview?.business_details?.business_name}</span>
                        )}
                        <a href="javascript:;" onClick={() => setNameField(!nameField)}>
                          <img src="images/img-edit-ico.svg" alt="ico" />
                        </a>
                      </h4>
                      {!(name ? name : preview?.business_details?.business_name) ? (
                        <span className="error-msg" style={{ 'font-size': '12px' }}>
                          {t('validation.business_name')}
                        </span>
                      ) : (
                        ''
                      )}

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
                      </div>
                      <div class="motto">
                        <h5>
                          {mottoField || !preview?.business_details?.motto ? (
                            <input
                              type="text"
                              class="text-truncate border-0"
                              placeholder={t('placeHolders.motto')}
                              onChange={(text) => setMotto(text.target.value)}
                              style={{ 'background-color': '#eefbfb', 'padding': '6px' }}
                              value={motto ? motto : preview?.business_details?.motto}
                              onMouseOut={(e) => {
                                ModifyBusiness(user);
                              }}
                              required
                            />
                          ) : (
                            <span>{motto ? motto : preview?.business_details?.motto}</span>
                          )}
                          <a href="javascript:;" onClick={() => setMottoField(!mottoField)}>
                            <img src="images/img-edit-ico.svg" alt="ico" />
                          </a>
                        </h5>
                        <p class="px-0">
                          {descField || !preview?.business_details?.description ? (
                            <textarea
                              class="border-0"
                              placeholder={t('placeHolders.description')}
                              style={{ 'background-color': '#eefbfb' }}
                              onChange={(text) => setDescription(text.target.value)}
                              value={description ? description : preview?.business_details?.description}
                              onMouseOut={(e) => {
                                ModifyBusiness(user);
                              }}
                              required
                              rows={4}
                              cols={40}
                            />
                          ) : (
                            <span>{description ? description : preview?.business_details?.description}</span>
                          )}
                        </p>
                        <a
                          href="javascript:;"
                          class="edit-btn"
                          style={{ 'left': '230px' }}
                          onClick={() => setDescField(!descField)}
                        >
                          <img src="images/img-edit-ico.svg" alt="ico" />
                        </a>
                      </div>
                    </div>
                    <div class="shop-carousel">
                      <div class="img-wrap shop-img">
                        <Carousel
                          showArrows={false}
                          showThumbs={false}
                          showStatus={false}
                          preventMovementUntilSwipeScrollTolerance={true}
                          swipeScrollTolerance={50}
                          onClickItem={() =>
                            navigate('/LoadBusinessshopImages', {
                              state: {
                                user: user,
                                business_place_images: preview?.business_place_images,
                                status: 'update',
                                business_Data: preview?.business_details,
                              },
                            })
                          }
                        >
                          {preview?.business_place_images?.map((item, index) => {
                            return (
                              <div key={index} className="carousel-height-election">
                                <img
                                  class="img-fluid"
                                  src={item?.picture}
                                  alt="Thumbnail"
                                  style={{ width: '720px', objectFit: 'cover' }}
                                />
                              </div>
                            );
                          })}
                        </Carousel>
                      </div>
                    </div>
                    {preview && viewport?.latitude && viewport?.longitude && (
                      <div class={`map-sec ${preview?.business_details.is_only_online == 0 ? 'business-map' : ''}`}>
                        {locations.longitude && locations.latitude ? (
                          <ReactMapGL
                            mapStyle="mapbox://styles/mapbox/streets-v10"
                            mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
                            {...locations.viewport}
                            width="100%"
                            height="210px"
                            dragPan={false}
                            scrollZoom={false}
                            onViewportChange={(viewport) => {
                              setViewport(viewport);
                            }}
                          >
                            {preview?.business_details?.business_name ? (
                              <div class="map-location-contain" style={{ 'right': '36px', 'top': '24px' }}>
                                <div class="map-location-wrap">
                                  <div class="location-logo">
                                    <img
                                      src={
                                        imagePreview
                                          ? imagePreview
                                          : preview?.business_details?.avatar
                                          ? preview?.business_details?.avatar
                                          : 'images/shop-placeholder.jpg'
                                      }
                                      class="location-logo-img"
                                    />
                                  </div>
                                  <div class="location-content">
                                    <h4>
                                      {' '}
                                      {preview?.business_details?.business_name
                                        ? preview?.business_details?.business_name
                                        : ''}
                                    </h4>

                                    {preview?.business_details.is_only_online == 1 ? (
                                      <p>{preview?.business_details?.website}</p>
                                    ) : (
                                      <>
                                        <p>{(locations.street_address ? locations.street_address : '') + ' '}</p>
                                        <p>
                                          {(locations.city ? locations.city : '') +
                                            ' ' +
                                            (locations.region ? locations.region : '') +
                                            ' ' +
                                            (locations.zip_code ? locations.zip_code : '')}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ''
                            )}
                            <Marker
                              anchor="center"
                              latitude={locations.latitude ? parseFloat(locations.latitude) : 34.0151}
                              longitude={locations.longitude ? parseFloat(locations.longitude) : 71.5249}
                            >
                              <img class="img-fluid" src={'images/businessPin.png'} width="20px" height="20px" alt="" />
                            </Marker>
                          </ReactMapGL>
                        ) : (
                          <ReactMapGL
                            mapStyle="mapbox://styles/mapbox/streets-v10"
                            mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
                            {...viewport}
                            width="100%"
                            height="210px"
                            dragPan={false}
                            scrollZoom={false}
                            onViewportChange={(viewport) => {
                              setViewport(viewport);
                            }}
                            style={
                              preview?.business_details?.latitude &&
                              preview?.business_details?.longitude &&
                              preview?.business_details?.region
                                ? { 'background-color': '#eefbfb', 'border': '2px solid transparent' }
                                : { 'background-color': '#eefbfb', 'border': '2px solid red' }
                            }
                          >
                            {preview?.business_details?.business_name ? (
                              <div class="map-location-contain" style={{ 'right': '36px', 'top': '24px' }}>
                                <div class="map-location-wrap">
                                  <div class="location-logo">
                                    <img
                                      src={
                                        imagePreview
                                          ? imagePreview
                                          : preview?.business_details?.avatar
                                          ? preview?.business_details?.avatar
                                          : 'images/shop-placeholder.jpg'
                                      }
                                      class="location-logo-img"
                                    />
                                  </div>
                                  <div class="location-content">
                                    <h4>
                                      {' '}
                                      {preview?.business_details?.business_name
                                        ? preview?.business_details?.business_name
                                        : ''}
                                    </h4>

                                    {preview?.business_details.is_only_online == 1 ? (
                                      <p>{preview?.business_details?.website}</p>
                                    ) : (
                                      <>
                                        <p>
                                          {(preview?.business_details.street_address
                                            ? preview?.business_details.street_address
                                            : '') + ' '}
                                        </p>
                                        <p>
                                          {(preview?.business_details.city ? preview?.business_details.city : '') +
                                            ' ' +
                                            (preview?.business_details.region ? preview?.business_details.region : '') +
                                            ' ' +
                                            (preview?.business_details.zip_code
                                              ? preview?.business_details.zip_code
                                              : '')}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ''
                            )}
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
                              <img class="img-fluid" src={'images/businessPin.png'} width="20px" height="20px" alt="" />
                            </Marker>
                          </ReactMapGL>
                        )}
                        <button class="btn btn-black text-uppercase" onClick={() => ClipBoardFtn()}>
                          {t('Buttons.Copy Address')}
                        </button>

                        <a
                          class="btn"
                          href="javascript:;"
                          onClick={() => {
                            setAddress(true);
                            PreviewBusiness(user);
                          }}
                        >
                          <img src="images/img-edit-ico.svg" alt="ico" />
                        </a>
                      </div>
                    )}

                    {locations?.latitude && locations?.longitude && locations?.region ? (
                      ''
                    ) : preview?.business_details.latitude &&
                      preview?.business_details.longitude &&
                      preview?.business_details.region ? (
                      ''
                    ) : (
                      <span className="error-msg" style={{ 'font-size': '12px' }}>
                        {t('validation.location')}
                      </span>
                    )}

                    <div class="shop-detail">
                      <div class="p-row">
                        <img src={tick} alt="ico" />
                        <p>
                          {categoryField || !preview?.business_details?.category.category_id ? (
                            <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              class="form-control border-0"
                              style={{ 'padding': '6px', 'font-size': '13px', 'background-color': '#eefbfb' }}
                              onMouseOut={(e) => {
                                ModifyBusiness(user);
                              }}
                            >
                              <option value="">{t('Select Category')}</option>
                              {categorylist?.map((item, index) => {
                                return (
                                  <>
                                    <option class="text-uppercase" value={item.id}>
                                      {item.name}
                                    </option>
                                    {item.sub_categories?.map((itemchild, index) => {
                                      return (
                                        <option class="text-uppercase" value={itemchild.id}>
                                          {itemchild.name}
                                        </option>
                                      );
                                    })}
                                  </>
                                );
                              })}
                            </select>
                          ) : (
                            <span>{preview?.business_details?.category.name}</span>
                          )}
                          <a href="javascript:;" onClick={() => setCategoryField(!categoryField)}>
                            <img src="images/img-edit-ico.svg" alt="ico" />
                          </a>
                        </p>
                      </div>
                      <div class="p-row">
                        <img src={web} alt="ico" />
                        <p>
                          {websiteField || !preview?.business_details?.website ? (
                            <input
                              type="text"
                              class="text-truncate border-0"
                              placeholder={t('placeHolders.Business website')}
                              onChange={(text) => setWebsite(text.target.value)}
                              style={{ 'background-color': '#eefbfb', 'width': '100%', 'padding': '6px' }}
                              value={website ? website : preview?.business_details?.website}
                              onMouseOut={(e) => {
                                ModifyBusiness(user);
                              }}
                              required
                            />
                          ) : (
                            <span>{website ? website : preview?.business_details?.website}</span>
                          )}
                          <a href="javascript:;" onClick={() => setWebsiteField(!websiteField)}>
                            <img src="images/img-edit-ico.svg" alt="ico" />
                          </a>
                        </p>
                      </div>
                      <div class="p-row">
                        <img src={call} alt="ico" />
                        <p>
                          {phoneField || !preview?.business_details?.phone_number ? (
                            <input
                              type="text"
                              class="text-truncate"
                              placeholder={t('placeHolders.Business phone number')}
                              style={
                                preview?.business_details?.phone_number
                                  ? {
                                      'background-color': '#eefbfb',
                                      'width': '100%',
                                      'padding': '6px',
                                      'border': '2px solid transparent',
                                    }
                                  : {
                                      'background-color': '#eefbfb',
                                      'width': '100%',
                                      'padding': '6px',
                                      'border': '2px solid red',
                                    }
                              }
                              onChange={(text) => setPhone_number(text.target.value)}
                              value={phone_number ? phone_number : preview?.business_details?.phone_number}
                              onMouseOut={(e) => {
                                ModifyBusiness(user);
                              }}
                              required
                            />
                          ) : (
                            <span>{phone_number ? phone_number : preview?.business_details?.phone_number}</span>
                          )}
                          <a href="javascript:;" onClick={() => setPhoneField(!phoneField)}>
                            <img src="images/img-edit-ico.svg" alt="ico" />
                          </a>
                        </p>
                      </div>
                      {!(phone_number ? phone_number : preview?.business_details?.phone_number) ? (
                        <span className="error-msg" style={{ 'font-size': '12px', 'margin': '34px' }}>
                          {t('validation.phone_number')}
                        </span>
                      ) : (
                        ''
                      )}
                      <div class="p-row">
                        <img src={clock} alt="ico" />
                        <p style={{ borderWidth: businessWorkingHours ? 0 : 1 }}>
                          {t('business_preview_screen.closed')} 16:00{' '}
                          {!openHours && (
                            <button className="bg-transparent border-0" onClick={() => setOpenHours(true)}>
                              <b>{t('business_preview_screen.Details')}</b>
                            </button>
                          )}
                          {openHours && (
                            <Link
                              to={'/WorkingHours'}
                              state={{
                                business_Data: preview,
                                user: user,
                                workingHours: businessWorkingHours,
                              }}
                            >
                              <img src="images/img-edit-ico.svg" alt="ico" />
                            </Link>
                          )}
                        </p>
                      </div>
                      {openHours && (
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
                          <button className="bg-transparent border-0" onClick={() => setOpenHours(false)}>
                            <p> {t('business_preview_screen.Close')}</p>
                          </button>
                        </div>
                      )}
                      <div class="rating-row">
                        <div class="rate">
                          <h2>{preview?.business_details?.ratings?.toFixed(1)}</h2>
                          <div class="rating">
                            <StarRatings
                              rating={preview?.business_details?.ratings}
                              starRatedColor="#FFD306"
                              numberOfStars={5}
                              name="rating"
                              starDimension="20px"
                              starSpacing="2px"
                            />
                            <p>
                              {t('Week_Days.from')} {preview?.business_details?.from_people}{' '}
                              {t('business_preview_screen.people')}
                            </p>
                          </div>
                        </div>
                        <h6>
                          <Link to="/shopFeedback" state={{ user: user }} class="view-all">
                            {t('business_preview_screen.feedback')}
                          </Link>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button class="btn btn-black w-100 py-2 my-0" onClick={() => ConfirmModification(user)}>
                {t('Buttons.confirm_modification')}
              </button>
            </div>

            {/* <!-- This Gift Section Ends here --> */}
          </section>

          {/* <!-- Content Section Ends here -->
        <!-- Footer Starts here --> */}
          <BusinessFooter />

          {/* <!-- Footer Ends here --> */}
        </div>
      )}
    </>
  );
}
