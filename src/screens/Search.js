import React, { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import API from "../services/ApiLists";
import { ApiCall } from "../services/ApiCall";

import menu from "../images/menu-ico.svg";
import home from "../images/home-ico.svg";
import { useTranslation } from "react-i18next";
import "../languages/i18n";

export default function Search() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("user");
  const { t, i18n } = useTranslation();

  function Searchftn() {
    var formData = new FormData();

    formData.append("search_text", search);
    formData.append("type", type);

    ApiCall("Post", API.searchApi, formData, {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiY2Q5NmMwY2ViMGExZTUwNjIzNmViYmFiODIwNjY5NTE2ZmEyNTU4MDBhYzZlMWFjNDk4ZGQ0ZTdhYzJmZTVlMGZkODFlM2I0YzE3YzA0ZjIiLCJpYXQiOjE2NDM4MDcwNjIsIm5iZiI6MTY0MzgwNzA2MiwiZXhwIjoxNjc1MzQzMDYyLCJzdWIiOiIxMyIsInNjb3BlcyI6W119.ZKTgcyxkhl1yLXkXME1EifdBQO48SZ0sZcoz-AlhAdN-2Dw40Im9nej_bg2ei2kY4-o0T6iRpCGZ2_4dl3jPkVDhcoiuEJOsS0xelCjoSPc5I06ABS9NQ7BepQnRET6eRqIcZyeZitPLgLrNqgHZWvHumH_Iw-U64jGJlRfoKvyc1TWeLVLsaCUpMwrnjn1iUVj2JJs_63gUBO2ZjBNJHkoBqskTLUkXtkutWzPcciCBq7FNLckMsx15RFSWsbm3K6rXZqXuiHX-RA5ehPZE1AFvYJQal04ADr2LZN3jSOL_8xkgYOcnjW0PZGBmzY2HZ-ovjWrO8T9PMn3GQ9AH5ykD2PpC-HAIWdOwk589CNHRqN7Zks_vpnt-jjhvOx2SEnI_QwU-T3Oc30KEQ-6QUHqA4oHoVZmyZ1mP8XCB_xVo9SLxeDzRR2X5ZafJIH7IuByjy1fKNkvrj8STNnr7PM8VejJBmEWLPho1_Y1llG7NKTMMIVeoq3sCTS6dmUUUhrWdhrJq2gdYkMZW6YmYiXC25bhqWG6cWZhWAokOB4X3SYuGGiE8KnuuyjmcaL2O2C7wa080O-dzWcaZ3nu4R7SApLE3KVVtLxL21U3MfSODn8tz59R0bKKoREjqRcYqLVGvA1twKhrPr1DyMN6l4uNA5xQeG0DxJDxV0Kqo0PQ",
      Accept: "application/json",
    })
      .catch((error) => {
        console.log("erorr reponse", error);
        //   reject(error.response);
      })
      .then((resp) => {
        navigate("/category", {
          state: {
            searchData: resp.data.data,
            type: type,
          },
        });
        console.log(resp.data);
      });
  }

  return (
    <div class="container-fluid">
      <header class="row">
        <button class="btn btn-menu">
          <img class="img-fluid" src={menu} alt="ico" />
        </button>
        <div class="search-form">
          <input
            class="form-control"
            type="text"
            placeholder={t("placeHolders.Search")}
            onChange={(text) => setSearch(text.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                Searchftn();
              }
            }}
          />
        </div>
      </header>

      <div class="row top-search-category">
        <form action="#">
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="radio"
                name="search-cat"
                checked={type == "business" ? true : false}
                onChange={() => {
                  setType("business");
                }}
              />
              {t("Buttons.Business")}
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="radio"
                name="search-cat"
                checked={type == "election" ? true : false}
                onChange={() => {
                  setType("election");
                }}
              />
              {t("Buttons.Election")}
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="radio"
                name="search-cat"
                checked={type == "user" ? true : false}
                onChange={() => {
                  setType("user");
                }}
              />
              {t("Buttons.User")}
            </label>
          </div>
        </form>
      </div>

      <section class="content-sec row">
        <div class="search-listing">
          <h6> {t("Buttons.History")}</h6>
          <ul class="list-unstyled search-item">
            <li>
              <a href="javascript:;">Sub-item</a>
            </li>
            <li>
              <a href="javascript:;">Sub-item</a>
            </li>
            <li>
              <a href="javascript:;">Sub-item</a>
            </li>
            <li>
              <a href="javascript:;">Sub-item</a>
            </li>
            <li>
              <a href="javascript:;">Sub-item</a>
            </li>
            <li>
              <a href="javascript:;">Sub-item</a>
            </li>
            <li>
              <a href="javascript:;">Sub-item</a>
            </li>
            <li>
              <a href="javascript:;">Sub-item</a>
            </li>
            <li>
              <a href="javascript:;">Sub-item</a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
