import React from "react";

import { Link } from "react-router-dom";

function Button({ title, path }) {
  return (
    <Link to={path} class="btn btn-black w-100 py-2">
      {title}
    </Link>
  );
}

export default Button;
