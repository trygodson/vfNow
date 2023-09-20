import { createContext, useContext, useEffect, useState } from 'react';

const CopyElectionContext = createContext({
  copyElection: undefined,
  setCopyElection: () => null,
});
// const socket = connect('wss://chat.voteandfun.com:7005/');

const CopyElectionProvider = ({ children }) => {
  const [copyElection, setCopyElection] = useState(null);

  // console.log('from socket top', socket);

  // useEffect(() => {}, [socket]);

  return (
    <CopyElectionContext.Provider value={{ setCopyElection, copyElection }}>{children}</CopyElectionContext.Provider>
  );
};

export const useCopyElectionContext = () => useContext(CopyElectionContext);

export default CopyElectionProvider;
