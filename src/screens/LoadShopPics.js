import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import TopHeader from '../components/TopHeader';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';

import del from '../images/img-delete-ico.svg';
import edit from '../images/img-edit-ico.svg';
import businessthumb from '../images/business-thumb.jpg';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';
import { generateRandomString } from '../Functions/Functions';
const fileArray = [];
function LoadShopPics({
  images,
  imagePreview,
  business_Data,
  setLoadshop,
  loadShop,
  setImagePreview,
  setImages,
  loader,
  setLoader,
  seterror_title,
  setError,
}) {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const [images, setImages] = useState(images);
  // const [imagePreview, setImagePreview] = useState(imagesPreview);
  const [selectedImage, setSelectedImage] = useState(
    imagePreview.length > 1 ? imagePreview[imagePreview.length - 1] : imagePreview[0],
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [PictureId, setPictureId] = useState(0);

  const imageApiCalls = () => {
    return images.map((image, index) => {
      var formData = new FormData();
      formData.append('business_id', business_Data.business_id);

      if (image) {
        formData.append(`picture`, image);
        formData.append(`description`, generateRandomString());
        formData.append(`order`, index + 1);
      }

      return ApiCall('Post', API.businessimageApi, formData, {
        Authorization: 'Bearer ' + business_Data.access_token,
        Accept: 'application/json',
      });
    });
  };

  function BusinessImagesApi() {
    // if (images) {
    //   setLoader(true);
    //   var formData = new FormData();
    //   formData.append('business_id', business_Data.business_id);
    //   for (let index = 0; index < images.length; index++) {
    //     formData.append(`picture${index + 1}`, images[index]);
    //     formData.append(`description`, generateRandomString());
    //     formData.append(`order`, index + 1);
    //   }

    //   ApiCall('Post', API.businessimagesApi, formData, {
    //     Authorization: 'Bearer ' + business_Data.access_token,
    //     Accept: 'application/json',
    //   })
    //     .then((res) => {
    //       //console.log(res, 'image response');
    //       if (res?.data?.success) {
    //         setLoadshop(false);
    //         setLoader(false);
    //       } else {
    //         setError(true);
    //         setLoadshop(false);
    //         seterror_title(res?.data?.message ?? 'Error Uploading');
    //         setLoader(false);
    //       }
    //     })
    //     .catch((err) => {
    //       setLoader(false);
    //     });
    // }
    setLoader(true);
    Promise.all(imageApiCalls())
      .then((res) => {
        if (res.every((obj) => obj.data.success === true)) {
          setLoadshop(false);
          setLoader(false);
          toast.success('Upload SuccessFull');
        } else {
          setError(true);
          setLoadshop(false);
          toast.error('Error Uploading');
          seterror_title('Error');
          setLoader(false);
        }
      })
      .catch((err) => {
        toast.error('Error Uploading');
        setLoader(false);
      });
  }

  const removeImage = (item) => {
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
    if (imagePreview.length > 5) {
      seterror_title(t('alerts.upload upto 5 images'));
    } else {
      const filesArray = Array.from(event.target.files);

      for (let i = 0; i < filesArray.length; i++) {
        if (filesArray[i].name != undefined) {
          imagePreview.push(URL.createObjectURL(filesArray[i]));
        }
      }

      setImages((p) => [...p, ...event.target.files]);
      ImageSelectionFtn(URL.createObjectURL(filesArray[filesArray.length - 1]), filesArray.length - 1);
      setPictureId(filesArray.length + 1);
    }
  };

  return (
    <div class="container-fluid">
      <TopHeader
        backarrow={true}
        backarrowftn={() => setLoadshop(false)}
        homebtn={false}
        title={t('Header.BUSINESS PLACE PICTURES')}
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
      {/* <!-- Content Section Ends here --> */}

      <Toaster
        toastOptions={{
          success: {
            position: 'top-center',

            style: {
              width: '100%',
            },
          },
          error: {
            position: 'bottom-center',
            style: {
              background: 'red',
              color: 'white',
              width: '100%',
            },
          },
        }}
      />
    </div>
  );
}

export default LoadShopPics;
