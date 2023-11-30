import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/custom-style.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import ScrollTop from './components/ScrollTop';
import OfflineMsg, { EnableLocation } from './components/OfflineMsg';
import Home from './screens/Home';
import Scan from './screens/Scan';
// import LoginMsg from "./screens/loginRegister/LoginMsg";
// import SignupConfirmModal from "./screens/loginRegister/SignupConfirmModal";
// import BusinessRegModal from "./screens/loginRegister/BusinessRegModal";
// import PreviewModal from "./screens/loginRegister/previewModal";

import Login from './screens/Login';
import Register from './screens/Register';
import UserRegister from './screens/UserRegister';
import BusinessDetailReg from './screens/BusinessDetailReg';
import BusinessDetail from './screens/BusinessDetail';
import BusinessReg from './screens/BusinessReg';
import LoadShopPics from './screens/LoadShopPics';
import LoadBusinessshopImages from './screens/LoadBusinessshopImages';
import BusinessCurrentLocation from './screens/BusinessCurrentLocation';
import BusinessPreview from './screens/BusinessPreview';
import BusinessHours from './screens/BusinessHours';
import Splash from './screens/Splash';
import Splash2 from './screens/Splash2';
import HomeMapFull from './screens/HomeMapFull';
import HomeMapCloset from './screens/HomeMapCloset';
import HappyWinner from './screens/HappyWinner';
import ShopFeedback from './screens/ShopFeedBack';
import Search from './screens/Search';
import GeneralCategory from './screens/generalCategory';
import ElectionDetail from './screens/ElectionDetail';
import BusinessHome from './screens/businessUsers/BusinessHome';
import BusinessMap from './components/BusinessMap';
import MyPage from './screens/businessUsers/MyPage';
import WorkingHours from './screens/businessUsers/WorkingHours';
import NewElection from './screens/businessUsers/NewElection';
import Election from './screens/businessUsers/Election';
import ElectionShare from './screens/businessUsers/ElectionShare';
import ElectionBusinessDetail from './screens/businessUsers/ElectionDetail';
import ElectionModify from './screens/businessUsers/ElectionModify';
import Customers from './screens/businessUsers/Customers';
import FriendChat from './screens/businessUsers/FriendChat';
import BusinessScan from './screens/businessUsers/Scan';
import VFvalue from './screens/businessUsers/VFvalue';
import Payment from './screens/businessUsers/Payment';
import Account from './screens/businessUsers/Account';
import ElectionVoteHistory from './screens/businessUsers/ElectionVoteHistory';
import ElectionGifts from './screens/businessUsers/ElectionGifts';

import UserProfile from './screens/registerUsers/UserProfile';
import UserVoteHistory from './screens/registerUsers/UserVoteHistory';
import UserElectionCandidate from './screens/registerUsers/UserElectionCandidate';
import UserGiftCollect from './screens/registerUsers/UserGiftCollect';
import UserFeedbackGiven from './screens/registerUsers/UserFeedbackGiven';
import AskForVote from './screens/registerUsers/AskForVote';
import DeliveryOptions from './screens/registerUsers/DeliveryOptions';
import UserFavourite from './screens/registerUsers/UserFavourite';
import UserFriendList from './screens/registerUsers/UserFriendList';
import UserChat from './screens/registerUsers/UserChat';

import GiveVote from './screens/visitorVote/GiveVote';
import GiveVoteRank from './screens/visitorVote/GiveVoteRank';
import VoteUser from './screens/visitorVote/VoteUser';

import API from './services/ApiLists';
import { ApiCall } from './services/ApiCall';
import { getUserData, storeUserLatitude, storeUserLongitude, GetAppTrackFunction } from './Functions/Functions';
import SelectElection from './screens/businessUsers/SelectElection';
import CopyElectionProvider from './context/copyElectionContext';
import UnknownRoute from './screens/404';
import BusinessDetailVisitorPreview from './screens/BusinessDetailVisitor';
// import './messaging_init_in_sw';
// import SocketProvider from './context/socketContext';
// import { onMessageListener } from "./Firebase";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

function App() {
  const [ip, setIP] = useState('');
  const [user, setUser] = useState();
  const [error, setError] = React.useState(false);
  const [locationError, setLocationError] = useState(false);

  // getTokenn(setTokenFound);
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });

  const getData = async () => {
    const res = await axios.get('https://geolocation-db.com/json/');

    if (res.data.IPv4) {
      VisitorLogin(res.data.IPv4);
    }
    setIP(res.data.IPv4);
  };
  // onMessage(messaging, (payload) => {
  //   console.log(payload, 'notification');
  // });

  // requestPermission();

  function storeCoordinates(position) {
    storeUserLatitude(position.coords.latitude);
    storeUserLongitude(position.coords.longitude);
    setLocationError(false);
    // console.log(position.coords.latitude, position.coords.longitude);
  }

  function errorHandler(e) {
    console.log('error', e);
    setLocationError(true);
    // alert('location error');
  }

  useEffect(() => {
    (async function () {
      navigator.geolocation.getCurrentPosition(storeCoordinates, errorHandler, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      });

      //passing getData method to the lifecycle method
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function (position) {
      //     console.log("user current location", position);

      //   });
      // }

      // storeUserLatitude(41.769131);
      // storeUserLongitude(12.349572);

      const userData = await getUserData();
      if (userData) {
        setUser(userData);
        GetAppTrackFunction(userData?.user_id, 'app', userData?.access_token);
        // getData();
      } else {
        getData();
      }
      window.ononline = (event) => {
        setError(false);
      };
      window.onoffline = (event) => {
        setError(true);
      };
    })();
  }, []);

  async function VisitorLogin(ip) {
    var formData = new FormData();

    formData.append('ip_address', ip);
    formData.append('device_type', 'test');
    formData.append('device_token', '1234567');
    formData.append('device_id', 'jshdjsdh878');

    ApiCall('Post', API.VisitorLoginApi, formData)
      .catch((error) => {
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        if (resp.data.data.length === 0) {
        } else {
          const jsonValue = JSON.stringify(resp.data.data);
          localStorage.setItem('user', jsonValue);
          console.log('vistor', resp.data.data);
          GetAppTrackFunction(resp.data.data?.user_id, 'app', resp.data.data?.access_token);
        }
      });
  }

  return error ? (
    <OfflineMsg error={error} setError={setError} />
  ) : locationError ? (
    <EnableLocation />
  ) : (
    <BrowserRouter>
      <CopyElectionProvider>
        <ScrollTop>
          <Routes>
            <Route path="/" element={<Splash />} />
            {/* <Route exact path="/">

              <Navigate to="/BusinessHome" />
            ) : (
              <Navigate to="/Home" />
            )}
          </Route> */}
            {/* <Route
            path="*"
            element={
              <Navigate
                to={user?.login_as == "business" ? "/BusinessHome" : "/Home"}
              />
            }
          /> */}
            <Route path="/electionDetails/:id" element={<ElectionBusinessDetail />} />

            <Route path="/splash" element={<Splash2 />} />
            <Route path="/Scan" element={<Scan />} />
            <Route path="/BusinessMap" element={<BusinessMap />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/userRegister" element={<UserRegister />} />
            <Route path="/businessDetailReg" element={<BusinessDetailReg />} />
            <Route path="/businessDetail" element={<BusinessDetail />} />
            <Route path="/businessDetailVisitor/:id" element={<BusinessDetailVisitorPreview />} />
            <Route path="/businessReg" element={<BusinessReg />} />
            {/* <Route path="/businessReg" element={<BusinessDetailReg />} /> */}
            <Route path="/loadShopPics" element={<LoadShopPics />} />
            <Route path="/WorkingHours" element={<WorkingHours />} />
            <Route path="/LoadBusinessshopImages" element={<LoadBusinessshopImages />} />
            <Route path="/businessHours" element={<BusinessHours />} />
            <Route path="/businessPreview" element={<BusinessPreview />} />
            <Route path="/businessCurrentLocation" element={<BusinessCurrentLocation />} />
            <Route path="/VFvalue" element={<VFvalue />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/ElectionGifts" element={<ElectionGifts />} />
            <Route path="/ElectionVoteHistory" element={<ElectionVoteHistory />} />
            <Route path="/home" element={<Home />} />
            <Route path="/homeMap" element={<HomeMapFull />} />
            <Route path="/homeMapCloset" element={<HomeMapCloset />} />
            <Route path="/happyWinner" element={<HappyWinner />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category" element={<GeneralCategory />} />
            <Route path="/electionDetail" element={<ElectionDetail />} />
            <Route path="/shopFeedback" element={<ShopFeedback />} />
            <Route path="/businessHome" element={<BusinessHome />} />
            <Route path="/businessScan" element={<BusinessScan />} />
            <Route path="/myPage" element={<MyPage />} />
            <Route path="/newElection" element={<NewElection />} />
            <Route path="/election" element={<Election />} />
            <Route path="/selectElection" element={<SelectElection />} />
            <Route path="/electionShare" element={<ElectionShare />} />
            <Route path="/electionModify" element={<ElectionModify />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/friendChat" element={<FriendChat />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/UserElectionCandidate" element={<UserElectionCandidate />} />
            <Route path="/UserGiftCollect" element={<UserGiftCollect />} />
            <Route path="/UserFeedbackGiven" element={<UserFeedbackGiven />} />
            <Route path="/AskForVote" element={<AskForVote />} />
            <Route path="/DeliveryOptions" element={<DeliveryOptions />} />
            <Route path="/UserFavourite" element={<UserFavourite />} />
            <Route path="/UserFriendList" element={<UserFriendList />} />
            <Route path="/UserChat" element={<UserChat />} />
            <Route path="/UserVoteHistory" element={<UserVoteHistory />} />
            <Route path="/404" element={<UnknownRoute />} />
            <Route path="/GiveVote" element={<GiveVote />} />
            <Route path="/GiveVoteRank" element={<GiveVoteRank />} />
            <Route path="/VoteUser" element={<VoteUser />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </ScrollTop>
      </CopyElectionProvider>
    </BrowserRouter>
  );
}

export default App;
