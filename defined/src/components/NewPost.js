import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

function NewPost({ image }) {
  //   const { image } = props;
  const { url, width, height } = image;
  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    // nhận dạng các khuôn mặt trên ảnh
    const dections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();
    // tạo lớp canvas trên ảnh
    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    faceapi.matchDimensions(canvasRef.current, {
      width: width,
      height: height,
    }); // gan khung nhan dang vao khuong mat trong anh

    const resize = faceapi.resizeResults(dections, {
      width: width,
      height: height,
    });

    console.log(resize);
    // vẽ khung nhận dạng khuông mặt
    faceapi.draw.drawDetections(canvasRef.current, resize);
    //  nhận dạng biểu cảm trên khuôn mặt
    faceapi.draw.drawFaceExpressions(canvasRef.current, resize);

    // vẽ đồ thị trên khuôn mặt
    // faceapi.draw.drawFaceLandmarks(canvasRef.current, resize);
    // nhận dạng tuổi và giới tính
    resize.forEach((detection) => {
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: Math.round(detection.age) + ", " + detection.gender,
      });
      drawBox.draw(canvasRef.current);
    });
  };

  useEffect(() => {
    const loadedModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };
    imgRef.current && loadedModels();
  }, []);
  return (
    <div>
      <img
        crossOrigin="anonymous"
        ref={imgRef}
        src={url}
        alt="unfind"
        width={width}
        height={height}
      />

      <canvas ref={canvasRef} width="940" height="650" />
    </div>
  );
}

export default NewPost;
