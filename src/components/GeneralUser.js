import React from "react";
import { useTranslation } from "react-i18next";
import "../languages/i18n";

const GeneralUser = ({ item, index, user, setLoader }) => {
  const { t } = useTranslation();
  return (
    <div
      class="candidate-snippet chat-snippet"
      key={index}
      // onClick={() => navigate("/friendChat")}
    >
      <div class="user-img">
        <img
          src={item.picture ? item.picture : "images/avatar-img-2.png"}
          alt="Name"
        />
      </div>
      <div class="avatar-cont">
        <div class="ac-lft">
          <h6 class="text-truncate">{item.name}</h6>
          <span class="elec">
            <img src="images/grid-elect-ico.svg" alt="ico" />
            <span>
              {t("election.Join")}
              <small> {t("election.as")} </small>
              {t("election.Candidates")}
            </span>
            <strong>{item.region}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GeneralUser;
