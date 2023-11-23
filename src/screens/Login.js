import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import TopHeader from '../components/TopHeader';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';
import ButtonClick from '../components/ButtonClick';

import logo from '../images/logo-black.png';
import mail from '../images/login-mail-ico.svg';
import pass from '../images/login-lock-ico.svg';

import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';
import { storeUserData, removeUserData } from '../Functions/Functions';
// import FacebookLogin from "react-facebook-login";
import Social from '../components/social/Social';
// import { requestForToken } from '../Functions/firebase';
// import { getMessaging, getToken } from "firebase/messaging";

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');

  useEffect(() => {
    window.addEventListener('message', (message) => {
      // alert(JSON.stringify(message.data));
      if (window.isNative) {
        window.ReactNativeWebView.postMessage(JSON.stringify('dddjdkdkjk'));
      }
    });

    return () => {
      window.removeEventListener('message', (message) => {
        // alert(JSON.stringify(message.data));
        if (window.isNative) {
          window.ReactNativeWebView.postMessage(JSON.stringify('sklklsnk'));
        }
      });
    };
  }, []);

  function LoginUser() {
    var formData = new FormData();
    setLoader(true);
    if (email == '' || password == '') {
      setError(true);
      setLoader(false);
      seterror_title('Required Fields are empty!');
    } else {
      formData.append('email', email);
      formData.append('password', password);
      formData.append('device_type', '143434');
      formData.append('device_token', '144343');
      formData.append('device_id', '12121434');

      ApiCall('Post', API.SignInApi, formData)
        .catch((error) => {
          setLoader(false);
          console.log('erorr reponse', error);
          //   reject(error.response);
        })
        .then(async (resp) => {
          setLoader(false);
          console.log('login', resp.data);
          // const deviceToken = await requestForToken();

          if (resp.data.success) {
            // Token(resp.data.data);
            storeUserData(resp.data.data);
            // await ApiCall(
            //   'Post',
            //   API.UpdateDeviceToken,
            //   {
            //     device_token: deviceToken,
            //     user_id: resp.data.data?.id,
            //   },
            //   {
            //     Authorization: 'Bearer ' + resp.data.data?.access_token,
            //     Accept: 'application/json',
            //   },
            // );

            if (resp.data?.data?.login_as == 'business') {
              navigate('/businessHome');
            } else {
              navigate(-1);
            }
          } else {
            setError(true);
            setLoader(false);
            seterror_title(resp.data.message);
          }
        });
    }
  }

  function ForgetPasswordUser() {
    var formData = new FormData();
    setLoader(true);
    if (email == '') {
      setError(true);
      setLoader(false);
      seterror_title('Email Field is empty!');
    } else {
      formData.append('email', email);
      formData.append('device_type', '143434');
      formData.append('device_token', '144343');
      formData.append('device_id', '12121434');

      ApiCall('Post', API.ForgotPasswordUserApi, formData)
        .catch((error) => {
          setLoader(false);
          console.log('erorr reponse', error);
          //   reject(error.response);
        })
        .then((resp) => {
          setLoader(false);
          console.log('Fortget password', resp.data);

          if (resp.data.success) {
            setError(true);
            setLoader(false);
            seterror_title(resp.data.message);
          }
        });
    }
  }
  const responseFacebook = (response) => {
    console.log('facebook', response);
    FacebookLoginUser(response);
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
          if (resp.data.data.login_as == 'business') navigate('/businessHome');
          else navigate('/userProfile');
        } else {
          removeUserData();
        }
      });
  }
  // function Token(data) {
  //   console.log("tokennn");
  //   var formData = new FormData();
  //   const messaging = getMessaging();
  //   getToken(messaging, {
  //     vapidKey:
  //       "BCTQUgXc6AHqc17xopC-cd2KsfMsi4p3v5Im9Hoov0ud3Getp9r1n1wBfhIQOGqJJqBDDN_6cpXSe7uCV6N-P-U",
  //   })
  //     .then((currentToken) => {
  //       if (currentToken) {
  //         console.log("currentToken login", currentToken);
  //         formData.append("device_token", currentToken);

  //         formData.append("user_id", data.id);

  //         ApiCall(
  //           "Post",
  //           "https://apis.voteandfun.com/api/device-token/update",
  //           formData
  //         )
  //           .catch((error) => {
  //             setLoader(false);
  //             console.log("erorr token", error);
  //             //   reject(error.response);
  //           })
  //           .then((resp) => {
  //             setLoader(false);
  //             console.log("tokentokentoken", resp.data);
  //           });
  //         // Send the token to your server and update the UI if necessary
  //         // ...
  //       } else {
  //         // Show permission request UI
  //         console.log(
  //           "No registration token available. Request permission to generate one."
  //         );
  //         // ...
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("An error occurred while retrieving token. ", err);
  //       // ...
  //     });
  // }
  const componentClicked = (response) => {
    console.log('componentClicked', response);
  };

  const responseGoogle = (response) => {
    console.log('responseofGoogle response :', response);
    alert('accessToke', response.accessToken);
    if (response.accessToken) GoogleLoginUser(response);
    else alert(response.accessToken);
  };

  function GoogleLoginUser(response) {
    var formData = new FormData();
    setLoader(true);
    // formData.append("access_token", response.accessToken);
    formData.append('first_name', response.first_name);
    formData.append('last_name', response.last_name);
    formData.append('uid', response.uid);
    formData.append('email', response.email);
    // formData.append("access_token", response);
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
      .then(async (resp) => {
        setLoader(false);
        console.log('login google', resp);
        // const deviceToken = await requestForToken();
        // await ApiCall(
        //   'Post',
        //   API.UpdateDeviceToken,
        //   {
        //     device_token: deviceToken,
        //     user_id: resp.data.data?.id,
        //   },
        //   {
        //     Authorization: 'Bearer ' + resp.data.data?.access_token,
        //     Accept: 'application/json',
        //   },
        // );
        if (resp.data.success) {
          storeUserData(resp.data.data);
          if (resp.data.data.login_as == 'business') navigate('/businessHome');
          else navigate('/userProfile');
        } else {
          removeUserData();
        }
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t('login_screen.Sign_In')} />
      {loader && <Loader />}
      <section class="content-sec row yellow-bg">
        <div class="login-wrap">
          <img class="img-fluid sign-logo" src={logo} alt="Vote and Fun" />
          <h5 class="mb-4">{t('login_screen.Sign_In')}</h5>

          <div class="login-form">
            <div class="form-group mb-3">
              <img class="ico" src={mail} alt="ico" />
              <input
                type="text"
                class="form-control"
                placeholder={t('placeHolders.email')}
                onChange={(text) => setEmail(text.target.value)}
                value={email}
                required
              />
            </div>

            <div class="form-group mb-2">
              <img class="ico" src={pass} alt="ico" />
              <input
                type="password"
                class="form-control"
                placeholder={t('placeHolders.password')}
                onChange={(text) => setPassword(text.target.value)}
                value={password}
                required
              />
            </div>

            <div class="form-group mb-3">
              <p class="text-center">
                <a onClick={() => ForgetPasswordUser()} class="forgot">
                  {t('login_screen.Forgot_password?')}
                </a>
              </p>

              <ButtonClick title={t('login_screen.Sign_In')} onClickftn={() => LoginUser()} />
            </div>
            <div class="form-group">
              {/* <p class="">{t('login_screen.social_Account')}</p> */}
              {/* <FacebookLogin
                appId="373314744525035"
                autoLoad={true}
                fields="name,email,picture"
                onClick={componentClicked}
                callback={responseFacebook}
                render={(renderProps) => (
                  <button
                    class="btn btn-yellow fb"
                    onClick={renderProps.onClick}
                  >
                    <img class="img-fluid" src={facebook} alt="ico" />
                    {t("login_screen.facebook")}
                  </button>
                )}
              />

              <GoogleLogin
                clientId="750019794113-24vv99lmgjnms26r78j16b0irqo3320q.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    class="btn btn-yellow google"
                  >
                    <img class="img-fluid" src={google} alt="ico" />
                    {t("login_screen.Google")}
                  </button>
                )}
              /> */}
              {/* <App2/> */}
              {/* <Social GoogleLoginUser={GoogleLoginUser} /> */}

              <p class="btm-line">
                {t('login_screen.no_acc')}
                <Link to={'/register'}>
                  <strong> {t('login_screen.sign_up')}</strong>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      {error && <MessageBox error={error} setError={setError} title={error_title} color={'black'} />}
    </div>
  );
}

export default Login;
