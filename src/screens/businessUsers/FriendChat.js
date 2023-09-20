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

import { EVENTS } from '../../services/socketEvents';
import Loader from '../../components/Loader';

const socket = io('wss://chat.voteandfun.com:7005/');
export default function FriendChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [userFriendChatMessage, setUserFriendChatMessage] = useState([]);
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState();
  const [chatUsers, setChatUsers] = useState([]);

  socket.emit('connected', {
    user_id: user?.user_id,
  });

  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      ChatMessages(userData);

      socket.on(EVENTS.ONLINE_USERS, (value) => {
        setLoader(false);
      });

      socket.on(EVENTS.RECIEVE_MESSAGE, (msg) => {
        // const { senderId, message, type, date, unread, totalUnread } = msg;

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
  }, []);

  // useEffect(() => {
  // }, [socket]);

  // useEffect(() => {
  //   if (socket.connected) {
  //     socket.on(EVENTS.RECIEVE_MESSAGE, (msg) => {
  //       // const { senderId, message, type, date, unread, totalUnread } = msg;

  //       if (msg) {
  //         console.log(msg, 'receive message');
  //         let newMsg = {
  //           created_at: msg?.date,
  //           message: msg?.message,
  //           sender_id: msg?.senderId,
  //           receiver_id: location?.state?.chatUser?.user_id,
  //         };
  //         setUserFriendChatMessage((prev) => [...prev, newMsg]);
  //       }
  //       // setChatUsers(msg);
  //       // setArrivalMessage({
  //       //   message: { text: message.text },
  //       //   sender: { username: sender.username },
  //       // });
  //     });
  //   }
  // }, [socket]);

  function ChatMessages(user) {
    var formData = new FormData();

    formData.append('user_id', user?.user_id);
    formData.append('chat_user_id', location?.state?.chatUser?.user_id);

    ApiCall('Post', API.userFriendChatmessageApi, formData, {
      Authorization: `Bearer ` + user?.access_token,
      Accept: 'application/json',
    })
      .catch((error) => {
        // setLoader(false);
        console.log('erorr reponse', error);
        //   reject(error.response);
      })
      .then((resp) => {
        // console.log('setUserFriendChatMessage View', resp.data.data.messages);
        // setLoader(false);
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
            receiverId: location?.state?.chatUser?.user_id,
            message: resp?.data?.data?.messages[0]?.message,
            type: 'user',
            date: resp?.data?.data?.messages[0]?.created_at,
            unread: 0,
            totalUnread: 0,
          }),
        );

        // console.log(
        //   {
        //     senderId: user?.user_id,
        //     receiverId: location?.state?.chatUser?.user_id,
        //     message: resp.data.data?.messages[0]?.message,
        //     type: 'user',
        //     date: resp.data.data?.messages[0]?.created_at,
        //     unread: 0,
        //     totalUnread: 0,
        //   },
        //   'message',
        // );

        setLoader(false);
        // ChatMessages(user);
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
                    <small class="text-truncate">Last seen Jan 11, 17:09</small>
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
        {/* <!-- Chat Sec Ends here --> */}
      </div>
    </>
  );
}
