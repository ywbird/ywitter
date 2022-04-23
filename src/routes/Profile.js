import Yweet from "components/Yweet";
import { fAuth, fData } from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ refreshUser, userObj }) => {
  const [myYweets, setMyYweets] = useState([]);
  const [newDisplayName, setNewDiaplayName] = useState(userObj.displayName);
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
  }, []);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDiaplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await fAuth.updateProfile(fAuth.getAuth().currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
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
        <input type="submit" value="Save changes" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      {myYweets.map((e) => (
        <Yweet key={e.id} yweetObj={e} userObj={userObj} />
      ))}
    </>
  );
};

export default Profile;
