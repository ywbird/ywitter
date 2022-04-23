import Yweet from "components/Yweet";
import { fAuth, fData, fStorage } from "fbase";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Profile = ({ refreshUser, userObj }) => {
  const [myYweets, setMyYweets] = useState([]);
  const [newDisplayName, setNewDiaplayName] = useState(userObj.displayName);
  const [newPhoto, setNewPhoto] = useState(userObj.photoURL);
  const fileInput = useRef();
  const navigate = useNavigate();
  const onLogOutClick = () => {
    fAuth.getAuth().signOut();
    navigate(-1);
  };
  const getMyYweets = async () => {
    const q = fData.query(
      fData.collection(fData.getFirestore(), "yweets"),
      // where('text', '==', 'hehe') // where뿐만아니라 각종 조건 이 영역에 때려부우면 됨
      fData.orderBy("createdAt", "desc"),
      fData.where("creatorId", "==", userObj.uid)
    );
    const unsubscribe = fData.onSnapshot(q, (querySnapshot) => {
      const newArray = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setMyYweets(newArray);
    });

    return () => {
      unsubscribe();
    };
  };
  useEffect(() => {
    getMyYweets();
  });
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDiaplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (
      userObj.displayName !== newDisplayName ||
      userObj.photoURL !== newPhoto
    ) {
      let fileUrl = "";
      if (newPhoto !== "") {
        try {
          const deleteFileRef = fStorage.ref(
            fStorage.getStorage(),
            userObj.photoURL
          );
          await fStorage.deleteObject(deleteFileRef);
        } catch {}
        const fileRef = fStorage.ref(
          fStorage.getStorage(),
          `${userObj.uid}/${uuidv4()}`
        );
        const response = await fStorage.uploadString(
          fileRef,
          newPhoto,
          "data_url"
        );
        fileUrl = await fStorage.getDownloadURL(response.ref);
      }
      await fAuth.updateProfile(fAuth.getAuth().currentUser, {
        displayName: newDisplayName,
        photoURL: fileUrl,
      });
      refreshUser();
    }
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (event) => {
      const {
        currentTarget: { result },
      } = event;
      setNewPhoto(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearFile = () => {
    setNewPhoto("");
    fileInput.current.value = "";
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={onChange}
          value={newDisplayName}
          placeholder="Display name"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Save changes" />
        {newPhoto && (
          <div>
            <img src={newPhoto} alt="File" width="50px" />
            <button onClick={onClearFile}>Clear</button>
          </div>
        )}
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      {myYweets.map((e) => (
        <Yweet key={e.id} yweetObj={e} userObj={userObj} />
      ))}
    </>
  );
};

export default Profile;
