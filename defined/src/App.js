import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import NewPost from "./components/NewPost";

function App() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

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
    <div>
      <Navbar />
      {image ? (
        <NewPost image={image} />
      ) : (
        <input
          onChange={(e) => setFile(e.target.files[0])}
          id="file"
          type="file"
        />
      )}
    </div>
  );
}

export default App;
