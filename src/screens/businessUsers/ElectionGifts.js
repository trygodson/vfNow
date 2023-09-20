import React, { useEffect, useState } from "react";

import TopHeader from "../../components/BusinessHeader";
import BusinessFooter from "../../components/BusinessFooter";
import Loader from "../../components/Loader";
import BusinessElectionBox from "../../components/BusinessElectionBox";
import MessageBox from "../../components/MessageBox";

import { useTranslation } from "react-i18next";
import "../../languages/i18n";
import API from "../../services/ApiLists";
import { ApiCall } from "../../services/ApiCall";
import { getUserData } from "../../Functions/Functions";

export default function Election() {
  const { t } = useTranslation();
  const [electionlist, setElectionList] = useState([]);
  const [electionDellist, setElectionDelList] = useState([]);
  const [user, setUser] = useState();

  const [loader, setLoader] = useState(false);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState("");
  const [trigger, setTrigger] = useState(false);

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      ElectionList(userData);
    }
  }, []);

  function ElectionList(user) {
    console.log("user", user);
    var formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("business_id", user.business_id);

    ApiCall("Post", API.ElectionListApi, formData, {
      Authorization: "Bearer " + user?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        setError(true);
        seterror_title("Error!");
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log("Election list", resp.data);
        setElectionList(resp.data.data);
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
      <TopHeader title={t("Header.SELECT ELECTION")} />
      {/* <!-- Content Section Starts here --> */}
      <section class="content-sec row">
        {/* <!-- This Election Section Starts here --> */}

        {electionlist?.ended?.length > 0 && (
          <div class="product-wrap">
            <div class="row mt-2 pt-3">
              <div class="col-12">
                <div class=" mb-3">
                  {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                  <h3>{t("election.Election END")}</h3>
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
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      <BusinessFooter />
    </div>
  );
}
