import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopHeader from "../../components/TopHeader";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import MessageBox from "../../components/MessageBox";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";

function BusinessHour({}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState();
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState(""); console.log(location.state.business_Data.business_details.business_id);

  const [monstart1, setmonstart1] = useState(
    (location.state.workingHours[1] != undefined) ? location.state.workingHours[1].from_1 : ''
  );
  const [monend1, setmonend1] = useState(
    (location.state.workingHours[1] != undefined) ? location.state.workingHours[1].to_1 : ''
  );
  const [monstart2, setmonstart2] = useState(
    (location.state.workingHours[1] != undefined) ? location.state.workingHours[1].from_2 : ''
  );
  const [monend2, setmonend2] = useState(
    (location.state.workingHours[1] != undefined) ? location.state.workingHours[1].to_2 : ''
  );

  const [tuestart1, settuestart1] = useState(
    (location.state.workingHours[2] != undefined) ? location.state.workingHours[2].from_1 : ''
  );
  const [tuesend1, settuesend1] = useState(
    (location.state.workingHours[2] != undefined) ? location.state.workingHours[2].to_1 : ''
  );
  const [tuestart2, settuestart2] = useState(
    (location.state.workingHours[2] != undefined) ? location.state.workingHours[2].from_2 : ''
  );
  const [tuesend2, settuesend2] = useState(
    (location.state.workingHours[2] != undefined) ? location.state.workingHours[2].to_2 : ''
  );

  const [wedstart1, setwedstart1] = useState(
    (location.state.workingHours[3] != undefined) ? location.state.workingHours[3].from_1 : ''
  );
  const [wedend1, setwedend1] = useState(
    (location.state.workingHours[3] != undefined) ? location.state.workingHours[3].to_1 : ''
  );
  const [wedstart2, setwedstart2] = useState(
    (location.state.workingHours[3] != undefined) ? location.state.workingHours[3].from_2 : ''
  );
  const [wedend2, setwedend2] = useState(
    (location.state.workingHours[3] != undefined) ? location.state.workingHours[3].to_2 : ''
  );

  const [thurstart1, setthurstart1] = useState(
    (location.state.workingHours[4] != undefined) ? location.state.workingHours[4].from_1 : ''
  );
  const [thurend1, setthurend1] = useState(
    (location.state.workingHours[4] != undefined) ? location.state.workingHours[4].to_1 : ''
  );
  const [thurstart2, setthurstart2] = useState(
    (location.state.workingHours[4] != undefined) ? location.state.workingHours[4].from_2 : ''
  );
  const [thurend2, setthurend2] = useState(
    (location.state.workingHours[4] != undefined) ? location.state.workingHours[4].to_2 : ''
  );

  const [fristart1, setfristart1] = useState(
    (location.state.workingHours[5] != undefined) ? location.state.workingHours[5].from_1 : ''
  );
  const [friend1, setfriend1] = useState(
    (location.state.workingHours[5] != undefined) ? location.state.workingHours[5].to_1 : ''
  );
  const [fristart2, setfristart2] = useState(
    (location.state.workingHours[5] != undefined) ? location.state.workingHours[5].from_2 : ''
  );
  const [friend2, setfriend2] = useState(
    (location.state.workingHours[5] != undefined) ? location.state.workingHours[5].to_2 : ''
  );

  const [satstart1, setsatstart1] = useState(
    (location.state.workingHours[6] != undefined) ? location.state.workingHours[6].from_1 : ''
  );
  const [satend1, setsatend1] = useState(
    (location.state.workingHours[6] != undefined) ? location.state.workingHours[6].to_1 : ''
  );
  const [satstart2, setsatstart2] = useState(
    (location.state.workingHours[6] != undefined) ? location.state.workingHours[6].from_2 : ''
  );
  const [satend2, setsatend2] = useState(
    (location.state.workingHours[6] != undefined) ? location.state.workingHours[6].to_2 : ''
  );

  const [sunstart1, setsunstart1] = useState(
    (location.state.workingHours[0] != undefined) ? location.state.workingHours[0].from_1 : ''
  );
  const [sunend1, setsunend1] = useState(
    (location.state.workingHours[0] != undefined) ? location.state.workingHours[0].to_1 : ''
  );
  const [sunstart2, setsunstart2] = useState(
    (location.state.workingHours[0] != undefined) ? location.state.workingHours[0].from_2 : ''
  );
  const [sunend2, setsunend2] = useState(
    (location.state.workingHours[0] != undefined) ? location.state.workingHours[0].to_2 : ''
  );

  function Hours(
    Day,
    startfrom1,
    endfrom1,
    startfrom2,
    endfrom2,
    start1,
    end1,
    start2,
    end2
  ) {
    return (
      <div class="row mb-2">
        <div class="col-3">
          <span class="day">{Day}</span>
        </div>
        <div class="col-9">
          <div class="row">
            <div class="col-6">
              <div class="row">
                <div class="col-6 text-center pe-1 overflow-hidden">
                  <input
                    class="day-input"
                    type="time"
                    onChange={(text) => {
                      startfrom1(text.target.value);
                    }}
                    value={start1}
                    required
                  />
                </div>
                <div class="col-6 text-center ps-1 overflow-hidden">
                  <input
                    class="day-input"
                    type="time"
                    onChange={(text) => {
                      endfrom1(text.target.value);
                    }}
                    value={end1}
                    required
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="row">
                <div class="col-6 text-center pe-1 overflow-hidden">
                  <input
                    class="day-input"
                    type="time"
                    name="appt"
                    onChange={(text) => {
                      startfrom2(text.target.value);
                    }}
                    value={start2}
                    required
                  />
                </div>
                <div class="col-6 text-center ps-1 overflow-hidden">
                  <input
                    class="day-input"
                    type="time"
                    name="appt"
                    onChange={(text) => {
                      endfrom2(text.target.value);
                    }}
                    value={end2}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function WorkingHourApi() {
    setLoader(true);
    var formData = new FormData();
    formData.append("business_id", location.state.business_Data.business_details.business_id);
    formData.append("sun_from_1", sunstart1);
    formData.append("sun_to_1", sunend1);
    formData.append("sun_from_2", sunstart2);
    formData.append("sun_to_2", sunend2);

    formData.append("mon_from_1", monstart1);
    formData.append("mon_to_1", monend1);
    formData.append("mon_from_2", monstart2);
    formData.append("mon_to_2", monend2);

    formData.append("tue_from_1", tuestart1);
    formData.append("tue_to_1", tuesend1);
    formData.append("tue_from_2", tuestart2);
    formData.append("tue_to_2", tuesend2);

    formData.append("wed_from_1", wedstart1);
    formData.append("wed_to_1", wedend1);
    formData.append("wed_from_2", wedstart2);
    formData.append("wed_to_2", wedend2);

    formData.append("thurs_from_1", thurstart1);
    formData.append("thurs_to_1", thurend1);
    formData.append("thurs_from_2", thurstart2);
    formData.append("thurs_to_2", thurend2);

    formData.append("fri_from_1", fristart1);
    formData.append("fri_to_1", friend1);
    formData.append("fri_from_2", fristart2);
    formData.append("fri_to_2", friend2);

    formData.append("sat_from_1", satstart1);
    formData.append("sat_to_1", satend1);
    formData.append("sat_from_2", satstart2);
    formData.append("sat_to_2", satend2);

    ApiCall("Post", API.businesshoursApi, formData, {
      Authorization: "Bearer " + location.state.user.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log(resp.data);

        if (resp.data.success) {
          navigate(-1);
        } else {
          setError(true);
          seterror_title(resp.data.message);
        }
      });
  }

  return (
    <div class="container-fluid">
      <TopHeader title={t("Header.WORKING TIME")} />

      <section class="content-sec row yellow-bg user-select">
        <div class="login-wrap">
          <div class="work-hrs">
            <div class="row">
              <div class="col-3">
                <span class="title">{t("Week_Days.week_day")}</span>
              </div>
              <div class="col-9">
                <span class="title">{t("Week_Days.working_hours")}</span>
              </div>
            </div>
            <div class="row mt-3 mb-2">
              <div class="col-3"></div>
              <div class="col-9">
                <div class="row">
                  <div class="col-6">
                    <div class="row">
                      <div class="col-6 fs-12 text-center">
                        {t("Week_Days.from")}
                      </div>
                      <div class="col-6 fs-12 text-center">
                        {t("Week_Days.to")}
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="row">
                      <div class="col-6 fs-12 text-center">
                        {t("Week_Days.from")}
                      </div>
                      <div class="col-6 fs-12 text-center">
                        {t("Week_Days.to")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {Hours(
              t("Week_Days.monday"),
              setmonstart1,
              setmonend1,
              setmonstart2,
              setmonend2,
              monstart1,
              monend1,
              monstart2,
              monend2,
              true
            )}
            {Hours(
              t("Week_Days.tuesday"),
              settuestart1,
              settuesend1,
              settuestart2,
              settuesend2,
              tuestart1,

              tuesend1,

              tuestart2,
              tuesend2
            )}
            {Hours(
              t("Week_Days.wednesday"),

              setwedstart1,
              setwedend1,
              setwedstart2,
              setwedend2,
              wedstart1,
              wedend1,
              wedstart2,
              wedend2
            )}

            {Hours(
              t("Week_Days.thursday"),
              setthurstart1,
              setthurend1,
              setthurstart2,
              setthurend2,
              thurstart1,
              thurend1,
              thurstart2,
              thurend2
            )}

            {Hours(
              t("Week_Days.friday"),

              setfristart1,
              setfriend1,
              setfristart2,
              setfriend2,
              fristart1,
              friend1,
              fristart2,
              friend2
            )}
            {Hours(
              t("Week_Days.saturday"),
              setsatstart1,
              setsatend1,
              setsatstart2,
              setsatend2,
              satstart1,
              satend1,
              satstart2,
              satend2
            )}

            {Hours(
              t("Week_Days.sunday"),
              setsunstart1,
              setsunend1,
              setsunstart2,
              setsunend2,
              sunstart1,
              sunend1,
              sunstart2,
              sunend2
            )}
          </div>
          <p class="btm-line px-4 mb-5">
            <button
              class="btn btn-black w-100 py-2"
              onClick={() => WorkingHourApi()}
            >
              {t("Buttons.save_modification")}
            </button>
          </p>
        </div>
        {error && (
          <MessageBox error={error} setError={setError} title={error_title} />
        )}
      </section>
    </div>
  );
}

export default BusinessHour;
