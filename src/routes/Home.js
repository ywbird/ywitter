import { fData } from "fbase";
import React, { useEffect, useState } from "react";

const Home = () => {
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
    console.log(yweets);
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await fData.addDoc(
        fData.collection(fData.getFirestore(), "yweets"),
        {
          content: yweet,
          createdAt: Date.now(),
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
          <h4 key={e.id}>{e.content}</h4>
        ))}
      </div>
    </div>
  );
};

export default Home;
