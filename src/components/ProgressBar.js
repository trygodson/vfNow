import React from "react";

const ProgressBar = ({ position, remaining, style }) => {
  return position == 1 ? (
    <div className="position-relative">
      <img className="progress-img" src="progressBars/position1.svg" />
    </div>
  ) : position == 2 ? (
    <div className="position-relative">
      <img className="progress-img" src="progressBars/position2.svg" />
      <span className="progress-p">- {remaining}</span>
    </div>
  ) : position == 3 ? (
    <div className="position-relative">
      <img className="progress-img" src="progressBars/position3.svg" />
      <span className="progress-p" style={{ right: 33 }}>
        - {remaining}
      </span>
    </div>
  ) : position == 4 ? (
    <div className="position-relative">
      <img className="progress-img" src="progressBars/position4.svg" />
      <span className="progress-p" style={{ right: 53 }}>
        - {remaining}
      </span>
    </div>
  ) : (
    <div className="position-relative">
      <img className="progress-img" src="progressBars/position5.svg" />
      <span className="progress-p" style={{ right: 83 }}>
        - {remaining}
      </span>
      <span className={`progress-posi ${style && "postion-avatar-span"}`}>
        {position}
      </span>
    </div>
  );
};

export default ProgressBar;
