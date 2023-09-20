import React from "react";

function Button({ title, onClickftn }) {
  return (
    <button class="btn btn-black w-100 py-2" onClick={onClickftn}>
      {title}
    </button>
  );
}

export default Button;
