import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import TopHeader from '../components/TopHeader';
import Loader, { CustomModal } from '../components/Loader';
import Footer from '../components/Footer';
import MessageBox from '../components/MessageBox';
import GeneralBusiness from '../components/GeneralBusiness';
import GeneralElection from '../components/GeneralElection';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';
import alertbubble from '../images/alert-bubble.svg';
import { getUserData } from '../Functions/Functions';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';

export default function BusinessDetailVisitorPreview() {
  let { id: business_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [viewport, setViewport] = React.useState({
    latitude: 30.3753,
    longitude: 69.3451,
    zoom: 5,
  });
  const [preview, setPreview] = useState();
  const [businessDetail, setBusinessDetail] = useState();
  const [elections, setElections] = useState();
  const [placeImages, setPlacesImages] = useState();
  const [hours, setHours] = useState();
  const [user, setUser] = useState();
  const [request, setRequest] = useState(location?.state?.request ? true : false);

  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
      setLoader(true);
      PreviewBusiness(userData);
    }
  }, []);
  function PreviewBusiness(user) {
    var formData = new FormData();
    formData.append('user_id', user?.user_id);
    // formData.append(
    //   'business_id',
    //   location.state?.business_id ? location.state?.business_id : location.state.business.business_id,
    // );
    formData.append('business_id', business_id);
    formData.append('logged_user_id', user?.user_id);

    ApiCall('Post', API.businessPreviewApi, formData, {
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
        if (resp.data.success) {
          console.log(resp.data.data, 'business details');
          setPreview(resp.data.data);
          setBusinessDetail(resp.data.data.business_details);
          setElections(resp.data.data.elections);
          setPlacesImages(resp.data.data.business_place_images);
          setHours(resp.data.data.business_working_hours);
          setViewport({
            latitude: parseFloat(resp.data.data.business_details.latitude),
            longitude: parseFloat(resp.data.data.business_details.longitude),
            zoom: 5,
          });
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
        // console.log("previewresp", resp.data.data);
      });
  }
  function BusinessrequestElectionftn() {
    var formData = new FormData();
    formData.append('user_id', user?.user_id);
    formData.append(
      'business_id',
      location.state?.business_id ? location.state?.business_id : location.state.business.business_id,
    );

    ApiCall('Post', API.BusinessrequestElection, formData, {
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

        // console.log("previewresp", resp.data.data);
      });
  }
  const [loginModal, setLoginModal] = useState(false);

  return (
    <div class="container-fluid">
      <TopHeader title={t('Header.business_detail')} />
      {loader && <Loader />}
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        {/* <!-- This Gift Section Starts here --> */}
        {preview && <GeneralBusiness preview={preview} location={location} user={user} setLoader={setLoader} />}

        {elections?.length == 0 && request == false && (
          <div class="row">
            <div class="col-12 alert-bubble">
              <img class="img-fluid" src={alertbubble} alt="icon" />
              <div class="alert-cont">
                <h5 class="mb-0"> {t('alerts.OPS!!!')}</h5>
                <p class="mb-3">{t('alerts.There is not elections')}</p>
                <p>
                  {t('alerts.Ask to add')} <br />
                  {t('alerts.something!!!')}
                </p>
              </div>
            </div>
            <div class="col my-3">
              <button
                onClick={() => {
                  setRequest(true);
                  BusinessrequestElectionftn();
                }}
                class="btn btn-yellow w-100 text-uppercase"
              >
                {t('Buttons.Ask to Add Something!!!')}
              </button>
            </div>
          </div>
        )}

        <div class="product-wrap item-snippet">
          <div class="row mt-3 mb-0">
            {request && (
              <div class="col-12 alert-bubble mb-4">
                <img class="img-fluid" src={alertbubble} alt="ico" />
                <div class="alert-cont">
                  {/* OPS!!! There is not elections Ask to add something!!! */}
                  <h5 class="mb-3">{t('alerts.Thanks!!!')}</h5>
                  <p class="text-danger">
                    {t('alerts.Your request has been sent.')}
                    <br />
                    {t('alerts.For now look at this!!!')}
                  </p>
                </div>
              </div>
            )}

            {elections?.map((item, index) => {
              return (
                <GeneralElection
                  items={item}
                  indexs={index}
                  user={user && user}
                  loader={loader}
                  setLoader={setLoader}
                />
              );
            })}
          </div>
        </div>
        {/* <!-- This Gift Section Ends here --> */}
      </section>
      {/* <!-- Content Section Ends here --> */}

      <CustomModal topClassName="minh-unset" showClose={false} open={loginModal} setOpen={setLoginModal}>
        <div class="alert-bubble-img">
          <img class="img-fluid" src="./images/alert-msg-bubble.png" alt="ico" />
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
      </CustomModal>
      {/* <div class="modal reg-modal bg-blur" id="login-message">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content minh-unset" data-bs-dismiss="modal">
          </div>
        </div>
      </div> */}
      {/* <!-- Footer Starts here --> */}
      {error && <MessageBox error={error} setError={setError} title={error_title} />}
      <Footer user={user && user} />
      {/* <!-- Footer Ends here --> */}
    </div>
  );
}
