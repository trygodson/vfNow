// import { createContext, useContext, useEffect, useState } from 'react';
// import { connect } from 'socket.io-client';
// import { EVENTS } from '../services/socketEvents';

// const SocketContext = createContext({
//   socket: () => null,
//   selectedUser: undefined,
//   setSelectedUser: () => null,
//   users: [],
//   setUsers: () => null,
// });
// // const socket = connect('wss://chat.voteandfun.com:7005/');

// const SocketProvider = ({ children }) => {
//   const [selectedUser, setSelectedUser] = useState();
//   const [users, setUsers] = useState([]);

//   // console.log('from socket top', socket);

//   socket.emit('connected', {
//     user_id: 'admin',
//   });

//   socket.on(EVENTS.ONLINE_USERS, (value) => {
//     console.log(value, 'from socket context');
//     setUsers((prev) => [...prev, value]);
//   });
//   // useEffect(() => {}, [socket]);

//   return (
//     <SocketContext.Provider value={{ socket, setUsers, setSelectedUser, users, selectedUser }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);

// export default SocketProvider;
