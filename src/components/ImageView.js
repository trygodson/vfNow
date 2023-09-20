import React from "react";
import { Carousel } from "react-responsive-carousel";
const ImageView = ({ imageView, setIsImageView, arrayItems }) => {
  const [modalIsOpen, setIsOpen] = React.useState(true);
  // console.log("arrayItems", arrayItems);
  return (
    <div
      class="modal bg-blur reg-modal show"
      role="dialog"
      aria-hidden="true"
      style={{
        display: modalIsOpen ? "block" : "none",
        backgroundColor: "rgba(0, 0, 0 , 1)",
      }}
      onClick={() => setIsImageView(false)}
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content minh-unset" data-bs-dismiss="modal">
          <Carousel
            showArrows={false}
            showThumbs={false}
            showStatus={false}
            selectedItem={imageView}
          >
            {arrayItems?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="image-view"
                  onClick={() => setIsImageView(false)}
                >
                  <img src={item?.picture} />
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ImageView;
