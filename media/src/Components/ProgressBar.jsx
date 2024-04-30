import React, { useState, useEffect } from 'react';

function ProgressBar({ audioElmRef }) {
  const [progressBarValue, setProgressBarValue] = useState(0);

  console.log(audioElmRef)

  
  useEffect(() => {


    
    const updateProgress = () => {
      if (audioElmRef) {
        
        const progress = (audioElmRef.current.currentTime / audioElmRef.current.duration) * 100;
        setProgressBarValue(progress)
      }
    };
    console.log("Updating..")

    audioElmRef.current.addEventListener('timeupdate', updateProgress);

    return () => {
      // Cleanup function to remove event listener
      audioElmRef.current.removeEventListener('timeupdate', updateProgress);
    };


  }, []);


  return (
    <div className="progress-bar-container">
      <progress value={progressBarValue} max="100" style={{ width: `${progressBarValue}%`, backgroundColor: "green" }} />
    </div>
  );
}

export default ProgressBar;
