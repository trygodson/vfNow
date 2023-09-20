import * as React from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import blackpin from "../images/black.png";
import yellowpin from "../images/yellow.png";

import { useNavigate } from "react-router-dom";
import API from "../services/ApiLists";
import { ApiCall } from "../services/ApiCall";
import { getBoundsForPoints } from "../Functions/Functions";

export default function Map({
  longitude,
  latitude,
  user,
  searching,
  setLoader,
}) {
  const navigate = useNavigate();
  const [startSoon, setStartSoon] = React.useState();
  const [viewport, setViewport] = React.useState({
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    zoom: 9,
    offsetTop: 50,
  });

  React.useEffect(() => {
    ElectionsList(user, latitude, longitude);
  }, []);

  function ElectionsList(user, latitude, longitude) {
    setLoader(true);
    var formData = new FormData();

    formData.append("user_latitude", `${latitude}`);
    formData.append("user_longitude", `${longitude}`);
    formData.append("user_id", user?.user_id);
    formData.append("batch_number", 0);
    formData.append("list_ids", "0");

    ApiCall("Post", API.MapElectionsApi, formData, {
      Authorization: `Bearer ` + user.access_token,
      Accept: "application/json",
    })
      .catch((error) => {
        console.log("erorr reponse", error);
        setLoader(false);
        //   reject(error.response);
      })
      .then((resp) => {
        const bounds = getBoundsForPoints(resp.data.data, longitude, latitude);

        setViewport({
          ...bounds,
        });
        setLoader(false);

        setStartSoon(resp.data.data);
      });
  }

  return (
    <ReactMapGL
      touchAction="pan-y"
      mapStyle="mapbox://styles/mapbox/streets-v10"
      mapboxApiAccessToken="pk.eyJ1IjoieGFpbmlraGFuMjAiLCJhIjoiY2tkdmswZjU5MXU4YjJ3cGJkYmpleGhnciJ9.Hn_L5hXdjR4zALA01O_aqQ"
      {...viewport}
      width="100vh"
      height="50vh"
      initialViewState={{
        longitude: longitude,
        latitude: latitude,
        zoom: 0,
      }}
      style={{ padding: 0 }}
      dragPan={false}
      // onTouchMove={"pan-y"}
      touchAction="pan-y"
      scrollZoom={false}
      boxZoom={false}
      onViewportChange={(viewport) => {
        setViewport(viewport);
      }}
      onClick={() => {
        if (!searching) {
          navigate("/homeMap");
        }
      }}
    >
      <Marker
        latitude={parseFloat(latitude)}
        longitude={parseFloat(longitude)}
        anchor={"center"}
        className="user-icon-marker"
      >
        <button
          class="btn btn-link p-0"
          onClick={() => {
            if (!searching) {
              navigate("/homeMap", {
                state: {
                  startSoon: startSoon,
                  longitude: longitude,
                  latitude: latitude,
                },
              });
            }
          }}
        >
          <img
            class="img-fluid user-map-img"
            src={user?.picture ? user?.picture : "images/VFAlien.png"}
            width="30px"
            height="30px"
            // style={{ backgroundColor: "black", width: 25, height: 25 }}
            alt=""
          />
        </button>
      </Marker>
      {startSoon?.map((item, index) => {
        return (
          <Marker
            key={index}
            anchor="center"
            latitude={parseFloat(item.business_details.latitude)}
            longitude={parseFloat(item.business_details.longitude)}
            className="election-pin-marker"
          >
            <button
              class="btn btn-link"
              onClick={() => {
                if (!searching) {
                  navigate("/electionDetail", {
                    state: {
                      electionStatus: item?.election_status,
                      election: item,
                      election_date_time: item?.election_date_time,
                    },
                  });
                }
              }}
            >
              <img
                class="img-fluid"
                src={
                  item?.election_status == "Not Started" ? blackpin : yellowpin
                }
                width="20px"
                height="20px"
                alt=""
              />
            </button>
          </Marker>
        );
      })}
    </ReactMapGL>
  );
}
