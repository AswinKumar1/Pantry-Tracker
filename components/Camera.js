// components/Camera.js
import React from 'react';
import Webcam from 'react-webcam';
import { Button } from '@mui/material';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Camera = () => {
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    try {
      await addDoc(collection(db, 'pantry'), {
        image: imageSrc,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }, [webcamRef]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <Button variant="contained" color="primary" onClick={capture}>
        Capture photo
      </Button>
    </div>
  );
};

export default Camera;
