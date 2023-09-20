import React, { useEffect, useState } from 'react';

import { useNavigate, useLocation, Link } from 'react-router-dom';
import TopHeader from '../components/TopHeader';
import Loader from '../components/Loader';
import Footer from '../components/Footer';
import GeneralBusiness from '../components/GeneralBusiness';
import ImageView from '../components/ImageView';
import ProgressBar from '../components/ProgressBar';
import RemoveCandidate from '../components/modal/RemoveCandidate';

import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';

import fun from '../images/fun-ico.svg';
import logo from '../images/logo-dummy.png';
import avatarbig from '../images/avatar-big-1.png';
import vote from '../images/vote-ico.svg';
import camera from '../images/camera-ico.svg';
import dollar from '../images/dollar-ico.svg';
import jc from '../images/join-candidate-ico.svg';
import fav from '../images/favorite-ico.svg';
import anounce from '../images/announce-ico.svg';
import winnerbadge from '../images/winner-badge.svg';

import top from '../images/light-top.svg';

import candidatepic from '../images/candidate-ico.svg';

import { useTranslation } from 'react-i18next';
import '../languages/i18n';
import StarRatings from 'react-star-ratings';
import { getUserData } from '../Functions/Functions';
import { Carousel } from 'react-responsive-carousel';

export default function BusinessPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);

  const [request, setRequest] = useState(false);
  const [preview, setPreview] = useState();
  const [election, setElection] = useState();
  const [feedback, setFeedback] = useState();
  const [winner, setWinner] = useState();
  const [candidate, setCandidate] = useState();
  const [candidateUser, setCandidateUser] = useState();
  const [isImageView, setIsImageView] = React.useState(false);
  const [imageView, setImageView] = React.useState(false);

  const [user, setUser] = useState();
  const [timeLeft, setTimeLeft] = useState();
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');

  const calculateTimeLeft = () => {
    let diffTime = Math.abs(new Date().valueOf() - new Date(`${location?.state?.election_date_time}`).valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    [days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)];

    return days + 'd ' + hours + 'h ' + minutes + 'm ' + secs + 's';
  };
  useEffect(() => {
    if (location?.state?.election_date_time) {
      setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
    }
  });

  const [days, setDays] = React.useState();
  const [hours, setHours] = React.useState();

  useEffect(() => {
    let diffTime = Math.abs(new Date().valueOf() - new Date(`${location?.state?.election_date_time}`).valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    setDays(days);
    setHours(hours);
  }, []);

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      setLoader(true);
      ElectionDetail(userData);
    }
  }, []);

  function ElectionDetail(user) {
    var formData = new FormData();
    formData.append('user_id', user?.user_id);
    formData.append(
      'business_id',
      location.state.election?.business_id
        ? location.state.election?.business_id
        : location.state.election?.business_details.business_id,
    );
    formData.append('election_id', location.state.election.election_id);

    ApiCall('Post', API.electiondetailhApi, formData, {
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
        console.log('election', resp.data.data);
        setPreview(resp.data.data);
        setElection(resp.data.data.election_details);
        setFeedback(resp.data.data.feedbacks);
        setWinner(resp.data.data.winner);
        setCandidate(resp.data.data.candidates);
        resp.data.data.candidates.map((item) => {
          if (item.candidate_id == user?.user_id) {
            setCandidateUser(item);
          }
        });
        // alert(resp.data.message);
      });
  }

  function EndedElectionRestart() {
    var formData = new FormData();
    setLoader(true);

    formData.append('election_id', location.state.election.election_id);

    ApiCall('Post', API.electionEndedRequestApi, formData, {
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

        console.log('EndedElectionRestart', resp);
      });
  }

  function UserFavElectionAdd(electionId, status) {
    var formData = new FormData();
    setLoader(true);
    formData.append('user_id', user?.user_id);
    formData.append('election_id', electionId);
    formData.append('status', status);
    ApiCall('Post', API.AddfavElectionApi, formData, {
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

        console.log('setUserProfile View', resp.data.data);
        ElectionDetail(user);
      });
  }

  function AddElectionCandidate(electionId) {
    var formData = new FormData();
    setLoader(true);
    formData.append('user_id', user?.user_id);
    formData.append('election_id', electionId);

    ApiCall('Post', API.AddElectionCandidateApi, formData, {
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

        // console.log("join election", resp.data.data);
        ElectionDetail(user);
      });
  }

  function removeElectionCandidateApiFtn() {
    var formData = new FormData();
    setLoader(true);
    formData.append('user_id', user?.user_id);
    formData.append('election_id', location.state.election.election_id);

    ApiCall('Post', API.removeElectionCandidateApi, formData, {
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
        // console.log("userFavADD View", resp.data.data);

        ElectionDetail(user);
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t('Header.Election_Details')} />
      {loader && <Loader />}
      {error && <RemoveCandidate error={error} setError={setError} ftn={() => removeElectionCandidateApiFtn()} />}
      {isImageView && (
        <ImageView imageView={imageView} arrayItems={election?.gift_images} setIsImageView={setIsImageView} />
      )}
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        <div class="product-wrap item-snippet">
          <div class="row mt-3 mb-0">
            <div class="product-list">
              <div class="product-overflow">
                <div class="prod-snip">
                  <div class="business-name">
                    <div
                      class="logo-sec p-0"
                      onClick={() => {
                        navigate('/businessDetail', {
                          state: {
                            business: election?.business_details,
                          },
                        });
                      }}
                    >
                      <img
                        class="img-fluid"
                        src={election?.business_details?.avatar ? election?.business_details?.avatar : logo}
                        alt="logo"
                      />
                    </div>
                    <div class="cont-sec">
                      <h4 class="text-truncate text-uppercase">{election?.business_name}</h4>
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
                    {election?.election_status == 'Not Started' ? (
                      <div class="status end">
                        <img src="images/not-started-bg.svg" alt="" />
                        {/* <img class="img-white" src={startyellow} alt="image" /> */}
                        <span className="text-white">{election?.election_status}</span>
                      </div>
                    ) : election?.election_status == 'Started' ? (
                      <div class="status start">
                        <img src="images/yellow-start-bg.svg" alt="image" />
                        <span>
                          <img class="ico" src="images/vote-ico.svg" alt="ico" />
                          {election?.election_status}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div class="status end">
                          <img class="img-white" src="images/yellow-start-bg.svg" alt="image" />
                          <span>{election?.election_status}</span>
                        </div>
                      </>
                    )}

                    {/* <span class="img-count">
                      <img src={camera} alt="" />
                      {election?.gift_images?.length}
                    </span> */}
                    <div class="slide-thumb">
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
                              <img class="img-fluid" src={item?.picture} alt="Thumbnail" />
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
                  <div class="cont">
                    <h4 class="text-truncate">{election?.gift_title}</h4>
                    <p class="cont">{election?.gift_description}</p>
                    <span class="full-desc">
                      <p></p>
                      <span>({election?.unique_number})</span>
                    </span>
                    <div class="d-flex w-100 pt-3">
                      <div class="ico-cont text-uppercase">
                        <img src={dollar} alt="" /> {election?.gift_value} {election?.currency}
                      </div>
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
                    {election?.election_status == 'Not Started' && (
                      <div class="d-flex start py-2">
                        <p>
                          <strong>{election?.election_status == 'Not Started' ? 'Start in ' : 'End in '}</strong>
                          {timeLeft}
                          <span>{election?.election_date}</span>
                        </p>
                        <div class="ico-cont">
                          <img src={candidatepic} alt="ico" />
                          {election?.candidates_count}
                          {' ' + t('election.Candidates')}
                        </div>
                      </div>
                    )}
                    {election?.election_status == 'Started' && (
                      <div class="d-flex start py-2">
                        <p
                          class={`${
                            election?.election_status == 'Not Started' || election?.election_status == 'Ended'
                              ? ''
                              : election?.election_status == 'Started' && parseInt(days) == 0 && parseInt(hours) <= 12
                              ? 'text-danger'
                              : 'text-success'
                          }`}
                        >
                          <strong>{election?.election_status == 'Not Started' ? 'Start in ' : 'End in '}</strong>
                          {timeLeft}
                          <span>{election?.election_date}</span>
                        </p>
                        <div class="ico-cont">
                          <img src={vote} alt="ico" className="icon-size" /> {election?.votes_count}{' '}
                          {t('election.Votes')}
                        </div>
                      </div>
                    )}
                    {election?.election_status == 'Ended' && (
                      <div class="d-flex start py-2">
                        <p className="fw-bold">{t('businessPage.ENDED')}</p>
                        <div class="ico-cont">
                          <img src={vote} alt="ico" /> {election?.votes_count} {t('election.Votes')}
                        </div>
                      </div>
                    )}

                    {election?.election_status == 'Ended' ? (
                      <div class="btm-sec">
                        <a href="javascript:;" class="link inactive">
                          <img src={jc} alt="ico" />
                          <span>
                            {t('election.Join')}
                            <small> {t('election.as')} </small>
                            {t('election.Candidates')}
                          </span>
                        </a>
                        <a href="javascript:;" class="link inactive">
                          <img src={fav} alt="ico" />
                          <span>{t('election.Favourite')}</span>
                        </a>
                        <a href="javascript:;" class="link inactive">
                          <img src={anounce} alt="ico" />
                          <span>{t('election.Ask for Vote')}</span>
                        </a>
                      </div>
                    ) : (
                      <>
                        {election?.join_status == false ? (
                          <div class="btm-sec">
                            {election?.join_status == false ? (
                              user?.login_as == 'visitor' ? (
                                <button
                                  data-bs-toggle="modal"
                                  data-bs-target="#login-message"
                                  class="bg-transparent border-0 link"
                                >
                                  <img src="images/join-candidate-ico.svg" alt="ico" />
                                  <span>
                                    {t('election.Join')}
                                    <small> {t('election.as')} </small>
                                    {t('election.Candidates')}
                                  </span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    AddElectionCandidate(election?.election_id);
                                  }}
                                  class="bg-transparent border-0 link"
                                >
                                  <img src="images/join-candidate-ico.svg" alt="ico" />
                                  <span>
                                    {t('election.Join')}
                                    <small> {t('election.as')} </small>
                                    {t('election.Candidates')}
                                  </span>
                                </button>
                              )
                            ) : (
                              <button class="bg-transparent border-0 link">
                                <img src="images/join-candidate-ico.svg" alt="ico" />
                                <span>{t('election.JOINED')}</span>
                              </button>
                            )}

                            <button
                              class={`link bg-transparent border-0 ${
                                election?.favourite == true ? 'yellow-ellipse' : ''
                              }`}
                              onClick={() => UserFavElectionAdd(election?.election_id, election?.favourite ? 0 : 1)}
                            >
                              <img class="img-fluid" src="images/heart-ico.svg" alt="" />
                              <span>{t('election.Favourite')}</span>
                            </button>
                            {election?.join_status == false ? (
                              <a class="link inactive">
                                <img src="images/announce-ico.svg" alt="ico" />
                                <span>{t('election.Ask for Vote')}</span>
                              </a>
                            ) : (
                              <Link
                                to="/AskForVote"
                                state={{
                                  user_id: user?.user_id,
                                  election_id: election?.election_id,
                                }}
                                class="btn btn-empty p-0"
                              >
                                <img class="img-fluid" src="images/ask-for-vote-vertical.svg" alt="ico" />
                              </Link>
                            )}
                          </div>
                        ) : (
                          <div class="btm-sec">
                            <div class="candidate-snippet w-100 pr-0 pt-1 m-0 pl-2">
                              <div
                                class="user-img"
                                onClick={() => {
                                  navigate('/VoteUser', {
                                    state: {
                                      user_id: candidateUser?.candidate_id,
                                    },
                                  });
                                }}
                              >
                                <img src={user?.picture ? user?.picture : 'images/avatar-img-1.png'} alt="Name" />
                              </div>
                              <div class="avatar-cont">
                                <div class="ac-lft">
                                  <div class="vote-count " style={{ paddingBottom: 13 }}>
                                    <img src="images/vote-ico.svg" alt="ico" />
                                    {candidateUser?.votes_count}
                                  </div>
                                  <div className="mt-2">
                                    <ProgressBar
                                      position={candidateUser?.position}
                                      remaining={
                                        candidate &&
                                        parseInt(candidate[0]?.votes_count) - parseInt(candidateUser?.votes_count)
                                      }
                                      style={true}
                                    />
                                  </div>
                                </div>
                                <Link
                                  to="/AskForVote"
                                  state={{
                                    user_id: user?.user_id,
                                    election_id: election?.election_id,
                                  }}
                                  class="btn btn-empty"
                                >
                                  <img class="img-fluid" src="images/ask-for-vote-rect.svg" alt="ico" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {election?.join_status == true && (
          <div class="col-12 justify-content-center mt-4 mb-5">
            <Link
              to={'/UserVoteHistory'}
              state={{
                election_id: location.state.election.election_id,
                status: candidateUser?.position,
              }}
              class={`btn btn-black w-100 text-uppercase`}
            >
              <small> {t('Buttons.MY VOTES')}</small>
            </Link>
          </div>
        )}
        {/* <!-- Winner Section Starts here --> */}
        {winner?.user_id && election?.election_status == 'Ended' && (
          <div class="winner-sec">
            <img class="img-fluid top-light" src={top} alt="image" />
            <div class="winner-img">
              <img src={winner?.avatar ? winner?.avatar : avatarbig} alt="username" />
            </div>
            <div class="winner-badge">
              <div class="badge-cont">
                <h6>{winner?.name}</h6>
                <p>{t('election.The Winner')}</p>
              </div>
              <img class="img-fluid" src={winnerbadge} alt="image" />
            </div>
          </div>
        )}
        {winner?.user_id == undefined && election?.election_status == 'Ended' && (
          <div class="row">
            <div class="col-12 alert-bubble">
              <img class="img-fluid" src="images/alert-bubble.svg" alt="ico" />
              <div class="alert-cont">
                {request ? (
                  <>
                    <h5 class="mb-0"> {t('alerts.Hi!')}</h5>
                    <p class="mb-3">{t('alerts.Your request has been sent')}</p>
                  </>
                ) : (
                  <>
                    <h5 class="mb-0"> {t('alerts.OPS!!!')}</h5>
                    <p class="mb-3">{t('alerts.You lost the chance to win this gift')}</p>
                    <p>
                      {t('alerts.Ask to restart again to win')} <br />
                    </p>
                  </>
                )}
              </div>
            </div>
            {!request && (
              <div class="col my-3">
                <button
                  onClick={() => {
                    setRequest(true);
                    EndedElectionRestart();
                  }}
                  class="btn btn-yellow w-100 text-uppercase"
                >
                  {t('Buttons.Ask to Restart Again!!!')}
                </button>
              </div>
            )}
          </div>
        )}
        {/* <!-- Winner Section Ends here -->
            <!-- Feedback Section Starts here --> */}
        {/* {feedback.length > 0 && ( */}
        {election?.election_status == 'Ended' && (
          <div class="product-wrap z9 mb-4">
            <div class=" mb-3">
              {/* <img class="ico" src={fun} alt="" /> */}
              <h3>{t('election.Feedback')}</h3>
            </div>
            <div class="feedback-wrap">
              {feedback?.length > 0 ? (
                feedback?.map((item, index) => {
                  return (
                    <div key={index} class="f-row">
                      <div class="fr-head">
                        <div class="avatar">
                          <img src={item.avatar ? item.avatar : avatarbig} alt="username" />
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
                })
              ) : (
                <p class="cont">{'No FeedBack yet'}</p>
              )}
            </div>
          </div>
        )}
        {/* <!-- Feedback Section Ends here -->
            <!-- Candidate Wrap Starts here --> */}
        <div class="product-wrap">
          {candidate?.length > 0 && (
            <div class=" mb-3">
              {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
              <h3>{t('election.Candidates')}</h3>
            </div>
          )}

          {candidate?.map((item, index) => {
            return election?.election_status != 'Not Started' ? (
              <div key={index} class="candidate-snippet w-100">
                <div
                  class="user-img"
                  onClick={() => {
                    navigate('/VoteUser', {
                      state: {
                        user_id: item?.candidate_id,
                      },
                    });
                  }}
                >
                  <img src={item?.avatar ? item?.avatar : 'images/avatar-img-1.png'} alt="Name" />
                </div>
                <div class="avatar-cont">
                  <div class="ac-lft">
                    <h6 class="text-truncate text-uppercase">{item?.username}</h6>
                    <div class="vote-count">
                      <img src="images/vote-ico.svg" alt="ico" /> {item?.votes_count}
                    </div>
                    <ProgressBar
                      position={item.position}
                      remaining={parseInt(candidate[0]?.votes_count) - parseInt(item?.votes_count)}
                    />

                    {/*
                    Code for progress bar manually done without picture
                    <div class="vote-progress">
                      <div class="progress-container" data-percentage="90">
                        <div
                          class="progress"
                          style={{ width: "20%", width: "30%" }}
                        >
                          <img src="images/progress-bar-fill.svg" />
                        </div>
                        <div class="percentage">10</div>
                        <p class="percentage-text">123</p>
                        <div class="percentage-grey">01</div>
                      </div>
                    </div> */}
                  </div>
                  {election?.election_status == 'Ended' ? (
                    <button class="btn btn-empty">
                      <img class="img-fluid" src="images/vote-btn-light.svg" alt="ico" />
                    </button>
                  ) : user?.user_id == item.candidate_id ? (
                    <Link
                      to="/AskForVote"
                      state={{
                        user_id: user?.user_id,
                        election_id: election?.election_id,
                      }}
                      class="btn btn-empty"
                    >
                      <img class="img-fluid" src="images/ask-for-vote-vertical.svg" alt="ico" />
                    </Link>
                  ) : (
                    <Link
                      to={'/GiveVote'}
                      state={{
                        candidate: item,
                        election: election,
                        business: preview,
                      }}
                      class="btn btn-empty"
                    >
                      <img class="img-fluid" src="images/vote-button-active.svg" alt="ico" />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div key={index} class="candidate-snippet w-100">
                <div class="user-img">
                  <img src={item?.avatar ? item?.avatar : 'images/avatar-img-1.png'} alt="Name" />
                </div>
                <div class="avatar-cont">
                  <div class="ac-lft">
                    <h6 class="text-truncate">{item?.username}</h6>
                    <div class="vote-count">
                      <img src="images/vote-ico.svg" alt="ico" />
                      {item?.votes_count}
                    </div>
                    <div class="vote-progress">
                      <img class="img-fluid" src="images/progress-bar.svg" alt="ico" />
                    </div>
                  </div>
                  {user?.user_id == item.candidate_id ? (
                    <Link
                      to="/AskForVote"
                      state={{
                        user_id: user?.user_id,
                        election_id: election?.election_id,
                      }}
                      class="btn btn-empty"
                    >
                      <img class="img-fluid" src="images/ask-for-vote-vertical.svg" alt="ico" />
                    </Link>
                  ) : (
                    <button class="btn btn-empty">
                      <img class="img-fluid" src="images/vote-btn-light.svg" alt="ico" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* <!-- Candidate Wrap Ends here -->
            <!-- Join Candidate Button Starts here --> */}

        <div class="col-12 justify-content-center mt-4 mb-5">
          {election?.join_status == true && election?.election_status != 'Ended' ? (
            <button
              class="btn btn-white with-ico-btn w-100 py-2 my-5"
              onClick={
                () => setError(true)
                // removeElectionCandidateApiFtn()
              }
            >
              <img class="img-fluid text-uppercase me-2" src="images/remove-candidate-ico.svg" alt="ico" />
              <span class="opacity-50">{t('Buttons.REMOVE CANDIDATE')}</span>
            </button>
          ) : (
            <>
              {election?.election_status == 'Not Started' ||
                (election?.election_status == 'Started' &&
                  (user?.login_as == 'visitor' ? (
                    <button data-bs-toggle="modal" data-bs-target="#login-message" class="btn btn-yellow w-100">
                      <img class="img-fluid text-uppercase me-2" src="images/join-candidate-ico.svg" alt="ico" />
                      {t('Buttons.Join as Candidate')}
                    </button>
                  ) : (
                    <button
                      class="btn btn-yellow w-100"
                      onClick={() => {
                        AddElectionCandidate(election?.election_id);
                      }}
                    >
                      <img class="img-fluid text-uppercase me-2" src="images/join-candidate-ico.svg" alt="ico" />
                      {t('Buttons.Join as Candidate')}
                    </button>
                  )))}
            </>
          )}
          {election?.election_status == 'Ended' && (
            <button
              onClick={() => {
                navigate('/businessDetail', {
                  state: {
                    business: preview?.business_details,
                    request: true,
                  },
                });
              }}
              class="btn btn-yellow w-100 text-uppercase"
            >
              {t('Buttons.Ask again this gift')}
            </button>
          )}
        </div>

        {/* <!-- This Gift Section Starts here --> */}
        <div class="product-wrap item-snippet full-view-img">
          <div class=" mb-3">
            {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
            <h3>{t('election.This is a gift from')}</h3>
          </div>
          {preview && <GeneralBusiness preview={preview} location={location} user={user} setLoader={setLoader} />}
        </div>
        {/* <!-- This Gift Section Ends here --> */}
      </section>
      <div class="modal reg-modal bg-blur" id="login-message">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="alert-bubble-img">
              <img class="img-fluid" src="images/alert-msg-bubble.png" alt="ico" />
              <div class="cont py-3">
                <h5>
                  {t('alerts.Hi!')} <br />
                  {t('alerts.you are still visitor')}
                </h5>
                <h5 class="dark">{t('alerts.Click to log-in!!!')}</h5>
              </div>
            </div>
            <div class="button-btm-sec">
              <Link class="btn btn-yellow text-uppercase w-100" to={'/login'}>
                {t('Buttons.Log-in')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Content Section Ends here --> */}
      {/* <!-- Footer Starts here --> */}
      <Footer user={user && user} />
      {/* <!-- Footer Ends here --> */}
    </div>
  );
}
