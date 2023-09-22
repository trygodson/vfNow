import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import TopHeader from '../../components/BusinessHeader';
import BusinessFooter from '../../components/BusinessFooter';
import Loader from '../../components/Loader';
import MessageBox from '../../components/MessageBox';
import ImageView from '../../components/ImageView';
import ProgressBar from '../../components/ProgressBar';
import { toPng } from 'html-to-image';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { getUserData } from '../../Functions/Functions';
import StarRatings from 'react-star-ratings';
import ReactStars from 'react-rating-stars-component';
import { Carousel } from 'react-responsive-carousel';
import ReactToPdf from 'react-to-pdf';
import { QrReader } from 'react-qr-reader';

import dollar from '../../images/dollar-ico.svg';
import { ShareView } from './ElectionShare';
import { useCopyElectionContext } from '../../context/copyElectionContext';
import CustomCircularProgressBar from '../../components/CircularProgressBar';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PdfExportFormat } from '../../components/ElectionPdf';
import { DoesNotExist } from '../../components/OfflineMsg';

export default function ElectionDetails() {
  const ref = useRef();
  const shareImageRef = useRef();
  const navigate = useNavigate();
  let { id } = useParams();
  const { t } = useTranslation();
  const [preview, setPreview] = useState();
  const [election, setElection] = useState();
  const [electionQR, setElectionQR] = useState();
  const [feedback, setFeedback] = useState();
  const [userfeedback, setUserFeedback] = useState();
  const [userfeedbackReply, setUserFeedbackReply] = useState();
  const [isUserFeedbackReply, SetisUserFeedbackReply] = useState();
  const [winner, setWinner] = useState();
  const [candidate, setCandidate] = useState();
  const [shareimage, setShareimage] = useState();
  const [giftAddress, setgiftAddress] = useState();
  const [isgiftOnlineAddress, issetgiftOnlineAddress] = useState(0);
  const [giftOnlineAddress, setgiftOnlineAddress] = useState();
  const [loader, setLoader] = useState(false);
  const [giftlinkemail, setGiftlink] = useState('');
  const [giftTrack, setGiftTrack] = useState('');
  const [chatmsgSend, setChatmsgSend] = useState('');
  const [ischatmsgSend, setIsChatmsgSend] = useState(true);
  const [scanShow, setscanShow] = useState(false);
  const [giftshow, setgiftshow] = useState(false);
  const [user, setUser] = useState();
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');
  const [isImageView, setIsImageView] = React.useState(false);
  const [imageView, setImageView] = React.useState(false);
  const [timeLeft, setTimeLeft] = useState();
  const calculateTimeLeft = (dd) => {
    let diffTime = Math.abs(new Date().valueOf() - new Date(`${dd}`).valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    [days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)];

    return days + 'd ' + hours + 'h ' + minutes + 'm ' + secs + 's';
  };

  const [selectedModalPicture, setSelectedModalPicture] = useState();
  const { setCopyElection } = useCopyElectionContext();

  useEffect(() => {
    if (election?.gift_images && election?.gift_images.length > 0) {
      setSelectedModalPicture(election.gift_images[0].picture_base64);
    }
    // if (election) {
    // }
  }, [election]);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setTimeLeft(calculateTimeLeft());
  //   }, 1000);
  // });

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      ElectionDetail(userData);
      ElectionQR(userData);
      BusinessGiftShippedAddressFtn(userData);
      feedbackApiFtn(userData);
    }
  }, []);

  function ElectionDetail(user) {
    var formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('business_id', user.business_id);
    formData.append('election_id', id);

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
        if (resp.data.success == false) {
          setError(true);
          setLoader(false);
          seterror_title(resp.data.message);
          navigate(-1);
        } else {
          setPreview(resp.data.data);
          setElection(resp.data.data.election_details);
          console.log(resp.data.data.election_details, 'election data');
          setTimeLeft(calculateTimeLeft(resp?.data?.data?.election_details?.election_date_time));
          setFeedback(resp.data.data.feedbacks);
          setWinner(resp.data.data.winner);
          setCandidate(resp.data.data.candidates);
          setLoader(false);

          // setTimeout(() => {
          //   shareImageToBase64();
          // }, 1200);
        }

        // alert(resp.data.message);
      });
  }

  function ElectionQR(user) {
    var formData = new FormData();

    formData.append('business_id', user.business_id);
    formData.append('election_id', id);

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
        // setLoader(false);
        if (resp.data.success) {
          setElectionQR(resp.data.data);
        } else {
          setError(true);
          // setLoader(false);
          seterror_title(resp.data.message);
        }
      });
  }
  function BusinessGiftShippedAddressFtn(user) {
    var formData = new FormData();
    console.log('id', id);
    setLoader(true);
    formData.append('election_id', id);

    ApiCall('Post', API.BusinessGiftShippedAddress, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // setLoader(false);

        if (resp.data.success) {
          setgiftAddress(resp.data.data);
        } else {
          // setError(true);
          // setLoader(false);
          // seterror_title(resp.data.message);
        }
        // alert(resp.data.message);
      });
  }

  function BusinessGiftShippedConfirmedFtn(user) {
    setLoader(true);
    var formData = new FormData();
    formData.append('election_id', id);
    // formData.append("election_id", 5);
    formData.append('shipment_company_link', giftAddress);
    formData.append('track_number', giftTrack);

    ApiCall('Post', API.BusinessGiftShippedConfirmed, formData, {
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

        if (resp.data.success) {
        } else {
          setError(true);
          setLoader(false);
          seterror_title(resp.data.message);
        }
        // setgiftAddress(resp.data.data);
        // alert(resp.data.message);
      });
  }

  function BusinessGiftOnlineFtn(user) {
    var formData = new FormData();
    setLoader(true);
    // formData.append("election_id", id);
    formData.append('election_id', 5);
    formData.append('online_gift_link', giftAddress);

    ApiCall('Post', API.BusinessGiftOnline, formData, {
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
        if (resp.data.success) {
        } else {
          setError(true);
          setLoader(false);
          seterror_title(resp.data.message);
        }
        // setgiftAddress(resp.data.data);
        // alert(resp.data.message);
      });
  }

  function feedbackApiFtn(user) {
    setLoader(true);
    var formData = new FormData();
    formData.append('election_id', id);
    formData.append('user_id', user.id);
    formData.append('business_id', user.business_id);

    ApiCall('Post', API.feedbackApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // setLoader(false);

        if (resp.data.success) {
          setUserFeedback(resp.data.data);
        } else {
          setError(true);
          // setLoader(false);
          seterror_title(resp.data.message);
        }
        // alert(resp.data.message);
      });
  }

  function Textftn() {
    return (
      <span class="info-text">
        {t('Scan_Screen.Scan QR-CODE to easily find your FRIENDS, BUSINESS PLACE or')}
        <br />
        {t('Scan_Screen.to receive VOTES AT THE BUSINESS PLACE')}!!!
      </span>
    );
  }

  function Closeftn() {
    return (
      <button class="btn btn-close-x p-0 mb-5" data-bs-dismiss="modal" onClick={() => setscanShow(false)}>
        <img class="img-fluid" src="images/close-x.svg" alt="ico" />
      </button>
    );
  }

  const Scanner = async (result, error) => {
    if (!!result) {
      ScanFtnAPi(result?.text);
      // setData(result?.text);
      if (JSON.parse(result?.text)?.type == 'user') {
        if (JSON.parse(result?.text)?.user_id == winner?.user_id) {
          setgiftshow(true);
          setscanShow(false);
        }
      }
      // if (JSON.parse(result?.text)?.type == "election") {
      //   // navigate("/electionDetails", {
      //   //   state: {
      //   //     election_id: JSON.parse(result?.text)?.election_id,
      //   //     election_date_time: JSON.parse(result?.text)?.election_date_time,
      //   //   },
      //   // });
      //   // setscanShow(false);
      //   // setgiftshow(false);
      //   // navigate(0);
      // }
      console.log('scan', JSON.parse(result?.text));
    }

    if (!!error) {
      console.info(error);
    }
  };

  function ScanFtnAPi(response) {
    console.log('erorr reponse helooooo');
    var formData = new FormData();
    setLoader(true);

    formData.append('qr_user_id', response?.user_id);
    formData.append('election_id', id);

    ApiCall('Post', API.SCANWinnerAPI, formData, {
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
        console.log('sucess reponse scan', resp.data);
      });
  }

  function replyFeedbackapiFtn(user, feedbackID) {
    setLoader(true);
    var formData = new FormData();
    // formData.append("election_id", id);
    formData.append('feedback_id', feedbackID);
    formData.append('business_id', user.business_id);
    formData.append('reply', userfeedbackReply);

    ApiCall('Post', API.replyFeedbackapi, formData, {
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
        if (resp.data.success) {
        } else {
          setError(true);
          setLoader(false);
          seterror_title(resp.data.message);
        }
      });
  }

  function userchatSendCandidateApiftn() {
    setLoader(true);
    var formData = new FormData();
    // formData.append("election_id", id);

    formData.append('message', chatmsgSend);
    formData.append('user_id', user.id);
    formData.append('election_id', id);

    ApiCall('Post', API.userchatSendCandidateApi, formData, {
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
        if (resp.data.success) {
          setChatmsgSend('');
        } else {
          setError(true);
          setLoader(false);
          seterror_title(resp.data.message);
        }
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

  return (
    <div className="container-fluid">
      {loader && <Loader />}
      <TopHeader title={t('Header.Election_Details')} />
      <>
        {isImageView && (
          <ImageView imageView={imageView} arrayItems={election?.gift_images} setIsImageView={setIsImageView} />
        )}

        <section className="content-sec row">
          {/* <!-- Product Wrap Starts here --> */}
          <div className="product-wrap item-snippet">
            <div className="row mt-3 mb-0">
              <div className="product-list">
                <div className="product-overflow">
                  <div className="prod-snip">
                    <div className="business-name">
                      <div className="logo-sec">
                        <img
                          className="img-fluid"
                          src={
                            election?.business_details?.avatar
                              ? election?.business_details?.avatar
                              : '/images/logo-dummy.png'
                          }
                          alt="logo"
                        />
                      </div>
                      <div className="cont-sec">
                        <h4 className="text-truncate text-uppercase">{election?.business_name}</h4>
                        <div className="rating-sec">
                          <div className="rating">
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
                    <div className="img-wrap">
                      {election?.election_status == 'Not Started' ? (
                        <div className="status end">
                          <img src="/images/not-started-bg.svg" alt="" />
                          {/* <img className="img-white" src={startyellow} alt="image" /> */}
                          <span className="text-white">{election?.election_status}</span>
                        </div>
                      ) : election?.election_status == 'Started' ? (
                        <div className="status start">
                          <img src="/images/yellow-start-bg.svg" alt="image" />
                          <span>
                            <img className="ico" src="/images/vote-ico.svg" alt="ico" />
                            {election?.election_status}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="status end">
                            <img className="img-white" src="/images/yellow-start-bg.svg" alt="image" />
                            <span>{election?.election_status}</span>
                          </div>
                        </>
                      )}

                      {/* <span className="img-count">
                      <img src={camera} alt="" />
                      {election?.gift_images?.length}
                    </span> */}
                      <div className="slide-thumb">
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
                                key={index}
                                className="carousel-height-election"
                                onClick={() => {
                                  setIsImageView(!isImageView);
                                  setImageView(index);
                                }}
                              >
                                <img
                                  className="img-fluid"
                                  src={item?.picture}
                                  alt="Thumbnail"
                                  style={{ width: '350px', objectPosition: '50% 0%', objectFit: 'cover' }}
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
                    </div>
                    <div className="cont">
                      <h4 className="text-truncate">{election?.gift_title}</h4>

                      <span className="full-desc">
                        <p>{election?.gift_description}</p>
                        <span>({election?.unique_number})</span>
                      </span>
                      <div className="d-flex w-100 pt-3">
                        <div className="ico-cont">
                          <img src={dollar} alt="" /> {election?.gift_value} {election?.currency}
                        </div>
                        <div className="ico-cont justify-content-end">
                          {election?.gift_delivery_option?.value == '1' ? (
                            <>
                              <img src="/images/shipped-ico.svg" alt="" className="icon-size" />
                              {t('election.Shipped')}
                            </>
                          ) : election?.gift_delivery_option?.value == '2' ? (
                            <>
                              <img src={'/images/mail-ico.svg'} alt="" />
                              {t('election.On-line delivery')}
                            </>
                          ) : (
                            <>
                              <img src="/images/shop-line-ico.svg" alt="" className="icon-size" />
                              {t('election.At the place')}
                            </>
                          )}
                        </div>
                      </div>
                      {election?.election_status == 'Not Started' && (
                        <div className="d-flex start py-2">
                          <p>
                            <strong>
                              {election?.election_status == 'Not Started'
                                ? t('election.Start in')
                                : t('election.End in')}
                            </strong>
                            {timeLeft}
                            <span>{election?.election_date}</span>
                          </p>
                          {/* <div className="ico-cont">
                          <img src={candidatepic} alt="ico" />
                          {election?.candidates_count + " "}
                          {t("election.Candidates")}
                        </div> */}
                        </div>
                      )}
                      {election?.election_status == 'Started' && (
                        <div className="d-flex start py-2">
                          <p className="text-danger">
                            <strong>{election?.election_duration}</strong>
                            <span>{election?.election_date}</span>
                          </p>
                          {/* <div className="ico-cont">
                          <img src={vote} alt="ico" /> {election?.votes_count}{" "}
                          {t("election.Votes")}
                        </div> */}
                        </div>
                      )}
                      {election?.election_status == 'Ended' && (
                        <div className="d-flex start py-2">
                          <p className="fw-bold">{t('businessPage.ENDED')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Product Wrap Ends here --> */}
          <div className="product-wrap mt-2 mb-3 zIndex">
            <div className=" mb-3">
              {/* <img className="ico" src="images/fun-ico.svg" alt="" />*/}
              <h3> {t('election.Election Performance')}</h3>
            </div>
            <div className="performance-sec candid-per">
              <img className="bg-perf" src="/images/performance-bg.png" alt="ico" />
              <div className="per-cont">
                <div className="cont-circle c1">
                  <CustomCircularProgressBar percentage={preview?.performance?.visit_at_shop_progress} />

                  {/* <img className="img-fluid" src="images/performance-circle.png" alt="" /> */}
                  <div className="cont">
                    <img className="ico opacity-25" src="/images/qr-ico-black.svg" alt="ico" />
                    <span className="count">{preview?.performance?.visit_at_shop}</span>
                    <p>
                      {t('election.VISIT AT')}
                      <br />
                      {t('election.THE SHOP')}
                    </p>
                  </div>
                  <img className="img-fluid tail-ico" src="/images/tail-ico.png" alt="ico" />
                </div>
                <div className="cont-circle c3">
                  {/* <img className="img-fluid" src="images/performance-circle-2.png" alt="" /> */}
                  <CustomCircularProgressBar percentage={preview?.performance?.election_favourite_progress} />
                  <div className="cont">
                    <img className="ico" src="/images/heart-ico.svg" alt="ico" />
                    <span className="count">{preview?.performance?.election_favourite}</span>
                    <p>
                      {t('election.ELECTION')}
                      <br />
                      {t('election.FAVOURITE')}
                    </p>
                  </div>
                  <img className="img-fluid tail-ico" src="/images/tail-ico-2.png" alt="ico" />
                </div>
                <div className="big-circle election-circle">
                  {/* <img className="img-fluid" src="images/performance-circle-big.png" alt="ico" /> */}
                  <CustomCircularProgressBar percentage={preview?.performance?.better_than} max={100} />
                  <div className="cont">
                    <img className="ico" src="/images/candidate-logo.png" alt="ico" />
                    <hr />
                    <img className="chart-img img-fluid" src="/images/bar-chat.png" alt="ico" />
                    <hr />
                    <span className="yellow">{t('businessPage.Better than')}</span>
                    <h5>{preview?.performance?.better_than} %</h5>
                    <span className="yellow">{t('businessPage.Of Shops')} </span>
                  </div>
                </div>
                <div className="cont-circle c4">
                  <CustomCircularProgressBar percentage={preview?.performance?.total_votes_progress} />

                  {/* <img className="img-fluid" src="images/performance-circle-3.png" alt="" /> */}
                  <div className="cont">
                    <img className="ico" src="/images/vote-btn-ico.png" alt="ico" />
                    <span className="count">{preview?.performance?.total_votes}</span>
                    <p>
                      {t('businessPage.TOTAL')}
                      <br />
                      {t('businessPage.VOTE')}
                    </p>
                  </div>
                  <img className="img-fluid tail-ico" src="/images/tail-ico-3.png" alt="ico" />
                </div>
                <div className="cont-circle c5">
                  <CustomCircularProgressBar percentage={preview?.performance?.total_candidates_progress} />

                  {/* <img className="img-fluid" src="images/performance-circle-4.png" alt="" /> */}
                  <div className="cont">
                    <img className="ico" src="/images/my-acc-ico.svg" alt="ico" />
                    <span className="count">{preview?.performance?.total_candidates}</span>
                    <p>
                      {t('businessPage.TOTAL')}
                      <br />
                      {t('businessPage.CANDIDATE')}
                    </p>
                  </div>
                  <img className="img-fluid tail-ico" src="/images/tail-ico-4.png" alt="ico" />
                </div>
              </div>
            </div>
            <div className="btn-clip-wrap my-4">
              {/* <button
              className="btn btn-yellow btn-clip "
              data-bs-toggle="modal"
              data-bs-target="#gift-free-2"
            >
              <span>Message 2</span>
              <img className="arrow" src="images/arrow-ico.svg" alt="ico" />
            </button> */}

              {/* <button
              className="btn btn-yellow btn-clip "
              data-bs-toggle="modal"
              data-bs-target="#gift-free-3"
            >
              <span>Message 3</span>
              <img className="arrow" src="images/arrow-ico.svg" alt="ico" />
            </button> */}

              <button
                className={`btn btn-yellow  btn-clip mt-0 ${election?.election_status == 'Ended' && 'btn-white'}`}
                disabled={election?.election_status == 'Ended' ? true : false}
                data-bs-toggle={'modal'}
                data-bs-target={'#share8-modal'}
              >
                <span>{t('Buttons.SHARE')}</span>
                <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
              </button>

              {election?.election_status == 'Not Started' ? (
                <button className="btn btn-yellow btn-clip btn-white mt-0">
                  <span>{t('Buttons.No message to reply')}</span>
                  <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                </button>
              ) : (
                <Link to={'/customers'} className="btn btn-yellow btn-clip mt-0">
                  <span>
                    {t('Buttons.REPLY to election message')}
                    <span className="chat-count">
                      <img className="img-fluid" src="/images/chat-ico.svg" alt="ico" />
                      <span>4</span>
                    </span>
                  </span>
                  <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                </Link>
              )}
              {election?.election_status === 'Not Started' ? (
                <button
                  className="btn btn-yellow btn-clip mt-0"
                  onClick={() => {
                    // setCopyElection({election_id: ''})
                    navigate('/newElection', { state: { isModify: true, election } });
                  }}
                >
                  <span>{t('Buttons.MODIFY ELECTION')}</span>
                  <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                </button>
              ) : (
                <button className="btn btn-yellow btn-clip btn-white mt-0">
                  <span>{t('Buttons.Election Started - modification not allowed')}</span>
                  <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                </button>
              )}
              {election?.election_status === 'Not Started' || election?.election_status == 'Started' ? (
                <button className="btn btn-yellow btn-clip btn-white mt-0">
                  <span>{t('Buttons.No gift to be given')}</span>
                  <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                </button>
              ) : (
                <div>
                  {election?.gift_delivery_option.option == 'On-line delivery' && (
                    <button
                      className="btn btn-yellow btn-clip mt-0"
                      data-bs-toggle="modal"
                      data-bs-target="#gift-free-3"
                    >
                      <span>{t('Buttons.GIVE FREE GIFT')}</span>
                      <span className="txt-ico">
                        <span className="me-2">
                          <img src="images/at-the-shop-ico.svg" alt="" />
                          {election?.gift_delivery_option.option}
                        </span>
                        <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                      </span>
                    </button>
                  )}
                  {election?.gift_delivery_option.option == 'Shipped' && (
                    <button
                      className="btn btn-yellow btn-clip mt-0"
                      data-bs-toggle="modal"
                      data-bs-target="#gift-free-2"
                    >
                      <span>{t('Buttons.GIVE FREE GIFT')}</span>
                      <span className="txt-ico">
                        <span className="me-2">
                          <img src="/images/at-the-shop-ico.svg" alt="" />
                          {election?.gift_delivery_option.option}
                        </span>
                        <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                      </span>
                    </button>
                  )}
                  {election?.gift_delivery_option.option == 'Self collection at the shop' && (
                    <button
                      className="btn btn-yellow btn-clip mt-0"
                      data-bs-toggle="modal"
                      data-bs-target="#gift-free-1"
                    >
                      <span>{t('Buttons.GIVE FREE GIFT')}</span>
                      <span className="txt-ico">
                        <span className="me-2">
                          <img src="/images/at-the-shop-ico.svg" alt="" />
                          {election?.gift_delivery_option.option}
                        </span>
                        <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                      </span>
                    </button>
                  )}
                </div>
              )}
              {feedback?.length > 0 ? (
                <button
                  className="btn btn-yellow btn-clip mt-0"
                  data-bs-toggle="modal"
                  data-bs-target="#messages-feed-10"
                >
                  <span>{t('Buttons.Reply to Feedback')}</span>
                  <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                </button>
              ) : (
                <button className="btn btn-yellow btn-clip btn-white mt-0">
                  <span>{t('Buttons.No feedback received yet')}</span>
                  <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                </button>
              )}

              <button
                className="btn btn-yellow btn-clip mt-0"
                onClick={() => {
                  setCopyElection({ election_id: election?.election_id });
                  navigate('/newElection', { state: {} });
                }}
              >
                <span>{t('Buttons.COPY ELECTION')}</span>
                <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
              </button>
            </div>
          </div>
          {winner?.user_id && winner && (
            <div className="winner-sec mt-minus-65">
              <img className="img-fluid top-light" src="/images/light-top.svg" alt="image" />
              <div className="winner-img">
                <img src={winner ? winner?.avatar : '/images/avatar-big-1.png'} alt="username" />
              </div>
              <div className="winner-badge">
                <div className="badge-cont">
                  <h6 className="px-5 text-truncate">{winner?.name}</h6>
                  <p>{t('election.The Winner')}</p>
                  <span className="win-place">01</span>
                </div>
                <img className="img-fluid" src="/mages/winner-badge.svg" alt="image" />
                <div className="btn-clip-wrap">
                  <button className="btn btn-yellow btn-clip mt-0">
                    <span>{t('Buttons.CONTACT WINNER')}</span>
                    <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {winner?.user_id == undefined && election?.election_status == 'Ended' && (
            <div className="row">
              <div className="col-12 alert-bubble">
                <img className="img-fluid" src="/images/alert-bubble.svg" alt="ico" />
                <div className="alert-cont">
                  <h5 className="mb-0"> {t('alerts.OPS!!!')}</h5>
                  <p className="mb-3">{t('alerts.There is no candidate in election')}</p>
                  <p>
                    {t('alerts.Try again with more attractive gift')} <br />
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* <!-- Candidate Wrap Starts here --> */}
          <div className="product-wrap zIndex">
            {candidate?.length > 0 && (
              <div className=" mb-3">
                {/* <img className="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t('election.Candidates')}</h3>
              </div>
            )}

            {candidate?.map((item, index) => {
              return election?.election_status != 'Not Started' ? (
                <div key={index} className="candidate-snippet w-100">
                  <div className="user-img">
                    <img src={item?.avatar ? item?.avatar : '/images/avatar-img-1.png'} alt="Name" />
                  </div>
                  <div className="avatar-cont">
                    <div className="ac-lft">
                      <h6 className="text-truncate">{item?.username}</h6>
                      <div className="vote-count">
                        <img src="/images/vote-ico.svg" alt="ico" /> {item?.votes_count}
                      </div>
                      <div className="vote-progress">
                        <ProgressBar position={item?.position} />
                      </div>
                    </div>
                    <button className="btn btn-empty mt-0">
                      <img className="img-fluid" src="/images/vote-button-active.svg" alt="ico" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="candidate-snippet w-100">
                  <div className="user-img">
                    <img src={item?.avatar ? item?.avatar : '/images/avatar-img-1.png'} alt="Name" />
                  </div>
                  <div className="avatar-cont">
                    <div className="ac-lft">
                      <h6 className="text-truncate">{item?.username}</h6>
                      <div className="vote-count">
                        <img src="/images/vote-ico.svg" alt="ico" />
                        {item?.votes_count}
                      </div>
                      <div className="vote-progress">
                        <img className="img-fluid" src="/images/progress-bar.svg" alt="ico" />
                      </div>
                    </div>
                    <button className="btn btn-empty mt-0">
                      <img className="img-fluid" src="/images/vote-btn-light.svg" alt="ico" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* <!-- Candidate Wrap Ends here --> */}
          <div className="btn-clip-wrap mt-4">
            <button
              className={`btn btn-yellow btn-clip ${election?.election_status == 'Ended' && 'btn-white'}`}
              disabled={election?.election_status == 'Ended' ? true : false}
              data-bs-toggle="modal"
              data-bs-target="#tc-modal"
            >
              <span>{t('Buttons.CONTACT ALL CANDIDATE')}</span>
              <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
            </button>
            <button
              className={`btn btn-yellow btn-clip mt-0 ${election?.election_status == 'Ended' && 'btn-white'}`}
              disabled={election?.election_status == 'Ended' ? true : false}
              data-bs-toggle="modal"
              data-bs-target="#pdfModal"
            >
              <span>{t('Buttons.ELECTION QR-CODE')}</span>
              <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
            </button>
          </div>
          <div className="btn-clip-wrap">
            <Link to={'/ElectionVoteHistory'} state={{ election_id: id }} className="btn btn-yellow btn-clip mt-0 ">
              <span>{t('Buttons.VOTE HISTORY')}</span>
              <img className="arrow" src="/images/arrow-ico.svg" alt="ico" />
            </Link>
          </div>
        </section>
        {/* <!-- Content Section Ends here -->
        <!-- Footer Starts here --> */}

        <BusinessFooter />
        <div className="modal bg-blur" id="tc-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {ischatmsgSend && (
                <div className="alert-bubble-img rect-pop mt-4">
                  <img className="img-fluid" src="/images/rectangle-popup-1.svg" alt="ico" />
                  <div className="cont">
                    <h6 className="text-center">{t('alerts.Hey')}!</h6>
                    <img className="finger-ico img-fluid mb-2" src="/images/alert-finger-ico.png" alt="ico" />
                    <p className="dark-txt mb-2">
                      {t('alerts.You are going to')} <strong>{t('alerts.write to all your candidate')}</strong>{' '}
                      {t('alerts.Please be professionale and respectfull')}
                    </p>
                    <p className="dark-txt mb-2">
                      <strong>{t('alerts.Are you sure to proceesd?')}</strong>
                    </p>
                    <p>
                      <button className="btn btn-black fs-12 py-1 px-5" onClick={() => setIsChatmsgSend(false)}>
                        {t('alerts.YES')}
                      </button>
                    </p>
                  </div>
                </div>
              )}

              <div className="bottom-input">
                <div className={`type-area ${ischatmsgSend ? 'opacity-25' : 'opacity-1'} `}>
                  <div className="type-inside">
                    <button className="btn btn-emoti">
                      <img src="/images/smilie-ico.svg" alt="ico" />
                    </button>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Say something..."
                      onChange={(text) => setChatmsgSend(text.target.value)}
                      value={chatmsgSend}
                      required
                      onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                          userchatSendCandidateApiftn();
                        }
                      }}
                    />
                  </div>
                </div>
                <button className="btn btn-close-x p-0">
                  <img className="img-fluid" src="/images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal py-5" id="pdfModal">
          <div ref={ref} className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollabl">
            <div className="modal-content rounded-0 position-relative">
              {/* <!-- Modal Header --> */}
              <div className="modal-">
                <img src="/images/pdf-top-img.png" className="img-fluid" alt="" />
                <button type="button" className="btn-close __close text-white" data-bs-dismiss="modal"></button>
              </div>

              {/* <!-- Modal body --> */}
              <div className="modal-body __modal_body">
                <div className="d-flex __info mb-2">
                  <img
                    src={
                      election?.business_details?.avatar
                        ? election?.business_details?.avatar
                        : '/images/cate-rest-ico.png'
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

                {/* <div className="d-flex flex-column __content __c1">
                <Carousel
                  preventMovementUntilSwipeScrollTolerance={true}
                  swipeScrollTolerance={50}
                  width={'100%'}
                  axis={'horizontal'}
                  showThumbs={false}
                  swipeable
                >
                  {election?.gift_images &&
                    election?.gift_images.map((item, i) => (
                      <div className="carousel-height-election" key={i}>
                        <img src={item.picture} controls="controls" className="carousel-video img-fluid" />
                      </div>
                    ))}

                  <div className="carousel-height">
                    <video
                      src={'http://techslides.com/demos/sample-videos/small.mp4'}
                      controls="controls"
                      className="carousel-video"
                    />
                  </div>
                </Carousel>

                <p className="__title mb-0 pb-2">{election?.gift_title}</p>
              </div> */}

                <div className="d-flex flex-column __content1 __c1">
                  <div className="w-100 d-flex" style={{ height: '260px', padding: '0 30px' }}>
                    <div style={{ height: '100%', width: '100%', marginRight: '5px' }}>
                      <img
                        src={'data:image/png;base64,' + selectedModalPicture}
                        className="img-fluid"
                        style={{ width: '300px', height: '250px' }}
                      />
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
                  {/* <Carousel
                  preventMovementUntilSwipeScrollTolerance={true}
                  swipeScrollTolerance={50}
                  width={'100%'}
                  axis={'horizontal'}
                  showThumbs={false}
                  swipeable
                >
                  {election?.gift_images &&
                    election?.gift_images.map((item, i) => (
                      <div className="carousel-height-election" key={i}>
                        <img src={item.picture} controls="controls" className="carousel-video img-fluid" />
                      </div>
                    ))}
                </Carousel> */}

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
                          <img src="/images/shipped-ico.svg" alt="" className="icon-size" />{' '}
                          <span style={{ 'font-size': '12px' }}>{t('election.Shipped')}</span>
                        </>
                      ) : election?.gift_delivery_option?.value == '2' ? (
                        <>
                          <img src={'/images/mail-ico.svg'} alt="" />{' '}
                          <span style={{ 'font-size': '12px' }}>{t('election.On-line delivery')}</span>
                        </>
                      ) : (
                        <>
                          <img src="/images/shop-line-ico.svg" alt="" className="icon-size" />{' '}
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
                  <img src="/images/vf-pdf-logo.png" className="img-fluid __vflogo" width={80} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-center">
            <p className="__print text-center">
              {t('election.Print and show the manifest in your place')}... <br />
              ... {t('election.people will come to your business place to scan it')}!
            </p>
            <button
              type="button"
              className="_btn _btn_yellow"
              onClick={() => {
                if (window?.isNative) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({ printpdf: true, data: { election, electionQR } }),
                  );
                }
              }}
            >
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

        <div className="modal bg-blur" id="gift-free-1">
          <div className="modal-dialog modal-dialog-centered" data-bs-dismiss="modal">
            <div className="modal-content">
              <div className="free-gift-info mt-4">
                <img className="finger-ico img-fluid mb-2 mt-3" src="/images/alert-finger-ico.png" alt="ico" />
                <h6 className="text-center text-danger">
                  {t('alerts.IMPORTANT')}
                  <br />
                  {t('alerts.Gift are free!!!')}
                </h6>
                <div className="edge-fade mt-4">
                  {t('alerts.This gift shall be given')}
                  <span>
                    <img src="/images/at-the-shop-ico.svg" alt="" />
                    {t('election.At the place')}
                  </span>
                </div>
                <hr className="divider" />
                <p className="fs-16">{t('election.WINNER can be recognized scanning his QR-Code')}</p>
                <p className="fs-16">
                  <strong>{t('election.Ask winner to show the QR-CODE')}</strong>
                </p>
              </div>
              <div className="bottom-input px-3">
                <button
                  className="btn btn-black mb-4 w-100 py-2"
                  data-bs-toggle="modal"
                  data-bs-target="#gift-scan"
                  onClick={() => setscanShow(true)}
                >
                  {t('election.SCAN QR-CODE')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal bg-blur" id="gift-scan">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="container-fluid scanner-qr-code p-0">
                {loader && <Loader />}
                {scanShow && (
                  <QrReader
                    constraints={{ facingMode: 'environment' }}
                    onResult={(result, error) => {
                      Scanner(result, error);
                      console.log('test');
                    }}
                    containerStyle={{ height: '100%' }}
                    videoStyle={{ height: 800 }}
                    ViewFinder={() => Closeftn()}
                  />
                )}

                {Textftn()}
              </div>
            </div>
          </div>
        </div>
        {giftshow && (
          <div
            className="modal bg-blur show"
            role="dialog"
            aria-hidden="true"
            style={{
              display: giftshow ? 'block' : 'none',
              backgroundColor: 'rgba(222, 223, 222 , 0.9)',
              marginTop: 60,
              transition: 'all 5s ease-in',
              height: 'auto',
            }}
          >
            {/* <div className="modal bg-blur" id="free-gift-received-1"> */}
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content minh-unset" data-bs-dismiss="modal" onClick={() => setgiftshow(false)}>
                <div className="gift-rib min-mt z9">
                  <a href="javascript:;" className="gift-ribbon-wrap">
                    <img className="img-fluid" src="/images/gift-ribbon.png" alt="images" />
                    <div className="gift-img">
                      <div className="img-wrap">
                        <img
                          src={election?.gift_images[0] ? election?.gift_images[0]?.picture : 'images/product-img.jpg'}
                          alt="ProductName"
                        />
                        <span className="img-count">
                          <img className="ico" src="/images/camera-ico.svg" alt="" />1
                        </span>
                      </div>
                      <span className="title text-truncate">{election?.gift_title}</span>
                      <span className="gift-title text-truncate text-center">{t('alerts.GIVE THE FREE GIFT')}</span>
                    </div>
                  </a>
                </div>
                <div className="winner-sec modal-pop">
                  <img className="img-fluid top-light" src="/images/light-top.svg" alt="image" />
                  <div className="winner-img">
                    <img src={winner?.avatar ? winner?.avatar : '/images/avatar-big-1.png'} alt="username" />
                  </div>
                  <div className="winner-badge">
                    <div className="badge-cont">
                      <h6 className="px-5 text-truncate">{winner?.name}</h6>
                      <p>{t('election.The Winner')}r</p>
                      <span className="win-place">01</span>
                    </div>
                    <img className="img-fluid" src="/images/winner-badge.svg" alt="image" />
                  </div>
                  <h6 className="confirm">{t('alerts.Confirm that you gave the gift')}</h6>
                  <div className="px-3 mt-4 mb-4 z9">
                    <button
                      className="btn btn-black w-100 mb-4"
                      data-bs-toggle="modal"
                      data-bs-target="#confirm-shipment"
                    >
                      <small>{t('user_register.CONFIRM')}</small>
                    </button>
                    <button className="btn btn-white w-100" data-bs-toggle="modal" data-bs-target="#messages-8">
                      <small>{t('user_register.WINNER REFUSED THE GIFT')}</small>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="modal bg-blur" id="confirm-shipment">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content minh-unset" data-bs-dismiss="modal">
              <div class="alert-bubble-img">
                <img class="img-fluid" src="/images/alert-msg-bubble.png" alt="ico" />
                <div class="cont">
                  <h5 class="dark mt-4"> {t('alerts.THANK YOU!!!')}</h5>
                  <p class="dark-txt fs-14">
                    {t('alerts.See you at the')} <br />
                    {t('alerts.next gift!!!')}
                  </p>

                  <p class="fs-14">{t('alerts.Remember to check the feedback')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Modal Popup Starts here --> */}
        <div class="modal bg-blur" id="messages-8">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content minh-unset" data-bs-dismiss="modal">
              <div class="alert-bubble-img min-mt">
                <img class="img-fluid" src="/images/alert-msg-bubble.png" alt="ico" />
                <div class="cont">
                  <h5>{t('alerts.OH NO')}!!!</h5>
                  <p class="dark-txt fs-14 mb-2">{t('alerts.This is not good! Please explain that gift is free')}</p>
                  <p class="fs-14">{t('alerts.Try again to give the gift')}...</p>
                </div>
              </div>
              <div class="button-btm-sec">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#messages-8"
                  class="btn btn-black text-uppercase w-100 mb-4"
                >
                  <small>{t('Buttons.TRY AGAIN')}</small>
                </button>
                <button
                  class="btn btn-white text-uppercase w-100 mb-4"
                  data-bs-toggle="modal"
                  data-bs-target="#messages-9"
                >
                  <small>{t('user_register.WINNER REFUSED THE GIFT')}</small>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
        <div class="modal bg-blur" id="messages-9">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content minh-unset" data-bs-dismiss="modal">
              <div class="alert-bubble-img">
                <img class="img-fluid" src="/images/alert-bubble-msg-height.png" alt="ico" />
                <div class="cont">
                  <h5>{t('alerts.THANK YOU!!!')}</h5>
                  <p class="dark-txt fs-14 mb-2">{t('alerts.For your trying')}!!!</p>
                  <p class="fs-14">
                    {t('alerts.Do not give up')} !!!
                    <br />
                    {t('alerts.Try to improve description and pictures and put it back')}
                    ...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
        <div class="modal bg-blur" id="messages-10">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content minh-unset" data-bs-dismiss="modal">
              <div class="alert-bubble-img mt-3">
                <img class="img-fluid" src="/images/alert-msg-bubble.png" alt="ico" />
                <div class="cont">
                  <h5 class="mt-2">{t('alerts.OPS!!!')}</h5>
                  <p class="dark-txt fs-14 mb-2">{t('alerts.Something went wrong')}</p>
                  <p class="fs-14 mb-2">{t('alerts.Seems that is not the winner')}...</p>
                  <p class="dark-txt fs-14">{t('alerts.Try again')}</p>
                </div>
              </div>
              <div class="px-3 mt-4">
                <button class="btn btn-black w-100 my-3 py-2">
                  <small>{t('Buttons.TRY AGAIN')}</small>
                </button>
                <button class="btn btn-black w-100 my-3 py-2">
                  <small>{t('Buttons.ADD AS FRIEND')}</small>
                </button>
                <button class="btn btn-white w-100 mt-3 mb-4 py-2">
                  <small>{t('Buttons.CONTANCT FOR ASSISTANCE')}</small>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal bg-blur" id="gift-free-2">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="free-gift-info mt-4">
                <img class="finger-ico img-fluid mb-2 mt-3" src="/images/alert-finger-ico.png" alt="ico" />
                <h6 class="text-center text-danger">
                  {t('alerts.IMPORTANT')}
                  <br />
                  {t('alerts.Gift are free!!!')}
                </h6>
                <div class="edge-fade mt-4">
                  {t('alerts.This gift shall be given')}
                  <span>
                    <img src="/images/ship-ico-big.svg" alt="" />
                    {t('election.Shipped')}
                  </span>
                </div>
                <hr class="divider mb-2" />
                <div class="ship-address mb-4">
                  <h6>{t('alerts.GIFT SHALL BE SHIPPED TO')}:</h6>
                  {giftAddress ? (
                    <>
                      <p>{giftAddress?.ship_to}</p>
                      <p>{giftAddress?.city}</p>
                      <p>{giftAddress?.street_address}</p>
                      <p>{giftAddress?.zip_code}</p>
                      <p>{giftAddress?.number}</p>
                    </>
                  ) : (
                    <p>{t('alerts.Ask user to add adress')}</p>
                  )}
                </div>
                <p class="fs-16 mb-2">{t('alerts.Please confirm gift has been shipped')}.</p>
                <p class="fs-16">
                  <strong>{t('alerts.Add track reference and confirm')}</strong>
                </p>
                <form action="#" class="register-form mb-4">
                  <div class="form-group bg p-0 mb-2">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Add shipping company"
                      onChange={(text) => setGiftlink(text.target.value)}
                      required
                    />
                  </div>
                  <div class="form-group bg p-0">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Add track number"
                      onChange={(text) => setGiftTrack(text.target.value)}
                      required
                    />
                  </div>
                </form>
                <button
                  class="btn btn-black mt-3 mb-4 w-100 py-2"
                  data-bs-toggle="modal"
                  data-bs-target="#confirm-shipment"
                  onClick={() => BusinessGiftShippedConfirmedFtn(user)}
                >
                  {t('Buttons.CONFIRM SHIPMENT')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal bg-blur" id="gift-free-3">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="free-gift-info mt-4">
                <img class="finger-ico img-fluid mb-2 mt-3" src="/images/alert-finger-ico.png" alt="ico" />
                <h6 class="text-center text-danger">
                  {t('alerts.IMPORTANT')}
                  <br />
                  {t('alerts.Gift are free!!!')}
                </h6>
                <div class="edge-fade mt-4">
                  {t('alerts.This gift shall be given')}
                  <span>
                    <img src="/images/ship-msg-ico-big.svg" alt="" />
                    {t('filter.On-line delivery')}
                  </span>
                </div>
                <hr class="divider mb-4" />
                <p class="fs-16 mb-2">{t('alerts.Please confirm gift has been shipped')}.</p>
                <p class="fs-16">
                  <strong>{t('alerts.Add track reference and confirm')}</strong>
                </p>
                <form action="#" class="register-form mb-4 mt-4">
                  <div class="form-group text-start px-4">
                    <div class="form-check mb-2 d-inline-block w-100">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="ship-opt"
                        checked={isgiftOnlineAddress == 0 ? true : false}
                        onChange={() => {
                          issetgiftOnlineAddress(0);
                        }}
                      />
                      <label class="form-check-label" for="ship-opt1">
                        {t('alerts.Send gift by email')}
                      </label>
                    </div>
                    <div class="form-check mb-2 d-inline-block w-100">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="ship-opt"
                        checked={isgiftOnlineAddress == 1 ? true : false}
                        onChange={() => {
                          issetgiftOnlineAddress(1);
                        }}
                      />
                      <label class="form-check-label" for="ship-opt2">
                        {t('alerts.Provide link for downloading')}
                      </label>
                    </div>
                  </div>
                  <div class="form-group bg p-0 mt-4">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Paste link here..."
                      onChange={(text) => setgiftOnlineAddress(text.target.value)}
                      required
                    />
                  </div>
                </form>
                <button
                  class="btn btn-black mt-3 mb-4 w-100 py-2"
                  data-bs-toggle="modal"
                  data-bs-target="#confirm-shipment"
                  onClick={() => BusinessGiftOnlineFtn(user)}
                >
                  {t('Buttons.CONFIRM SHIPMENT')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal bg-blur" id="messages-feed-10">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="product-wrap px-3 mt-3x zIndex">
                <div class=" mb-3">
                  {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                  <h3>{t('Header.feedback')}</h3>
                </div>
                <div class="feedback-wrap">
                  {userfeedback?.feedbacks?.map((item, index) => {
                    return (
                      <div class="f-row" key={index}>
                        <div class="fr-head">
                          <div class="avatar">
                            <img src={item.avatar ? item.avatar : '/images/avatar-big-1.png'} alt="username" />
                          </div>
                          <div class="avatar-detail">
                            <h6>{item.username}</h6>
                            <div class="rating-sec">
                              {item.ratings}
                              <div class="rating">
                                <StarRatings
                                  rating={item.ratings}
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

                        <p class="cont">{item.review}</p>
                      </div>
                    );
                  })}

                  <div class="f-row mb-0">
                    <div class="fr-head">
                      <div class="avatar">
                        <img
                          src={userfeedback?.avatar ? userfeedback?.avatar : '/images/logo-dummy.png'}
                          alt="username"
                        />
                      </div>
                      <div class="avatar-detail">
                        <h6>{userfeedback?.business_name}</h6>
                        <a href="javascript:;" class="reply">
                          {t('Buttons.Reply')}
                        </a>
                      </div>
                    </div>
                    <p class="cont text-yellow">{userfeedbackReply ? userfeedbackReply : '...say something nice'}</p>
                  </div>
                </div>
              </div>
              <div class="bottom-input">
                {!isUserFeedbackReply && (
                  <>
                    <div class="type-area">
                      <div class="type-inside">
                        <button class="btn btn-emoti">
                          <img src="/images/smilie-ico.svg" alt="ico" />
                        </button>
                        <input
                          type="text"
                          class="form-control"
                          placeholder={t('placeHolders.Say something')}
                          onChange={(text) => setUserFeedbackReply(text.target.value)}
                          required
                          onKeyDown={(e) => {
                            if (e.code === 'Enter') {
                              SetisUserFeedbackReply(true);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <button class="btn btn-close-x p-0">
                      <img class="img-fluid" src="/images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
                    </button>
                  </>
                )}

                {isUserFeedbackReply && (
                  <>
                    <div class="free-gift-info mt-2">
                      <img class="finger-ico img-fluid mb-2 mt-3" src="/images/alert-finger-ico.png" alt="ico" />
                      <h6 class="text-center text-danger"> {t('alerts.IMPORTANT')}</h6>
                      <p class="fs-14 text-danger">
                        {t(
                          'alerts.Please make sure your feedback is not offensive and correct. Once confirmed, it will not be possible to modify it.',
                        )}
                      </p>
                    </div>
                    <div class="bottom-input px-4">
                      <button
                        class="btn btn-black w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#messages-13"
                        onClick={() => replyFeedbackapiFtn(user, userfeedback?.feedbacks[0].feedback_id)}
                      >
                        <small> {t('user_register.Confirm Feedback')}</small>
                      </button>
                      <button class="btn btn-close-x p-0">
                        <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div class="modal bg-blur" id="messages-13">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content minh-unset" data-bs-dismiss="modal">
              <div class="alert-bubble-img">
                <img class="img-fluid" src="/images/alert-msg-bubble.png" alt="ico" />
                <div class="cont">
                  <h5>{t('alerts.THANK YOU!!!')}</h5>
                  <p class="dark-txt fs-14 mb-2">
                    {t('alerts.See you at the')} <br />
                    {t('alerts.next gift!!!')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {error && <MessageBox error={error} setError={setError} title={error_title} />}
      </>

      <div class="modal bg-blur" id="share8-modal">
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
                        election?.gift_images[0]?.picture
                          ? election?.gift_images[0]?.picture
                          : '/images/product-img.jpg'
                      }
                      alt="ico"
                    />
                    <div class="business-logo">
                      <img
                        src={
                          election?.business_details?.avatar
                            ? election?.business_details?.avatar
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
              modalElection={election}
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
