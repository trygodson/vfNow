import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { BiChevronRight } from 'react-icons/bi';
import TopHeader from '../components/TopHeader';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';
import LoadShopPics from './LoadShopPics';
import BusinessHours from './BusinessHours';
import BusinessPreview from './BusinessPreview';
import BusinessCurrentLocation from './BusinessCurrentLocation';
import avatar from '../images/avatar-placeholder.png';
import upload from '../images/upload-photo-ico.svg';
import ModalView from 'react-modal';

import { getUserData, getUserLatitude, getUserLongitude, textSlicer } from '../Functions/Functions';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

function BusinessDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [viewport, setViewport] = React.useState({
    latitude: 34.0151,
    longitude: 71.5249,
    zoom: 300,
  });
  const [name, setName] = useState('');
  const [selectedItems, setSelectedItems] = useState();
  const [houseNo, setHouseNo] = useState('');
  const [motto, setMotto] = useState('');
  const [category, setCategory] = useState('');
  const [categorylist, setCategoryList] = useState([]);
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [is_only_online, setIs_only_online] = useState(0);
  const [region, setRegion] = useState('');
  const [selectedRegion, setSelectedRegion] = useState({});
  const [city, setCity] = useState('');
  const [street_address, setStreet_address] = useState('');
  const [zip_code, setZip_code] = useState('');
  const [userId, setUserId] = useState('');
  const [latitude, setLatitude] = useState('34.0151');
  const [longitude, setLongitude] = useState('71.5249');
  const [not_place_in_map, setNot_place_in_map] = useState(false);
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState('');
  const [loadShop, setLoadshop] = useState(false);
  const [hours, sethours] = useState(false);
  const [locationmap, setlocationMap] = useState(false);
  const [preview, setpreview] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');
  const [BusinesData, setBusinesData] = useState('');
  const [regionList, setRegionList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [locationSearchValue, setLocationSearchValue] = useState();
  const outref = useRef();
  const inref = useRef();
  const onFileChange = (event) => {
    setImage(event.target.files[0]);
    setImagePreview(URL.createObjectURL(event.target.files[0]));
  };

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const onFilesChange = async (event) => {
    // console.log(
    //   "images.length + event.target.files.length",
    //   images.length,
    //   event.target.files.length
    // );
    if (images.length + event.target.files.length > 5) {
      setError(true);
      seterror_title(t('alerts.upload upto 5 images'));
    } else {
      const filesArray = Array.from(event.target.files);

      for (let i = 0; i < filesArray.length; i++) {
        if (filesArray[i].name != undefined) {
          imagesPreview.push(URL.createObjectURL(filesArray[i]));
          // images.push(filesArray[i]);

          // setImagePreview((prev) => [...prev, URL.createObjectURL(filesArray[i])]);

          setImages((p) => [...p, filesArray[i]]);
        }
      }

      setLoadshop(true);
    }
  };

  useEffect(async () => {
    CategoryList();
    RegionList();
    const user = await getUserData();
    console.log('----------->');
    console.log(user.user_id);
    const userlongitude = await getUserLongitude();
    const userlatitude = await getUserLatitude();
    setUserId(user.user_id);
    setLongitude(userlongitude);
    setLatitude(userlatitude);
    setViewport({
      latitude: userlatitude,
      longitude: userlongitude,
      zoom: 12,
    });
  }, []);

  function RegionList() {
    ApiCall('Get', API.RegionApi)
      .catch((error) => {
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // console.log('regionList', resp.data.data);
        setRegionList(resp.data.data);
      });
  }

  function CitiesList(countryId) {
    var formData = new FormData();
    formData.append('country_id', countryId);
    ApiCall('Post', API.CitiesApi, formData)
      .catch((error) => {
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // console.log("regionList", resp.data.data);
        setCitiesList(resp.data.data);
      });
  }

  // console.log("Latitude is :", latitude, longitude);
  function CategoryList() {
    var formData = new FormData();

    ApiCall('Post', API.categoryBusinessListApi, formData, {
      Authorization: 'Bearer ' + location.state?.business_Data.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // console.log('categoriess', resp.data.data);
        setCategoryList(resp.data.data);
      });
  }
  // console.log("images", images, "images", hours);
  function Registration(page) {
    setLoader(true);
    console.log('====>');
    console.log(userId);
    console.log(street_address);
    if (
      (name == '' || category == '' || houseNo == '' || description == '' || images.length == 0, phone_number === '')
    ) {
      setError(true);
      setLoader(false);
      seterror_title(t('alerts.Required Fields are empty'));
    } else if (
      is_only_online == 0 &&
      (region == '' || latitude == '' || longitude == '')
      // (city == '' || region == '' || street_address == '' || zip_code == '' || latitude == '' || longitude == '')
    ) {
      setError(true);
      setLoader(false);
      seterror_title(t('alerts.Required Fields are empty'));
    }

    // else if (images.length < 2) {
    //   setError(true);
    //   setLoader(false);
    //   seterror_title(t('alerts.Minimum 2  images required!'));
    // }
    else {
      var formData = new FormData();
      formData.append('user_id', userId);
      formData.append('name', name);
      formData.append('motto', motto);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('website', website);
      formData.append('phone_number', phone_number);
      formData.append('house_number', houseNo);
      formData.append('is_only_online', is_only_online);
      formData.append('region', region);
      if (is_only_online == 0) {
        formData.append('city', city);
        formData.append('street_address', street_address);
        formData.append('zip_code', zip_code);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('not_place_in_map', not_place_in_map ? '1' : '0');
      } else {
        if (not_place_in_map == false) {
          formData.append('latitude', latitude);
          formData.append('longitude', longitude);
          formData.append('not_place_in_map', not_place_in_map ? '1' : '0');
        } else {
          formData.append('not_place_in_map', not_place_in_map ? '1' : '0');
        }
      }

      if (image && image.length > 0) {
        formData.append('picture', image, image.name);
      }

      ApiCall('Post', API.businessDetailApi, formData, {
        Authorization: 'Bearer ' + location.state?.business_Data.access_token,
        Accept: 'application/json',
      })
        .catch((error) => {
          setLoader(false);
          console.log('erorr reponse', error);
          //   reject(error.response);
        })
        .then((resp) => {
          console.log('business detial reg', resp.data);
          setLoader(false);
          if (resp.data.success) {
            if (page == 'preview') {
              setpreview(true);
            } else {
              setIsOpen(true);
            }
          } else {
            setError(true);
            seterror_title(resp.data.message);
          }
        });
    }
  }
  const handleItemToggle = (item) => {
    const updatedSelectedItems = selectedItems == item ? null : item;
    setCategory(updatedSelectedItems?.id ?? '');
    setSelectedItems(updatedSelectedItems);
    setCategoryOpen(false);
  };

  const clickOutsideRef = (content_ref, toggle_ref) => {
    document.addEventListener('mousedown', (e) => {
      // user click toggle
      if (content_ref.current && content_ref.current.contains(e.target)) {
        // setTimeout(() => {
        //   // content_ref.current.classList.toggle('active');
        // }, 0);
        return;
      } else if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
        setCategoryOpen(false);
        // return;
      } else {
        // user click outside toggle and content
        if (content_ref.current && !content_ref.current.contains(e.target)) {
          setCategoryOpen(false);
        }
      }
    });
  };

  useEffect(() => {
    clickOutsideRef(outref, inref);
  }, [inref, outref]);
  // console.log(selectedRegion, '-----selectedRegion---');
  return (
    <>
      {loader && <Loader />}

      {loadShop ? (
        <LoadShopPics
          loader={loader}
          setLoader={setLoader}
          setError={setError}
          seterror_title={seterror_title}
          loadShop={loadShop}
          setLoadshop={setLoadshop}
          setImagePreview={setImagesPreview}
          setImages={setImages}
          images={images}
          business_Data={location.state?.business_Data}
          imagePreview={imagesPreview}
        />
      ) : hours ? (
        <BusinessHours
          setError={setError}
          seterror_title={seterror_title}
          loader={loader}
          setLoader={setLoader}
          hours={hours}
          sethours={sethours}
          business_Data={location.state?.business_Data}
        />
      ) : locationmap ? (
        <BusinessCurrentLocation
          setError={setError}
          seterror_title={seterror_title}
          loader={loader}
          setLoader={setLoader}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
          viewport={viewport}
          setViewport={setViewport}
          locationmap={locationmap}
          setlocationMap={setlocationMap}
          business_details={location.state?.business_Data}
        />
      ) : preview ? (
        <BusinessPreview
          setError={setError}
          seterror_title={seterror_title}
          loader={loader}
          setLoader={setLoader}
          setpreview={setpreview}
          business_Data={location.state?.business_Data}
        />
      ) : (
        <>
          <div class="container-fluid">
            <TopHeader title={t('register_detail_screen.title')} />

            {/* <!-- Content Section Starts here --> */}
            <section class="content-sec row yellow-bg user-select pb-0">
              <div class="login-wrap">
                <div class="register-form px-2">
                  <div class="form-group">
                    <div class="avatar-img">
                      <img class="img-fluid imageHeight" src={imagePreview == '' ? avatar : imagePreview} alt="image" />
                      <div class="input-file">
                        <input type="file" name="input-file" onChange={onFileChange} />
                        {imagePreview == '' && (
                          <button class="btn">
                            <img src={upload} alt="ico" />
                          </button>
                        )}
                      </div>
                    </div>
                    <h6 class="text-center">
                      <strong>{t('register_detail_screen.pic')}</strong>
                    </h6>
                  </div>
                  <h6 class="mt-5">
                    <strong> {t('register_detail_screen.desc')}</strong> {t('register_detail_screen.reference')}
                  </h6>
                  <div class="form-group bg pt-5 pb-4">
                    <input
                      type="text"
                      class="form-control mb-4"
                      placeholder={t('placeHolders.business_name')}
                      onChange={(text) => setName(text.target.value)}
                      value={name}
                      required
                    />
                    <input
                      type="text"
                      class="form-control mb-4"
                      placeholder={t('placeHolders.motto')}
                      onChange={(text) => setMotto(text.target.value)}
                      value={motto}
                      required
                    />
                    {/* <div
                class="form-control select-pop"
                // data-bs-toggle="modal"
                // data-bs-target="#category-modal"
              > */}

                    <div
                      className="form-control mt-2"
                      style={{ color: selectedItems?.name ? 'black' : 'gray', cursor: 'pointer' }}
                      // data-bs-toggle="modal"
                      // data-bs-target="#cat-modall"
                      onClick={() => setCategoryOpen(true)}
                    >
                      {selectedItems ? selectedItems?.name : 'Select Category'}
                    </div>
                    {/* <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    class="form-control mt-2"
                    placeholder={t('placeHolders.category')}
                  >
                    <option value="">{t('placeHolders.category')}</option>
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
                  </select> */}
                    {/* <img class="ico" src={icon} alt="ico" />
              </div> */}
                  </div>
                  <h6 class="mt-5">
                    <strong>{t('register_detail_screen.desc')}</strong> {t('register_detail_screen.desc_title')}
                  </h6>
                  <div class="form-group bg pt-5 pb-4">
                    <textarea
                      name=""
                      id=""
                      cols="20"
                      rows="5"
                      class="form-control border-0"
                      placeholder={t('placeHolders.desc')}
                      onChange={(text) => setDescription(text.target.value)}
                      value={description}
                      required
                    ></textarea>
                  </div>
                  <h6 class="mt-5">
                    <strong> {t('register_detail_screen.Pictures')}</strong> {t('register_detail_screen.Pictures_desc')}
                  </h6>
                  <div class="form-group">
                    <div class="shop-pic">
                      <img class="img-fluid" src="images/add-pic-shop-ico.svg" alt="" />

                      <input type="file" name="input-file" onChange={onFilesChange} multiple />

                      {/* <input type="file" name="shop-img" /> */}
                    </div>
                    <div class="slide-thumb">
                      {imagesPreview?.length > 0 &&
                        imagesPreview.map((item, index) => {
                          return (
                            <img src={item?.picture ? item?.picture : item} alt="img" height={'100'} width={'100'} />
                          );
                        })}
                    </div>
                  </div>
                  <h6 class="mt-5">
                    <strong> {t('register_detail_screen.website')}</strong>
                  </h6>
                  <div class="form-group bg pt-5 pb-4">
                    <input
                      type="text"
                      class="form-control mb-4"
                      placeholder={t('placeHolders.website')}
                      onChange={(text) => setWebsite(text.target.value)}
                      value={website}
                      required
                    />
                    <input
                      type="tel"
                      class="form-control mb-3"
                      placeholder={`${t('placeHolders.number')} *`}
                      onChange={(text) => setPhone_number(text.target.value)}
                      value={phone_number}
                      required
                      maxLength={12}
                    />
                  </div>
                  <div class="form-group bg business-radio-encl mt-5">
                    <h6>
                      {t('register_detail_screen.Is')} <span> {t('register_detail_screen.only')}</span>{' '}
                      {t('register_detail_screen.an')} <span> {t('register_detail_screen.online_busi')}</span>?
                    </h6>
                    <div class="row w-100">
                      <div class="col-6 text-center">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="business-online"
                            checked={is_only_online == 0 ? true : false}
                            onChange={() => {
                              setIs_only_online(0);
                            }}
                          />
                          <label class="form-check-label" for="business-online-no">
                            {t('placeHolders.radio_no')}
                          </label>
                        </div>
                      </div>
                      <div class="col-6 text-center">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="business-online"
                            checked={is_only_online == 1 ? true : false}
                            onChange={() => {
                              setIs_only_online(1);
                            }}
                            id="business-online-yes"
                          />
                          <label class="form-check-label" for="business-online-yes">
                            {t('placeHolders.radio_yes')}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h6 class="mt-5">
                    <strong>{t('register_detail_screen.Address')}</strong> {t('register_detail_screen.business_place')}
                  </h6>

                  <>
                    <div class="form-group bg pt-5 pb-4" style={{ clipPath: 'none' }}>
                      <select
                        value={region}
                        onChange={(e) => {
                          if (e.target.value === '') {
                            setRegion(e.target.value);
                          } else {
                            let dd = regionList.filter((it) => {
                              return e.target.value === it.country_name;
                            });
                            setLatitude(dd[0]?.latitude);
                            setLongitude(dd[0]?.longitude);
                            setSelectedRegion(dd[0]);
                            setRegion(e.target.value);
                          }
                          // CitiesList(e.target.value ? e.target.value : '');
                        }}
                        class="form-control mb-4"
                      >
                        <option value="">{t('placeHolders.State / Region *')}</option>
                        {regionList?.map((item) => {
                          return <option value={item.country_name}>{item.country_name}</option>;
                        })}
                      </select>
                      {is_only_online == 0 && (
                        <>
                          {/* <select value={city} onChange={(e) => setCity(e.target.value)} class="form-control mb-4">
                          <option value="">{t('placeHolders.City')}</option>
                          {citiesList?.map((item) => {
                            return <option value={item}>{item}</option>;
                          })}
                        </select>
                        <input
                          type="text"
                          class="form-control mb-4"
                          placeholder={t('placeHolders.Street_Address')}
                          onChange={(text) => setStreet_address(text.target.value)}
                          value={street_address}
                          required
                        /> */}
                          <div className="w-100 mb-4" style={{ width: '100%', zIndex: 10, position: 'relative' }}>
                            <GooglePlacesAutocomplete
                              apiKey={'AIzaSyCDNRdBHLGuhW8MQOKnXn3T7Ot4p0fherE'}
                              apiOptions={{}}
                              autocompletionRequest={{
                                // bounds: [
                                //   {
                                //     lat: 9.05785,
                                //     lng: 7.49508,
                                //   },
                                // ],
                                radius: 1000,
                                componentRestrictions: {
                                  country: [selectedRegion?.country_code ?? ''],
                                },
                                location: {
                                  lat: selectedRegion?.latitude,
                                  lng: selectedRegion?.longitude,
                                },
                              }}
                              selectProps={{
                                value: locationSearchValue,
                                onChange: async (v) => {
                                  const address = v?.label || '';
                                  console.log(address);
                                  if (address) {
                                    let place = await geocodeByAddress(address);
                                    const { lat, lng } = await getLatLng(place[0]);
                                    setLatitude(lat);
                                    setLongitude(lng);
                                    setViewport({
                                      latitude: lat,
                                      longitude: lng,
                                      zoom: 12,
                                    });

                                    let address_components = {};
                                    for (var i = 0; i < place[0].address_components.length; i++) {
                                      var addressType = place[0].address_components[i].types[0];
                                      console.log('===> ' + addressType);
                                      switch (addressType) {
                                        case 'premise':
                                          address_components.premise = place[0].address_components[i].long_name;
                                          break;
                                        case 'subpremise':
                                          address_components.subpremise = place[0].address_components[i].long_name;
                                          break;
                                        case 'establishment':
                                          address_components.establishment = place[0].address_components[i].long_name;
                                          break;
                                        case 'plus_code':
                                          address_components.plus_code = place[0].address_components[i].long_name;
                                          break;
                                        case 'neighborhood':
                                          address_components.neighborhood = place[0].address_components[i].long_name;
                                          break;
                                        case 'political':
                                          address_components.political = place[0].address_components[i].long_name;
                                          break;
                                        case 'street_number':
                                          address_components.street_number = place[0].address_components[i].long_name;
                                          break;
                                        case 'route':
                                          address_components.route = place[0].address_components[i].long_name;
                                          break;
                                        case 'locality':
                                          address_components.locality = place[0].address_components[i].long_name;
                                          break;
                                        case 'administrative_area_level_3':
                                          address_components.administrative_area_level_3 =
                                            place[0].address_components[i].long_name;
                                          break;
                                        case 'administrative_area_level_1':
                                          address_components.administrative_area_level_1 =
                                            place[0].address_components[i].long_name;
                                          break;
                                        case 'country':
                                          address_components.country = place[0].address_components[i].long_name;
                                          break;
                                        case 'postal_code':
                                          address_components.postal_code = place[0].address_components[i].long_name;
                                          break;
                                      }
                                      console.log(place[0].address_components[i], 'address');
                                    }
                                    console.log('premise => ' + address_components.premise);
                                    console.log('subpremise => ' + address_components.subpremise);
                                    console.log('establishment => ' + address_components.establishment);
                                    console.log('plus_code => ' + address_components.plus_code);
                                    console.log('neighborhood => ' + address_components.neighborhood);
                                    console.log('political => ' + address_components.political);
                                    console.log('street_number => ' + address_components.street_number);
                                    console.log('route => ' + address_components.route);
                                    console.log('locality => ' + address_components.locality);
                                    console.log(
                                      'administrative_area_level_3 => ' +
                                        address_components.administrative_area_level_3,
                                    );
                                    console.log(
                                      'administrative_area_level_1 => ' +
                                        address_components.administrative_area_level_1,
                                    );
                                    console.log('country => ' + address_components.country);
                                    console.log('postal_code => ' + address_components.postal_code);
                                    setCity(
                                      address_components.locality != undefined ? address_components.locality : '',
                                    );
                                    let streetAddress = '';
                                    if (address_components.premise != undefined) {
                                      streetAddress = streetAddress + address_components.premise + ' ';
                                    }
                                    if (address_components.subpremise != undefined) {
                                      streetAddress = streetAddress + address_components.subpremise + ' ';
                                    }
                                    if (address_components.establishment != undefined) {
                                      streetAddress = streetAddress + address_components.establishment + ' ';
                                    }
                                    if (address_components.plus_code != undefined) {
                                      streetAddress = streetAddress + address_components.plus_code + ' ';
                                    }
                                    if (address_components.neighborhood != undefined) {
                                      streetAddress = streetAddress + address_components.neighborhood + ' ';
                                    }
                                    if (address_components.political != undefined) {
                                      streetAddress = streetAddress + address_components.political + ' ';
                                    }
                                    if (address_components.street_number != undefined) {
                                      streetAddress = streetAddress + address_components.street_number + ' ';
                                    }
                                    if (address_components.route != undefined) {
                                      streetAddress = streetAddress + address_components.route + ' ';
                                    }
                                    console.log('>>>>>>>>>>>>>>>>>>>');
                                    console.log(streetAddress);
                                    setStreet_address(streetAddress);
                                    setZip_code(
                                      address_components.postal_code != undefined ? address_components.postal_code : '',
                                    );
                                  }
                                },

                                // onChange: (v) => { console.log(v?.label)
                                //   geocodeByAddress(v.label)
                                //     .then((results) => getLatLng(results[0]))
                                //     .then(({ lat, lng }) => {
                                //       setLatitude(lat);
                                //       setLongitude(lng);
                                //       setViewport({
                                //         latitude: lat,
                                //         longitude: lng,
                                //         zoom: 12,
                                //       });
                                //       setStreet_address(v?.label);
                                //     })
                                //     .catch((err) => console.log(err, '-----err fetching lat lang---'));
                                //   // setValue(v);
                                // },
                                placeholder: t('placeHolders.Business Address'),
                                styles: {
                                  container: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#fff',
                                    padding: '0px',
                                    borderRadius: '5px',
                                    border: '0px solid transparent',
                                    borderBottom: '1px solid #dddddd',
                                    outline: 'none',
                                    color: 'black',
                                    position: 'relative',
                                    zIndex: 33,
                                  }),
                                  option: (provided) => ({
                                    ...provided,
                                    position: 'relative',
                                    zIndex: 1003,
                                  }),
                                  menuList: (provided) => ({
                                    ...provided,
                                    position: 'relative',
                                    zIndex: 31013,
                                  }),

                                  valueContainer: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                    padding: '0px',
                                  }),
                                  indicatorsContainer: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#f3f4f6',
                                    color: 'black',
                                    opacity: 0,
                                  }),
                                  indicatorSeparator: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#fff',
                                    borderRadius: '10px',
                                    color: 'black',
                                  }),
                                  control: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: '#fff',
                                    color: 'black',
                                    border: state.isFocused ? 0 : 0,
                                    boxShadow: state.isFocused ? 0 : 0,
                                    '&:hover': {
                                      border: state.isFocused ? 0 : 0,
                                    },
                                    zIndex: 33,
                                  }),
                                },
                              }}
                            />
                          </div>
                          {/* <input
                          type="text"
                          class="form-control mb-2"
                          placeholder={t('placeHolders.Zip_code')}
                          onChange={(text) => setZip_code(text.target.value)}
                          value={zip_code}
                          required
                        /> */}
                        </>
                      )}

                      <input
                        type="text"
                        class="form-control mb-4"
                        placeholder={t('placeHolders.house_no')}
                        onChange={(text) => setHouseNo(text.target.value)}
                        value={houseNo}
                        required
                      />
                    </div>
                    <h6 class="mt-5">
                      <strong>{t('register_detail_screen.position')}</strong>
                    </h6>
                    <div class="form-group">
                      <div class={`map-blk ${not_place_in_map == 1 ? 'blur-map' : ''}`}>
                        <ReactMapGL
                          touchAction="pan-y"
                          mapStyle="mapbox://styles/mapbox/streets-v10"
                          mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
                          {...viewport}
                          width="100%"
                          height="220px"
                          dragPan={false}
                          scrollZoom={false}
                          onViewportChange={(viewport) => {
                            setViewport(viewport);
                          }}
                          latitude={parseFloat(latitude)}
                          longitude={parseFloat(longitude)}
                        >
                          <Marker anchor="center" latitude={parseFloat(latitude)} longitude={parseFloat(longitude)}>
                            <div className="position-relative">
                              {(imagePreview !== '' || name !== '') && (
                                <div
                                  className="position-relative d-flex flex-column  align-items-center"
                                  style={{
                                    backgroundColor: 'black',
                                    width: '185px',
                                    padding: '7px 10px 15px 20px',
                                    borderRadius: '5px',
                                    right: '45%',
                                    bottom: '3px',
                                  }}
                                >
                                  <div className="d-flex w-100 align-items-center">
                                    <img
                                      src={imagePreview == '' ? avatar : imagePreview}
                                      width={'45px'}
                                      height={'45px'}
                                      className="mr-1"
                                      style={{
                                        height: '45px !important',
                                        border: '2px solid white',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginTop: '-25%',
                                        aspectRatio: 'auto',
                                        marginRight: '6px',
                                      }}
                                      alt=""
                                    />

                                    <p
                                      className="m-0"
                                      style={{
                                        color: 'white',
                                        fontSize: 11,
                                        textTransform: 'uppercase',

                                        // textAlign: 'center',
                                        width: '100%',
                                        fontWeight: 700,
                                      }}
                                    >
                                      {textSlicer(name ?? 'Business Name', 14)}
                                    </p>
                                  </div>

                                  <p
                                    className="w-100 m-0"
                                    style={{
                                      color: 'white',
                                      fontSize: 11,
                                      flexWrap: 'wrap',
                                      textAlign: 'left',
                                      marginTop: '3px',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {street_address ?? ''}
                                  </p>
                                </div>
                              )}
                              <img
                                class="img-fluid"
                                src={'/images/businessPin.png'}
                                width="20px"
                                height="20px"
                                alt=""
                              />
                            </div>
                          </Marker>
                        </ReactMapGL>
                        <div class="btn-sec map-btn">
                          <button class="btn btn-white w-40" onClick={() => setlocationMap(true)}>
                            {t('Buttons.change')}
                          </button>
                        </div>
                      </div>
                      {is_only_online == 1 && (
                        <div class="form-check d-flex">
                          <input
                            class="checkbox-click"
                            type="checkbox"
                            checked={not_place_in_map}
                            onChange={() => {
                              setNot_place_in_map(!not_place_in_map);
                            }}
                          />
                          {/* <img class="check-mark" src={checkbox} alt="" /> */}
                          <label class="form-check-label" for="map-show">
                            {t('register_detail_screen.checkbox_desc')}
                          </label>
                        </div>
                      )}
                    </div>
                  </>

                  <h6 class="mt-5 mb-4">
                    <strong>{t('register_detail_screen.Working_day')}</strong>
                  </h6>
                  <div class="form-group text-center mb-5">
                    <button
                      class="btn btn-white"
                      onClick={
                        () => sethours(true)
                        // navigate("/businessHours", {
                        //   state: {
                        //     business_Data: location.state?.business_Data,
                        //   },
                        // })
                      }
                    >
                      {t('Buttons.working_time')}
                    </button>
                  </div>
                  <hr class="thick-line mb-5" />
                </div>

                <p class="btm-line position-static mt-5 mb-5">
                  <button class="btn btn-white w-100 mb-4 py-2" onClick={() => Registration('preview')}>
                    {t('Buttons.business_page')}
                  </button>
                  <button
                    class="btn btn-black w-100 py-2 mb-3"
                    data-bs-toggle="modal"
                    data-bs-target="#shop-success"
                    onClick={() => Registration()}
                  >
                    {t('Buttons.confirm_reg')}
                  </button>
                </p>
              </div>
            </section>
            {/* <!-- Content Section Ends here --> */}

            {/* <ModalView
            isOpen={modalIsOpen}
            onRequestClose={() => {
              setIsOpen(false);
              navigate("/login", {
                state: {
                  business_Data: BusinesData,
                },
              });
            }}
          > */}
            <div
              class="modal bg-blur reg-modal show"
              onClick={() => {
                setIsOpen(false);
                navigate('/login');
              }}
              role="dialog"
              aria-hidden="true"
              style={{
                display: modalIsOpen ? 'block' : 'none',
                backgroundColor: 'rgba(222, 223, 222 , 0.9)',
              }}
            >
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content minh-unset" data-bs-dismiss="modal">
                  <div class="alert-bubble-img">
                    <img class="img-fluid" src="images/alert-msg-bubble.png" alt="ico" />
                    <div class="cont">
                      <h5>{t('alerts.FANTASTIC!')} </h5>
                      <p>{t("alerts.let's start to promote your BUSINESS")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </ModalView> */}
            {error && <MessageBox error={error} setError={setError} title={error_title} />}
            {/* <!-- Modal Popup Ends here --> */}
          </div>
        </>
      )}

      <div
        role="dialog"
        aria-hidden="true"
        className="modal bg-blur reg-modal show"
        tabindex="-1"
        style={{
          display: categoryOpen ? 'block' : 'none',
          backgroundColor: 'rgba(222, 223, 222 , 0.9)',
        }}
        id="cat-modall"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-100 " ref={outref}>
            <div
              className="w-75 mx-auto d-flex flex-column align-items-center"
              style={{ backgroundColor: 'white' }}
              ref={inref}
            >
              {/* <button type="button" className="btn-close __close " style={{ position: 'relative' }}>
                      Close
                    </button> */}
              <div style={{ backgroundColor: 'offwhite', maxWidth: '400px', padding: '20px 0px' }}>
                {categorylist &&
                  categorylist.length > 0 &&
                  categorylist?.map((item, index) => {
                    return (
                      <>
                        <p
                          key={index}
                          className="text-uppercase mt-2"
                          style={{ fontWeight: '500', fontSize: '14px' }}
                          value={item.id}
                        >
                          {item.name}
                        </p>
                        {item.sub_categories?.map((itemchild, index) => {
                          return (
                            <div
                              key={itemchild.name}
                              style={{
                                borderBottom: '0.5px solid #d3d3d3',
                                borderTop: '0.5px solid #d3d3d3',
                                padding: '10px 15px',
                                marginLeft: '15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: selectedItems === itemchild ? 'yellow' : 'transparent',
                              }}
                              data-bs-dismiss="modal"
                              onClick={() => {
                                handleItemToggle(itemchild);
                              }}
                            >
                              <p className="text-uppercase m-0 p-0" style={{ fontSize: '14px' }}>
                                {itemchild.name}
                              </p>
                              <BiChevronRight size={17} color="black" />
                            </div>
                          );
                        })}
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BusinessDetail;
