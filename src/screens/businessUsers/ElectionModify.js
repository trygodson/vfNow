import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import TopHeader from '../../components/BusinessHeader';
import ImageView from '../../components/ImageView';
import GeneralBusiness from '../../components/GeneralBusiness';
import Loader from '../../components/Loader';
import { toPng } from 'html-to-image';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import dollar from '../../images/dollar-ico.svg';
import StarRatings from 'react-star-ratings';
import ReactStars from 'react-rating-stars-component';
import { Carousel } from 'react-responsive-carousel';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PdfExportFormat } from '../../components/ElectionPdf';
import { ShareView } from './ElectionShare';

export default function ElectionDetails({
  setelectionUpdate,
  electionUpdate,
  setIsModifyElection,
  user,
  elections,
  UpdateElection,
}) {
  const ref = useRef();
  const shareImageRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [preview, setPreview] = useState();
  const [election, setElection] = useState();
  const [electionQR, setElectionQR] = useState();
  const [feedback, setFeedback] = useState();
  const [winner, setWinner] = useState();
  const [candidate, setCandidate] = useState();
  const [isImageView, setIsImageView] = React.useState(false);
  const [imageView, setImageView] = React.useState(false);
  const [selectedModalPicture, setSelectedModalPicture] = useState();

  const [viewport, setViewport] = React.useState({
    latitude: 30.3753,
    longitude: 69.3451,
    zoom: 5,
  });

  useEffect(async () => {
    ElectionDetail(user);
    ElectionQR(user);
  }, []);

  function ElectionQR(user) {
    var formData = new FormData();

    formData.append('business_id', user.business_id);
    if (elections?.data?.election_id != undefined) {
      formData.append('election_id', elections?.data?.election_id);
    } else {
      formData.append('election_id', elections?.data);
    }

    ApiCall('Post', API.electionQRcodeApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse QR', error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log('resp.data.data QRCODE', resp.data.data);
        setLoader(false);
        if (resp.data.success) {
          setElectionQR(resp.data.data);
        } else {
          // setError(true);
          setLoader(false);
          // seterror_title(resp.data.message);
        }
      });
  }

  function ElectionDetail(user) {
    setLoader(true);
    var formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('business_id', user.business_id);
    if (elections?.data?.election_id != undefined) {
      formData.append('election_id', elections?.data?.election_id);
    } else {
      formData.append('election_id', elections?.data);
    }
    // formData.append("election_id", location.state.election_id);

    ApiCall('Post', API.electiondetailhApi, formData, {
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
        console.log('previewresp', resp.data.data);
        setPreview(resp.data.data);
        setElection(resp.data.data.election_details);
        setFeedback(resp.data.data.feedbacks);
        setWinner(resp.data.data.winner);
        setCandidate(resp.data.data.candidates);

        // alert(resp.data.message);
      });
  }

  const shareImageToBase64 = () => {
    if (shareImageRef.current != null) {
      return toPng(shareImageRef.current, { cacheBust: true })
        .then((dataUrl) => {
          // var img = new Image();
          // img.src = dataUrl;

          // setShareimage(dataUrl);
          setLoader(false);

          return dataUrl;
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

  // const shareView = () => {
  //   return (
  //     <>
  //       <div class="ss-wrap">
  //         <div class="ss-encl">
  //           <div class="ss-row">
  //             <div class="ss-blk">
  //               <FacebookShareButton
  //                 url={'https://facebook.com'}
  //                 quote={'Vote and Fun Vote'}
  //                 hashtag={'#vote&fun'}
  //                 description={'aiueo'}
  //                 className="Demo__some-network__share-button"
  //               >
  //                 <FacebookIcon size={32} round />
  //               </FacebookShareButton>
  //               <span>FACEBOOK</span>
  //             </div>
  //             <div class="ss-blk">
  //               <TelegramShareButton
  //                 url={'https://telegram.org/'}
  //                 quote={'Vote and Fun Vote'}
  //                 hashtag={'#vote&fun'}
  //                 description={'aiueo'}
  //                 className="Demo__some-network__share-button"
  //               >
  //                 <TelegramIcon size={32} round />
  //               </TelegramShareButton>
  //               <span>TELEGRAM</span>
  //             </div>
  //             <div class="ss-blk">
  //               <InstapaperShareButton
  //                 url={'https://www.instapaper.com/'}
  //                 quote={'Vote and Fun Vote'}
  //                 hashtag={'#vote&fun'}
  //                 description={'aiueo'}
  //                 className="Demo__some-network__share-button"
  //               >
  //                 <InstapaperIcon size={32} round />
  //               </InstapaperShareButton>
  //               <span>INSTAGRAM</span>
  //             </div>
  //             <div class="ss-blk">
  //               <LinkedinShareButton
  //                 url={'https://www.linkedin.com/'}
  //                 quote={'Vote and Fun Vote'}
  //                 hashtag={'#vote&fun'}
  //                 description={'aiueo'}
  //                 className="Demo__some-network__share-button"
  //               >
  //                 <LinkedinIcon size={32} round />
  //               </LinkedinShareButton>
  //               <span>LINKEDIN</span>
  //             </div>
  //             <div class="ss-blk">
  //               <WhatsappShareButton
  //                 url={'https://www.whatsapp.com/'}
  //                 quote={'Vote and Fun Vote'}
  //                 hashtag={'#vote&fun'}
  //                 description={'aiueo'}
  //                 className="Demo__some-network__share-button"
  //               >
  //                 <WhatsappIcon size={32} round />
  //               </WhatsappShareButton>
  //               <span>Whatsapp</span>
  //             </div>
  //             <div class="ss-blk">
  //               <PinterestShareButton
  //                 url={'https://www.pinterest.com/'}
  //                 quote={'Vote and Fun Vote'}
  //                 hashtag={'#vote&fun'}
  //                 description={'aiueo'}
  //                 className="Demo__some-network__share-button"
  //               >
  //                 <PinterestIcon size={32} round />
  //               </PinterestShareButton>
  //               <span>PINTEREST</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <h6>{t('alert.Message it to your friend!')}</h6>
  //       <div class="ss-wrap">
  //         <div class="ss-encl">
  //           <div class="ss-row">
  //             <div class="ss-blk">
  //               <WhatsappShareButton
  //                 url={'https://www.whatsapp.com/'}
  //                 quote={'Vote and Fun Vote'}
  //                 hashtag={'#vote&fun'}
  //                 description={'aiueo'}
  //                 className="Demo__some-network__share-button"
  //               >
  //                 <WhatsappIcon size={32} round />
  //               </WhatsappShareButton>{' '}
  //               <span>WHATSAPP</span>
  //             </div>
  //             <div class="ss-blk">
  //               <TelegramShareButton
  //                 url={'https://telegram.org/'}
  //                 quote={'Vote and Fun Vote'}
  //                 hashtag={'#vote&fun'}
  //                 description={'aiueo'}
  //                 className="Demo__some-network__share-button"
  //               >
  //                 <TelegramIcon size={32} round />
  //               </TelegramShareButton>
  //               <span>TELEGRAM</span>
  //             </div>

  //             <div class="ss-blk">
  //               <FacebookMessengerShareButton
  //                 url={'https://telegram.org/'}
  //                 quote={'Vote and Fun Vote'}
  //                 hashtag={'#vote&fun'}
  //                 description={'aiueo'}
  //                 className="Demo__some-network__share-button"
  //               >
  //                 <FacebookMessengerIcon size={32} round />
  //               </FacebookMessengerShareButton>
  //               <span>MESSANGER</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <h6>{t('alerts.Message it to your friend in VOTE and FUN!')}</h6>

  //       <div class="ss-wrap">
  //         <div class="ss-encl">
  //           <div class="ss-row">
  //             <div class="ss-blk">
  //               <img class="vf-ico" src="images/btn-vote-fun-ico.png" alt="ico" />
  //               <span>{t('alerts.A SINGLE FRIEND')}</span>
  //             </div>
  //             <div class="ss-blk">
  //               <img class="vf-ico" src="images/btn-vote-fun-ico.png" alt="ico" />
  //               <span>{t('alerts.ALL FRIENDS')}</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // };
  return (
    <div class="container-fluid p-0">
      <TopHeader backarrow={true} backarrowftn={() => setelectionUpdate(false)} title={t('Header.MODIFY ELECTION')} />
      {loader && <Loader />}
      {isImageView && (
        <ImageView imageView={imageView} arrayItems={election?.gift_images} setIsImageView={setIsImageView} />
      )}
      <section class="content-sec row yellow-bg user-select pb-0">
        <div class="login-wrap election-form px-0">
          <h5 class="green">{t('Header.PREVIEW')}</h5>
          <div class="preview-sec">
            <div class="product-wrap item-snippet">
              <div class="row my-3">
                <div class="product-list">
                  <div class="product-overflow">
                    <div class="prod-snip">
                      <div class="business-name">
                        <div class="logo-sec">
                          <img
                            class="img-fluid"
                            src={
                              preview?.business_details?.avatar
                                ? preview?.business_details?.avatar
                                : 'images/logo-dummy.png'
                            }
                            alt="logo"
                          />
                        </div>
                        <div class="cont-sec">
                          <h4 class="text-truncate">{election?.business_name}</h4>
                          <div class="rating-sec">
                            <div class="rating">
                              <StarRatings
                                rating={election?.ratings}
                                starRatedColor="#FFD306"
                                numberOfStars={5}
                                name="rating"
                                starDimension="20px"
                                starSpacing="2px"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="img-wrap">
                        <div class="status">
                          <img src="images/not-started-bg.svg" alt="" />
                          <span>{election?.election_status}</span>
                        </div>

                        <Carousel
                          showArrows={false}
                          showThumbs={false}
                          showStatus={false}
                          preventMovementUntilSwipeScrollTolerance={true}
                          swipeScrollTolerance={50}
                        >
                          {election?.gift_images?.map((item, index) => {
                            return (
                              <div
                                className="carousel-height-election"
                                key={index}
                                onClick={() => {
                                  setIsImageView(!isImageView);
                                  setImageView(index);
                                }}
                              >
                                <img
                                  className="img-fluid"
                                  src={item?.picture}
                                  alt="Thumbnail"
                                  style={{
                                    width: '350px',
                                    objectFit: 'cover',
                                    objectPosition: '50% 0%',
                                  }}
                                />
                              </div>
                            );
                          })}
                          {election?.video != '' && (
                            <div className="carousel-height">
                              <video src={election?.video} controls="controls" className="carousel-video" />
                            </div>
                          )}
                        </Carousel>
                      </div>
                      <div class="cont">
                        <h4 class="text-truncate">{election?.gift_title}</h4>
                        <p class="cont">{election?.gift_description}</p>
                        {/* <span class="full-desc">
                          <a href="javascript:;">Full Description</a>
                          <span>(000.000.001)</span>
                        </span> */}
                        <div class="d-flex w-100 pt-3">
                          <div class="ico-cont">
                            <img src="images/dollar-ico.svg" alt="" /> {election?.gift_value} {election?.currency}
                          </div>
                          <div class="ico-cont justify-content-end">
                            <div class="ico-cont justify-content-end">
                              {election?.gift_delivery_option?.value == '1' ? (
                                <>
                                  <img src="images/shipped-ico.svg" className="icon-size" alt="" />
                                  {t('election.Shipped')}
                                </>
                              ) : election?.gift_delivery_option?.value == '2' ? (
                                <>
                                  <img src={'images/mail-ico.svg'} alt="" />
                                  {t('election.On-line delivery')}
                                </>
                              ) : (
                                <>
                                  <img src="images/shop-line-ico.svg" className="icon-size" alt="" />
                                  {t('election.At the place')}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div class="d-flex start py-2">
                          <p>
                            <strong>{election?.election_duration}</strong>
                            <span>{election?.election_date}</span>
                          </p>
                          <div class="ico-cont">
                            <img src="images/candidate-ico.svg" alt="ico" />
                            {election?.candidates_count} {t('election.Candidates')}
                          </div>
                        </div>
                        <div class="btm-sec">
                          <a href="javascript:;" class="link">
                            <img src="images/join-candidate-ico.svg" alt="ico" />
                            <span>
                              {t('election.Join')}
                              <small> {t('election.as')} </small>
                              {t('election.Candidates')}
                            </span>
                          </a>
                          <a href="javascript:;" class="link">
                            <img src="images/favorite-ico.svg" alt="ico" />
                            <span>{t('election.Favourite')}</span>
                          </a>
                          <a href="javascript:;" class="link inactive">
                            <img src="images/announce-ico.svg" alt="ico" />
                            <span>{t('election.Ask for Vote')}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="product-wrap item-snippet">
              <div class="mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t('election.This is a gift from')}</h3>
              </div>
              {preview && <GeneralBusiness preview={preview} location={location} user={user} setLoader={setLoader} />}
            </div>
          </div>
          <div class="col-12 px-3">
            <button
              onClick={() => {
                setIsModifyElection(true);
                setelectionUpdate(false);
              }}
              class="btn btn-white w-100 py-2 mt-3 mb-4"
            >
              {t('user_register.MODIFY')}
            </button>
            <button
              class="btn btn-black w-100 py-2 mt-3 mb-5"
              data-bs-toggle="modal"
              data-bs-target="#elec-confirm-modal"
            >
              {t('user_register.CONFIRM')}
            </button>
          </div>
        </div>
      </section>

      {/* <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur reg-modal" id="elec-confirm-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="close-cont">
              <button class="btn btn-close-x p-0">
                <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
              </button>
            </div>
            <div class="alert-bubble-img rect-pop">
              <img class="img-fluid" src="images/rectangle-popup.svg" alt="ico" />
              <div class="cont">
                <h6 class="text-success text-center">{t('user_register.Almost there!')}</h6>
                <img class="finger-ico img-fluid" src="images/alert-finger-ico.png" alt="ico" />
                <p>
                  <strong>{t('alerts.Please make sure to give your gift for free to the Winner')}.</strong>
                </p>
                <p class="text-danger">
                  {t(
                    'alerts.If for any reason you do not feel confortable to guaraty the free gift, please do not confirm, or your reputation can be seriously damaged',
                  )}
                  .
                </p>
                <p>{t('alerts.Instead, if you are able to guaranty the free gift, please')} </p>
                <p>
                  <strong>
                    {t('alerts.click')} "{t('alerts.CONFIRM ELECTION')}"
                  </strong>
                </p>
                <p class="text-success">
                  <strong>
                    {t('alerts.and we will be very happy to help you with this election and with your SHOP')} !!!
                  </strong>
                </p>
              </div>
            </div>
            <div class="col-12 px-3 mt-4 mb-5">
              <button class="btn btn-black w-100" data-bs-toggle="modal" data-bs-target="#elec-confirm1-modal">
                <small>{t('alerts.CONFIRM ELECTION')}</small>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur reg-modal" id="elec-confirm1-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="close-cont">
              <button class="btn btn-close-x p-0">
                <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
              </button>
              <p>
                {t(
                  'businessPage.If you are on a rush, you can Print the QR CODE and SHARE even later from the Election page',
                )}
              </p>
            </div>
            <div class="alert-bubble-img mb-5">
              <img class="img-fluid" src="images/alert-msg-bubble.png" alt="ico" />
              <div class="cont">
                <h5 class="mt-1">{t('alerts.FANTASTIC!')}</h5>
                <p class="mb-1">
                  <strong>...{t('alerts.your election is now published')}!!!</strong>
                </p>
                <h5 class="mt-1"> {t('alerts.IMPORTANT')}</h5>
                <p>
                  <strong>{t('alerts.Print the ELECTION QR-CODE and put it in a visible place in your SHOP')}</strong>
                </p>
              </div>
            </div>
            <div class="col-12 px-3 mt-4 mb-5">
              <button class="btn btn-yellow w-100 mb-4" data-bs-toggle="modal" data-bs-target="#pdf-modal">
                <small>{t('Buttons.PRINT ELECTION QR-CODE')}</small>
              </button>
              <button class="btn btn-black w-100" data-bs-toggle="modal" data-bs-target="#lay7-modal">
                <small>{t('Buttons.SHARE')}</small>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Modal Popup Ends here --> */}
      {/* <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="lay7-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-lay-wrap">
            <div class="layout-thumb lay-5 lay-7 elect-lay" ref={shareImageRef}>
              <img class="img-fluid" src="images/layout-4-bg.png" alt="images" />
              <div class="cont">
                <div class="prod-thumb">
                  <div class="thumb-in">
                    <img
                      class="prod-img img-fluid"
                      src={
                        election?.gift_images[0]?.picture ? election?.gift_images[0]?.picture : 'images/product-img.jpg'
                      }
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img
                        src={
                          election?.business_details?.avatar
                            ? election?.business_details?.avatar
                            : 'images/logo-dummy.png'
                        }
                        alt=""
                      />
                    </div>
                    <div class="pls-vote-badge">
                      <img class="img-fluid" src="images/pls-vote-vertical-badge.png" alt="img" />
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
              modalElection={election}
              // shareImage={shareimage}
              shareFunc={shareImageToBase64}
              setLoading={setLoader}
            />

            <button class="btn btn-close-x">
              <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
            </button>
          </div>
        </div>
      </div>

      <div class="modal py-5" id="pdf-modal">
        <div ref={ref} class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollabl">
          <div class="modal-content rounded-0 position-relative">
            {/* <!-- Modal Header --> */}
            <div class="modal-">
              <img src="images/pdf-top-img.png" class="img-fluid" alt="" />
              <button type="button" class="btn-close __close text-white" data-bs-dismiss="modal"></button>
            </div>

            {/* <!-- Modal body --> */}
            <div class="modal-body __modal_body">
              <div className="d-flex __info mb-2">
                <img
                  src={
                    election?.business_details?.avatar ? election?.business_details?.avatar : 'images/cate-rest-ico.png'
                  }
                  className="img-fluid __sowner me-2 user-img"
                  alt=""
                />
                <div className="d-flex-flex-column">
                  <h3 className="text-uppercase __sname mb-0">{election?.business_name}</h3>

                  <div className="rating">
                    <ReactStars size={25} edit={false} activeColor="#FFD306" count={5} value={election?.ratings} />
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column __content1 __c1">
                <div className="w-100 d-flex" style={{ height: '260px', padding: '0 30px' }}>
                  <div style={{ height: '100%', width: '100%', marginRight: '5px' }}>
                    {election?.gift_images && (
                      <img
                        src={'data:image/png;base64,' + election?.gift_images[0].picture_base64}
                        className="img-fluid"
                        style={{ width: '300px', height: '250px' }}
                      />
                    )}
                  </div>
                  <div style={{ width: '70px', height: '60px' }}>
                    {election?.gift_images &&
                      election?.gift_images.map((item, i) => {
                        if (i > 0 && i <= 4) {
                          return (
                            <img
                              data={i}
                              src={'data:image/png;base64,' + item.picture_base64}
                              controls="controls"
                              className="carousel-video img-fluid mb-1 pe-auto"
                              style={{ height: '60px' }}
                            />
                          );
                        }
                      })}
                  </div>
                </div>
                {/* <img
                  src={
                    electionQR?.gift_images[0]?.picture
                      ? electionQR?.gift_images[0]?.picture
                      : "images/pdf-product-thumb.png"
                  }
                  alt=""
                  class="img-fluid"
                /> */}
                <div className="d-flex justify-content-between align-items-center my-2" style={{ padding: '0 30px' }}>
                  <p className="__title mb-0 pb-2">{election?.gift_title}</p>
                  <span style={{ 'font-size': '12px' }}>({election?.unique_number})</span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center my-2" style={{ padding: '0 30px' }}>
                <div className="d-flex align-items-center small">
                  <i className="fa fa-clock pe-2"></i>
                  <div className="ico-cont">
                    <img src={dollar} alt="" />{' '}
                    <span style={{ 'font-size': '12px' }}>
                      {election?.gift_value} {election?.currency}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center small">
                  <div className="ico-cont justify-content-end">
                    {election?.gift_delivery_option?.value == '1' ? (
                      <>
                        <img src="images/shipped-ico.svg" alt="" className="icon-size" />{' '}
                        <span style={{ 'font-size': '12px' }}>{t('election.Shipped')}</span>
                      </>
                    ) : election?.gift_delivery_option?.value == '2' ? (
                      <>
                        <img src={'images/mail-ico.svg'} alt="" />{' '}
                        <span style={{ 'font-size': '12px' }}>{t('election.On-line delivery')}</span>
                      </>
                    ) : (
                      <>
                        <img src="images/shop-line-ico.svg" alt="" className="icon-size" />{' '}
                        <span style={{ 'font-size': '12px' }}>{t('election.At the place')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-center __content __c1 pb-1">
                <h6 className="small">
                  <b>{election?.election_duration} </b>
                </h6>
                <h6 className="small">
                  <b>{election?.election_date} </b>
                </h6>
              </div>
              <div className="mt-3 d-flex flex-column justify-content-center align-items-center __content">
                <p className="text-center __scan">
                  {t('alerts.Scan the QR Code to collect lots of votes')}... <br />
                  ...{t('alerts.and win the gift')} !!!
                </p>
                {electionQR?.qr_image && <img src={'data:image/png;base64,' + electionQR?.qr_image} width={100} />}
              </div>
              <div className="mb-2">
                <img src="images/vf-pdf-logo.png" className="img-fluid __vflogo" width={80} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <p className="__print text-center">
            {t('election.Print and show the manifest in your place')}... <br />
            ... {t('election.people will come to your business place to scan it')}!
          </p>
          <button type="button" className="_btn _btn_yellow">
            {t('Buttons.Print')}
          </button>
          {window?.isNative ? (
            <button
              onClick={() => {
                if (window?.isNative) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({ downloadpdf: true, data: { election, electionQR } }),
                  );
                }
              }}
              className="_btn _btn_black"
            >
              {t('Buttons.Download')}
            </button>
          ) : (
            <PDFDownloadLink
              document={<PdfExportFormat election={election} electionQR={electionQR} />}
              fileName={`${election?.business_name}.pdf`}
              className="_btn _btn_black"
            >
              {({ blob, url, loading, error }) => (loading ? t('Buttons.Loading') : t('Buttons.Download'))}
            </PDFDownloadLink>
          )}

          {/* <ReactToPdf targetRef={ref} filename="ElectionQRScan.pdf">
            {({ toPdf }) => (
              <button
                onClick={() => {
                  if (window?.isNative) {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({ downloadpdf: true, data: { election, electionQR } }),
                    );
                  } else {
                    toPdf();
                  }
                }}
                className="_btn _btn_black"
              >
                {t('Buttons.Download')}
              </button>
            )}
          </ReactToPdf> */}
        </div>
      </div>
      {/* <!-- Modal Popup Ends here --> */}
    </div>
  );
}
