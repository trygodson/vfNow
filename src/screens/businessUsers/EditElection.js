import React, { useEffect, useState } from 'react';

import TopHeader from '../../components/BusinessHeader';
import BusinessFooter from '../../components/BusinessFooter';
import Loader from '../../components/Loader';
import MessageBox from '../../components/MessageBox';
import ElectionModify from './ElectionModify';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { getUserData } from '../../Functions/Functions';

export default function EditElection() {
  const { t } = useTranslation();

  const [candidatePhase, setCandidatePhase] = useState('');
  const [electionPhase, setElectionPhase] = useState('');
  const [category, setCategory] = useState('');
  const [category2, setCategory2] = useState('');
  const [categorylist, setCategoryList] = useState([]);
  const [gitfName, setgitfName] = useState('');
  const [gitfDes, setgitfDes] = useState('');
  const [giftValue, setgiftValue] = useState('');
  const [ageLimit, setAgeLimit] = useState(false);
  const [update, setUpdate] = useState(false);
  const [delivery, setdelivery] = useState(1);

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState('');
  const [video, setVideo] = useState();
  const [elections, setElections] = useState();
  const [loader, setLoader] = useState(false);
  const [electionUpdate, setelectionUpdate] = useState(false);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');

  const fileArray = [];
  const onFilesChange = async (event) => {
    if (event.target.files.length > 5) {
      setError(true);
      seterror_title(t('alerts.upload upto 5 images'));
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        fileArray.push(URL.createObjectURL(event.target.files[i]));
      }
      setImagesPreview(fileArray);
      setImages(event.target.files);
    }
  };

  const [user, setUser] = useState();

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      CategoryList(userData);
    }
  }, []);

  function CategoryList(user) {
    var formData = new FormData();

    ApiCall('Post', API.categoryListApi2, formData, {
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
        // console.log("catehory", resp.data);
        setCategoryList(resp.data.data);
      });
  }

  function AddElection() {
    setLoader(true);

    var formData = new FormData();
    formData.append('business_id', user.business_id);

    formData.append('candidate_phase_duration', candidatePhase);
    formData.append('election_phase_duration', electionPhase);
    formData.append('category1', category);
    // formData.append('category2', category2);
    if (category2 !== '' && category2 !== null) {
      formData.append('category2', category2);
    }
    formData.append('gift_title', gitfName);
    formData.append('gift_description', gitfDes);
    formData.append('gift_value', `${giftValue}`);
    formData.append('age_limitation', ageLimit ? 1 : 0);

    formData.append('gift_delivery_option', delivery);

    if (images[0] != undefined) {
      formData.append(`gift_image1`, images[0]);
    }
    if (images[1] != undefined) {
      formData.append(`gift_image2`, images[1]);
    }
    if (images[2] != undefined) {
      formData.append(`gift_image3`, images[2]);
    }
    if (images[3] != undefined) {
      formData.append(`gift_image4`, images[3]);
    }
    if (images[4] != undefined) {
      formData.append(`gift_image5`, images[4]);
    }

    if (video) {
      formData.append(`video`, video);
    }

    ApiCall('Post', API.AddelectionApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
        setLoader(false);

        //   reject(error.response);
      })
      .then((resp) => {
        console.log('new elec', resp.data);
        setLoader(false);

        setElections(resp.data);
        if (resp.data.success) {
          setelectionUpdate(true);
          setUpdate(true);
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }
  function UpdateElection() {
    setLoader(true);
    var formData = new FormData();
    formData.append('business_id', user.business_id);
    formData.append('election_id', elections?.data?.id);
    formData.append('candidate_phase_duration', candidatePhase);
    formData.append('election_phase_duration', electionPhase);
    formData.append('category1', category);
    if (category2 !== '' && category2 !== null) {
      formData.append('category2', category2);
    }
    // category2 !== '' && category2 !== null && formData.append('category2', category2);
    formData.append('gift_title', gitfName);
    formData.append('gift_description', gitfDes);
    formData.append('gift_value', `${giftValue}`);
    formData.append('age_limitation', ageLimit ? 1 : 0);

    formData.append('gift_delivery_option', delivery);

    if (images[0] != undefined) {
      formData.append(`gift_image1`, images[0]);
    }
    if (images[1] != undefined) {
      formData.append(`gift_image2`, images[1]);
    }
    if (images[2] != undefined) {
      formData.append(`gift_image3`, images[2]);
    }
    if (images[3] != undefined) {
      formData.append(`gift_image4`, images[3]);
    }
    if (images[4] != undefined) {
      formData.append(`gift_image5`, images[4]);
    }

    if (video) {
      formData.append(`video`, video);
    }

    ApiCall('Post', API.UpdateelectionApi, formData, {
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
          setelectionUpdate(true);
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  return (
    <div class="container-fluid">
      {loader && <Loader />}

      <TopHeader title={t('Header.newElection')} />
      {/* <!-- Content Section Starts here --> */}
      {!electionUpdate ? (
        <section class="content-sec row yellow-bg user-select pb-0">
          <div class="login-wrap election-form election-container px-0">
            <h5>
              {t('election.CREATE')}
              <br />
              {t('election.NEW ELECTION')}
            </h5>
            <span class="copy-txt">{t('election.COPY FROM PREVIOUS ELECTION')}</span>
            <div class="seperator"></div>
            <div class="product-wrap mt-4 px-3">
              <div class=" mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t('election.Election duration')}</h3>
              </div>
            </div>
            <div class="register-form px-3 mt-3 position-relative">
              <h6 class="mt-2">
                <strong>{t('election.Candidate phase duration')}</strong>
              </h6>
              <div class="form-group bg p-0 minh-unset">
                {/* <button
                class="btn btn-empty"
                data-bs-toggle="modal"
                data-bs-target="#select-date-7-modal"
              >
                <span>
                  <strong>7</strong> days
                </span>
                <span class="btn-right">
                  Click to modify
                  <img src="images/arrow-ico.svg" alt="" />
                </span>
              </button> */}
                <select
                  value={candidatePhase}
                  onChange={(e) => setCandidatePhase(e.target.value)}
                  class="form-control mt-2"
                >
                  <option value="">{t('election.Select Candidate phase duration')}</option>
                  <option value="0">{t('election.Now')}</option>
                  <option value="1">1 {t('election.day from now')}</option>
                  <option value="2">2 {t('election.day from now')}</option>
                  <option value="3">3 {t('election.day from now')}</option>
                  <option value="4">4 {t('election.day from now')}</option>
                  <option value="5">5 {t('election.day from now')}</option>
                  <option value="6">6 {t('election.day from now')}</option>
                  <option value="7">7 {t('election.day from now')}</option>
                  <option value="8">8 {t('election.day from now')}</option>
                  <option value="9">9 {t('election.day from now')}</option>
                  <option value="10">10 {t('election.day from now')}</option>
                </select>
              </div>
              <p class="small mt-2 mb-0">
                <small>
                  {t('election.These are days when users can become cadidate, but voting is not started yet.')}{' '}
                  <strong>{t('election.We suggest to leave 7 days.')}</strong>
                </small>
              </p>
              <h6 class="mt-4">
                <strong>{t('election.Election phase duration')}</strong>
              </h6>
              <div class="form-group bg p-0 minh-unset">
                <select
                  value={electionPhase}
                  onChange={(e) => setElectionPhase(e.target.value)}
                  class="form-control mt-2"
                >
                  <option value="">{t('election.Select Election phase duration')}</option>
                  {/* <option value="0">{t('election.Now')}</option> */}
                  <option value="7">7 {t('election.days')}</option>
                  <option value="10">10 {t('election.days')}</option>
                  <option value="14">14 {t('election.days')}</option>
                </select>
              </div>
              <p class="small mt-2 mb-5">
                <small>
                  {t('election.These are days of voting.')}
                  <strong>{t('election.We suggest to leave 10 days.')}</strong>
                </small>
              </p>
              <button class="btn btn-transparent info" data-bs-toggle="modal" data-bs-target="#elec-duration-modal">
                <img class="img-fluid" src="images/info-green.png" alt="ico" />
              </button>
            </div>
            <div class="seperator"></div>
            <div class="product-wrap mt-4 px-3">
              <div class=" mb-3">
                {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                <h3>{t('election.Election Gift Details')}</h3>
              </div>
            </div>
            <div class="register-form px-3 mt-3 w-100" action="#">
              <h6 class="mt-2">
                <strong>{t('election.Category')} 1</strong>
              </h6>
              <div class="form-group bg minh-unset p-0">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  class="form-control mt-2"
                  placeholder={t('placeHolders.category')}
                >
                  <option value="">{t('BUSINESS Category *')}</option>
                  {categorylist &&
                    categorylist.map((item, index) => {
                      return (
                        <option class="text-uppercase" value={item.category_id}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <h6 class="mt-4">
                <strong>{t('election.Category')} 2 (optional)</strong>
              </h6>
              <div class="form-group bg minh-unset p-0">
                <select
                  value={category2}
                  onChange={(e) => setCategory2(e.target.value)}
                  class="form-control mt-2"
                  placeholder={t('placeHolders.category')}
                >
                  <option value="">{t('BUSINESS Category')}</option>
                  {categorylist.map((item, index) => {
                    return (
                      <option class="text-uppercase" value={item.category_id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <h6 class="mt-4">
                <strong>{t('election.Gift title')}</strong>
              </h6>
              <div class="form-group bg minh-unset p-0">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter the gift title"
                  onChange={(text) => setgitfName(text.target.value)}
                  value={gitfName}
                  required
                />
              </div>
              <h6 class="mt-4">
                <strong>{t('election.Gift description')}</strong>
              </h6>
              <div class="form-group bg minh-unset p-0">
                <textarea
                  class="form-control pt-4"
                  name="desc"
                  id=""
                  cols="30"
                  rows="7"
                  placeholder="Enter the gift description..."
                  onChange={(text) => setgitfDes(text.target.value)}
                  value={gitfDes}
                  required
                ></textarea>
              </div>
              <h6 class="mt-4">
                <strong>{t('election.Add gift pictures')}</strong>
                <small class="fs-12"> {t('election.(max 5 pictures)')}</small>
              </h6>
              <div class="form-group">
                <div class="shop-pic">
                  <img class="img-fluid" src="images/add-pic-shop-ico.svg" alt="" />
                  <input type="file" name="input-file" onChange={onFilesChange} multiple />
                </div>
                <div class="slide-thumb">
                  {imagesPreview?.length > 0 &&
                    imagesPreview.map((item, index) => {
                      return <img src={item.picture ? item?.picture : item} alt="img" height={'100'} width={'100'} />;
                    })}
                </div>
              </div>
              <h6 class="mt-4">
                <strong>{t('election.Gift Value')}</strong>
              </h6>
              <div class="form-group bg minh-unset p-0">
                <input
                  type="number"
                  class="form-control"
                  placeholder={'0.00  ' + user?.currency}
                  onChange={(text) => setgiftValue(text.target.value)}
                  value={giftValue}
                  required
                />
              </div>
              <p class="small">
                <small>
                  {t('election.The Value is only an indication. The gift will be given to Winner for free.')}
                </small>
              </p>
              <h6 class="mt-4">
                <strong>{t('election.Age limitation')}</strong>
              </h6>
              <div class="form-group ps-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="business-online"
                    checked={ageLimit ? true : false}
                    onChange={() => {
                      setAgeLimit(!ageLimit);
                    }}
                  />
                  <label class="form-check-label" for="adult">
                    {t('election.The gift is only for adult (18+ years old)')}
                  </label>
                </div>
              </div>
              <h6 class="mt-4">
                <strong>{t('election.Gift Delivery option')}</strong>
              </h6>
              <div class="form-group ps-3">
                <div class="form-check mb-2">
                  <input
                    // checked="check"
                    class="form-check-input"
                    type="radio"
                    name="ship-opt"
                    checked={delivery == 1 ? true : false}
                    onChange={() => {
                      setdelivery(1);
                    }}
                  />
                  <label class="form-check-label" for="ship-opt1">
                    {t('election.Shipped')}
                  </label>
                </div>
                <div class="form-check mb-2">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="ship-opt"
                    checked={delivery == 2 ? true : false}
                    onChange={() => {
                      setdelivery(2);
                    }}
                  />
                  <label class="form-check-label" for="ship-opt2">
                    {t('election.On-line delivery')}
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="ship-opt"
                    checked={delivery == 3 ? true : false}
                    onChange={() => {
                      setdelivery(3);
                    }}
                  />
                  <label class="form-check-label" for="ship-opt3">
                    {t('election.Self collection at the shop')}
                  </label>
                </div>
              </div>
              <div class="check-info">
                <img class="ico" src="images/alert-finger-ico.png" alt="ico" />
                {delivery === 1 ? (
                  <p>
                    {t('You shall guaranty that the free gift')}
                    <br />
                    {t('election.will')}
                    <strong> {t('shipped to the winner')} </strong>
                    {t('election.address.')}
                  </p>
                ) : delivery === 2 ? (
                  <p>
                    {t('You shall guaranty that the free gift will')}
                    <br />
                    <strong> {t('delivered on-line')} </strong>
                    {t('(e.g email, coupon etc)')}
                  </p>
                ) : (
                  delivery === 3 && (
                    <p>
                      {t('You shall guaranty that the free gift will be given to ')}
                      {/* {t('election.')} */}
                      <strong>{t('winner at your shop')}</strong>
                      {/* {t('election.(e.g email, coupon etc)')} */}
                    </p>
                  )
                )}
              </div>
              <h6 class="mt-4">
                <strong>{t('election.Advertisement video (optional)')}</strong>
                <small class="fs-12"> {t('election.(max size 5MB)')}</small>
              </h6>
              <div class="form-group">
                <div class="shop-pic">
                  <img class="img-fluid" src="images/add-pic-shop-ico.svg" alt="" />
                  <input
                    type="file"
                    accept="video/mp4,video/x-m4v,video/*"
                    onChange={(ev) => {
                      if (ev.target.files[0].size < 5242880) {
                        setVideo(ev.target.files[0]);
                      } else {
                        setError(true);
                        seterror_title('video is larger than 5 mb');
                      }
                    }}
                  />
                </div>
                {video && (
                  <div class="slide-thumb">
                    <video width="400" controls>
                      <source src={URL.createObjectURL(video)} />
                    </video>
                  </div>
                )}
              </div>
              <h6 class="mt-4">
                <strong>{t('election.OR')}</strong>
              </h6>
              <p class="small">
                <small>{t('election.Load URL Video from other platform')}</small>
              </p>
              <div class="form-group bg minh-unset p-0">
                <input
                  type="text"
                  class="form-control"
                  placeholder={t('election.VIDEO URL')}
                  onChange={(text) => setgitfName(text.target.value)}
                  required
                />
              </div>
            </div>

            <div class="seperator mt-3"></div>
            <div class="col-12 px-3">
              <p class="small mt-3">
                <small>
                  {t('election.By clicking on button below you accept the terms and condition.')}
                  <strong data-bs-toggle="modal" data-bs-target="#tc-modal">
                    {t('election.CLICK HERE')}
                  </strong>
                  {t('election.to check the term and condition.')}
                </small>
              </p>

              <button onClick={() => AddElection()} class="btn btn-black w-100 py-2 mt-2 mb-5">
                {t('Buttons.CONTINUE TO PREVIEW')}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <ElectionModify
          electionUpdate={electionUpdate}
          setelectionUpdate={setelectionUpdate}
          user={user}
          elections={elections}
          UpdateElection={() => UpdateElection()}
        />
      )}

      <BusinessFooter />
      {/* <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="tc-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="performace-modal btm-fix-btn">
              <h5>{t('alerts.TERMS and CONDITIONS')}</h5>
              <p>{t('alerts.TERMS_Text')}</p>
              <button class="btn btn-close-x p-0">
                <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal Popup Ends here -->
    <!-- Modal Popup Starts here --> */}
      <div class="modal bg-blur" id="elec-duration-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="performace-modal btm-fix-btn">
              <h5>
                <h3>{t('election.Election duration')}</h3>
                <br />
                {t('businessPage.How does it work?')}
              </h5>
              <p>{t('election.An election consists of two phases')}</p>
              <p>
                <strong>- {t('election.Candidate phase')}</strong>
              </p>
              <p>
                <strong>- {t('election.Election phase')}</strong>
              </p>
              <p>
                {t('election.During')} <strong>{t('election.Candidate phase')}</strong>
                {t(
                  'election.users can see your free gift and decide to partecipate as Candidate. However, no vote can be received during this phase',
                )}{' '}
                .
              </p>
              <p>
                {t('election.During')} <strong>{t('election.Election phase')}</strong>{' '}
                {t('election.candidate can receive vote. While other user can still became candidate and/or give vote')}
              </p>
              <p class="text-center">
                <img class="img-fluid my-3" src="images/election-duration-diagram.svg" alt="ico" />
              </p>
              <button class="btn btn-close-x p-0">
                <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {error && <MessageBox error={error} setError={setError} title={error_title} />}
    </div>
  );
}
