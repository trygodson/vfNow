import React, { useEffect, useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import TopHeader from '../components/TopHeader';
import API from '../services/ApiLists';
import { ApiCall } from '../services/ApiCall';

import del from '../images/img-delete-ico.svg';
import edit from '../images/img-edit-ico.svg';
import businessthumb from '../images/business-thumb.jpg';
import { useTranslation } from 'react-i18next';
import '../languages/i18n';
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

  // useEffect(() => {
  //   if (location.state == null) {
  //     BusinessImagesPlacesApi();
  //   }
  // }, []);

  // function BusinessImagesPlacesApi() {
  //   var formData = new FormData();
  //   formData.append("business_id", 1);
  //   formData.append("user_id", 13);

  //   ApiCall("Post", API.placeImagesApi, formData, {
  //     Authorization:
  //       "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiY2Q5NmMwY2ViMGExZTUwNjIzNmViYmFiODIwNjY5NTE2ZmEyNTU4MDBhYzZlMWFjNDk4ZGQ0ZTdhYzJmZTVlMGZkODFlM2I0YzE3YzA0ZjIiLCJpYXQiOjE2NDM4MDcwNjIsIm5iZiI6MTY0MzgwNzA2MiwiZXhwIjoxNjc1MzQzMDYyLCJzdWIiOiIxMyIsInNjb3BlcyI6W119.ZKTgcyxkhl1yLXkXME1EifdBQO48SZ0sZcoz-AlhAdN-2Dw40Im9nej_bg2ei2kY4-o0T6iRpCGZ2_4dl3jPkVDhcoiuEJOsS0xelCjoSPc5I06ABS9NQ7BepQnRET6eRqIcZyeZitPLgLrNqgHZWvHumH_Iw-U64jGJlRfoKvyc1TWeLVLsaCUpMwrnjn1iUVj2JJs_63gUBO2ZjBNJHkoBqskTLUkXtkutWzPcciCBq7FNLckMsx15RFSWsbm3K6rXZqXuiHX-RA5ehPZE1AFvYJQal04ADr2LZN3jSOL_8xkgYOcnjW0PZGBmzY2HZ-ovjWrO8T9PMn3GQ9AH5ykD2PpC-HAIWdOwk589CNHRqN7Zks_vpnt-jjhvOx2SEnI_QwU-T3Oc30KEQ-6QUHqA4oHoVZmyZ1mP8XCB_xVo9SLxeDzRR2X5ZafJIH7IuByjy1fKNkvrj8STNnr7PM8VejJBmEWLPho1_Y1llG7NKTMMIVeoq3sCTS6dmUUUhrWdhrJq2gdYkMZW6YmYiXC25bhqWG6cWZhWAokOB4X3SYuGGiE8KnuuyjmcaL2O2C7wa080O-dzWcaZ3nu4R7SApLE3KVVtLxL21U3MfSODn8tz59R0bKKoREjqRcYqLVGvA1twKhrPr1DyMN6l4uNA5xQeG0DxJDxV0Kqo0PQ",
  //     Accept: "application/json",
  //   })
  //     .catch((error) => {
  //       console.log("erorr reponse in images", error);
  //       //   reject(error.response);
  //     })
  //     .then((resp) => {
  //       if (resp.data.success) {
  //         setImagePreview(resp.data.data);
  //         setSelectedImage(resp.data.data[0].picture);
  //         setImages(resp.data.data);
  //       }
  //     });
  // }

  function BusinessImagesApi() {
    setLoader(true);
    var formData = new FormData();
    formData.append('business_id', business_Data.business_id);

    console.log('=========================');
    console.log(images);
    console.log('=========================');

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
      Authorization: 'Bearer ' + business_Data.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log('sdsdsd', resp.data);

        if (resp.data.success) {
          setLoadshop(false);
        } else {
          setError(true);
          setLoadshop(false);
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
    </div>
  );
}

export default LoadShopPics;
