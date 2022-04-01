import { fData } from "fbase";
import React, { useState } from "react";

const Home = () => {
  const [yweet, setYweet] = useState("");
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
    </div>
  );
};

export default Home;
