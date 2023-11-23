import React, { useEffect, useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import TopHeader from '../components/TopHeader';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';

import del from '../images/img-delete-ico.svg';

import businessthumb from '../images/business-thumb.jpg';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';

function LoadShopPics() {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(
    location.state.business_place_images ? location.state.business_place_images : [],
  );

  const [images, setImages] = useState(
    location.state.business_place_images ? location.state.business_place_images : [],
  );

  const [user, setUser] = useState(location.state.user);

  const [selectedImage, setSelectedImage] = useState(imagePreview.length > 1 ? imagePreview[0].picture : '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loader, setLoader] = useState(false);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState('');
  const [PictureId, setPictureId] = useState(1);

  console.log(images, 'places images');
  function BusinessImagesApi() {
    setLoader(true);
    var formData = new FormData();
    formData.append('business_id', location.state.business_Data.business_id);

    if (images[0] && images[0].name != undefined) {
      formData.append(`picture1`, images[0].picture ? images[0].picture : images[0]);
      formData.append(`description1`, images[0]?.name ? images[0]?.name : images[0]?.description);
    }

    if (images[1] && images[1].name != undefined) {
      formData.append(`picture2`, images[1].picture ? images[1].picture : images[1]);
      formData.append(`description2`, images[1]?.name ? images[1]?.name : images[1]?.description);
    }

    if (images[2] && images[2].name != undefined) {
      formData.append(`picture3`, images[2].picture ? images[2].picture : images[2]);
      formData.append(`description3`, images[2]?.name ? images[2]?.name : images[2]?.description);
    }

    if (images[3] && images[3].name != undefined) {
      formData.append(`picture4`, images[3].picture ? images[3].picture : images[3]);
      formData.append(`description4`, images[3]?.name ? images[3]?.name : images[3]?.description);
    }

    if (images[4] && images[4].name != undefined) {
      formData.append(`picture5`, images[4].picture ? images[4].picture : images[4]);
      formData.append(`description5`, images[4]?.name ? images[4]?.name : images[4]?.description);
    }

    ApiCall('Post', API.businessimagesApi, formData, {
      Authorization: 'Bearer ' + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr savemodification', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log('sdsdsd', resp.data);
        navigate(-1);
        if (resp.data.success) {
        } else {
          setError(true);

          seterror_title(resp.data.message);
        }
      });
  }

  const removeImage = (item) => {
    console.log('>>>>>>>>>>>>>>>>');
    console.log(item);
    console.log(imagePreview);
    console.log('>>>>>>>>>>>>>>>>');
    setImagePreview(imagePreview.filter((file) => file !== item));
    setPictureId(imagePreview.findIndex((file) => file !== item));
    setImages(images?.filter((file, index) => index !== selectedImageIndex));
    setSelectedImage(imagePreview.length > 1 ? imagePreview[imagePreview.length - 1] : imagePreview[0]);
    setSelectedImageIndex(imagePreview.length > 1 ? imagePreview.length - 1 : 0);
  };

  function ImageSelectionFtn(item, index) {
    setPictureId(index + 1);
    setSelectedImage(item);
    setSelectedImageIndex(index);
  }

  const onFilesChange = async (event) => {
    // console.log(
    //   "images.length + event.target.files.length",
    //   images.length,
    //   event.target.files.length
    // );
    console.log('preview ==> ' + imagePreview.length);
    // let pic = URL.createObjectURL(event.target.files[0]);
    // console.log(pic);
    // console.log(event.target.files[0].name);
    // console.log(event.target.files[0].picture);
    if (imagePreview.length > 5) {
      seterror_title(t('alerts.upload upto 5 images'));
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].name != undefined) {
          imagePreview.push(URL.createObjectURL(event.target.files[i]));
        }
      }

      // if (event.target.files[0].name != undefined) {
      //   event.target.files.forEach((element) => {
      //     imagePreview.push(URL.createObjectURL(element));
      //   });
      //   imagePreview.push(URL.createObjectURL(event.target.files[0]));
      //   console.log('------------------');
      //   console.log(event.target.files[0]);
      //   console.log('------------------');
      //   images.push(event.target.files[0]);
      // }

      // console.log('xxxxxxxxxxxxxxxxxxxxx');
      // console.log(images);
      //setImagePreview([...imagePreview, event.target.files]);
      setImages([...images, ...event.target.files]);
      ImageSelectionFtn(
        URL.createObjectURL(event.target.files[event.target.files.length - 1]),
        event.target.files.length - 1,
      );
      setPictureId(event.target.files.length + 1);
    }
  };

  return (
    <div class="container-fluid">
      <TopHeader
        backarrow={true}
        homebtn={false}
        title={t('Header.BUSINESS PLACE PICTURES')}
        backarrowftn={() => navigate(-1)}
      />

      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row pb-3">
        <div class="slider-img mb-4">
          <img class="img-fluid blur-bg" src={selectedImage ? selectedImage : businessthumb} alt="Thumbnail" />
          <img class="actual-img img-fluid" src={selectedImage ? selectedImage : businessthumb} alt="Thumbnail" />
          {location.state != null && (
            <div class="btn-sec">
              <button class="btn btn-link" onClick={() => removeImage(selectedImage)}>
                <img src={del} alt="ico" />
              </button>
            </div>
          )}
        </div>
        <p class="fs-12">
          Pitcure {PictureId ? PictureId : '0'} of {imagePreview?.length}
        </p>

        <div class="slide-thumb" style={{ width: '100vw', overflowX: 'scroll' }}>
          {imagePreview?.length > 0 &&
            imagePreview.map((item, index) => {
              return (
                <img
                  src={item?.picture ? item?.picture : item}
                  onClick={() => {
                    ImageSelectionFtn(item?.picture ? item?.picture : item, index);
                  }}
                  key={index}
                  alt="img"
                  height={'100px'}
                  width={'100px'}
                  style={{ objectFit: 'cover' }}
                  // className="img-fluid"
                />
              );
            })}
          {imagePreview?.length > 4 ? null : (
            <div class="shop-pic-image">
              <img width={'100px'} height={'100px'} src="images/add-pic-shop-ico.svg" alt="" />

              <input type="file" name="input-file" onChange={onFilesChange} multiple />
            </div>
          )}
        </div>
        <div class="col-12 mt-4 mb-4">
          <button class="btn btn-black w-100" onClick={() => images?.length > 0 && BusinessImagesApi()}>
            {t('Buttons.save_modification')}
          </button>
        </div>
      </section>
      {error && <MessageBox error={error} setError={setError} title={error_title} />}
      {/* <!-- Content Section Ends here --> */}
    </div>
  );
}

export default LoadShopPics;
