import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Footer from '../../components/Footer';
import TopHeader from '../../components/TopHeader';
import Loader, { CustomModal } from '../../components/Loader';
import GeneralElection from '../../components/GeneralElection';

import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import StarRatings from 'react-star-ratings';
import { getUserData } from '../../Functions/Functions';

export default function UserFeedBackGiven() {
  const location = useLocation();
  const { t } = useTranslation();

  const [userProfile, setUserProfile] = useState();
  const [elections, setElection] = useState();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [loader, setLoader] = useState(false);
  const [businessID, setBusinesID] = useState('');
  const [electionID, setElectionID] = useState('');
  const [user, setUser] = useState();
  const [feedback, setFeedback] = useState(false);
  const [confirmFDBModal, setConfirmFDBModal] = useState(false);

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      GetUsergiftData(userData);
    }
  }, []);

  function GetUsergiftData(user) {
    var formData = new FormData();

    formData.append('user_id', location.state.user_id);
    ApiCall('Post', API.userFeedback, formData, {
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
        setUserProfile(resp.data.data);
        setElection(resp.data.data.my_feedbacks);
      });
  }

  function ConfirmFeedback() {
    setLoader(true);
    var formData = new FormData();

    formData.append('election_id', electionID.election_id);
    formData.append('user_id', location.state.user_id);
    formData.append('business_id', businessID.business_id);
    formData.append('ratings', rating);
    formData.append('review', review);

    ApiCall('Post', API.addFeedbackGift, formData, {
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
        // alert(resp.data.message);
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t('Header.My Feedback to be Given')} />

      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        <div class="col-12 general-filter">
          <button class="btn">
            {t('filter.ORGANIZE')}
            <img src="images/organize-ico.svg" alt="ico" />
          </button>
          <button class="btn">
            {t('filter.FILTER')}
            <img src="images/filter-gray-ico.svg" alt="ico" />
          </button>
        </div>
        <div class="winner-sec mb-minus-max">
          <img class="img-fluid top-light" src="images/light-top.svg" alt="image" />
          <div class="winner-img">
            <img src={userProfile?.avatar} alt="username" />
          </div>
          <div class="winner-badge">
            <div class="badge-cont">
              <h6 class="px-5 text-truncate">{userProfile?.username}</h6>
              <p>{t('election.The Winner')}</p>
              <span class="win-place">01</span>
            </div>
            <img class="img-fluid" src="images/winner-badge.svg" alt="image" />
          </div>
        </div>
        {/* <!-- This Gift Section Starts here --> */}
        <div class="product-wrap item-snippet">
          <div class="row mt-4 pt-3">
            <div class="col-12">
              <div class=" mb-4">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t('user_register.MY FEEDBACK')}</h3>
              </div>
            </div>
            {elections?.map((election, index) => {
              return (
                <GeneralElection
                  items={election}
                  indexs={index}
                  user={user && user}
                  loader={loader}
                  setLoader={setLoader}
                  bottom="userfeedback"
                  setBusinesID={setBusinesID}
                  setElectionID={setElectionID}
                />
              );
            })}
          </div>
        </div>
        <Footer user={user && user} />
        {loader && <Loader />}
        {/* <!-- This Gift Section Ends here --> */}
      </section>
      <CustomModal topClassName="minh-unset p-4" showClose={false} open={feedback} setOpen={setFeedback}>
        <div class="feedback-pop">
          <div class="fdb-bubble">
            <img class="img-fluid" src="images/feedback-bubble.png" alt="image" />
            <p>
              {t('user_register.You are giving a feedback to')}
              <br />
              {electionID?.business_name}
            </p>
          </div>
          <h4>{t('user_register.Are you happy about your gift?')}</h4>
          <div class="star-row">
            <StarRatings
              rating={rating}
              starRatedColor="#FFD306"
              changeRating={setRating}
              numberOfStars={5}
              name="rating"
              starDimension="20px"
              starSpacing="2px"
            />
          </div>
          <h6> {t('user_register.Give your stars')}</h6>
          <div class="mb-4">
            <div class="comment">
              <textarea
                name="feedback"
                placeholder={`Say something about ${electionID?.business_name}`}
                onChange={(text) => setReview(text.target.value)}
                required
              />
            </div>
          </div>
          <button
            class="btn btn-black w-100 py-2 mt-3"
            // data-bs-toggle="modal"
            // data-bs-target="#confirm-fdb-modal"
            onClick={() => {
              setFeedback(false);
              setConfirmFDBModal(true);
              ConfirmFeedback();
            }}
          >
            {t('user_register.Confirm Feedback')}
          </button>
        </div>
      </CustomModal>

      <CustomModal topClassName="minh-unset" showClose={true} open={confirmFDBModal} setOpen={setConfirmFDBModal}>
        <div class="alert-bubble-img">
          <img class="img-fluid" src="images/alert-msg-bubble.png" alt="ico" />
          <div class="cont mt-2">
            <h5 class="dark mt-4">{t('alerts.Thanks!!!')}</h5>
            <p class="dark-txt fs-14">
              {t('alerts.See you at the')} <br />
              {t('alerts.next gift!!!')}
            </p>
          </div>
        </div>
      </CustomModal>
      {/* <!-- Content Section Ends here --> */}
    </div>
  );
}
