import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getUserData } from '../Functions/Functions';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';
import { ApiCall } from '../services/ApiCall';
import API from '../services/ApiLists';
import { requestForToken } from '../Functions/firebase';

function Splash2() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { t } = useTranslation();

  async function RouteFtn() {
    const userData = await getUserData();
    console.log('user data', userData);
    if (userData) {
      setUser(userData);
      if (window.isNative) {
        // window.ReactNativeWebView.postMessage(
        //   JSON.stringify({
        //     notification: true,
        //     data: {
        //       token: window.isNative,
        //     },
        //   }),
        // );
        await ApiCall(
          'Post',
          API.UpdateDeviceToken,
          { device_token: window.isNative, user_id: userData?.id },
          {
            Authorization: 'Bearer ' + user?.access_token,
            Accept: 'application/json',
          },
        );
      } else {
        // const deviceToken = await requestForToken();
        // await ApiCall(
        //   'Post',
        //   API.UpdateDeviceToken,
        //   {
        //     device_token: deviceToken,
        //     user_id: user?.id,
        //   },
        //   {
        //     Authorization: 'Bearer ' + user?.access_token,
        //     Accept: 'application/json',
        //   },
        // );
      }
      if (userData?.login_as == 'business') {
        navigate('/BusinessHome');
      } else {
        navigate('/Home');
      }
    } else {
      navigate('/Home');
    }
  }
  return (
    <div class="splash-wrap container-fluid d-flex justify-content-center" onClick={() => RouteFtn()}>
      <img src={'gifs/VFnormal.gif'} alt="loading..." />
    </div>
  );
}

export default Splash2;
