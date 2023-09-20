import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import ButtonClick from '../components/ButtonClick';
import TopHeader from '../components/TopHeader';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';

import avatar from '../images/avatar-placeholder.png';
import upload from '../images/upload-photo-ico.svg';
import alert from '../images/alert-msg-bubble.png';
import google from '../images/google-btn-ico.svg';
import facebook from '../images/fb-btn-ico.svg';

import { storeUserData, removeUserData } from '../Functions/Functions';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import imageCompression from 'browser-image-compression';
const options = {
  maxSizeMB: 0.5, // pretty much self-explanatory
  // maxWidthOrHeight: 500, // apparently px
};

function UserRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('');
  const [image, setImages] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');

  const [regionList, setRegionList] = useState([]);

  const resizeFile = (file) => {
    imageCompression(file, options).then(function (compressedFile) {
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

      return compressedFile; // code to actual upload, in my case uploader() is a function to upload to Firebase storage.
    });
  };

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    const image = await resizeFile(file);
    setImages(image);
    setImagePreview(URL.createObjectURL(event.target.files[0]));
  };

  useEffect(async () => {
    RegionList();
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

  const responseFacebook = (response) => {
    console.log('facebook', response);
    FacebookLoginUser(response);
  };

  const componentClicked = (response) => {
    console.log('componentClicked', response);
  };

  function FacebookLoginUser(response) {
    var formData = new FormData();
    setLoader(true);
    formData.append('access_token', response.accessToken);

    formData.append('device_type', '143434');
    formData.append('device_token', '144343');
    formData.append('device_id', '12121434');

    ApiCall('Post', API.facebookApi, formData)
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log('login facebook', resp);
        if (resp.data.success) {
          storeUserData(resp.data.data);
          navigate('/userProfile');
        } else {
          removeUserData();
        }
      });
  }

  const responseGoogle = (response) => {
    console.log('accessToke', response.accessToken);
    if (response.accessToken) GoogleLoginUser(response);
    else alert('error');
  };

  function GoogleLoginUser(response) {
    var formData = new FormData();
    setLoader(true);
    formData.append('access_token', response.accessToken);

    formData.append('device_type', '143434');
    formData.append('device_token', '144343');
    formData.append('device_id', '12121434');

    ApiCall('Post', API.googleApi, formData)
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        alert('Error occured!');
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log('login google', resp);

        if (resp.data.success) {
          storeUserData(resp.data.data);
          navigate('/userProfile');
        } else {
          removeUserData();
        }
      });
  }

  function Registration() {
    setLoader(true);
    if (username == '' || region == '' || email == '' || password == '' || image == '') {
      setError(true);
      setLoader(false);
      seterror_title(t('alerts.Required Fields are empty'));
    } else if (password.length < 8) {
      setError(true);
      setLoader(false);
      seterror_title(t('alerts.Passowrd must be 8 digit!'));
    } else {
      var formData = new FormData();
      formData.append('name', username);
      formData.append('region', region);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('device_type', '143434');
      formData.append('device_token', '144343');
      formData.append('device_id', '12121434');

      if (image) {
        formData.append('picture', image, image.name);
      }

      ApiCall('Post', API.userRegisterApi, formData)
        .catch((error) => {
          setLoader(false);
          console.log('erorr reponse', error);
          //   reject(error.response);
        })
        .then((resp) => {
          setLoader(false);

          console.log(resp.data.success);

          if (resp.data.success) {
            storeUserData(resp.data.data);
            setIsOpen(true);
            navigate('/Home');
          } else {
            setError(true);
            seterror_title(resp.data.message);
          }
        });
    }
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t('register_screen.register_title')} />
      {loader && <Loader />}
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row yellow-bg user-select pb-0">
        <div class="login-wrap">
          <div class="register-form">
            <div class="form-group">
              <div class="avatar-img">
                <img
                  class="img-fluid imageHeight"
                  src={imagePreview == '' ? avatar : imagePreview}
                  alt="image"
                  style={{}}
                />
                <div class="input-file">
                  <input type="file" name="input-file" onChange={onFileChange} />
                  {imagePreview == '' && (
                    <button class="btn">
                      <img src={upload} alt="ico" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div class="form-group bg mb-5">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value ? e.target.value.split('##')[1] : '')}
                class="form-control mt-2"
              >
                <option value="">{t('placeHolders.State / Region *')}</option>
                {regionList?.map((item) => {
                  return <option value={item.id}>{item.country_name}</option>;
                })}
              </select>
            </div>
            <div class="form-group bg pt-5 pb-4">
              <input
                type="text"
                class="form-control mb-4"
                placeholder={t('placeHolders.username')}
                onChange={(text) => setUsername(text.target.value)}
                required
              />
              <input
                type="text"
                class="form-control mb-4"
                placeholder={t('placeHolders.Business Email')}
                onChange={(text) => setEmail(text.target.value)}
                required
              />
              <input
                type="password"
                class="form-control mb-3"
                placeholder={t('placeHolders.Business Password')}
                onChange={(text) => setPassword(text.target.value)}
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

          <p class="btm-line position-static mt-5 mb-4">
            <ButtonClick title={t('register_screen.sign_up')} onClickftn={() => Registration()} />

            {/* <p class="my-4">{t("login_screen.social_Account")}</p> */}
            <FacebookLogin
              appId="373314744525035"
              autoLoad={true}
              fields="name,email,picture"
              onClick={componentClicked}
              callback={responseFacebook}
              render={(renderProps) => (
                <button class="btn btn-yellow fb" onClick={renderProps.onClick}>
                  <img class="img-fluid" src={facebook} alt="ico" />
                  {t('login_screen.facebook')}
                </button>
              )}
            />

            <GoogleLogin
              clientId="750019794113-24vv99lmgjnms26r78j16b0irqo3320q.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              render={(renderProps) => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled} class="btn btn-yellow google">
                  <img class="img-fluid" src={google} alt="ico" />
                  {t('login_screen.Google')}
                </button>
              )}
            />

            <p class=" mt-4">
              {t('register_screen.acc_exist')}{' '}
              <Link to={'/login'}>
                <strong>{t('login_screen.Sign_In')}</strong>{' '}
              </Link>
            </p>
          </p>
        </div>
      </section>
      {error && <MessageBox error={error} setError={setError} title={error_title} />}
      {/* <!-- Modal Popup Starts here --> */}
      {/* <ModalView
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setIsOpen(false);
          navigate("/login");
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
              <img class="img-fluid" src={alert} alt="ico" />
              <div class="cont">
                <h5>{t('alerts.Hi!')} </h5>
                <h5 class="dark">{t("alerts.let's start to win gifts for FREE")}</h5>
                <p>{t('alerts.Please check your email to confirm your email address!!!')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </ModalView> */}
      {/* <!-- Modal Popup Ends here --> */}
      {/* <!-- Content Section Ends here --> */}
    </div>
  );
}

export default UserRegister;
