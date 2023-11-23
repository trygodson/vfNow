import React, { useEffect, useRef, useState } from 'react';
import TopHeader from '../../components/BusinessHeader';
import BusinessElectionBox from '../../components/BusinessElectionBox';
import Loader from '../../components/Loader';
import { toPng } from 'html-to-image';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { getUserData } from '../../Functions/Functions';

import {
  EmailShareButton,
  FacebookShareButton,
  FacebookIcon,
  HatenaShareButton,
  InstapaperShareButton,
  InstapaperIcon,
  LineShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PinterestIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TelegramIcon,
  TumblrShareButton,
  TwitterShareButton,
  TwitterIcon,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  WorkplaceShareButton,
} from 'react-share';
export const ShareView = ({ modalElection, shareFunc = () => null, setLoading }) => {
  const { t } = useTranslation();
  // console.log(shareImage, 'shareImage');
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
                            name: modalElection?.business_name,
                            link: `www.voteandfun.com/electionDetails/${modalElection?.election_id}`,
                            imageBase64: res ?? '',
                          },
                        }),
                      );
                    });
                  }}
                />
              ) : (
                <FacebookShareButton
                  // url={shareImage ?? ''}
                  url={modalElection?.gift_images[0]?.picture}
                  quote={'Vote and Fun Vote'}
                  hashtag={'#vote&fun'}
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
                            name: modalElection?.business_name,
                            link: `www.voteandfun.com/electionDetails/${modalElection?.election_id}`,
                            imageBase64: res ?? '',
                          },
                        }),
                      );
                    });
                  }}
                />
              ) : (
                <TelegramShareButton
                  url={modalElection?.gift_images[0]?.picture}
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
                            name: modalElection?.business_name,
                            link: `www.voteandfun.com/electionDetails/${modalElection?.election_id}`,
                            imageBase64: res ?? '',
                          },
                        }),
                      );
                    });
                  }}
                />
              ) : (
                <InstapaperShareButton
                  url={modalElection?.gift_images[0]?.picture}
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
                            name: modalElection?.business_name,
                            link: `www.voteandfun.com/electionDetails/${modalElection?.election_id}`,

                            imageBase64: res ?? '',
                          },
                        }),
                      );
                    });
                  }}
                />
              ) : (
                <LinkedinShareButton
                  url={modalElection?.gift_images[0]?.picture}
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
                            name: modalElection?.business_name,
                            link: `www.voteandfun.com/electionDetails/${modalElection?.election_id}`,

                            imageBase64: res ?? '',
                          },
                        }),
                      );
                    });
                  }}
                />
              ) : (
                <WhatsappShareButton
                  url={modalElection?.gift_images[0]?.picture}
                  quote={'Vote and Fun Vote'}
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
                            name: modalElection?.business_name,
                            link: `www.voteandfun.com/electionDetails/${modalElection?.election_id}`,

                            imageBase64: res ?? '',
                          },
                        }),
                      );
                    });
                  }}
                />
              ) : (
                <PinterestShareButton
                  url={modalElection?.gift_images[0]?.picture}
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
      <h6>{t('alert.Message it to your friend!')}</h6>
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
                            name: modalElection?.business_name,
                            link: `www.voteandfun.com/electionDetails/${modalElection?.election_id}`,
                            imageBase64: res ?? '',
                          },
                        }),
                      );
                    });
                  }}
                />
              ) : (
                <WhatsappShareButton
                  url={modalElection?.gift_images[0]?.picture}
                  quote={'Vote and Fun Vote'}
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
                            name: modalElection?.business_name,
                            link: `www.voteandfun.com/electionDetails/${modalElection?.election_id}`,

                            imageBase64: res ?? '',
                          },
                        }),
                      );
                    });
                  }}
                />
              ) : (
                <TelegramShareButton
                  url={modalElection?.gift_images[0]?.picture}
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
                            name: modalElection?.business_name,
                            link: `www.voteandfun.com/electionDetails/${modalElection?.election_id}`,

                            imageBase64: res ?? '',
                          },
                        }),
                      );
                    });
                  }}
                />
              ) : (
                <FacebookMessengerShareButton
                  url={modalElection?.gift_images[0]?.picture}
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

      <h6>{t('alerts.Message it to your friend in VOTE and FUN!')}</h6>
      <div class="ss-wrap">
        <div class="ss-encl">
          <div class="ss-row">
            <div class="ss-blk">
              <img class="vf-ico" src="images/btn-vote-fun-ico.png" alt="ico" />
              <span>{t('alerts.A SINGLE FRIEND')}</span>
            </div>
            <div class="ss-blk">
              <img class="vf-ico" src="images/btn-vote-fun-ico.png" alt="ico" />
              <span>{t('alerts.ALL FRIENDS')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ElectionShare() {
  const { t } = useTranslation();
  const shareImageRef = useRef();
  const [shareimage, setShareimage] = useState();

  const [electionlist, setElectionList] = useState([]);
  const [modalElection, setModalElection] = useState();
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(false);

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      ElectionShareListApiList(userData);
      shareImageToBase64();
    }
  }, []);

  const shareImageToBase64 = () => {
    if (shareImageRef.current !== null) {
      // setMobileSharingLoading(true);
      return toPng(shareImageRef.current, { cacheBust: true })
        .then((dataUrl) => {
          // var img = new Image();
          // img.src = dataUrl;

          setLoader(false);

          return dataUrl;
          // return dataUrl;
          // setMobileSharingLoading(false);
          // console.log('shareimage', dataUrl);
          // setShareGiftImage(dataUrl);
          // link.download = 'my-image-name.png';
          // link.href = dataUrl;
          // link.click();
          // handleOnSubmit(dataUrl);
        })
        .catch((err) => {
          // setMobileSharingLoading(false)
          alert('download err', err);
        });
    }
  };

  function ElectionShareListApiList(user) {
    var formData = new FormData();
    formData.append('user_id', user?.id);
    formData.append('business_id', user?.business_id);

    ApiCall('Post', API.ElectionShareListApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log('Election list Share', resp.data);
        setElectionList(resp.data.data);
      });
  }

  // console.log("modalElection", modalElection);
  return (
    <div class="container-fluid">
      {loader && <Loader />}
      <TopHeader title={t('Header.SELECT ELECTION TO SHARE')} />
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        {/* <!-- This Election Section Starts here --> */}
        <div class="product-wrap">
          <div class="row mt-2 pt-3">
            {electionlist?.not_started?.length > 0 && (
              <div class="col-12">
                <div class=" mb-3">
                  {/* <img class="ico" src="images/fun-ico.svg" alt="ico" />*/}
                  <h3>{t('election.Election NOT STARTED')}</h3>
                </div>
              </div>
            )}
            <div class="col-12">
              {electionlist?.not_started?.map((item, index) => {
                return (
                  <BusinessElectionBox
                    item={item}
                    index={index}
                    setLoader={setLoader}
                    user={user}
                    type={'modal'}
                    setModalElection={setModalElection}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div class="product-wrap">
          <div class="row mt-2 pt-3">
            {electionlist?.started?.length > 0 && (
              <div class="col-12">
                <div class=" mb-3">
                  {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                  <h3>{t('election.Election STARTED')}</h3>
                </div>
              </div>
            )}
            <div class="col-12">
              {electionlist?.started?.map((item, index) => {
                return (
                  <div
                    key={index}
                    class="election-snippet"
                    data-bs-toggle="modal"
                    data-bs-target="#lay7-modal"
                    onClick={() => setModalElection(item)}
                  >
                    <div class="status">
                      <img class="bg" src="/images/start-bg-length.svg" alt="" />
                      <span class="dark">
                        <img class="ico" src="/images/vote-ico.svg" alt="ico" />
                        {t('filter.Started')}
                      </span>
                    </div>

                    <div class="img-wrap">
                      <img
                        class="img-fluid"
                        src={item.gift_images[1] ? item.gift_images[1]?.picture : 'images/product-img.jpg'}
                        alt="ico"
                      />
                    </div>
                    <div class="cont">
                      <h6 class="text-truncate">{item.gift_title}</h6>
                      <p>
                        <img class="ico" src="/images/item-msg-ico.svg" alt="ico" />
                        <span>{item.gift_delivery_option.option}</span>
                      </p>
                      <p>
                        <img class="ico" src="/images/item-people-ico.svg" alt="ico" />
                        <span>
                          {item.candidates_count} {t('election.Candidates')}
                        </span>
                      </p>
                      <p>
                        <img class="ico" src="/images/item-finger-ico.svg" alt="ico" />
                        <span>
                          {item.votes_count} {t('businessPage.Total Votes')}
                        </span>
                      </p>
                      <p>
                        <img class="ico" src="/images/item-qr-code-ico.svg" alt="ico" />
                        <span>123 {t('election.Visit at the place')}</span>
                      </p>
                      <p class="btm-tag text-success">{item.election_duration}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <div class="modal bg-blur" id="lay7-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-5 lay-7 elect-lay" ref={shareImageRef}>
              <img class="img-fluid" src="/images/layout-4-bg.png" alt="images" />
              <div class="cont">
                <div class="prod-thumb">
                  <div class="thumb-in">
                    <img
                      class="prod-img img-fluid"
                      src={
                        modalElection?.gift_images[0]?.picture
                          ? modalElection?.gift_images[0]?.picture
                          : '/images/product-img.jpg'
                      }
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img
                        src={
                          modalElection?.business_details?.avatar
                            ? modalElection?.business_details?.avatar
                            : '/images/logo-dummy.png'
                        }
                        alt=""
                      />
                    </div>
                    <div class="pls-vote-badge">
                      <img class="img-fluid" src="/images/pls-vote-vertical-badge.png" alt="img" />
                    </div>
                  </div>
                </div>
                <button class="btn btn-black border">
                  {t('Buttons.CLICK TO')}
                  <br />
                  {t('Buttons.ENTER')}
                </button>
              </div>
            </div>
            <h6>{t('vote.Create a story or a post!')}!</h6>
            <ShareView
              modalElection={modalElection}
              // shareImage={shareimage}
              shareFunc={shareImageToBase64}
              setLoading={setLoader}
            />
            <button class="btn btn-close-x">
              <img class="img-fluid" src="/images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
