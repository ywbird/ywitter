import { fData } from "fbase";
import Comment from "./Comment";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Yweet = ({ yweetObj, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newYweet, setNewYweet] = useState(yweetObj.content);
  const [comment, setComment] = useState("");
  const YweetTextRef = fData.doc(
    fData.getFirestore(),
    "yweets",
    `${yweetObj.id}`
  );
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure to delete this yweet?");
    if (ok) {
      await fData.deleteDoc(YweetTextRef);
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onEditSubmit = async (event) => {
    event.preventDefault();
    await fData.updateDoc(YweetTextRef, {
      content: newYweet,
    });
    toggleEditing();
  };
  const onEditChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewYweet(value);
  };
  const onCommentSubmit = async (event) => {
    event.preventDefault();
    await fData.updateDoc(YweetTextRef, {
      comments: [
        ...yweetObj.comments,
        {
          content: comment,
          creatorId: userObj.uid,
          createdAt: Date.now(),
          id: uuidv4(),
        },
      ],
    });
    setComment("");
  };
  const onCommentChange = (event) => {
    const {
      target: { value },
    } = event;
    setComment(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onEditSubmit}>
            <input
              type="text"
              onChange={onEditChange}
              placeholder="Edit your yweet"
              value={newYweet}
              required
            />
            <input type="submit" value="Update" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{yweetObj.content}</h4>
          {yweetObj.creatorId === userObj.uid && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
          {yweetObj.comments.map((d) => (
            <Comment
              key={d.id}
              yweetObj={yweetObj}
              commentObj={d}
              YweetTextRef={YweetTextRef}
              userObj={userObj}
            />
          ))}
        </>
      )}
      <form onSubmit={onCommentSubmit}>
        <input
          type="text"
          onChange={onCommentChange}
          placeholder="Add a comment..."
          value={comment}
          required
        />
        <input type="submit" value="Comment" />
      </form>
    </div>
  );
};

export default Yweet;
