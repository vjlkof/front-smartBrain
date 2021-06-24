import React from 'react';
import './FaceRecognition.css';

const FaceRecognition =({box, imageUrl}) => {
  
  console.log("image:" + imageUrl + "box:"+ box.toprow)
  return (
    <div className="flex justify-center ma">
      <div className="absolute mt2">
        <img id='inputimage' alt='' src={imageUrl} width='500rem' heigh='auto'/>
          {box.map ((boun) => {
            return(
              <div className='bounding-box' style={{top: boun.toprow, right: boun.rightcol, bottom: boun.bottomrow, left: boun.leftcol}}></div>
            )
          })}
      </div>
    </div>
    )
}

export default FaceRecognition;