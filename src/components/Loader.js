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
      <ModalView
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <img className="loader-position" src="/images/loader/loader.gif" width={100} />
      </ModalView>
    </div>
  );

  {
    /* <ModalView isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)} style={{ zIndex: 3000 }}>
      </ModalView> */
  }
};
export const CustomModal = ({ open, setOpen, topClassName = 'modal-lay-wrap', showClose = true, children }) => {
  return (
    <ModalView
      style={{
        overlay: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },
        content: {
          width: 'auto',
          inset: '10px',
        },
      }}
      // overlayClassName={'blur_background'
      isOpen={open}
      onRequestClose={() => setOpen(false)}
    >
      <div className={topClassName}>
        {children}
        {showClose && (
          <button class="btn btn-close-x">
            <img class="img-fluid" src="./images/close-x.svg" alt="ico" onClick={() => setOpen(false)} />
          </button>
        )}
      </div>
    </ModalView>
  );
};

export default Loader;
