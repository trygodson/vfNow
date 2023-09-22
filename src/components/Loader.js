import React from 'react';

import ModalView from 'react-modal';

const Loader = () => {
  const [modalIsOpen, setIsOpen] = React.useState(true);

  return (
    <div className="loader-view-container">
      <ModalView isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)}>
        <img className="loader-position" src="/images/loader/loader.gif" width={100} />
      </ModalView>
    </div>
  );
};

export default Loader;
