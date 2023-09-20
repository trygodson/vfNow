import React, { useEffect } from 'react';
import { useEarthoOne } from '@eartho/one-client-react';
import { useNavigate } from 'react-router-dom';
import ButtonClick from '../../components/ButtonClick';
import { useTranslation } from 'react-i18next';

function Social(props) {
  let { GoogleLoginUser } = props;
  let navigate = useNavigate();
  const { t } = useTranslation();

  const { isLoading, isConnected, error, user, getUser, connectWithPopup, connectWithRedirect, logout, getIdToken } =
    useEarthoOne();

  useEffect(() => {
    if (getUser) {
      getUser()
        .then((res) => {
          console.log('res user from google:', res);
          console.log('only user from google:', user);
          let payload = {
            email: res.user.email,
            first_name: res.user.firstName,
            last_name: res.user.lastName,
            uid: res.user.uid,
          };
          GoogleLoginUser(payload);
          localStorage.setItem('userdetail', res.user);
          console.log(res.user.uid, 'payload : ', payload);
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (getIdToken) {
      getIdToken()
        .then((token) => {
          console.log('res token from google :', token);
          localStorage.setItem('token', token);
          if (token) {
            // navigate("/UserProfile");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [getIdToken, getUser]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isConnected) {
    return <div>{/* <button onClick={() => logout({ returnTo: window.location.origin })}>Log out</button> */}</div>;
  } else {
    return (
      <button
        class="btn btn-black w-100 py-2 mt-0"
        onClick={() => {
          if (window.isNative) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ googleSignin: true }));
          } else {
            connectWithRedirect({ access_id: 'zdjGzIhPZHeAE2rMJGE0' });
          }
        }}
      >
        {'Login with Social'}
      </button>
    );
  }
}

export default Social;
