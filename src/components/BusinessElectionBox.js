import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import '../languages/i18n';

import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';
import useLongPress from '../components/business/LongPressButton';
import { useCopyElectionContext } from '../context/copyElectionContext';
const BusinessElectionBox = ({
  item,
  index,
  user,
  setLoader,
  type,
  setModalElection,
  setElectionDelList,
  electionDellist,
  trigger,
  electionlist,
  longPress,
  setLongPress,
  selectElection,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();

  const calculateTimeLeft = () => {
    let diffTime = Math.abs(new Date().valueOf() - new Date(`${item?.election_date_time}`).valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    [days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)];

    return days + 'd ' + hours + 'h ' + minutes + 'm ' + secs + 's';
  };
  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  useEffect(() => {
    if (item?.election_status == 'Ended' && trigger) {
      electionDellist?.push(item.election_id);

      setElectionDel(true);
    }

    // console.log("electionDellist check", electionDellist);
  }, [trigger]);

  function ElectionStart(Election_id) {
    console.log('user', user);
    var formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('election_id', Election_id);

    ApiCall('Post', API.electionstartApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        setError(true);
        seterror_title('Error!');
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);

        if (resp.data.success) {
          setError(true);
          seterror_title(resp.data.message);
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');
  const [electionDel, setElectionDel] = useState(false);
  const { setCopyElection } = useCopyElectionContext();

  const onLongPress = () => {
    setLongPress(true);
  };

  const onClick = () => {
    // console.log("click is triggered");
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 2000,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <div
      class="election-snippet"
      key={index}
      data-bs-toggle={`${type == 'modal' ? 'modal' : ''}`}
      data-bs-target={`${type == 'modal' ? '#lay7-modal' : ''}`}
      onClick={() => {
        if (type === 'modal') {
          setModalElection(item);
        } else if (selectElection) {
          setCopyElection({ election_id: item?.election_id });
          navigate('/newElection', { state: {} });
        } else {
          navigate('/electionDetails', {
            state: {
              election_id: item.election_id,
              election_date_time: item?.election_date_time,
            },
          });
        }
      }}
    >
      {item?.election_status == 'Not Started' ? (
        <div class="status">
          <img class="bg" src="images/not-start-bg-length.svg" alt="" />
          <span>{item?.election_status}</span>
        </div>
      ) : item?.election_status == 'Started' ? (
        <div class="status">
          <img class="bg" src="images/start-bg-length.svg" alt="" />
          <span class="dark">
            <img class="ico" src="images/vote-ico.svg" alt="ico" />
            {item?.election_status}
          </span>
        </div>
      ) : (
        <div class="status">
          <img class="bg" src="images/ended-bg-length.svg" alt="" />
          <span class="dark"> {item?.election_status}</span>
        </div>
      )}
      {item?.election_status == 'Ended' && (
        // item?.give_gift_status == "" &&
        // item?.feedback_status == "" &&
        <div class="radio-form">
          {longPress && (
            <div
              class="form-check"
              onClick={() => {
                setElectionDel(!electionDel);
                if (!electionDel) {
                  setElectionDelList([...electionDellist, item.election_id]);
                } else {
                  const result = electionDellist.filter((itemID) => itemID != item.election_id);
                  setElectionDelList(result);
                }
              }}
            >
              <input class="form-check-input" type="radio" checked={electionDel} />
            </div>
          )}
        </div>
      )}
      <div
        class="img-wrap"
        // onClick={() => {
        //   if (type === 'modal') {
        //     setModalElection(item);
        //   }
        // }}
      >
        <img
          class="img-fluid"
          src={item.gift_images[0] ? item.gift_images[0]?.picture : 'images/product-img.jpg'}
          alt="ico"
        />
      </div>
      <div class="cont" {...longPressEvent}>
        <h6 class="text-truncate">{item.gift_title}</h6>
        <p>
          <img class="ico" src="images/item-msg-ico.svg" alt="ico" />
          <span>{item.gift_delivery_option.option}</span>
        </p>
        <p>
          <img class="ico" src="images/item-people-ico.svg" alt="ico" />
          <span>
            {item.candidates_count} {t('election.Candidates')}
          </span>
        </p>
        <p>
          <img class="ico" src="images/item-finger-ico.svg" alt="ico" />
          <span>
            {item.votes_count} {t('election.Votes')}
          </span>
        </p>
        <p>
          <img class="ico" src="images/item-qr-code-ico.svg" alt="ico" />
          <span>123 {t('election.Visit at the place')}</span>
        </p>
        {item?.election_status != 'Ended' && (
          <p class={`btm-tag  ${item?.election_status == 'Started' && 'text-success'}`}>
            {item?.election_status == 'Not Started' ? t('election.Start in') : t('election.End in')}
            {timeLeft}
          </p>
        )}

        {/* {item?.election_status == 'Ended' && (
          <>
            {item?.give_gift_status == '' ? (
              <p class="btm-tag pt-0">
                <button class="btn btn-black">{t('Buttons.Give Gift')}</button>
              </p>
            ) : item?.feedback_status == '' ? (
              <p class="btm-tag pt-0">
                <button class="btn btn-black btn-gray">{t('Buttons.Feedback')}</button>
              </p>
            ) : (
              <p class="btm-tag pt-0">
                <button class="btn btn-yellow" onClick={() => ElectionStart(item?.election_id)}>
                  {t('Buttons.Start Again')}
                </button>
              </p>
            )}
          </>
        )} */}
      </div>
    </div>
  );
};

export default BusinessElectionBox;
