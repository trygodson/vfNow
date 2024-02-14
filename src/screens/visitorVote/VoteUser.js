import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { storeUserData, getUserData } from '../../Functions/Functions';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import TopHeader from '../../components/TopHeader';
import Footer from '../../components/Footer';
import Loader, { CustomModal } from '../../components/Loader';
import GeneralElection from '../../components/GeneralElection';

import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import StarRatings from 'react-star-ratings';

export default function GiveVote() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [elections, setElection] = useState();
  const [vote, setVote] = useState();
  console.log('location?.state', location?.state);

  const [users, setUsers] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUsers(userData);
      setLoader(true);
      VisitorVoteUser(userData);
    }
  }, []);

  function VisitorVoteUser(users) {
    var formData = new FormData();

    formData.append('user_id', location.state?.user_id);
    formData.append('logged_user_id', users.id);

    ApiCall('Post', API.VisitorVoteUserApi, formData, {
      Authorization: `Bearer ` + users?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        setElection(resp.data.data.elections);
        setVote(resp.data.data);
        console.log('userVOTEEEE View', resp.data.data);
      });
  }
  const [votedModal, setVotedModal] = useState(false);
  const [alreadyVotedModal, setAlreadyVotedModal] = useState(false);
  return (
    <div class="container-fluid">
      <TopHeader title={t(vote?.username)} />
      {loader && <Loader />}
      <section class="content-sec row">
        <div class="vote-sec elect-sec px-0">
          <img class="w-100 img-fluid" src="images/grunge-gray-bg.png" alt="ico" />
          <div class="avatar-img">
            <img src={vote?.avatar ? vote?.avatar : 'images/avatar-big-1.png'} alt="img" />
          </div>
          <div class="elect-cont">
            <img class="img-fluid" src="images/elect-bubble.png" alt="ico" />
            <div class="cont">
              <h5 class="vote-user">{vote?.username}</h5>
              <span>
                <img class="img-fluid" src="images/grid-elect-ico.svg" alt="ico" />
                {t('Footer.Election') + ' '}
                <small className="p-1"> {' ' + t('election.as') + ' '} </small>
                {t('election.Candidates')}
                <strong className="p-1">{vote?.election_as_candidate}</strong>
              </span>
            </div>
          </div>
        </div>
        <div class="col-12 mb-3">
          <button
            class="btn btn-black w-100 py-2"
            onClick={() =>
              navigate('/UserChat', {
                state: {
                  chatUser: vote,
                },
              })
            }
          >
            <img class="img-fluid me-2" src="images/message-ico.svg" alt="ico" />
            <small>{t('Buttons.Send a message')}</small>
          </button>
        </div>
        <div class="product-wrap item-snippet mt-5">
          <div class=" mb-3">
            {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
            <h3>
              {t('election.Vote')} {vote?.username}
            </h3>
          </div>
          <div class="row">
            {elections?.map((item, index) => {
              return (
                <GeneralElection
                  items={item}
                  indexs={index}
                  user={users && users}
                  loader={loader}
                  setLoader={setLoader}
                />
              );
            })}
          </div>
        </div>
      </section>

      <CustomModal topClassName="minh-unset" showClose={true} open={votedModal} setOpen={setVotedModal}>
        <div class="alert-bubble-img">
          <img class="img-fluid" src="./images/alert-msg-bubble.png" alt="ico" />
          <div class="cont">
            <h5>{t('alerts.VOTED')}</h5>
            <p>
              {t('alerts.LOG-IN to give more than 1 vote per time')}
              !!!
            </p>
          </div>
        </div>
        <div class="button-btm-sec">
          <Link to={'/login'} class="btn btn-yellow text-uppercase w-100">
            {t('Buttons.Sign-up')}
          </Link>
          <Link
            to={'/GiveVoteRank'}
            // state={{
            //   candidate_id: user?.candidate_id,
            //   election_id: user?.election_id,
            // }}
            class="text-link"
          >
            {t('Buttons.Continue as Visitor')}
          </Link>
          {/* <a href="javascript:;" class="text-link">
                Continue as Visitor
              </a> */}
        </div>
      </CustomModal>
      {/* <div class="modal bg-blur" id="voted-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content " >
          </div>
        </div>
      </div> */}

      <div class="modal bg-blur" id="already-voted-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
            <div class="alert-bubble-img">
              <img class="img-fluid" src="images/alert-msg-bubble.png" alt="ico" />
              <div class="cont">
                <h5> {t('alerts.OPS!!!')}</h5>
                <p>{t('alerts.You already voted. Please wait a bit more to vote again')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer user={users && users} />
    </div>
  );
}
