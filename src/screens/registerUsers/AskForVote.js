import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import Footer from '../../components/Footer';
import TopHeader from '../../components/TopHeader';
import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import {
  FacebookShareButton,
  FacebookIcon,
  InstapaperShareButton,
  InstapaperIcon,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestShareButton,
  PinterestIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { storeUserData, getUserData } from '../../Functions/Functions';
export default function UserProfileElections() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const shareImageRef = useRef();
  const [userProfile, setUserProfile] = useState();
  const [giftImages, setGiftImages] = useState();
  const [SelectedGiftImage, setSelectedGiftImage] = useState();
  const [selectedGiftImageBase64, setSelectedGiftImageBase64] = useState();
  const [ShareGiftImage, setShareGiftImage] = useState();
  const [loader, setLoader] = useState(false);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef(null);
  const ref9 = useRef(null);
  const ref10 = useRef(null);
  const onButtonClick = useCallback(
    (ref) => {
      if (ref.current === null) {
        return;
      } else {
        if (window?.isNative) {
          if (window?.isVoteMobile) {
            setLoading(true);
            toPng(ref.current, { cacheBust: true })
              .then((dataUrl) => {
                setLoading(false);
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    shareVotePic: true,
                    data: {
                      name: userProfile?.username,
                      link: `Vote and Fun Vote ${user?.name}`,
                      imageBase64: dataUrl ?? '',
                    },
                  }),
                );
              })
              .catch((err) => {
                alert('download err', err);
              });
          } else {
            return toPng(ref.current, { cacheBust: true })
              .then((dataUrl) => {
                // setLoader(false);

                return dataUrl;
              })
              .catch((err) => {
                // setMobileSharingLoading(false)
                alert('download err', err);
              });
          }
        } else {
          // alert(navigator.share);
          toPng(ref.current, { cacheBust: true })
            .then((dataUrl) => {
              const link = document.createElement('a');
              // console.log('image', dataUrl);
              setShareGiftImage(dataUrl);
              link.download = 'my-image-name.png';
              link.href = dataUrl;
              link.click();
              // handleOnSubmit(dataUrl);
            })
            .catch((err) => {
              alert('download err', err);
            });
        }
      }
    },
    [ref],
  );

  const [user, setUser] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      // console.log("useruser", user);
      GetUserProfileData(userData);
    }
  }, []);
  function GetUserProfileData(user) {
    var formData = new FormData();

    formData.append('user_id', location.state.user_id);
    formData.append('election_id', location.state.election_id);

    ApiCall('Post', API.AskforVoteApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        // console.log("voteask View", resp.data.data);
        setUserProfile(resp.data.data);
        setGiftImages(resp.data.data.gift_images);
        setSelectedGiftImage(resp.data.data.gift_images[0]?.picture);
        setSelectedGiftImageBase64(resp.data.data.gift_images[0]?.picture_base64);
      });
  }

  const handleOnSubmit = async (image) => {
    const response = await fetch(image);
    // here image is url/location of image
    const blob = await response.blob();
    const file = new File([blob], 'share.jpg', { type: blob.type });

    if (navigator.share) {
      await navigator
        .share({
          title: 'title',
          text: 'ajeeb testing web android',
          url: 'url to share',
          files: [file],
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error in sharing', error));
    } else {
      alert(`system does not support sharing files.`);
    }
  };

  const ShareView = ({ shareFunc = () => null, setLoading }) => {
    return (
      <>
        <div class="ss-wrap">
          <div class="ss-encl">
            <div class="ss-row">
              <div class="ss-blk">
                {window?.isNative ? (
                  <FacebookIcon
                    size={32}
                    round
                    onClick={() => {
                      setLoading(true);
                      shareFunc().then((res) => {
                        setLoading(false);

                        window.ReactNativeWebView.postMessage(
                          JSON.stringify({
                            facebookStory: true,
                            data: {
                              name: userProfile?.username,
                              link: `Vote and Fun Vote ${user?.name}`,
                              imageBase64: res ?? '',
                            },
                          }),
                        );
                      });
                    }}
                  />
                ) : (
                  <FacebookShareButton
                    url={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                    quote={`Vote and Fun Vote ${user?.name}`}
                    hashtag={'#vote_&_fun'}
                    description={'aiueo'}
                    className="Demo__some-network__share-button"
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                )}
                <span>FACEBOOK</span>
              </div>
              <div class="ss-blk">
                {window?.isNative ? (
                  <TelegramIcon
                    size={32}
                    round
                    onClick={() => {
                      setLoading(true);
                      shareFunc().then((res) => {
                        setLoading(false);

                        window.ReactNativeWebView.postMessage(
                          JSON.stringify({
                            telegram: true,
                            data: {
                              name: userProfile?.username,
                              link: `Vote and Fun Vote ${user?.name}`,
                              imageBase64: res ?? '',
                            },
                          }),
                        );
                      });
                    }}
                  />
                ) : (
                  <TelegramShareButton
                    url={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                    quote={'Vote and Fun Vote'}
                    hashtag={'#vote&fun'}
                    description={'aiueo'}
                    className="Demo__some-network__share-button"
                  >
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                )}
                <span>TELEGRAM</span>
              </div>
              <div class="ss-blk">
                {window?.isNative ? (
                  <InstapaperIcon
                    size={32}
                    round
                    onClick={() => {
                      setLoading(true);
                      shareFunc().then((res) => {
                        setLoading(false);

                        window.ReactNativeWebView.postMessage(
                          JSON.stringify({
                            instagram: true,
                            data: {
                              name: userProfile?.username,
                              link: `Vote and Fun Vote ${user?.name}`,
                              imageBase64: res ?? '',
                            },
                          }),
                        );
                      });
                    }}
                  />
                ) : (
                  <InstapaperShareButton
                    url={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                    quote={'Vote and Fun Vote'}
                    hashtag={'#vote&fun'}
                    description={'aiueo'}
                    className="Demo__some-network__share-button"
                  >
                    <InstapaperIcon size={32} round />
                  </InstapaperShareButton>
                )}
                <span>INSTAGRAM</span>
              </div>

              <div class="ss-blk">
                {window?.isNative ? (
                  <LinkedinIcon
                    size={32}
                    round
                    onClick={() => {
                      setLoading(true);
                      shareFunc().then((res) => {
                        setLoading(false);

                        window.ReactNativeWebView.postMessage(
                          JSON.stringify({
                            linkedin: true,
                            data: {
                              name: userProfile?.username,
                              link: `Vote and Fun Vote ${user?.name}`,
                              imageBase64: res ?? '',
                            },
                          }),
                        );
                      });
                    }}
                  />
                ) : (
                  <LinkedinShareButton
                    url={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                    quote={'Vote and Fun Vote'}
                    hashtag={'#vote&fun'}
                    description={'aiueo'}
                    className="Demo__some-network__share-button"
                  >
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                )}
                <span>LINKEDIN</span>
              </div>
              <div class="ss-blk">
                {window.isNative ? (
                  <WhatsappIcon
                    size={32}
                    round
                    onClick={() => {
                      setLoading(true);
                      shareFunc().then((res) => {
                        setLoading(false);

                        window.ReactNativeWebView.postMessage(
                          JSON.stringify({
                            whatsapp: true,
                            data: {
                              name: userProfile?.username,
                              link: `Vote and Fun Vote ${user?.name}`,
                              imageBase64: res ?? '',
                            },
                          }),
                        );
                      });
                    }}
                  />
                ) : (
                  <WhatsappShareButton
                    url={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                    quote={`Vote and Fun Vote ${user?.name}`}
                    hashtag={'#vote&fun'}
                    description={'aiueo'}
                    className="Demo__some-network__share-button"
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                )}
                <span>Whatsapp</span>
              </div>
              <div class="ss-blk">
                {window?.isNative ? (
                  <PinterestIcon
                    size={32}
                    round
                    onClick={() => {
                      setLoading(true);
                      shareFunc().then((res) => {
                        setLoading(false);

                        window.ReactNativeWebView.postMessage(
                          JSON.stringify({
                            pinterest: true,
                            data: {
                              name: userProfile?.username,
                              link: `Vote and Fun Vote ${user?.name}`,
                              imageBase64: res ?? '',
                            },
                          }),
                        );
                      });
                    }}
                  />
                ) : (
                  <PinterestShareButton
                    url={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                    quote={'Vote and Fun Vote'}
                    hashtag={'#vote&fun'}
                    description={'aiueo'}
                    className="Demo__some-network__share-button"
                  >
                    <PinterestIcon size={32} round />
                  </PinterestShareButton>
                )}
                <span>PINTEREST</span>
              </div>
            </div>
          </div>
        </div>
        <h6>Message it to your friend!</h6>
        <div class="ss-wrap">
          <div class="ss-encl">
            <div class="ss-row">
              <div class="ss-blk">
                {window.isNative ? (
                  <WhatsappIcon
                    size={32}
                    round
                    onClick={() => {
                      setLoading(true);
                      shareFunc().then((res) => {
                        setLoading(false);

                        window.ReactNativeWebView.postMessage(
                          JSON.stringify({
                            whatsapp: true,
                            data: {
                              name: userProfile?.username,
                              link: `Vote and Fun Vote ${user?.name}`,
                              imageBase64: res ?? '',
                            },
                          }),
                        );
                      });
                    }}
                  />
                ) : (
                  <WhatsappShareButton
                    url={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                    quote={`Vote and Fun Vote ${user?.name}`}
                    hashtag={'#vote&fun'}
                    description={'aiueo'}
                    className="Demo__some-network__share-button"
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                )}
                <span>WHATSAPP</span>
              </div>
              <div class="ss-blk">
                {window?.isNative ? (
                  <TelegramIcon
                    size={32}
                    round
                    onClick={() => {
                      setLoading(true);
                      shareFunc().then((res) => {
                        setLoading(false);

                        window.ReactNativeWebView.postMessage(
                          JSON.stringify({
                            telegram: true,
                            data: {
                              name: userProfile?.username,
                              link: `Vote and Fun Vote ${user?.name}`,
                              imageBase64: res ?? '',
                            },
                          }),
                        );
                      });
                    }}
                  />
                ) : (
                  <TelegramShareButton
                    url={'https://telegram.org/'}
                    quote={'Vote and Fun Vote'}
                    hashtag={'#vote&fun'}
                    description={'aiueo'}
                    className="Demo__some-network__share-button"
                  >
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                )}
                <span>TELEGRAM</span>
              </div>

              <div class="ss-blk">
                {window.isNative ? (
                  <FacebookMessengerIcon
                    size={32}
                    round
                    onClick={() => {
                      setLoading(true);
                      shareFunc().then((res) => {
                        setLoading(false);

                        window.ReactNativeWebView.postMessage(
                          JSON.stringify({
                            messenger: true,
                            data: {
                              name: userProfile?.username,
                              link: `Vote and Fun Vote ${user?.name}`,
                              imageBase64: res ?? '',
                            },
                          }),
                        );
                      });
                    }}
                  />
                ) : (
                  <FacebookMessengerShareButton
                    url={'https://telegram.org/'}
                    quote={'Vote and Fun Vote'}
                    hashtag={'#vote&fun'}
                    description={'aiueo'}
                    className="Demo__some-network__share-button"
                  >
                    <FacebookMessengerIcon size={32} round />
                  </FacebookMessengerShareButton>
                )}
                <span>MESSANGER</span>
              </div>
            </div>
          </div>
        </div>
        <h6>Message it to your friend in VOTE and FUN!</h6>
        <div class="ss-wrap">
          <div class="ss-encl">
            <div class="ss-row">
              <div class="ss-blk">
                <img class="vf-ico" src="images/btn-vote-fun-ico.png" alt="ico" />
                <span>A SINGLE FRIEND</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      {loader && <Loader />}
      <div class="container-fluid">
        <TopHeader title={t('election.Ask for Vote')} />

        <section class="content-sec row">
          {/* <!-- Ask for Vote Wrap Starts here --> */}
          <div class="ask-vote-wrap">
            <img class="img-fluid vote-ico" src="images/ask-vote-big-ico.svg" alt="images" />
            <h4>{t('election.Ask for Vote')}</h4>
            {/* <h6>{t("vote.Choose product image")}</h6> */}

            <div class="choose-prod-thumb">
              {giftImages?.map((item, index) => {
                return (
                  <div key={index} class="thumb" onClick={() => setSelectedGiftImage(item?.picture)}>
                    <img class="pd-img img-fluid" src={item?.picture} alt="image" />
                    {item?.picture == SelectedGiftImage && (
                      <img class="ico" src="images/check-circle-ico.svg" alt="ico" />
                    )}
                  </div>
                );
              })}
            </div>
            <div class="layout-wrap-encl">
              <div class="layout-wrap">
                <div class="layout-thumb" data-bs-toggle="modal" data-bs-target="#lay1-modal" ref={ref}>
                  <img class="img-fluid" src="images/layout-1-bg.png" alt="images" />
                  <div class="cont">
                    <div class="avatar">
                      {/* <img
                        src={
                          userProfile?.user_avatar
                            ? userProfile?.user_avatar
                            : "images/avatar-big-1.png"
                        }
                        alt="username"
                      /> */}
                    </div>
                    <div class="avatar-cont">
                      <span class="name text-truncate">{userProfile?.username}</span>
                      <img class="logo img-fluid" src="images/vote-fun-logo.png" alt="Vote & Fun" />
                    </div>
                    <div class="prod-thumb mb-3">
                      <div class="thumb-in">
                        <div class="status start">
                          {/* {userProfile?.election_status == "Started" ? ( */}
                          <img class="img-fluid" src="images/started-yellow-bg-small.svg" alt="image" />
                          {/* ) : (
                            <img
                              class="img-fluid"
                              src="images/not-started-bg.svg"
                              alt=""
                            />
                          )} */}

                          <span>
                            <img class="ico" src="images/vote-ico.svg" alt="ico" />
                            {userProfile?.election_status}
                          </span>
                        </div>
                        <img
                          class="prod-img img-fluid"
                          src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                          alt="ico"
                        />
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <button class="btn btn-yellow w-100 m-0">
                      {t('vote.Vote')} {userProfile?.username}
                    </button>
                  </div>
                </div>
                <div class="layout-thumb lay-2" data-bs-toggle="modal" data-bs-target="#lay2-modal" ref={ref2}>
                  <img class="img-fluid" src="images/layout-2-bg.png" alt="images" />
                  <div class="cont">
                    <div class="avatar av-1">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar av-2">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar av-3">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar av-4">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar av-5">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="business-logo">
                      <img
                        src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                        alt="logo"
                      />
                    </div>
                    <div class="business-logo bl-1">
                      <img
                        src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                        alt="logo"
                      />
                    </div>
                    <div class="business-logo bl-2">
                      <img
                        src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                        alt="logo"
                      />
                    </div>
                    <div class="prod-thumb">
                      <div class="thumb-in">
                        <img
                          class="prod-img img-fluid"
                          src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                          alt="ico"
                        />
                      </div>
                    </div>
                    <div class="vf-logo">
                      <img src="images/vote-fun-logo.png" alt="logo" />
                    </div>
                    <button class="btn btn-yellow w-100 m-0">
                      {t('vote.Vote')} {userProfile?.username}
                    </button>
                  </div>
                </div>
                <div class="layout-thumb lay-3" data-bs-toggle="modal" data-bs-target="#lay3-modal" ref={ref3}>
                  <img class="img-fluid" src="images/layout-3-bg.png" alt="images" />
                  <div class="cont">
                    <div class="avatar">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar-cont">
                      <img class="logo img-fluid" src="images/vote-fun-logo.png" alt="Vote & Fun" />
                      <span class="name">{t('vote.can you please vote me?')}</span>
                    </div>
                    <div class="prod-thumb">
                      <div class="thumb-in">
                        <div class="status start">
                          <img class="img-fluid" src="images/started-yellow-bg-small.svg" alt="image" />
                          <span>
                            <img class="ico" src="images/vote-ico.svg" alt="ico" />
                            {t('vote.Started')}
                          </span>
                        </div>
                        <img
                          class="prod-img img-fluid"
                          src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                          alt="ico"
                        />
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <button class="btn btn-yellow w-100 m-0">
                      {' '}
                      {t('vote.Vote')} {userProfile?.username}
                    </button>
                  </div>
                </div>
                <div class="layout-thumb lay-4" data-bs-toggle="modal" data-bs-target="#lay4-modal" ref={ref4}>
                  <img class="lamp-img" src="images/lamp-light.png" alt="ico" />
                  <img class="img-fluid" src="images/layout-4-bg.png" alt="images" />
                  <div class="cont">
                    <div class="prod-thumb">
                      <div class="thumb-in">
                        <div class="status start">
                          <img class="img-fluid" src="images/started-yellow-bg-small.svg" alt="image" />
                          <span>
                            <img class="ico" src="images/vote-ico.svg" alt="ico" />
                            {t('vote.Started')}
                          </span>
                        </div>
                        <img
                          class="prod-img img-fluid"
                          src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                          alt="ico"
                        />
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <button class="btn btn-yellow w-100 m-0 btn-with-avatar">
                      <div class="avatar">
                        <img
                          src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                          alt="username"
                        />
                      </div>
                      {t('vote.Vote')} {userProfile?.username}
                    </button>
                  </div>
                </div>
                <div class="layout-thumb lay-5" data-bs-toggle="modal" data-bs-target="#lay5-modal" ref={ref5}>
                  <img class="img-fluid" src="images/layout-4-bg.png" alt="images" />
                  <div class="cont">
                    <div class="prod-thumb">
                      <div class="thumb-in">
                        <div class="status start">
                          <img class="img-fluid w-100" src="images/yellow-start-bg.svg" alt="image" />
                          <span>
                            <img class="ico" src="images/vote-ico.svg" alt="ico" />
                            {t('vote.Started')}
                          </span>
                        </div>
                        <img
                          class="prod-img img-fluid"
                          src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                          alt="ico"
                        />
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <button class="btn btn-yellow m-0 btn-with-avatar">
                      <div class="avatar edge">
                        <img
                          src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                          alt="username"
                        />
                      </div>
                      {t('vote.Vote')} {userProfile?.username}
                    </button>
                  </div>
                </div>
                <div class="layout-thumb lay-6" data-bs-toggle="modal" data-bs-target="#lay6-modal" ref={ref6}>
                  <img class="img-fluid" src="images/layout-6-bg.png" alt="images" />
                  <div class="cont">
                    <div class="prod-thumb">
                      <div class="thumb-in">
                        <div class="status start">
                          <img class="img-fluid" src="images/started-yellow-bg-small.svg" alt="image" />
                          <span>
                            <img class="ico" src="images/vote-ico.svg" alt="ico" />
                            {t('vote.Started')}
                          </span>
                        </div>
                        <img
                          class="prod-img img-fluid"
                          src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                          alt="ico"
                        />
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <span class="vote-txt"> {t('vote.please give me a vote')}</span>
                    <button class="btn btn-yellow w-100 btn-with-avatar">
                      <div class="avatar edge">
                        <img
                          src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                          alt="username"
                        />
                      </div>
                      {t('vote.Vote')} {userProfile?.username}
                    </button>
                  </div>
                </div>
                <div class="layout-thumb lay-5 lay-7" data-bs-toggle="modal" data-bs-target="#lay7-modal" ref={ref7}>
                  <img class="img-fluid" src="images/layout-4-bg.png" alt="images" />
                  <div class="cont">
                    <div class="prod-thumb">
                      <div class="thumb-in">
                        <img
                          class="prod-img img-fluid"
                          src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                          alt="ico"
                        />
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                        <div class="pls-vote-badge">
                          <img class="img-fluid" src="images/pls-vote-vertical-badge.png" alt="img" />
                        </div>
                      </div>
                    </div>
                    <button class="btn btn-yellow btn-with-avatar m-0">
                      <div class="avatar edge">
                        <img
                          src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                          alt="username"
                        />
                      </div>
                      {t('vote.Vote')} {userProfile?.username}
                    </button>
                  </div>
                </div>
                <div class="layout-thumb lay-8" data-bs-toggle="modal" data-bs-target="#lay8-modal" ref={ref8}>
                  <img class="img-fluid" src="images/layout-8-bg.png" alt="images" />
                  <div class="cont">
                    <div class="prod-thumb">
                      <div class="thumb-in">
                        <img
                          class="prod-img img-fluid"
                          src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                          alt="ico"
                        />
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/avatar-big-1.png'}
                            alt=""
                          />
                        </div>
                      </div>
                      <div class="avatar">
                        <img
                          src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                          alt="username"
                        />
                      </div>
                    </div>
                    <button class="btn btn-black w-100">
                      {' '}
                      {t('vote.Vote')} {userProfile?.username}
                    </button>
                  </div>
                </div>
                <div class="layout-thumb lay-9" data-bs-toggle="modal" data-bs-target="#lay9-modal" ref={ref9}>
                  <img class="img-fluid" src="images/layout-9-bg.png" alt="images" />
                  <div class="cont">
                    <div class="prod-thumb">
                      <div class="bs-logo-wrap">
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                        <div class="business-logo">
                          <img
                            src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                            alt=""
                          />
                        </div>
                      </div>
                      <div class="thumb-wrap">
                        <div class="thumb-in">
                          <img
                            class="prod-img img-fluid"
                            src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                            alt="ico"
                          />
                        </div>
                        <div class="thumb-in">
                          <img
                            class="prod-img img-fluid"
                            src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                            alt="ico"
                          />
                        </div>
                        <div class="thumb-in">
                          <img
                            class="prod-img img-fluid"
                            src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                            alt="ico"
                          />
                        </div>
                        <div class="thumb-in">
                          <img
                            class="prod-img img-fluid"
                            src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                            alt="ico"
                          />
                        </div>
                        <div class="thumb-in">
                          <img
                            class="prod-img img-fluid"
                            src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                            alt="ico"
                          />
                        </div>
                        <div class="thumb-in">
                          <img
                            class="prod-img img-fluid"
                            src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                            alt="ico"
                          />
                        </div>
                        <div class="thumb-in">
                          <img
                            class="prod-img img-fluid"
                            src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                            alt="ico"
                          />
                        </div>
                        <div class="thumb-in">
                          <img
                            class="prod-img img-fluid"
                            src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                            alt="ico"
                          />
                        </div>{' '}
                      </div>
                      <div class="avatar-encl">
                        <div class="avatar">
                          <img
                            src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                            alt="username"
                          />
                        </div>
                        <div class="avatar">
                          <img
                            src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                            alt="username"
                          />
                        </div>
                        <div class="avatar">
                          <img
                            src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                            alt="username"
                          />
                        </div>
                        <div class="avatar">
                          <img
                            src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                            alt="username"
                          />
                        </div>
                        <div class="avatar">
                          <img
                            src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                            alt="username"
                          />
                        </div>
                        <div class="avatar">
                          <img
                            src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                            alt="username"
                          />
                        </div>
                        <div class="avatar">
                          <img
                            src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                            alt="username"
                          />
                        </div>
                        <div class="avatar">
                          <img
                            src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                            alt="username"
                          />
                        </div>
                      </div>
                      <span class="vote-txt">
                        {t('vote.Plese give me')}
                        <br /> {t('vote.a vote!!!')}
                      </span>
                    </div>
                    <button class="btn btn-black m-0">
                      {t('vote.Vote')} {userProfile?.username}
                    </button>
                  </div>
                </div>
                <div class="layout-thumb lay-10" data-bs-toggle="modal" data-bs-target="#lay10-modal" ref={ref10}>
                  <img class="img-fluid" src="images/layout-10-bg.png" alt="images" />
                  <div class="cont">
                    <span class="vote-txt">
                      {t('vote.CAN YOU')}
                      <br />
                      {t('vote.VOTE')}
                      <br />
                      {t('vote.FOR ME?')}
                    </span>
                    <div class="avatar">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <button class="btn btn-black w-100 m-0">
                      {' '}
                      {t('vote.Vote')} {userProfile?.username}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Ask for Vote Wrap Ends here --> */}
          <div class="layout-info">
            <div class="info-row mb-4">
              <em>01</em>
              <span>{t('vote.CHOOSE THE LAYOUT')}</span>
            </div>
            <div class="info-row">
              <em>02</em>
              <span>{t('vote.CREATE POSTS ON SOCIAL MEDIA or SHARE WITH YOUR FRIENDS')}C</span>
            </div>
          </div>
        </section>
        <Footer user={user && user} />
      </div>

      {/* <!-- Modal1 Popup Starts here --> */}
      <div class="modal bg-blur" id="lay1-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb" ref={shareImageRef}>
              <img class="img-fluid" src="images/layout-1-bg.png" alt="images" />
              <div class="cont">
                <div class="avatar">
                  <img
                    src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                    alt="username"
                  />
                </div>
                <div class="avatar-cont">
                  <span class="name text-truncate">{userProfile?.username}</span>
                  <img class="logo img-fluid" src="images/vote-fun-logo.png" alt="Vote & Fun" />
                </div>
                <div class="prod-thumb mb-3">
                  <div class="thumb-in">
                    <div class="status start">
                      <img class="img-fluid" src="images/started-yellow-bg-small.svg" alt="image" />
                      <span>
                        <img class="ico" src="images/vote-ico.svg" alt="ico" />
                        {userProfile?.election_status}
                      </span>
                    </div>
                    <img
                      class="prod-img img-fluid"
                      src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img
                        src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <button
                  class="btn btn-yellow 
                  "
                  onClick={() => onButtonClick(ref)}
                >
                  {t('vote.Vote')} {userProfile?.username}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')} </h6>
            <ShareView shareFunc={() => onButtonClick(ref)} setLoading={setLoader} />
            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="lay2-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-2">
              <img class="img-fluid" src="images/layout-2-bg.png" alt="images" />
              <div class="cont">
                <div class="avatar av-1">
                  <img
                    src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                    alt="username"
                  />
                </div>
                <div class="avatar av-2">
                  <img
                    src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                    alt="username"
                  />
                </div>
                <div class="avatar av-3">
                  <img
                    src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                    alt="username"
                  />
                </div>
                <div class="avatar av-4">
                  <img
                    src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                    alt="username"
                  />
                </div>
                <div class="avatar av-5">
                  <img
                    src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                    alt="username"
                  />
                </div>
                <div class="business-logo">
                  <img
                    src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                    alt="logo"
                  />
                </div>
                <div class="business-logo bl-1">
                  <img
                    src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                    alt="logo"
                  />
                </div>
                <div class="business-logo bl-2">
                  <img
                    src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                    alt="logo"
                  />
                </div>
                <div class="prod-thumb">
                  <div class="thumb-in">
                    <img
                      class="prod-img img-fluid"
                      src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                      alt="ico"
                    />
                  </div>
                </div>
                <div class="vf-logo">
                  <img src="images/vote-fun-logo-100.png" alt="logo" />
                </div>
                <button class="btn btn-yellow" onClick={() => onButtonClick(ref2)}>
                  {t('vote.Vote')} {userProfile?.username}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            {/*             <ShareView
              shareFunc={onButtonClick}
              setLoading={setLoader}
            />
 */}

            <ShareView shareFunc={() => onButtonClick(ref2)} setLoading={setLoader} />
            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="lay3-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-3">
              <img class="img-fluid" src="images/layout-3-bg.png" alt="images" />
              <div class="cont">
                <div class="avatar">
                  <img
                    src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                    alt="username"
                  />
                </div>
                <div class="avatar-cont">
                  <img class="logo img-fluid" src="images/vote-fun-logo-100.png" alt="Vote & Fun" />
                  <span class="name">{t('vote.can you please vote me?')}</span>
                </div>
                <div class="prod-thumb">
                  <div class="thumb-in">
                    <div class="status start">
                      <img class="img-fluid" src="images/started-yellow-bg-small.svg" alt="image" />
                      <span>
                        <img class="ico" src="images/vote-ico.svg" alt="ico" />
                        {t('vote.Started')}
                      </span>
                    </div>
                    <img
                      class="prod-img img-fluid"
                      src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img
                        src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <button class="btn btn-yellow" onClick={() => onButtonClick(ref3)}>
                  {t('vote.Vote')} {userProfile?.username}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            <ShareView shareFunc={() => onButtonClick(ref3)} setLoading={setLoader} />

            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="lay4-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-4">
              <img class="lamp-img" src="images/lamp-light.png" alt="ico" />
              <img class="img-fluid" src="images/layout-4-bg.png" alt="images" />
              <div class="cont">
                <div class="prod-thumb">
                  <div class="thumb-in">
                    <div class="status start">
                      <img class="img-fluid w-100" src="images/started-yellow-bg-small.svg" alt="image" />
                      <span>
                        <img class="ico" src="images/vote-ico.svg" alt="ico" />
                        {t('vote.Started')}
                      </span>
                    </div>
                    <img
                      class="prod-img img-fluid"
                      src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <button class="btn btn-yellow btn-with-avatar" onClick={() => onButtonClick(ref4)}>
                  <div class="avatar">
                    <img
                      src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                      alt="username"
                    />
                  </div>
                  {t('vote.Vote')} {userProfile?.username}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            <ShareView shareFunc={() => onButtonClick(ref4)} setLoading={setLoader} />

            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="lay5-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-5">
              <img class="img-fluid" src="images/layout-4-bg.png" alt="images" />
              <div class="cont">
                <div class="prod-thumb">
                  <div class="thumb-in">
                    <div class="status start">
                      <img class="img-fluid w-100" src="images/yellow-start-bg.svg" alt="image" />
                      <span>
                        <img class="ico" src="images/vote-ico.svg" alt="ico" />
                        {t('vote.Started')}
                      </span>
                    </div>
                    <img
                      class="prod-img img-fluid"
                      src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img
                        src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <button class="btn btn-yellow btn-with-avatar" onClick={() => onButtonClick(ref5)}>
                  <div class="avatar edge">
                    <img
                      src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                      alt="username"
                    />
                  </div>
                  {t('vote.Vote')} {userProfile?.username}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            <ShareView shareFunc={onButtonClick} setLoading={setLoader} />

            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="lay6-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-6">
              <img class="img-fluid w-100" src="images/layout-6-bg.png" alt="images" />
              <div class="cont">
                <div class="prod-thumb">
                  <div class="thumb-in">
                    <div class="status start">
                      <img class="img-fluid" src="images/started-yellow-bg-small.svg" alt="image" />
                      <span>
                        <img class="ico" src="images/vote-ico.svg" alt="ico" />
                        {t('vote.Started')}
                      </span>
                    </div>
                    <img
                      class="prod-img img-fluid"
                      src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <span class="vote-txt"> {t('vote.please give me a vote')}</span>
                <button class="btn btn-yellow btn-with-avatar" onClick={() => onButtonClick(ref6)}>
                  <div class="avatar edge">
                    <img
                      src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                      alt="username"
                    />
                  </div>
                  {t('vote.Vote')} {userProfile?.username}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            <ShareView shareFunc={onButtonClick} setLoading={setLoader} />

            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="lay7-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-5 lay-7">
              <img class="img-fluid" src="images/layout-4-bg.png" alt="images" />
              <div class="cont">
                <div class="prod-thumb">
                  <div class="thumb-in">
                    <img
                      class="prod-img img-fluid"
                      src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img
                        src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                        alt=""
                      />
                    </div>
                    <div class="pls-vote-badge">
                      <img class="img-fluid" src="images/pls-vote-vertical-badge.png" alt="img" />
                    </div>
                  </div>
                </div>
                <button class="btn btn-yellow btn-with-avatar" onClick={() => onButtonClick(ref7)}>
                  <div class="avatar edge">
                    <img
                      src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                      alt="username"
                    />
                  </div>
                  {t('vote.Vote')} {userProfile?.username}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            <ShareView shareFunc={onButtonClick} setLoading={setLoader} />

            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="lay8-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-8">
              <img class="img-fluid" src="images/layout-8-bg.png" alt="images" />
              <div class="cont">
                <div class="prod-thumb">
                  <div class="thumb-in">
                    <img
                      class="prod-img img-fluid"
                      src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="avatar">
                    <img
                      src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                      alt="username"
                    />
                  </div>
                </div>
                <button class="btn btn-black" onClick={() => onButtonClick(ref8)}>
                  {t('vote.Vote')} {userProfile?.username}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            <ShareView shareFunc={onButtonClick} setLoading={setLoader} />

            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="lay9-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-9">
              <img class="img-fluid" src="images/layout-9-bg.png" alt="images" />
              <div class="cont">
                <div class="prod-thumb">
                  <div class="bs-logo-wrap">
                    <div class="business-logo">
                      <img
                        src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                        alt=""
                      />
                    </div>
                    <div class="business-logo">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt=""
                      />
                    </div>
                    <div class="business-logo">
                      <img
                        src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                        alt=""
                      />
                    </div>
                    <div class="business-logo">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt=""
                      />
                    </div>
                    <div class="business-logo">
                      <img
                        src={userProfile?.business_avatar ? userProfile.business_avatar : 'images/logo-dummy.png'}
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="thumb-wrap">
                    <div class="thumb-in">
                      <img
                        class="prod-img img-fluid"
                        src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                        alt="ico"
                      />
                    </div>
                    <div class="thumb-in">
                      <img
                        class="prod-img img-fluid"
                        src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                        alt="ico"
                      />
                    </div>
                    <div class="thumb-in">
                      <img
                        class="prod-img img-fluid"
                        src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                        alt="ico"
                      />
                    </div>
                    <div class="thumb-in">
                      <img
                        class="prod-img img-fluid"
                        src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                        alt="ico"
                      />
                    </div>
                    <div class="thumb-in">
                      <img
                        class="prod-img img-fluid"
                        src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                        alt="ico"
                      />
                    </div>
                    <div class="thumb-in">
                      <img
                        class="prod-img img-fluid"
                        src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                        alt="ico"
                      />
                    </div>
                    <div class="thumb-in">
                      <img
                        class="prod-img img-fluid"
                        src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                        alt="ico"
                      />
                    </div>
                    <div class="thumb-in">
                      <img
                        class="prod-img img-fluid"
                        src={SelectedGiftImage ? SelectedGiftImage : 'images/product-img.jpg'}
                        alt="ico"
                      />
                    </div>
                  </div>
                  <div class="avatar-encl">
                    <div class="avatar">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                    <div class="avatar">
                      <img
                        src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                        alt="username"
                      />
                    </div>
                  </div>
                  <span class="vote-txt">
                    Plese give me
                    <br />a vote!!!
                  </span>
                </div>
                <button class="btn btn-black" onClick={() => onButtonClick(ref9)}>
                  {t('vote.Vote')} {userProfile?.username}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            <ShareView shareFunc={onButtonClick} setLoading={setLoader} />

            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="lay10-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-10">
              <img class="img-fluid" src="images/layout-10-bg.png" alt="images" />
              <div class="cont">
                <span class="vote-txt">
                  {t('vote.CAN YOU')}
                  <br />
                  {t('vote.VOTE')}
                  <br />
                  {t('vote.FOR ME?')}
                </span>
                <div class="avatar">
                  <img
                    src={userProfile?.user_avatar ? userProfile?.user_avatar : 'images/avatar-big-1.png'}
                    alt="username"
                  />
                </div>
                <button class="btn btn-black" onClick={() => onButtonClick(ref10)}>
                  {t('vote.Vote')} {userProfile?.username}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            <ShareView shareFunc={onButtonClick} setLoading={setLoader} />

            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
