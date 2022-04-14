import React from "react";
const Yweet = ({ yweetObj, isOwner }) => {
  return (
    <div>
      <h4>{yweetObj.content}</h4>
    </div>
  );
};

export default Yweet;
