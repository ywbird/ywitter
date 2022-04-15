import Yweet from "components/Yweet";
import { fData, fStorage } from "fbase";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [yweet, setYweet] = useState("");
  const [yweets, setYweets] = useState([]);
  const [file, setFile] = useState("");
  const fileInput = useRef();
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
    let fileUrl;
    if (file !== "") {
      const fileRef = fStorage.ref(
        fStorage.getStorage(),
        `${userObj.uid}/${uuidv4()}`
      );
      const response = await fStorage.uploadString(fileRef, file, "data_url");
      fileUrl = await fStorage.getDownloadURL(response.ref);
    }
    const yweetObj = {
      content: yweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      comments: [],
      fileUrl,
    };
    try {
      await fData.addDoc(
        fData.collection(fData.getFirestore(), "yweets"),
        yweetObj
      );
      // console.log("Document written with ID: ", docRef.id);
      setYweet("");
      setFile("");
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
      setFile(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearFile = () => {
    setFile("");
    fileInput.current.value = "";
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={yweet}
          type="text"
          placeholder="What's on your mind?"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Yweet" />
        {file && (
          <div>
            <img src={file} alt="File" width="50px" />
            <button onClick={onClearFile}>Clear</button>
          </div>
        )}
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
