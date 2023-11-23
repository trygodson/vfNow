import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import '../languages/i18n';
import { Carousel } from 'react-responsive-carousel';

import MessageBox from '../components/MessageBox';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';

const ElectionBox = ({ item, index, user, setLoader, HomeFtn, mapClick, mapClickftn }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const calculateTimeLeft = () => {
    let diffTime = Math.abs(new Date().valueOf() - new Date(`${item.election_date_time}`).valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    [days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)];

    return days + 'd ' + hours + 'h ' + minutes + 'm ' + secs + 's';
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [ageLimit, setAgeLimit] = useState(false);
  const [ageLimitDiv, setAgeLimitDiv] = useState(item.age_limitation == 0 ? false : true);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const [days, setDays] = React.useState();
  const [hours, setHours] = React.useState();

  useEffect(() => {
    let diffTime = Math.abs(new Date().valueOf() - new Date(`${item.election_date_time}`).valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    setDays(days);
    setHours(hours);
  }, []);

  function UserFavElectionAdd(electionId, status, item) {
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
        console.log('erorr reponse', error);
        setLoader(false);
      })
      .then((resp) => {
        setLoader(false);
        if (resp.data.success) {
          item.favourite = status;
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
        // HomeFtn();
      });
  }

  function AddElectionCandidate(electionId, item) {
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
      })
      .then((resp) => {
        setLoader(false);
        if (resp.data.success) {
          item.join_status = true;
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
        // HomeFtn();
      });
  }

  return (
    <div class="prod-snip" key={index}>
      <div
        class="img-wrap"
        onClick={() => {
          if (mapClick) {
            console.log('mappppp');
            mapClickftn();
          } else {
            if (!ageLimitDiv) {
              navigate('/electionDetail', {
                state: {
                  electionStatus: item?.election_status,
                  election: item,
                  election_date_time: item?.election_date_time,
                },
              });
            }
          }
        }}
      >
        <div class={`${item?.election_status == 'Not Started' ? 'status' : 'status start'}`}>
          <img
            src={item?.election_status == 'Not Started' ? 'images/not-started-bg.svg' : 'images/yellow-start-bg.svg'}
            alt=""
          />
          <span>{item?.election_status}</span>
        </div>
        {/* <span class="img-count">
          <img src={"images/camera-ico.svg"} alt="" />
          {item?.gift_images?.length}
        </span> */}

        <div className="plus18-container">
          <Carousel
            showArrows={false}
            showThumbs={false}
            showStatus={false}
            preventMovementUntilSwipeScrollTolerance={true}
            // swipeScrollTolerance={50}
          >
            {item?.gift_images?.map((item, index) => {
              return (
                <div key={index} className="carousel-height">
                  <img class="img-fluid" src={item?.picture} alt="Thumbnail" />
                </div>
              );
            })}
            {item?.video != '' && (
              <div className="carousel-height">
                <video src={item?.video} controls="controls" className="carousel-video" />
              </div>
            )}
          </Carousel>
          {ageLimitDiv && (
            <>
              {ageLimit ? (
                <div classname="plus18-image">
                  <p class="plus18-text ">
                    {t('election.Are you really more than 18 years old')} ???
                    <div className="plus18-button">
                      <button
                        className="bg-transparent border-0"
                        onClick={() => {
                          setAgeLimitDiv(false);
                        }}
                      >
                        <p>{t('placeHolders.radio_yes')}</p>
                      </button>
                      <button
                        className="bg-transparent border-0"
                        onClick={() => {
                          setAgeLimit(false);
                        }}
                      >
                        <p> {t('placeHolders.radio_no')}</p>
                      </button>
                    </div>
                  </p>
                </div>
              ) : (
                <img
                  onClick={() => {
                    setAgeLimit(true);
                  }}
                  class="img-fluid plus18-image"
                  src={'images/18+btn.svg'}
                  alt="Thumbnail"
                />
              )}
            </>
          )}
        </div>
      </div>
      <div class="cont">
        <h4 class="text-truncate">{item?.gift_title}</h4>
        <div
          class="d-flex w-100"
          onClick={() =>
            navigate('/electionDetail', {
              state: {
                electionStatus: item?.election_status,
                election: item,
                election_date_time: item?.election_date_time,
              },
            })
          }
        >
          <div class="ico-cont">
            <img src={'images/dollar-ico.svg'} alt="" /> {item?.gift_value} {item?.currency}
          </div>
          <div class="ico-cont justify-content-end">
            {item?.gift_delivery_option?.value == '1' ? (
              <>
                <img src="images/shipped-ico.svg" className="icon-size" alt="" />
                {t('election.Shipped')}
              </>
            ) : item?.gift_delivery_option?.value == '2' ? (
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
        <div
          class="btm-row"
          onClick={() =>
            navigate('/electionDetail', {
              state: {
                electionStatus: item?.election_status,
                election: item,
                election_date_time: item?.election_date_time,
              },
            })
          }
        >
          <span
            class={`${
              item?.election_status == 'Not Started' || item?.election_status == 'Ended'
                ? ''
                : item?.election_status == 'Started' && parseInt(days) == 0 && parseInt(hours) <= 12
                ? 'text-danger'
                : 'text-success'
            }`}
          >
            <strong>{item?.election_status == 'Not Started' ? t('election.Start in') : t('election.End in')}</strong>
            {timeLeft}
          </span>

          <div class="ico-cont justify-content-end">
            {item?.election_status == 'Not Started' ? (
              <>
                <img src={'./images/candidate-ico.svg'} alt="ico" />
                <span>
                  {item?.candidates_count == '' ? '0' : item?.candidates_count} {t('election.Candidates')}
                </span>
              </>
            ) : (
              <>
                <img src="./images/vote-ico.svg" alt="ico" />{' '}
                <span>
                  {item?.votes_count == '' ? '0' : item?.votes_count} {t('election.Votes')}
                </span>
              </>
            )}
          </div>
        </div>
        <div class="btm-sec">
          {item.join_status == false ? (
            user?.login_as == 'visitor' ? (
              <button data-bs-toggle="modal" data-bs-target="#login-message" class="bg-transparent border-0 link">
                <img class="img-fluid text-uppercase me-2" src="./images/join-candidate-ico.svg" alt="ico" />
                {t('Buttons.Join as Candidate')}
              </button>
            ) : (
              <button onClick={() => AddElectionCandidate(item.election_id, item)} class="bg-transparent border-0 link">
                <img src="./images/join-candidate-ico.svg" alt="ico" />
                <span>
                  {t('election.Join')}
                  <small> {t('election.as')} </small>
                  {t('election.Candidates')}
                </span>
              </button>
            )
          ) : (
            <button class="bg-transparent border-0 link">
              <img src="./images/join-candidate-ico.svg" alt="ico" />
              <span>{t('election.JOINED')}</span>
            </button>
          )}

          <button
            class={`link bg-transparent border-0 ${item.favourite == true ? 'yellow-ellipse' : ''}`}
            onClick={() => UserFavElectionAdd(item.election_id, item?.favourite ? 0 : 1, item)}
          >
            <img class="img-fluid" src="./images/heart-ico.svg" alt="" />
            <span>{t('election.Favourite')}</span>
          </button>
          {item.join_status == false ? (
            <a class="link inactive">
              <img src="./images/announce-ico.svg" alt="ico" />
              <span>{t('election.Ask for Vote')}</span>
            </a>
          ) : (
            <Link
              to="/AskForVote"
              state={{
                user_id: user?.user_id,
                election_id: item.election_id,
              }}
              class="btn btn-empty p-0"
            >
              <img class="img-fluid" src="images/ask-for-vote-rect.svg" alt="ico" />
            </Link>
          )}
        </div>
      </div>
      {error && <MessageBox error={error} setError={setError} title={error_title} />}
    </div>
  );
};

export default ElectionBox;
