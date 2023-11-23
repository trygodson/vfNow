import { WebMercatorViewport } from 'react-map-gl';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';

export const getUserData = async () => {
  try {
    const userData = localStorage.getItem('user');
    return userData != null ? JSON.parse(userData) : null;
  } catch (e) {
    console.log('errrooo', e);
  }
};

export const storeUserData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem('user', jsonValue);
  } catch (e) {
    console.log('errrooo', e);
  }
};

export const removeUserData = async () => {
  try {
    localStorage.removeItem('user');
  } catch (e) {
    console.log('errrooo', e);
  }
};

export const storeUserLongitude = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem('userLongitude', jsonValue);
  } catch (e) {
    console.log('errrooo', e);
  }
};

export const storeUserLatitude = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem('userLatitude', jsonValue);
  } catch (e) {
    console.log('errrooo', e);
  }
};

export const getUserLongitude = async () => {
  try {
    const userData = localStorage.getItem('userLongitude');
    return userData != null ? JSON.parse(userData) : null;
  } catch (e) {
    console.log('errrooo', e);
  }
};

export const getUserLatitude = async () => {
  try {
    const userData = localStorage.getItem('userLatitude');
    return userData != null ? JSON.parse(userData) : null;
  } catch (e) {
    console.log('errrooo', e);
  }
};

const applyToArray = (func, array) => func.apply(Math, array);

export const getBoundsForPoints = (points, longitudetest, latitudetest, status) => {
  // Calculate corner values of bounds
  // const pointsLong = [];
  // const pointsLat=[];
  //   if (status == "business") {
  const pointsLong = points.map((point) =>
    point.business_details ? point.business_details.longitude : point.longitude,
  );
  const pointsLat = points.map((point) => (point.business_details ? point.business_details.latitude : point.latitude));
  // } else {
  //   const pointsLong = points.map((point) => point.business_details.longitude);
  //   const pointsLat = points.map((point) => point.business_details.latitude);
  // }
  const cornersLongLat = [
    [longitudetest, latitudetest],
    [applyToArray(Math.min, pointsLong), applyToArray(Math.min, pointsLat)],
    [applyToArray(Math.max, pointsLong), applyToArray(Math.max, pointsLat)],
  ];

  // Use WebMercatorViewport to get center longitude/latitude and zoom
  const viewport = new WebMercatorViewport({ width: 400, height: 600 })
    // @ts-ignore
    .fitBounds(cornersLongLat, {
      padding: { top: 150, bottom: 200, left: 100, right: 150 },
    });
  // console.log("viewport:", viewport);
  const { longitude, latitude, zoom } = viewport;
  return { longitude, latitude, zoom };
};

export const GetAppTrackFunction = async (user_id, section_type, access_token) => {
  var formData = new FormData();

  formData.append('user_id', user_id);
  formData.append('section', section_type);

  ApiCall('Post', API.TrackApp, formData, {
    Authorization: `Bearer ` + access_token,
    Accept: 'application/json',
  })
    .catch((error) => {
      console.log('App track erorr reponse', error);
      //   reject(error.response);
    })
    .then((resp) => {
      console.log('App track response', resp);
    });
};

export const textSlicer = (data, amount) => {
  if (data?.length >= amount) {
    return data ? `${data.slice(0, amount)}...` : '';
  } else {
    return data;
  }
};
