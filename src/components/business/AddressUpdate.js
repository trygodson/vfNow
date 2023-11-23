import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReactMapGL, { Marker } from 'react-map-gl';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import TopHeader from '../BusinessHeader';
import BusinessCurrentLocation from '../../screens/BusinessCurrentLocation';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import Loader from '../Loader';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

export default function AddressUpdate({
  business_details,
  setError,
  seterror_title,
  address,
  // setLoader,
  // loader,
  setAddress,
  locations,
  setLocations,
  locationmap,
  setlocationMap,
  preview,
  user,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [locationSearchValue, setLocationSearchValue] = useState();
  const [is_only_online, setIs_only_online] = useState(business_details?.is_only_online);
  const [not_place_in_map, setNot_place_in_map] = useState(business_details?.not_place_in_map);

  const [zip_code, setZip_code] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [street_address, setStreet_address] = useState('');

  const [ncity, setNcity] = useState('');
  const [nregion, setNregion] = useState('');
  const [nhouseNumber, setNHouseField] = useState('');

  const [nstreet_address, setNstreet_address] = useState('');
  const [nzip_code, setNzip_code] = useState('');

  const [loader, setLoader] = useState(false);
  //const [locationmap, setlocationMap] = useState(false);
  //const [locationaddress, setAddress] = useState(false);

  const [stateField, setStateField] = useState(false);
  const [cityField, setCityField] = useState(false);
  const [houseField, setHouseField] = useState(false);
  const [houseNumber, setHouseNumber] = useState('');
  const [streetAddressField, setStreetAddressField] = useState(false);
  const [zipCodeField, setZipCodeField] = useState(false);
  const [regionList, setRegionList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState({});

  var [latitude, setLatitude] = useState(business_details?.latitude ? parseFloat(business_details?.latitude) : 34.0151);
  var [longitude, setLongitude] = useState(
    business_details?.longitude ? parseFloat(business_details?.longitude) : 71.5249,
  );

  const [viewport, setViewport] = React.useState({
    latitude: business_details?.latitude ? parseFloat(business_details?.latitude) : 34.0151,
    longitude: business_details?.longitude ? parseFloat(business_details?.longitude) : 71.5249,
    zoom: 12,
  });

  useEffect(async () => {
    RegionList();
    // const userData = await getUserData();
    // const userlongitude = await getUserLongitude();
    // const userlatitude = await getUserLatitude();
    // if (userData) {
    //   setUser(userData);
    // }

    // setLongitude(userlongitude);
    // setLatitude(userlatitude);
    // setViewport({
    //   latitude: userlatitude,
    //   longitude: userlongitude,
    //   zoom: 6,
    // });
  }, []);

  function RegionList() {
    ApiCall('Get', API.RegionApi)
      .catch((error) => {
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // console.log("regionList", resp.data.data);
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

  function updateAddress() {
    console.log(
      {
        business_id: business_details?.business_id,
        region,
        city,
        street_address,
        zip_code,
      },
      'update data',
    );
    var formData = new FormData();
    formData.append('business_id', business_details?.business_id);
    formData.append('state', region);
    formData.append('city', city);
    formData.append('address', street_address);
    formData.append('zip_code', zip_code);
    formData.append('house_number', houseNumber);
    setLoader(true);
    ApiCall('Post', API.businesscurrentlocationApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);

        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // console.log(resp.data.success);
        // console.log(resp.data.data);
        if (resp.data.success) {
          //setAddress(false);
          //setlocationMap(false);
          setNzip_code(resp.data.data.zip_code);
          setNregion(resp.data.data.state);
          setNcity(resp.data.data.city);
          setNstreet_address(resp.data.data.address);
          setNHouseField(resp.data.data.houseField);
          setStateField(false);
          if (city) {
            setCityField(false);
          }
          setStreetAddressField(false);
          setZipCodeField(false);
        } else {
          setAddress(false);
          setlocationMap(false);
          setError(true);
          seterror_title(resp.data.message);
        }
        setLoader(false);
      });
  }

  function currentLocationApi() {
    var formData = new FormData();
    formData.append('business_id', business_details?.business_id);
    formData.append('state', region);
    formData.append('city', city);
    formData.append('address', street_address);
    formData.append('zip_code', zip_code);
    formData.append('latitude', parseFloat(latitude));
    formData.append('longitude', parseFloat(longitude));
    formData.append('is_only_online', is_only_online);
    formData.append('house_number', houseNumber);
    if (is_only_online == 0) {
      formData.append('not_place_in_map', 0);
    } else {
      formData.append('not_place_in_map', not_place_in_map ? 1 : 0);
    }
    setLoader(true);

    ApiCall('Post', API.businesscurrentlocationApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);

        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // console.log(resp.data, 'update response');
        if (resp.data.success) {
          setlocationMap(false);
          setAddress(false);
          setLocations({
            longitude: resp.data.data.longitude ? parseFloat(resp.data.data.longitude) : '',
            latitude: resp.data.data.latitude ? parseFloat(resp.data.data.latitude) : '',
            viewport: {
              longitude: resp.data.data.longitude ? parseFloat(resp.data.data.longitude) : 73.0479,
              latitude: resp.data.data.latitude ? parseFloat(resp.data.data.latitude) : 33.6844,
              zoom: 12,
            },
            region: resp.data.data.state ? resp.data.data.state : '',
            city: resp.data.data.city ? resp.data.data.city : '',
            street_address: resp.data.data.address ? resp.data.data.address : '',
            zip_code: resp.data.data.zip_code ? resp.data.data.zip_code : '',
            house_number: resp.data.data.house_number ? resp.data.data.house_number : '',
          });
        } else {
          setAddress(false);
          setlocationMap(false);
          setError(true);
          seterror_title(resp.data.message);
        }
        setLoader(false);
      });
  }

  return locationmap ? (
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
      business_details={business_details}
    />
  ) : (
    <div class="container-fluid">
      <TopHeader title={t('Header.MY ADDRESS')} />
      {loader && <Loader />}

      <section class="content-sec row yellow-bg user-select pb-0">
        <div class="login-wrap">
          <div class="register-form px-2" action="#">
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
                        setNot_place_in_map(0);
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
              <strong>{t('register_detail_screen.Address')}</strong>{' '}
              {t('register_detail_screen.of your Business Place')}
            </h6>
            <div class="form-group bg pt-5 pb-4" style={{ clipPath: 'none' }}>
              <div class="w-100 d-inline-block mb-4 position-relative">
                {stateField || !(nregion ? nregion : preview?.business_details?.region) ? (
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
                    }}
                    class="form-control"
                    style={
                      preview?.business_details?.region
                        ? { 'background-color': '#eefbfb', 'border': '2px solid transparent' }
                        : { 'background-color': '#eefbfb', 'border': '2px solid red' }
                    }
                    onMouseOut={(e) => {
                      // updateAddress();
                    }}
                  >
                    <option value="">{t('placeHolders.State / Region *')}</option>
                    {regionList?.map((item) => {
                      return <option value={item.country_name}>{item.country_name}</option>;
                    })}
                  </select>
                ) : (
                  <span class="form-control pe-4">{region ? region : preview?.business_details?.region}</span>
                )}
                <a
                  href="javascript:;"
                  class="edit-btn"
                  style={
                    !(region ? region : preview?.business_details?.region) ? { 'bottom': '26px' } : { 'bottom': '10px' }
                  }
                  onClick={() => {
                    setStateField(!stateField);
                    setCityField(!stateField);
                  }}
                >
                  <img src="images/img-edit-ico.svg" alt="ico" />
                </a>

                {!(nregion ? nregion : preview?.business_details?.region) ? (
                  <span className="error-msg" style={{ 'font-size': '12px' }}>
                    {t('validation.state')}
                  </span>
                ) : (
                  ''
                )}
              </div>

              {is_only_online == 0 && (
                <>
                  <div class="w-100 d-inline-block mb-4 position-relative">
                    {cityField || !(ncity ? ncity : preview?.business_details?.city) ? (
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
                                  console.log(place[0].address_components[i]);
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
                                  'administrative_area_level_3 => ' + address_components.administrative_area_level_3,
                                );
                                console.log(
                                  'administrative_area_level_1 => ' + address_components.administrative_area_level_1,
                                );
                                console.log('country => ' + address_components.country);
                                console.log('postal_code => ' + address_components.postal_code);
                                setCity(address_components.locality != undefined ? address_components.locality : '');
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
                    ) : (
                      <span class="form-control pe-4">{city ? city : preview?.business_details?.city}</span>
                    )}

                    <a
                      href="javascript:;"
                      class="edit-btn"
                      style={
                        !(city ? city : preview?.business_details?.city)
                          ? { 'bottom': '26px', zIndex: 50 }
                          : { 'bottom': '10px', zIndex: 50 }
                      }
                      onClick={() => setCityField(!cityField)}
                    >
                      <img src="images/img-edit-ico.svg" alt="ico" />
                    </a>

                    {/* {!(ncity ? ncity : preview?.business_details?.city) ? (
                      <span className="error-msg" style={{ 'font-size': '12px' }}>
                        {t('validation.city')}
                      </span>
                    ) : (
                      ''
                    )} */}
                  </div>
                  <div class="w-100 d-inline-block mb-4 position-relative">
                    {houseField || !(nhouseNumber ? nhouseNumber : preview?.business_details?.house_number) ? (
                      <div className="w-100 mb-4" style={{ width: '100%', zIndex: 10, position: 'relative' }}>
                        <input
                          type="text"
                          class="form-control mb-4"
                          placeholder={t('placeHolders.house_no')}
                          onChange={(text) => setHouseNumber(text.target.value)}
                          value={houseNumber}
                          required
                        />
                      </div>
                    ) : (
                      <span class="form-control pe-4">{city ? city : preview?.business_details?.house_number}</span>
                    )}

                    <div
                      class="edit-btn"
                      style={
                        !(houseNumber ? houseNumber : preview?.business_details?.house_number)
                          ? { 'bottom': '26px', zIndex: 50 }
                          : { 'bottom': '10px', zIndex: 50 }
                      }
                      onClick={() => setHouseField(!houseField)}
                    >
                      <img src="images/img-edit-ico.svg" alt="ico" />
                    </div>

                    {/* {!(ncity ? ncity : preview?.business_details?.city) ? (
                      <span className="error-msg" style={{ 'font-size': '12px' }}>
                        {t('validation.city')}
                      </span>
                    ) : (
                      ''
                    )} */}
                  </div>
                  {/* <div class="w-100 d-inline-block mb-4 position-relative">
                    {streetAddressField ||
                    !(nstreet_address ? nstreet_address : preview?.business_details?.street_address) ? (
                      <input
                        type="text"
                        class="form-control"
                        placeholder={t('placeHolders.Street Address')}
                        onChange={(text) => setStreet_address(text.target.value)}
                        value={street_address ? street_address : preview?.business_details?.street_address}
                        style={
                          preview?.business_details?.street_address
                            ? { 'background-color': '#eefbfb', 'border': '2px solid transparent' }
                            : { 'background-color': '#eefbfb', 'border': '2px solid red' }
                        }
                        onMouseOut={(e) => {
                          updateAddress();
                        }}
                      />
                    ) : (
                      <span class="form-control pe-4">
                        {street_address ? street_address : preview?.business_details?.street_address}
                      </span>
                    )}
                    <a
                      href="javascript:;"
                      class="edit-btn"
                      style={
                        !(street_address ? street_address : preview?.business_details?.street_address)
                          ? { 'bottom': '26px' }
                          : { 'bottom': '10px' }
                      }
                      onClick={() => setStreetAddressField(!streetAddressField)}
                    >
                      <img src="images/img-edit-ico.svg" alt="ico" />
                    </a>

                    {!(nstreet_address ? nstreet_address : preview?.business_details?.street_address) ? (
                      <span className="error-msg" style={{ 'font-size': '12px' }}>
                        {t('validation.street_address')}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                  <div class="w-100 d-inline-block mb-4 position-relative">
                    {zipCodeField || !(nzip_code ? nzip_code : preview?.business_details?.zip_code) ? (
                      <input
                        type="text"
                        class="form-control"
                        placeholder={t('placeHolders.Business Zip_code')}
                        onChange={(text) => setZip_code(text.target.value)}
                        value={zip_code ? zip_code : preview?.business_details?.zip_code}
                        style={
                          preview?.business_details?.zip_code
                            ? { 'background-color': '#eefbfb', 'border': '2px solid transparent' }
                            : { 'background-color': '#eefbfb', 'border': '2px solid red' }
                        }
                        onMouseOut={(e) => {
                          updateAddress();
                        }}
                      />
                    ) : (
                      <span class="form-control pe-4">{zip_code ? zip_code : preview?.business_details?.zip_code}</span>
                    )}
                    <a
                      href="javascript:;"
                      class="edit-btn"
                      style={
                        !(zip_code ? zip_code : preview?.business_details?.zip_code)
                          ? { 'bottom': '26px' }
                          : { 'bottom': '10px' }
                      }
                      onClick={() => setZipCodeField(!zipCodeField)}
                    >
                      <img src="images/img-edit-ico.svg" alt="ico" />
                    </a>

                    {!(nzip_code ? nzip_code : preview?.business_details?.zip_code) ? (
                      <span className="error-msg" style={{ 'font-size': '12px' }}>
                        {t('validation.zip_code')}
                      </span>
                    ) : (
                      ''
                    )}
                  </div> */}
                </>
              )}
            </div>
            <h6 class="mt-5">
              <strong> {t('register_detail_screen.position')}</strong>
            </h6>
            {preview && (
              <div
                class={`map-sec ${preview?.business_details.is_only_online == 0 ? 'business-map' : ''} ${
                  not_place_in_map == 1 ? 'blur-map' : ''
                }`}
              >
                <ReactMapGL
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
                >
                  {preview?.business_details?.business_name ? (
                    <div class="map-location-contain" style={{ 'right': '36px', 'top': '24px' }}>
                      <div class="map-location-wrap">
                        <div class="location-logo">
                          <img
                            src={
                              preview?.business_details?.avatar
                                ? preview?.business_details?.avatar
                                : 'images/shop-placeholder.jpg'
                            }
                            class="location-logo-img"
                          />
                        </div>
                        <div class="location-content">
                          <h4>
                            {' '}
                            {preview?.business_details?.business_name ? preview?.business_details?.business_name : ''}
                          </h4>

                          {preview?.business_details.is_only_online == 1 ? (
                            <p>{preview?.business_details?.website}</p>
                          ) : (
                            <>
                              <p>
                                {(street_address
                                  ? street_address
                                  : preview?.business_details.street_address
                                  ? preview?.business_details.street_address
                                  : '') + ' '}
                              </p>
                              <p>
                                {(city ? city : preview?.business_details.city ? preview?.business_details.city : '') +
                                  ' ' +
                                  (region
                                    ? region
                                    : preview?.business_details.region
                                    ? preview?.business_details.region
                                    : '') +
                                  ' ' +
                                  (zip_code
                                    ? zip_code
                                    : preview?.business_details.zip_code
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
                      latitude
                        ? parseFloat(latitude)
                        : preview?.business_details?.latitude
                        ? parseFloat(preview?.business_details?.latitude)
                        : 34.0151
                    }
                    longitude={
                      longitude
                        ? parseFloat(longitude)
                        : preview?.business_details?.longitude
                        ? parseFloat(preview?.business_details?.longitude)
                        : 71.5249
                    }
                  >
                    <img class="img-fluid" src={'images/businessPin.png'} width="20px" height="20px" alt="" />
                  </Marker>
                  <button class="btn btn-black text-uppercase mapbtn-address" onClick={() => setlocationMap(true)}>
                    {t('Buttons.change')}
                  </button>
                </ReactMapGL>
              </div>
            )}
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
          <button class="btn btn-black w-100 py-2 mt-4 mb-5" onClick={() => currentLocationApi()}>
            {t('Buttons.save_modification')}
          </button>
        </div>
      </section>
    </div>
  );
}
