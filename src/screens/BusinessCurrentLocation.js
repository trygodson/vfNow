import React, { useEffect, useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';

import pin from '../images/map-pin-black-ico.svg';
import yellow from '../images/yellow-arrow.svg';
import gps from '../images/gps-ico.svg';

import { useTranslation } from 'react-i18next';
import '../languages/i18n';
import {
  getUserData,
  getUserLatitude,
  getUserLongitude,
  storeUserLatitude,
  storeUserLongitude,
  getBoundsForPoints,
} from '../Functions/Functions';

export default function ShopCurrentLocation({
  business_details,
  locationmap,
  setError,
  seterror_title,
  setlocationMap,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  viewport,
  setViewport,
}) {
  const { t } = useTranslation();
  console.log('business_details', business_details);
  console.log(latitude);
  console.log(longitude);
  console.log(viewport);
  // const [latitude, setLatitude] = useState(latitude);
  // const [longitude, setLongitude] = useState(longitude);
  // const [viewport, setViewport] = React.useState({
  //   latitude: latitude,
  //   longitude: longitude,
  //   zoom: 12,
  // });
  const [user, setUser] = useState();

  const [marker, setMarker] = useState({
    latitude: latitude,
    longitude: longitude,
  });

  const handleDragEnd = (event) => {
    setViewport({
      ...viewport,
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
    //Update Users location on dragend
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
    setLongitude(event.lngLat[0]);
    setLatitude(event.lngLat[1]);
  };

  useEffect(async () => {
    const userData = await getUserData();
    // const userlongitude = await getUserLongitude();
    // const userlatitude = await getUserLatitude();
    if (userData) {
      setUser(userData);
    }

    // setLongitude(userlongitude);
    // setLatitude(userlatitude);
    // setViewport({
    //   latitude: latitude ? parseFloat(latitude) : '',
    //   longitude: longitude ? parseFloat(longitude) : '',
    //   zoom: 6,
    // });
  }, []);

  function currentLocationApi() {
    var formData = new FormData();
    formData.append('business_id', business_details?.business_id);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    ApiCall('Post', API.businesscurrentlocationApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log(resp.data);
        if (resp.data.success) {
          setLongitude(resp.data.data.longitude ? parseFloat(resp.data.data.longitude) : 71.5249);
          setLatitude(resp.data.data.latitude ? parseFloat(resp.data.data.latitude) : 34.0151);
          setViewport({
            longitude: resp.data.data.longitude ? parseFloat(resp.data.data.longitude) : 71.5249,
            latitude: resp.data.data.latitude ? parseFloat(resp.data.data.latitude) : 34.0151,
            zoom: 12,
          });
          setlocationMap(false);
        } else {
          setlocationMap(false);
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  function userCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        storeUserLatitude(position.coords.latitude);
        storeUserLongitude(position.coords.longitude);
        setLongitude(position.coords.longitude);
        setLatitude(position.coords.latitude);
        setMarker({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
        setViewport({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 12,
        });
      });
    }
  }

  return (
    <div class="container-fluid">
      <section class="content-sec row mt-0 pb-0">
        <div class={`map-sec map-wrap fullscreen ${business_details.is_only_online == 0 ? 'business-map' : ''}`}>
          <ReactMapGL
            mapStyle="mapbox://styles/mapbox/streets-v10"
            mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
            {...viewport}
            width="100%"
            height="100%"
            onViewportChange={(viewport) => {
              setMarker({
                longitude: viewport.longitude,
                latitude: viewport.latitude,
              });
              setLongitude(viewport.longitude);
              setLatitude(viewport.latitude);
              setViewport(viewport);
            }}
          >
            <Marker
              latitude={marker.latitude}
              longitude={marker.longitude}
              // offsetLeft={-10}
              // offsetTop={-10}
              draggable={true}
              onDragEnd={handleDragEnd}
            >
              <img class="img-fluid" src={'images/businessPin.png'} width="20px" height="20px" alt="" />
            </Marker>
          </ReactMapGL>
          <div class="map-head">
            <button class="btn btn-back" onClick={() => setlocationMap(false)}>
              <img class="img-white img-fluid" src={yellow} alt="ico" />
            </button>
          </div>
          <div class="map-btm">
            <button class="btn gps-btn">
              <img class="img-white img-fluid" src={gps} alt="ico" onClick={() => userCurrentLocation()} />
            </button>
            <div class="btn-sec">
              <button class="btn btn-black fs-14 m-0" onClick={() => currentLocationApi()}>
                {t('Buttons.confirm_position')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
