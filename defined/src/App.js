import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import NewPost from "./components/NewPost";
import defaultImage from "./asset/Image/default.png";

function App() {
  const [file, setFile] = useState();
  const [image, setImage] = useState({
    url: defaultImage,
    width: 512,
    height: 512,
  });

  useEffect(() => {
    const getImage = () => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage({
          url: img.src,
          width: img.width,
          height: img.height,
        });
      };
    };

    file && getImage();
  }, [file]);
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="recognition-center">
          <div className="input-recognition">
            <input
              onChange={(e) => setFile(e.target.files[0])}
              id="file"
              type="file"
            />
          </div>
          <NewPost image={image} />
        </div>
      </div>
    </>
  );
}

export default App;
