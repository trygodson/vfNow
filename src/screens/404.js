import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import TopHeader from '../components/TopHeader';
import { DoesNotExist } from '../components/OfflineMsg';
import { useTranslation } from 'react-i18next';
// import { getMessaging, getToken } from "firebase/messaging";

function UnknownRoute() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <DoesNotExist />
    // <div class="container-fluid">
    //   <TopHeader title={'404'} />
    //   <div className="h-100 w-100 d-flex justify-content-center align-items-center">
    //     <div className="modal-dialog modal-dialog-centered">
    //       <div className="modal-content minh-unset">
    //         <div className="alert-bubble-img">
    //           <img className="img-fluid" src="images/alert-msg-bubble.png" alt="ico" />
    //           <div className="cont">
    //             <h5>{t('alerts.OOOPS')}</h5>
    //             <p>{t('alerts.wrong route')}</p>
    //             <p>{t('alerts.Get The route Write')}</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default UnknownRoute;
