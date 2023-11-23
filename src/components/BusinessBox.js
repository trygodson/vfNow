import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import '../languages/i18n';

import MessageBox from '../components/MessageBox';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';
import StarRatings from 'react-star-ratings';

const BusinessBox = ({ item, index, user, setLoader, HomeFtn, style }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');

  function UserFavBusinessAdd(businessID, status, item) {
    console.log('status', status, status == 1);
    var formData = new FormData();
    setLoader(true);
    formData.append('user_id', user?.user_id);
    formData.append('business_id', businessID);
    formData.append('status', status);
    ApiCall('Post', API.AddfavBusinessApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
        setLoader(false);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        if (resp.data.success) {
          if (status == 1) item.favourite = true;
          else item.favourite = false;
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
        console.log('UserFavBusinessAdd', resp.data);
        // alert(resp.data.message);
        HomeFtn();
      });
  }

  return (
    <div class={`prod-snip ${style == 'business-general' ? 'business-general' : 'business'}`} key={index}>
      <div
        class="img-wrap"
        onClick={() => {
          user?.login_as === 'visitor'
            ? navigate(`/businessDetailVisitor/${item?.business_id}`)
            : navigate(`/businessDetail`, {
                state: {
                  business: item,
                },
              });
        }}
      >
        <img
          class="img-fluid"
          src={
            item?.business_place_images[0]?.picture
              ? item?.business_place_images[0]?.picture
              : './images/business-thumb.jpg'
          }
          alt="ico"
        />
      </div>
      <div class="cont">
        <div
          class="logo-sec"
          onClick={() => {
            // console.log("hell cont");
            user?.login_as === 'visitor'
              ? navigate(`/businessDetailVisitor/${item?.business_id}`)
              : navigate(`/businessDetail`, {
                  state: {
                    business: item,
                  },
                });
          }}
        >
          <img class="img-fluid" src={item?.avatar ? item?.avatar : 'images/logo-dummy.png'} alt="logo" />
        </div>
        <h4 class="text-truncate">{item?.business_name}</h4>
        <div class="rating-sec">
          <div class="rating">
            <Link to="/shopFeedback" state={{ user: item }}>
              <StarRatings
                rating={item?.ratings}
                starRatedColor="#FFD306"
                numberOfStars={5}
                name="rating"
                starDimension="20px"
                starSpacing="2px"
                // onClick={() => {
                //   console.log("hell cont");
                //   navigate("/shopFeedback", {
                //     state: {
                //       user: item,
                //     },
                //   });
                // }}
              />
            </Link>

            <span>
              {item?.rating} ({item?.from_people})
            </span>
          </div>
          <div class="share">
            <button
              onClick={() => UserFavBusinessAdd(item?.business_id, item?.favourite ? 0 : 1, item)}
              class={`link bg-transparent border-0 ${item?.favourite == true ? 'yellow-ellipse' : ''}`}
            >
              <img class="img-fluid" src="images/heart-ico.svg" alt="" />
            </button>
            <a href="javascript:;" class="link">
              <img class="img-fluid" src="images/share-ico.svg" alt="" />
            </a>
          </div>
        </div>
        <div
          class="motto"
          onClick={() => {
            user?.login_as === 'visitor'
              ? navigate(`/businessDetailVisitor/${item?.business_id}`)
              : navigate(`/businessDetail`, {
                  state: {
                    business: item,
                  },
                });
          }}
        >
          <h5>{item?.motto}</h5>
          <p>{item?.description}</p>
        </div>
      </div>
      {error && <MessageBox error={error} setError={setError} title={error_title} />}
    </div>
  );
};

export default BusinessBox;
