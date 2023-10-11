import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getUserData } from '../Functions/Functions';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';

function Splash2() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { t } = useTranslation();

  async function RouteFtn() {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      if (window.isNative) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            notifiication: true,
            data: {
              token: window.isNative,
            },
          }),
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
