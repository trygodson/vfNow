import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import MessageBox from '../../components/MessageBox';
import { getUserData } from '../../Functions/Functions';
import moment from 'moment';
import { io, connect } from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import { EVENTS } from '../../services/socketEvents';

var socket = io('wss://chat.voteandfun.com:7005/');

export default function UserChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [userFriendChatMessage, setUserFriendChatMessage] = useState();
  const [msg, setMsg] = useState('');
  const [error, setError] = React.useState(false);
  const [isReport, setIsReport] = React.useState(false);
  const [error_title, seterror_title] = useState('');
  const [review, setReview] = useState('');
  const [user, setUser] = useState();
  
  // console.log("chat user", location.state?.chatUser);
  socket.emit('connected', {
    user_id: user?.user_id,
  });

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      ChatMessages(userData);
      ChatReadMessages(userData);
      console.log("oooooooooooooooooooooooooooooooo");
      console.log(socket);
      console.log("oooooooooooooooooooooooooooooooo");
      socket.on(EVENTS.ONLINE_USERS, (value) => {
        setLoader(false);
      });
      console.log("//////////////////////////////");
      console.log(msg);
      socket.on(EVENTS.RECIEVE_MESSAGE, (msg) => { alert("recv msg");
        // const { senderId, message, type, date, unread, totalUnread } = msg;
        console.log(msg, 'receive message');
        if (msg) {
          console.log(msg, 'receive message');
          let newMsg = {
            created_at: msg?.date,
            message: msg?.message,
            sender_id: msg?.senderId,
            receiver_id: location?.state?.chatUser?.user_id,
          };
          setUserFriendChatMessage((prev) => [newMsg, ...prev]);
        }
        // setChatUsers(msg);
        // setArrivalMessage({
        //   message: { text: message.text },
        //   sender: { username: sender.username },
        // });
      });
    }
    return () => {
      socket.disconnect();
    };

    //passing getData method to the lifecycle method
  }, []);

  function ChatReadMessages(user) {
    var formData = new FormData();

    formData.append('user_id', user?.user_id);
    formData.append('chat_user_id', location.state?.chatUser?.user_id);

    ApiCall('Post', API.userReadmessageApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log('MSGS', resp.data);
        // setLoader(false);
        // setUserFriendChatMessage(resp.data.data.messages);
      });
  }

  function DeleteChatMessages(user, msg_id) {
    var formData = new FormData();

    formData.append('user_id', user?.user_id);
    formData.append('chat_user_id', location.state?.chatUser?.user_id);
    if (msg_id != 'null') formData.append('message_id', msg_id);

    ApiCall('Post', API.DeletemessageApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log('delete', resp.data);
        setLoader(false);
        setError(true);
        seterror_title(t('alerts.Delete Chat successfully'));
        setUserFriendChatMessage(resp.data.data.messages);
      });
  }

  function ReportChatMessages(user, chat_id) {
    var formData = new FormData();

    formData.append('reported_by', user?.user_id);
    formData.append('reported_to', location.state?.chatUser?.user_id);
    formData.append('description', 'block text');

    if (chat_id != 'null') formData.append('chat_id', chat_id);

    ApiCall('Post', API.DeletemessageApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log('User ReportedUser Reported', resp.data.data);
        setLoader(false);
        setError(true);
        seterror_title(t('alerts.User Reported'));
      });
  }

  function ChatMessages(user) {
    var formData = new FormData();

    formData.append('user_id', user?.user_id);
    formData.append('chat_user_id', location.state?.chatUser?.user_id);

    ApiCall('Post', API.userFriendChatmessageApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        console.log('setUserFriendChatMessage View', resp.data.data.messages);
        // setLoader(false);
        setUserFriendChatMessage(resp.data.data.messages);
      });
  }
  function ChatMessageSend(msg) {
    var formData = new FormData();
    formData.append('sender_id', user?.user_id);
    formData.append('receiver_id', location.state?.chatUser?.user_id);
    formData.append('message', msg);

    ApiCall('Post', API.userFriendchatSendApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        socket.emit(
          EVENTS.SEND_MESSAGE,
          JSON.stringify({
            senderId: user?.user_id,
            receiverId: location.state?.chatUser?.user_id ? location.state?.chatUser?.user_id : 'admin',
            message: resp?.data?.data?.messages[0]?.message,
            type: 'user',
            date: resp?.data?.data?.messages[0]?.created_at,
            unread: 0,
            totalUnread: 0,
          }),
        );
        
        console.log('send message');
        console.log(JSON.stringify({
          senderId: user?.user_id,
          receiverId: location.state?.chatUser?.user_id ? location.state?.chatUser?.user_id : 'admin',
          message: resp?.data?.data?.messages[0]?.message,
          type: 'user',
          date: resp?.data?.data?.messages[0]?.created_at,
          unread: 0,
          totalUnread: 0,
        }));

        setLoader(false);
        ChatMessages(user);
      });
  }
  return (
    <div class="container-fluid">
      <header class="top-bar">
        <div class="container">
          <div class="row">
            <div class="col-12 tob-bar-inner">
              <button class="btn pe-0" onClick={() => navigate(-1)}>
                <img src="images/arrow_back_ios-24px.svg" />
              </button>
              <h6 class="chat-head">
                <div class="avatar">
                  <img
                    src={
                      location.state?.chatUser?.picture ? location.state?.chatUser?.picture : 'images/avatar-img-2.png'
                    }
                    alt="username"
                  />
                </div>
                <div class="user-cont">
                  <span class="name text-truncate">{location.state?.chatUser?.username}</span>
                  <small class="text-truncate">
                    Last seen {moment(location.state?.chatUser?.last_message_time).format('LLL')}
                  </small>
                </div>
              </h6>

              <div class="dropdown head-dd">
                <button
                  class="btn dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img class="img-fluid" src="images/vertical-dot.svg" />
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a class="dropdown-item" onClick={() => DeleteChatMessages(user, 'null')}>
                      {t('Menus.Delete Chat')}
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:;">
                      {t('Menus.Block Notification')}
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:;">
                      {t('Menus.Block User')}
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => setIsReport(true)}
                      // data-bs-toggle="modal"
                      // data-bs-target="#report-modal"
                    >
                      {t('Menus.Report User')}
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Chat Sec Starts here --> */}
      <div class="chat-sec">
        <ScrollToBottom className="chat-area">
          {userFriendChatMessage
            ?.map((item, index) => {
              return item.sender_id == user?.user_id ? (
                <div class="msg-row-parent sent">
                  <div class="msg-row">
                    <p>{item.message}</p>
                    <span class="time">
                      {moment(item.created_at).format('LT')}
                      {item.read > 0 ? (
                        <img class="ico" src="images/msg-read-ico.svg" alt="ico" />
                      ) : (
                        <img class="ico" src="images/msg-received-ico.svg" alt="ico" />
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div class="msg-row-parent">
                  <div class="msg-row">
                    <p>{item.message}</p>
                    <span class="time">{moment(item.created_at).format('LT')}</span>
                  </div>
                </div>
              );
            })
            .reverse()}
        </ScrollToBottom>
        <div class="type-area">
          <div class="type-inside">
            <button class="btn btn-emoti">
              <img src="images/smilie-ico.svg" alt="ico" />
            </button>
            <input
              type="text"
              class="form-control"
              // placeholder="Say something..."
              placeholder={t('Say something...')}
              onChange={(text) => {
                setMsg(text.target.value);
              }}
              value={msg}
              onKeyDown={(e) => {
                if (e.code === 'Enter') {
                  ChatMessageSend(msg);
                  setMsg('');
                }
              }}
            />
          </div>
        </div>
      </div>

      {error && <MessageBox error={error} setError={setError} title={error_title} color={'black'} />}
      {isReport && (
        <div
          class="modal bg-blur show"
          style={{
            display: isReport ? 'block' : 'none',
            backgroundColor: 'rgba(222, 223, 222 , 0.9)',
          }}
          // onClick={() => {
          //   setIsReport(false);
          // }}
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="product-wrap px-3 mt-3x zIndex">
                <div class=" mb-3">
                  {/* <img class="ico" src="images/fun-ico.svg" alt="" />*/}
                  <h3>{t('Header.feedback')}</h3>
                </div>
                <div class="feedback-wrap">
                  <div class="f-row mb-0">
                    <div class="fr-head">
                      <div class="avatar">
                        <img
                          src={
                            location.state?.chatUser?.picture
                              ? location.state?.chatUser?.picture
                              : 'images/logo-dummy.png'
                          }
                          alt="username"
                        />
                      </div>
                      <div class="avatar-detail">
                        <h6>{location.state?.chatUser?.username}</h6>
                      </div>
                    </div>
                    <p class="cont text-yellow">{review ? review : t('placeHolders.Give reason for report')}</p>
                  </div>
                </div>
              </div>
              <div class="bottom-input">
                <div class="type-area">
                  <div class="type-inside">
                    <button class="btn btn-emoti">
                      <img src="images/smilie-ico.svg" alt="ico" />
                    </button>
                    <input
                      type="text"
                      class="form-control"
                      placeholder={t('placeHolders.Say something')}
                      onChange={(text) => setReview(text.target.value)}
                      required
                      onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                          ReportChatMessages(user, 'null');
                          setIsReport(false);
                        }
                      }}
                    />
                  </div>
                </div>
                <button class="btn btn-close-x p-0" onClick={() => setIsReport(false)}>
                  <img class="img-fluid" src="images/close-x.svg" alt="ico" data-bs-dismiss="modal" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <!-- Chat Sec Ends here --> */}
    </div>
  );
}
