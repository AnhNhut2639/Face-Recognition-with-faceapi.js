import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

function NewPost({ image }) {
  const { url, width, height } = image;
  const imgRef = useRef();
  const canvasRef = useRef();
  // nhận dạng người trong khung hình
  function LoadLabeledImages() {
    const labels = [
      "Black widow",
      "Captain America",
      "Captain Marvel",
      "Hawkeye",
      "Jim Rhodes",
      "Thor odinson",
      "Tony Stark",
    ];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(
            `/labeled_images/${label}/${i}.jpg`
          ); // dữ liệu files ảnh
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }

  const handleImage = async () => {
    // nhận dạng các khuôn mặt trên ảnh
    // const labeledFaceDescriptors = await LoadLabeledImages();
    // const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    const dections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender()
      .withFaceDescriptors();
    // tạo lớp canvas trên ảnh
    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    faceapi.matchDimensions(canvasRef.current, {
      width: width,
      height: height,
    }); // gắn khung nhận dạng vào khuôn mặt trong ảnh

    const resize = faceapi.resizeResults(dections, {
      width: width,
      height: height,
    });
    //  nhận dạng danh tính trên ảnh
    // const results = resize.map((d) => faceMatcher.findBestMatch(d.descriptor));
    // results.forEach((result, i) => {
    //   const box = resize[i].detection.box;
    //   const drawBox = new faceapi.draw.DrawBox(box, {
    //     label: result.toString(),
    //   });
    //   drawBox.draw(canvasRef.current);
    // });

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
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    imgRef.current && loadedModels();
  });

  return (
    <div className="image-recognition">
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
