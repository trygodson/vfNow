import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import TopHeader from '../../components/BusinessHeader';
import BusinessFooter from '../../components/BusinessFooter';
import Loader from '../../components/Loader';
import BusinessElectionBox from '../../components/BusinessElectionBox';
import MessageBox from '../../components/MessageBox';

import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { getUserData } from '../../Functions/Functions';
import { useCopyElectionContext } from '../../context/copyElectionContext';

export default function SelectElection() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t, i18n } = useTranslation();
  const [electionlist, setElectionList] = useState([]);
  const [electionDellist, setElectionDelList] = useState([]);
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(false);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [longPress, setLongPress] = useState(false);

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      CategoryList(userData);
    }
  }, []);

  function CategoryList(user) {
    console.log('user', user);
    var formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('business_id', user.business_id);

    ApiCall('Post', API.ElectionListApi, formData, {
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
        console.log('Election list', resp.data);
        setElectionList(resp.data.data);
        if (resp.data.success) {
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }
  // console.log(electionDellist.toString(), "electionDellist.toString()");
  function ElectionDelete(election_ids) {
    console.log('user', user);
    var formData = new FormData();

    formData.append('election_ids', election_ids);

    ApiCall('Post', API.electionDeleteApi, formData, {
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
        console.log('Election list', resp.data);

        if (resp.data.success) {
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  return (
    <div class="container-fluid">
      {loader && <Loader />}
      <TopHeader title={t('Select Election')} />
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        {/* <!-- This Election Section Starts here --> */}
        <div class="product-wrap">
          <div class="row mt-2 pt-3">

              <div class="col-12">
                <div class=" mb-3">
                  {/* <img class="ico" src="images/fun-ico.svg" alt="ico" />*/}
                  <h3> {t('election.Select Election to copy')}</h3>
                </div>
              </div>
        
            <div class="col-12">
              {electionlist?.not_started?.map((item, index) => {
                return (
                  <BusinessElectionBox
                    item={item}
                    index={index}
                    setLoader={setLoader}
                    user={user}
                    selectElection={true}
                  />
                );
              })}
            </div>
          </div>
        </div>
        {electionlist?.started?.length > 0 && (
          <div class="product-wrap">
            <div class="row mt-2 pt-3">
              <div class="col-12">
                <div class=" mb-3">
                  {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                  <h3>{t('election.Election STARTED')}</h3>
                </div>
              </div>
              <div class="col-12">
                {electionlist?.started?.map((item, index) => {
                  return (
                    <BusinessElectionBox
                      item={item}
                      index={index}
                      setLoader={setLoader}
                      user={user}
                      selectElection={true}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {electionlist?.ended?.length > 0 && (
          <div class="product-wrap">
            <div class="row mt-2 pt-3">
              <div class="col-12">
                <div class=" mb-3">
                  {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                  <h3>{t('election.Election END')}</h3>
                </div>
              </div>
              <div class="col-12">
                {electionlist?.ended?.map((item, index) => {
                  return (
                    <BusinessElectionBox
                      item={item}
                      index={index}
                      setLoader={setLoader}
                      user={user}
                      electionlist={electionlist}
                      setElectionDelList={setElectionDelList}
                      electionDellist={electionDellist}
                      trigger={trigger}
                      longPress={longPress}
                      setLongPress={setLongPress}
                      selectElection={true}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {!state?.selectElection && electionlist?.ended?.length > 0 && longPress && (
          <div class="btn-dual">
            <button
              class="btn"
              onClick={() => {
                setTrigger(!trigger);
                // console.log("trigger", trigger);
              }}
            >
              {t('Buttons.SELECT ALL')}
            </button>
            <button class="btn" onClick={() => ElectionDelete(electionDellist.toString())}>
              {t('Buttons.DELETE SELECTED')}
            </button>
          </div>
        )}
      </section>

      <BusinessFooter />
    </div>
  );
}
