import React from "react";
import { fData } from "fbase";

const Comment = ({ userObj, yweetObj, commentObj, YweetTextRef }) => {
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure to delete this comment?");
    if (ok) {
      await fData.updateDoc(YweetTextRef, {
        comments: [...yweetObj.comments.filter((f) => f.id !== commentObj.id)],
      });
    }
  };
  return (
    <div>
      <h5>{commentObj.content}</h5>
      {userObj.uid === commentObj.creatorId && (
        <button onClick={onDeleteClick}>Delete</button>
      )}
    </div>
  );
};

export default Comment;
