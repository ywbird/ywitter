import { isEditable } from "@testing-library/user-event/dist/utils";
import { fData } from "fbase";
import React, { useState } from "react";

const Yweet = ({ yweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newYweet, setNewYweet] = useState(yweetObj.content);
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
  const onSubmit = async (event) => {
    event.preventDefault();
    await fData.updateDoc(YweetTextRef, {
      content: newYweet,
    });
    toggleEditing();
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewYweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              onChange={onChange}
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
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Yweet;
