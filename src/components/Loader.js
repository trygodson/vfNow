import React from 'react';

import ModalView from 'react-modal';

const Loader = () => {
  const [modalIsOpen, setIsOpen] = React.useState(true);

  return (
    // <div
    //   style={{
    //     position: 'fixed',
    //     width: '100vw',
    //     height: '100vh',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     zIndex: 3000,
    //     inset: '0px',
    //     backgroundColor: 'rgba(0,0,0, 0.55)',
    //   }}
    // >
    //   <img
    //     style={{ alignSelf: 'center', justifySelf: 'center' }}
    //     className="loader-position"
    //     src="/images/loader/loader.gif"
    //     width={100}
    //   />
    // </div>
    <div className="loader-view-container">
      <ModalView isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)}>
        <img className="loader-position" src="/images/loader/loader.gif" width={100} />
      </ModalView>
    </div>
  );

  {
    /* <ModalView isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)} style={{ zIndex: 3000 }}>
      </ModalView> */
  }
};

export default Loader;
