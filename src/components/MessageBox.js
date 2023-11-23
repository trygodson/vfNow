import React from 'react';

import { useTranslation } from 'react-i18next';
import '../languages/i18n';
function MessageBox({ error, setError, title, ftn, color }) {
  const { t, i18n } = useTranslation();
  return (
    <div
      class="modal bg-blur reg-modal show"
      role="dialog"
      aria-hidden="true"
      style={{
        display: error ? 'block' : 'none',
        backgroundColor: 'rgba(222, 223, 222 , 0.9)',
      }}
      onClick={() => {
        setError(false);
        ftn();
      }}
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content minh-unset" data-bs-dismiss="modal">
          <div class="alert-bubble-img">
            <img class="img-fluid" src="./images/alert-msg-bubble.png" alt="ico" />
            <div class="cont">
              <h5>{t('alerts.Hi!')}</h5>
              <h5 class={color == 'black' ? 'error-warning' : 'error-msg'}>{title}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;
