import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getUserData } from '../Functions/Functions';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';
import apiCalls from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';

function Splash2() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { t } = useTranslation();

  async function RouteFtn() {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      if (window.isNative) {
        await ApiCall(
          'Post',
          apiCalls.UpdateDeviceToken,
          { device_token: window.isNative, user_id: userData?.id },
          {
            Authorization: 'Bearer ' + userData?.access_token,
            Accept: 'application/json',
          },
        );
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
    <div class="splash-wrap container-fluid" onClick={() => RouteFtn()}>
      <img src={'gifs/VFnormal.gif'} alt="loading..." />
    </div>
  );
}

export default Splash2;
