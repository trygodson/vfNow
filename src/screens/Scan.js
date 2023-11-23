import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import { useTranslation } from "react-i18next";
import "../languages/i18n";

import Footer from "../components/Footer";
import BusinessFooter from "../components/BusinessFooter";
import { getUserData } from "../Functions/Functions";
import MessageBox from "../components/MessageBox";
import API from "../services/ApiLists";
import { ApiCall } from "../services/ApiCall";

import Loader from "../components/Loader";

const Scan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = React.useState(false);
  const [error_title, seterror_title] = useState("");

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const Scanner = async (result, error) => {
    const userData = await getUserData();
    var resultText = result?.text ? atob(result?.text) : '';
    console.log(">>>>>>>>>>");
    console.log(resultText);
    if (!!resultText) {
      setData(resultText);
      console.log("scan", JSON.parse(resultText));
      if (JSON.parse(resultText)?.type == "user") {
        navigate("/VoteUser", {
          state: {
            user_id: JSON.parse(resultText)?.user_id,
          },
        });
      }
      if (JSON.parse(resultText)?.type == "business") {
        navigate("/businessDetail", {
          state: {
            business_id: JSON.parse(resultText)?.business_id,
          },
        });
      }
      if (JSON.parse(resultText)?.type == "election") {
        if (userData && userData?.login_as === "visitor") {
          setError(true);
          seterror_title(t("alerts.Please register before scan!"));
          // navigate("/userRegister", {
          //   state: {
          //     scanScreen: true,
          //   },
          // });
        } else {
          ScanFtnAPi(resultText, userData);

          navigate("/electionDetail", {
            state: {
              election: JSON.parse(resultText),
              election_date_time: JSON.parse(resultText)?.election_date_time,
            },
          });
        }
      }
    }

    if (!!error) {
      console.info(error);
    }
  };
  function ScanFtnAPi(response, users) {
    var formData = new FormData();
    var qrResponse = response ? btoa(response) : '';
    setLoader(true);

    formData.append("qr_response", qrResponse);
    formData.append("user_id", users?.user_id);

    ApiCall("Post", API.SCANAPI, formData, {
      Authorization: `Bearer ` + users?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
        console.log("sucess reponse vote", resp.data);
      });
  }

  function AddElectionCandidate(electionId, user) {
    var formData = new FormData();
    setLoader(true);
    formData.append("user_id", user?.user_id);
    formData.append("election_id", electionId);

    ApiCall("Post", API.AddElectionCandidateApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        setLoader(false);
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        setLoader(false);
      });
  }
  function Textftn() {
    return (
      <span class="info-text">
        {t(
          "Scan_Screen.Scan QR-CODE to easily find your FRIENDS, BUSINESS PLACE or"
        )}
        <br />
        {t("Scan_Screen.to receive VOTES AT THE BUSINESS PLACE")}!!!
      </span>
    );
  }

  function Closeftn() {
    return (
      <button class="btn btn-close-x p-0 mb-5" onClick={() => navigate(-1)}>
        <img class="img-fluid" src="images/close-x.svg" alt="ico" />
      </button>
    );
  }
  return (
    <div class="container-fluid scanner-qr-code p-0">
      {loader && <Loader />}
      <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={(result, error) => {
          Scanner(result, error);
        }}
        containerStyle={{ height: "100%" }}
        videoStyle={{ height: 800 }}
        ViewFinder={() => Closeftn()}
      />
      {Textftn()}
      {user?.login_as == "business" ? (
        <BusinessFooter />
      ) : (
        <Footer user={user && user} />
      )}

      {error && (
        <MessageBox
          error={error}
          setError={setError}
          title={error_title}
          ftn={() =>
            navigate("/userRegister", {
              state: {
                scanScreen: true,
              },
            })
          }
        />
      )}
      {/* <!-- Footer Ends here --> */}
    </div>
  );
};

export default Scan;
