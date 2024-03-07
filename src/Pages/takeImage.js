import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { LoadingButton } from '@mui/lab';
import convertBlobUrlToFile from '../helper/convertInFIle';

const WebcamComponent = () => <Webcam />
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'user',
}

const TakeImage = (props) => {
  const [picture, setPicture] = useState('')
  const webcamRef = React.useRef(null)
  const capture = React.useCallback(async () => {
    const pictureSrc = webcamRef.current.getScreenshot()
    setPicture(pictureSrc)
    const imageData = await convertBlobUrlToFile(pictureSrc, "image.png")
    props.setSelectedFile(imageData)
  })

  const startCamera = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });

      if (permissionStatus.state === 'granted') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        webcamRef.current.srcObject = stream;
      } else if (permissionStatus.state === 'prompt') {
        // Ask for permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        webcamRef.current.srcObject = stream;
      } else {
        console.error('Camera access denied by the user.');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  useEffect(() => {
    startCamera()
  }, [])
  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      <h3 className="text-center">
        Capture Image
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto auto' }}>
        {picture == '' ? (
          <Webcam
            audio={false}
            height={200}
            ref={webcamRef}
            width={200}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={picture} />
        )}
      </div>
      <br />
      <div>
        {picture != '' ? (
          <LoadingButton
            onClick={(e) => {
              e.preventDefault()
              setPicture('')
            }}
            variant='contained'
            className="btn btn-primary"
          >
            Retake
          </LoadingButton>
        ) : (
          <LoadingButton
            onClick={(e) => {
              e.preventDefault()
              capture()
            }}
            variant='contained'
            className="btn btn-danger"
          >
            Capture
          </LoadingButton>
        )}
      </div>
    </div>
  )
}
export default TakeImage