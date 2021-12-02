import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./App.css";

function App() {
  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    // nhận dạng các khuôn mặt trên ảnh
    const dections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    // console.log(dections);
    // tạo lớp canvas trên ảnh
    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    faceapi.matchDimensions(canvasRef.current, {
      width: 940,
      height: 650,
    }); // gan khung nhan dang vao khuong mat trong anh

    const resize = faceapi.resizeResults(dections, {
      width: 940,
      height: 650,
    });
    // vẽ khung nhận dạng khuông mặt
    faceapi.draw.drawDetections(canvasRef.current, resize);
    //  nhận dạng biểu cảm trên khuôn mặt
    faceapi.draw.drawFaceExpressions(canvasRef.current, resize);
    // vẽ đồ thị trên khuôn mặt
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resize);
  };

  useEffect(() => {
    const loadedModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };
    imgRef.current && loadedModels();
  }, []);
  return (
    <div className="App">
      <img
        crossOrigin="anonymous"
        ref={imgRef}
        src="https://images.pexels.com/photos/1037989/pexels-photo-1037989.jpeg?cs=srgb&dl=pexels-hannah-nelson-1037989.jpg&fm=jpg"
        alt="unfind"
        width="940"
        height="650"
      />

      <canvas ref={canvasRef} width="940" height="650" />
    </div>
  );
}

export default App;
