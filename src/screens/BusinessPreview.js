import React, { useEffect, useState } from "react";

import { useLocation, useNavigate, Link } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import API from "../services/ApiLists";
import { ApiCall } from "../services/ApiCall";

import { useTranslation } from "react-i18next";
import "../languages/i18n";

import GeneralBusiness from "../components/GeneralBusiness";

export default function BusinessPreview({
  business_Data,
  setLoader,
  setpreview,
}) {
  const { t } = useTranslation();

  const [preview, setPreview] = useState();
  useEffect(() => {
    setLoader(true);
    PreviewBusiness();
  }, []);

  function PreviewBusiness() {
    var formData = new FormData();
    formData.append("user_id", business_Data.id);
    formData.append("business_id", business_Data.business_id);

    ApiCall("Post", API.businessPreviewApi, formData, {
      Authorization: `Bearer ` + business_Data.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        // storeUserData(resp.data.data);
        console.log("previewresp  setLoader(false);", resp.data.data);
        setPreview(resp.data.data);
        // alert(resp.data.message);
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader
        backarrow={true}
        backarrowftn={() => setpreview(false)}
        title={t("Header.BUSINESS PAGE PREVIEW")}
      />

      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        {/* <!-- This Gift Section Starts here --> */}
        {preview && (
          <GeneralBusiness
            preview={preview}
            user={business_Data}
            setLoader={setLoader}
          />
        )}
      </section>
    </div>
  );
}
