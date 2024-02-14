import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Footer from '../../components/Footer';
import Loader, { CustomModal } from '../../components/Loader';
import MsgModify from '../../components/MsgModify';
import MessageBox from '../../components/MessageBox';

import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { storeUserData, getUserData } from '../../Functions/Functions';

export default function UserProfile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [QRcode, setQRcode] = useState();
  const [userProfile, setUserProfile] = useState();
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(false);
  const [modifyMsg, setModifyMsg] = useState(false);
  const [error_title, seterror_title] = useState('');
  const [username, setUsername] = useState();
  const [qrModal, setQrModal] = useState(false);

  const [error, setError] = React.useState(false);

  const ref = useRef(null);
  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      UserQRcode(userData);
      GetUserProfileData(userData);
    }

    //passing getData method to the lifecycle method
  }, []);

  function GetUserProfileData(user) {
    var formData = new FormData();

    formData.append('user_id', user?.user_id);
    ApiCall('Post', API.userProfileApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        // console.log("setUserProfile", resp.data.data);
        setUserProfile(resp.data.data);
      });
  }

  function UpdateUser() {
    console.log('username', username);
    var formData = new FormData();

    formData.append('user_id', user?.user_id);
    if (image) {
      formData.append('picture', image, image.name);
    }

    formData.append('name', username ? username : userProfile?.username);

    ApiCall('Post', API.UpdateuserProfileApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        storeUserData(resp.data.data);
        // console.log("QRCODE", resp.data.data);
        setQRcode(resp.data.data);
      });
  }

  function UserQRcode(user) {
    var formData = new FormData();

    formData.append('user_id', user?.user_id);
    ApiCall('Post', API.UserQR, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        // console.log("QRCODE", resp.data.data);
        setQRcode(resp.data.data);
      });
  }

  const [image, setImages] = useState('');
  const [imagePreview, setImagePreview] = useState();

  const onFileChange = (event) => {
    setImages(event.target.files[0]);
    setImagePreview(URL.createObjectURL(event.target.files[0]));
    seterror_title('avatar');
    setModifyMsg(true);
  };

  return (
    <div class="container-fluid">
      {loader && <Loader />}
      <header class="top-bar">
        <div class="container">
          <div class="row">
            <div class="col-12 tob-bar-inner">
              <Link to={'/home'} class="btn pe-0">
                <img src="images/arrow_back_ios-24px.svg" />
              </Link>
              <h6>{t('Header.My User Page')}</h6>
              <div class="dropdown head-dd">
                <button
                  class="btn dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img class="img-fluid" src="images/vertical-dot.svg" />
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a class="dropdown-item">
                      <div class="wrapper transparent">
                        <div class="btnimg">{t('filter.Modify Picture')}</div>
                        <input type="file" onChange={onFileChange} />
                      </div>
                      {/* <input
                        type="file"
                        name="input-file"
                        onChange={onFileChange}
                      /> */}
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" onClick={() => ref.current.focus()}>
                      {t('filter.Modify Username')}
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        <div class="vote-sec elect-sec px-0">
          <img class="w-100 img-fluid" src="images/grunge-gray-bg.png" alt="ico" />
          <div class="avatar-img">
            <img
              src={imagePreview ? imagePreview : userProfile?.avatar ? userProfile?.avatar : 'images/avatar-big-1.png'}
              alt="img"
            />
            <div class="wrapper wrapper-img ">
              <input type="file" onChange={onFileChange} />
            </div>
          </div>
          <div class="elect-cont">
            <img class="img-fluid" src="images/elect-bubble.png" alt="ico" />
            <div class="cont">
              <input
                ref={ref}
                type="text"
                class="vote-user mt-4 border-0"
                placeholder={t('placeHolders.username')}
                onChange={(text) => setUsername(text.target.value)}
                value={username ? username : userProfile?.username}
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    setModifyMsg(true);
                    seterror_title('username');
                  }
                }}
                required
              />
            </div>
          </div>
        </div>
        <div class="um-sec">
          <button
            onClick={() => {
              if (userProfile?.election_as_candidate == 0) {
                setError(true);
                seterror_title(t('alerts.You are not candidate yet on any election'));
              } else {
                navigate('/UserElectionCandidate', {
                  state: {
                    user_id: user?.user_id,
                  },
                });
              }
            }}
            class="link transparent border-0"
          >
            <div class="ico-blk">
              <img src="images/my-elec-ico.svg" alt="ico" style={{ margin: -10 }} />
              <span class="count">{userProfile?.election_as_candidate}</span>
            </div>
            <p>
              {t('user_register.My election')}
              <br />
              {t('user_register.as Candidate')}
            </p>
          </button>

          <button
            onClick={() => {
              if (userProfile?.gift_to_be_collected == 0) {
                setError(true);
                seterror_title(t('alerts.You do not have gift to be collected'));
              } else {
                navigate('/UserGiftCollect', {
                  state: {
                    user_id: user?.user_id,
                  },
                });
              }
            }}
            // to="/UserGiftCollect"
            // state={{ user_id: user?.user_id }}
            class="link transparent border-0"
          >
            <div class="ico-blk">
              <img src="images/my-gift-ico.svg" alt="ico" />
              {userProfile?.gift_to_be_collected > 0 && <span class="count">{userProfile?.gift_to_be_collected}</span>}

              {/* <span class="place">01</span> */}
            </div>
            <p>
              {t('user_register.My gift to be')}
              <br />
              {t('user_register.Collected')}
            </p>
          </button>
          <button
            onClick={() => {
              if (userProfile?.feedback_to_be_give == 0) {
                setError(true);
                seterror_title(t('alerts.You do not have Feedback to be given'));
              } else {
                navigate('/UserFeedbackGiven', {
                  state: {
                    user_id: user?.user_id,
                  },
                });
              }
            }}
            class="link transparent border-0"
          >
            <div class="ico-blk">
              <img src="images/my-feedback-ico.svg" alt="ico" />
              {userProfile?.feedback_to_be_give > 0 && <span class="count">{userProfile?.feedback_to_be_give}</span>}
            </div>
            <p>
              {t('user_register.My Feedback')}
              <br /> {t('user_register.to be Given')}
            </p>
          </button>
        </div>
        <div class="col-12 mb-3">
          <button
            class="btn btn-black w-100 py-2 mb-4"
            // data-bs-toggle="modal"
            // data-bs-target="#qr-modal"
            onClick={() => {
              setQrModal(true);
            }}
          >
            {t('user_register.My QR-CODE')}
          </button>
          <button class="btn btn-white w-100 py-2" onClick={() => navigate('/Home')}>
            {t('user_register.FIND MORE ELECTION')}
          </button>
        </div>
      </section>
      {/* <!-- Content Section Ends here -->
        <!-- Footer Starts here --> */}
      <Footer user={user && user} />
      {/* <!-- Footer Ends here --> */}
      {/* <!-- Modal Popup Starts here --> */}
      <CustomModal topClassName="minh-unset" showClose={true} open={qrModal} setOpen={setQrModal}>
        <div class="alert-bubble-img qr-wrap">
          <div class="avatar-img">
            <img src={userProfile?.avatar ? userProfile?.avatar : 'images/avatar-big-1.png'} alt="Username" />
          </div>
          <h5>{userProfile?.username}</h5>
          <div class="qr-img m-auto mt-5">
            <img class="img-fluid" src={'data:image/png;base64,' + QRcode?.qr_image} alt="image" />
          </div>
        </div>
      </CustomModal>
      {modifyMsg && (
        <MsgModify
          error={modifyMsg}
          setError={setModifyMsg}
          title={error_title}
          UpdateUser={UpdateUser}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setUsername={setUsername}
        />
      )}
      {error && <MessageBox error={error} setError={setError} title={error_title} />}
    </div>
  );
}
