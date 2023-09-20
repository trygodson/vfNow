import axios from "axios";

export function ApiCall(type, sourceUrl, Data, headers = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: type,
      url: sourceUrl,
      data: Data,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        ...headers,
      },
    })
      .catch((error) => {
        console.log(error);
        reject(error.response);
      })
      .then((resp) => {
        console.log(resp);
        resolve(resp);
      });
  });
}
