import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import openSocket from "socket.io-client";
import "./MarkAttendence.style.css";
import Button from "../components/FormElements/Button";

import { ExportCSV } from "./components/ExportCSV";

import { useHttpClient } from "../hooks/http-hook";
const MarkAttendence = () => {
  const attendence = [];
  const viewers = [];
  let finalAttendence;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [initializing, setInitializing] = useState(false);
  const [descriptor, setDescriptor] = useState();
  const [students, setStudents] = useState();
  const videoWidth = 720;
  const videoHeight = 480;

  const imgRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const socket = openSocket("http://localhost:5000");
    const fetchAttendenceScreen = async () => {
      try {
        const data = await sendRequest(
          "http://localhost:5000/api/attendence/mark-attendence"
        );
        console.log(data);
        const content = data.content;
        for (var x = 0; x < Object.keys(content.parent).length; x++) {
          for (
            var y = 0;
            y < Object.keys(content.parent[x].descriptors).length;
            y++
          ) {
            var results = Object.values(content.parent[x].descriptors[y]);
            content.parent[x].descriptors[y] = new Float32Array(results);
          }
        }
        setDescriptor(content);
        setStudents(data.students);
        socket.on("image", (data) => {
          if (imgRef.current) {
            imgRef.current.src = `data:image/jpeg;base64,${data}`;
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/weights";
      setInitializing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]).then(fetchAttendenceScreen);
    };
    loadModels();
  }, [sendRequest]);
  // const loadLabels = async () => {
  //   console.log(descriptor);
  //   // for (var key in descriptor) {
  //   //   if (descriptor.hasOwnProperty(key)) {
  //   //     var val = descriptor[key];
  //   //     console.log(val);
  //   //   }
  //   // }
  //   descriptor.studentLabel.map(async (label) => {
  //     console.log(label);
  //     return new faceapi.LabeledFaceDescriptors(label,)
  //   });
  // };
  async function createFaceMatcher(data) {
    const labeledFaceDescriptors = await Promise.all(
      data.parent.map((className) => {
        console.log(className);
        const descriptors = [];
        for (var i = 0; i < className.descriptors.length; i++) {
          descriptors.push(new Float32Array(className.descriptors[i]));
        }
        return new faceapi.LabeledFaceDescriptors(className.label, descriptors);
      })
    );
    console.log(labeledFaceDescriptors);
    return new faceapi.FaceMatcher(labeledFaceDescriptors, 0.59);
  }

  const handleVideoOnPlay = async () => {
    const faceMatcher = await createFaceMatcher(descriptor);
    console.log(faceMatcher);
    setTimeout(() => {
      clearInterval(interval);
      let i = 0;
      console.log(i++);
      finalAttendence = mark();

      console.log(finalAttendence);
      // finalAttendence.forEach((val) => {
      //   console.log(val);
      //   if (val !== "unknown") {
      //     viewers.push({ id: val, present: "p" });
      //   }
      // });

      students.forEach((s) => {
        console.log(finalAttendence.has(s.id));
        if (finalAttendence.has(s.id)) {
          viewers.push({ id: s.id, name: s.name, present: "P" });
        } else {
          viewers.push({ id: s.id, name: s.name, present: "A" });
        }
      });
      console.log(viewers);
    }, 15000);
    const interval = setInterval(async () => {
      if (initializing) {
        setInitializing(false);
      }
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        imgRef.current
      );
      const displySize = {
        width: videoWidth,
        height: videoHeight,
      };
      const detections = await faceapi
        .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displySize);
      if (canvasRef.current) {
        faceapi.matchDimensions(canvasRef.current, displySize);
        canvasRef.current
          .getContext("2d")
          .clearRect(0, 0, videoWidth, videoHeight);
      }
      // faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor);
      });
      console.log(results);
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        // if (!attendence.find(result.toString().split(" ")[0])) {
        attendence.push(result.toString().split(" ")[0]);
        // }
        drawBox.draw(canvasRef.current);
      });

      markAttendence();
    }, 1000 / 30);
  };

  function mark() {
    return new Set(attendence.map((a) => a));
  }
  const fileName = Date.now();

  const markAttendence = () => {
    const videoBox = document.getElementsByClassName("name-box");

    videoBox.display = "block";
  };
  return (
    <React.Fragment>
      <div className="center video-box">
        <img
          ref={imgRef}
          alt="Loading"
          width={videoWidth}
          height={videoHeight}
        />
        <canvas ref={canvasRef} />
      </div>
      {/* <div className="center name-box">
        <h1>Name:Nitin</h1>
      </div> */}
      <ExportCSV csvData={viewers} fileName={fileName} />
      <Button onClick={handleVideoOnPlay}>Mark Attendence</Button>
    </React.Fragment>
  );
};
export default MarkAttendence;
