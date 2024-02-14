import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ButtonClick from '../components/ButtonClick';
import TopHeader from '../components/TopHeader';
import Loader, { CustomModal } from '../components/Loader';
import MessageBox from '../components/MessageBox';

import { useNavigate } from 'react-router-dom';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';
import ModalView from 'react-modal';
import { storeUserData, removeUserData } from '../Functions/Functions';

function BusinessRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');
  const [BusinesData, setBusinesData] = useState('');

  function Registration() {
    setLoader(true);
    if (email == '' || password == '') {
      setError(true);
      setLoader(false);
      seterror_title('Required Fields are empty!');
    } else {
      var formData = new FormData();
      formData.append('name', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('device_type', '143434');
      formData.append('device_token', '144343');
      formData.append('access_token', 'asas');
      formData.append('device_id', '12121434');

      ApiCall('Post', API.businessRegisterApi, formData)
        .catch((error) => {
          setLoader(false);
          console.log('erorr reponse', error);
          //   reject(error.response);
        })
        .then((resp) => {
          setLoader(false);
          // console.log("business", resp.data);
          setBusinesData(resp.data.data);
          // if (resp.data.success) {
          //   navigate("/businessRegModal", {
          //     state: {
          //       business_Data: resp.data.data,
          //     },
          //   });
          // }
          if (resp.data.success) {
            setIsOpen(true);
            // navigate("/signupConfirmModal");
          } else {
            setError(true);
            seterror_title(resp.data.message);
          }
        });
    }
  }

  function EmailVerification() {
    setLoader(true);

    var formData = new FormData();
    formData.append('user_id', BusinesData.id);

    ApiCall('Post', API.BusinessRegEmailVerifyCheckApi, formData)
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log('businessemail', resp.data);

        if (resp.data.success) {
          storeUserData(resp.data.data);
          navigate('/businessDetailReg', {
            state: {
              business_Data: BusinesData,
            },
          });
        } else {
          removeUserData();
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  function EmailSendAgain() {
    setLoader(true);

    var formData = new FormData();
    formData.append('user_id', BusinesData.id);

    ApiCall('Post', API.BusinessRegSendEmailAgainApi, formData)
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log('businessemail again', resp.data);

        if (resp.data.success) {
          setError(true);
          seterror_title(resp.data.message);
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t('registerMain_screen.Business_Reg')} />
      {loader && <Loader />}
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row yellow-bg user-select pb-0">
        <div class="login-wrap">
          <div class="register-form" action="#">
            <div class="form-group bg mt-5 pt-5 pb-4">
              {/* <input
                type="text"
                class="form-control mb-4"
                placeholder={t("placeHolders.username")}
                onChange={(text) => setUsername(text.target.value)}
                value={username}
                required
              /> */}
              <input
                type="text"
                class="form-control mb-4"
                placeholder={t('placeHolders.Business Email')}
                onChange={(text) => setEmail(text.target.value)}
                value={email}
                required
              />
              <input
                type="password"
                class="form-control mb-3"
                placeholder={t('placeHolders.Business Password')}
                onChange={(text) => setPassword(text.target.value)}
                value={password}
                required
              />
            </div>
            <div class="form-group">
              <p class="req-row">
                {t('register_screen.required')}
                <small>{t('register_screen.required_desc')}</small>
              </p>
            </div>
          </div>

          <ButtonClick title={t('registerMain_screen.Continue_to_BUSINESS')} onClickftn={() => Registration()} />

          <p class="btm-line px-3">
            {t('register_screen.acc_exist')}{' '}
            <Link to={'/login'}>
              <strong> {t('login_screen.Sign_In')}</strong>
            </Link>
          </p>
        </div>
      </section>
      {/* <ModalView
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setIsOpen(false);
          navigate("/businessDetailReg", {
            state: {
              business_Data: BusinesData,
            },
          });
        }}
      > */}
      <CustomModal topClassName="minh-unset" showClose={false} open={modalIsOpen} setOpen={setIsOpen}>
        <div class="alert-bubble-img mt-0">
          <img class="img-fluid" src="./images/alert-msg-bubble.png" alt="ico" />
          <div class="cont">
            <h5>{t('alerts.Hi!')} </h5>

            <p className="mb-0">{t('alerts.Please confirm your email address before you proceed')}</p>
            <div class="button-btm-sec margin-set">
              <button
                onClick={() => {
                  setIsOpen(false);
                  EmailVerification();
                }}
                // data-bs-dismiss="modal"
                class="btn btn-yellow text-uppercase w-100 mb-0"
              >
                {t('Buttons.Continue')}
              </button>
              <button
                // data-bs-dismiss="modal"
                onClick={() => {
                  EmailSendAgain();
                  setIsOpen(false);
                }}
                class="text-link btn text-uppercase font-bold"
              >
                {t('Buttons.Send Email Again')}
              </button>
              {/* <a href="javascript:;" class="text-link">
                Continue as Visitor
              </a> */}
            </div>
          </div>
        </div>
      </CustomModal>
      {/* <div
        class="modal bg-blur reg-modal show"
        // onClick={() => {
        //   setIsOpen(false);
        // }}
        role="dialog"
        aria-hidden="true"
        style={{
          display: modalIsOpen ? 'block' : 'none',
          backgroundColor: 'rgba(222, 223, 222 , 1)',
        }}
      >
        <div class="modal-dialog modal-dialog-centered heigh-cal">
          <div class="modal-content minh-unset">
          </div>
        </div>
      </div> */}
      {/* </ModalView> */}
      {error && <MessageBox error={error} setError={setError} title={error_title} />}
      {/* <!-- Content Section Ends here --> */}
    </div>
  );
}

export default BusinessRegister;
