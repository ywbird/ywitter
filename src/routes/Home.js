import Yweet from "components/Yweet";
import { fData } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [yweet, setYweet] = useState("");
  const [yweets, setYweets] = useState([]);
  const getYweets = async () => {
    setYweets([]);
    const q = fData.query(fData.collection(fData.getFirestore(), "yweets"));
    const querySnapshot = await fData.getDocs(q);
    querySnapshot.forEach((doc) => {
      const nweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      setYweets((prev) => [nweetObj, ...prev]);
    });
  };
  useEffect(() => {
    getYweets();
    const q = fData.query(
      fData.collection(fData.getFirestore(), "yweets"),
      // where('text', '==', 'hehe') // where뿐만아니라 각종 조건 이 영역에 때려부우면 됨
      fData.orderBy("createdAt")
    );
    const unsubscribe = fData.onSnapshot(q, (querySnapshot) => {
      const newArray = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setYweets(newArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await fData.addDoc(
        fData.collection(fData.getFirestore(), "yweets"),
        {
          content: yweet,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          comments: [],
        }
      );
      console.log("Document written with ID: ", docRef.id);
      setYweet("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setYweet((prev) => (prev = value));
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={yweet}
          type="text"
          placeholder="What's on your mind?"
        />
        <input type="submit" value="Yweet" />
      </form>
      <div>
        {yweets.map((e) => (
          <Yweet key={e.id} yweetObj={e} userObj={userObj} />
        ))}
      </div>
    </div>
  );
};

export default Home;
