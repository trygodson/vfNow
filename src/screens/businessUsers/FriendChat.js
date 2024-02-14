import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { getUserData } from '../../Functions/Functions';
import moment from 'moment';
import { useSocket } from '../../context/socketContext';
import { io, connect } from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';

import { EVENTS, SOCKET_URL } from '../../services/socketEvents';
import Loader from '../../components/Loader';

const socket = io(SOCKET_URL);

export default function FriendChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [userFriendChatMessage, setUserFriendChatMessage] = useState([]);
  // const [socket, setSocket] = useState(null);
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState();
  const [chatUsers, setChatUsers] = useState([]);

  // useEffect(async () => {
  //   const userData = await getUserData();
  //   if (userData) {
  //     setLoader(false);
  //     setUser(userData);
  //     ChatMessages(userData);
  //     ChatReadMessages(userData);

  //     console.log('==================>');
  //     console.log(socket);

  //     socket.emit(EVENTS.CONNECTED, {
  //       user_id: userData?.user_id.toString(),
  //     });

  //     socket.on(EVENTS.ONLINE_USERS, (value) => {
  //       setLoader(false);
  //     });

  //     socket.on(EVENTS.RECIEVED_MESSAGE, (msg) => {
  //       const { senderId, message, type, date, unread, totalUnread } = msg;
  //       console.log(msg, 'receive message');
  //       if (msg) {
  //         let newMsg = {
  //           created_at: date,
  //           message: message,
  //           sender_id: senderId,
  //           receiver_id: location?.state?.chatUser?.user_id,
  //         };
  //         setUserFriendChatMessage((prev) => [newMsg, ...prev]);
  //       }
  //       setChatUsers(message);
  //     });
  //   }

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

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

  function ChatMessages(user) {
    var formData = new FormData();

    formData.append('user_id', user?.user_id);
    formData.append('chat_user_id', location?.state?.chatUser?.user_id);

    ApiCall('Post', API.userFriendChatmessageApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        console.log('erorr reponse', error);
      })
      .then((resp) => {
        console.log('setUserFriendChatMessage View', resp.data.data.messages);
        setUserFriendChatMessage(resp.data.data.messages);
      });
  }
  function ChatMessageSend(msg) {
    var formData = new FormData();
    formData.append('sender_id', user?.user_id);
    formData.append('receiver_id', location?.state?.chatUser?.user_id);
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
            unread: resp?.data?.data?.messages[0]?.unread_chats,
            totalUnread: resp?.data?.data?.messages[0]?.total_unread_chats,
          }),
        );
        console.log(
          JSON.stringify({
            senderId: user?.user_id,
            receiverId: location.state?.chatUser?.user_id ? location.state?.chatUser?.user_id : 'admin',
            message: resp?.data?.data?.messages[0]?.message,
            type: 'user',
            date: resp?.data?.data?.messages[0]?.created_at,
            unread: resp?.data?.data?.messages[0]?.unread_chats,
            totalUnread: resp?.data?.data?.messages[0]?.total_unread_chats,
          }),
        );

        setLoader(false);
        ChatMessages(user);
      });
  }
  return (
    <>
      {loader && <Loader />}

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
                        location?.state?.chatUser?.picture
                          ? location?.state?.chatUser?.picture
                          : 'images/avatar-img-2.png'
                      }
                      alt="username"
                    />
                  </div>
                  <div class="user-cont">
                    <span class="name text-truncate">{location?.state?.chatUser?.username}</span>
                    {location.state?.chatUser?.last_message_time ? (
                      <small class="text-truncate">
                        Last seen {moment(location.state?.chatUser?.last_message_time).format('LLL')}
                      </small>
                    ) : (
                      <small class="text-truncate"></small>
                    )}
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
                      <a class="dropdown-item" href="javascript:;">
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
                      <a class="dropdown-item" href="javascript:;">
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
        <div className="chat-sec">
          <ScrollToBottom className="chat-area">
            {userFriendChatMessage &&
              userFriendChatMessage.length > 0 &&
              userFriendChatMessage
                ?.map((item, index) => {
                  return item.sender_id == user?.user_id ? (
                    <div class="msg-row-parent sent" key={item.message + index}>
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
                    <div class="msg-row-parent" key={item.message + index}>
                      <div class="msg-row">
                        <p>{item.message}</p>
                        <span class="time">{moment(item.created_at).format('LT')}</span>
                      </div>
                    </div>
                  );
                })
                .reverse()}
            {/* <div class="msg-row-parent sent">
            <div class="msg-row">
              <p>Message READ</p>
              <span class="time">
                10:47 AM
                <img class="ico" src="images/msg-read-ico.svg" alt="ico" />
              </span>
            </div>
          </div>
          <div class="msg-row-parent sent">
            <div class="msg-row">
              <p>Message RECEIVED</p>
              <span class="time">
                10:47 AM
                <img class="ico" src="images/msg-received-ico.svg" alt="ico" />
              </span>
            </div>
          </div>
          <div class="msg-row-parent sent">
            <div class="msg-row">
              <p>Message SENT</p>
              <span class="time">
                10:47 AM
                <img class="ico" src="images/msg-sent-ico.svg" alt="ico" />
              </span>
            </div>
          </div>
          <div class="msg-row-parent sent">
            <div class="msg-row">
              <p>Message NOT SENT</p>
              <span class="time">
                10:47 AM
                <img class="ico" src="images/msg-not-sent-ico.svg" alt="ico" />
              </span>
            </div>
          </div> */}
          </ScrollToBottom>
          <div class="type-area" style={{ marginBottom: '30px' }}>
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
              />
              <img
                src="images/chat-send.png"
                width="30"
                onClick={(e) => {
                  ChatMessageSend(msg);
                  setMsg('');
                }}
              />
            </div>
          </div>
        </div>
        {/* <!-- Chat Sec Ends here --> */}
      </div>
    </>
  );
}
