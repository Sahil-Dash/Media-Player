import { useEffect, useRef, useState } from "react";
import { PlayFill, PauseFill, CaretRightSquareFill, CaretLeftSquareFill, UsbPlugFill, Upload } from 'react-bootstrap-icons';

// import "./styles.css";
import WaveForm from "./WaveForm";
import ProgressBar from "./Components/ProgressBar";



export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [files, setFiles] = useState([]);
  const [playing, setPlaying] = useState(false);


  const [audioUrl, setAudioUrl] = useState(null);
  const [analyzerData, setAnalyzerData] = useState(null);
  const audioElmRef = useRef(null);

  // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  // create a new AudioContext
  const audioCtx = new AudioContext()
  const ctxRef = useRef(audioCtx)


  let source;


  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    console.log(file.name)
    setFiles((files) => [...files, file.name])

    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

    await fetchMusic(files[currentIndex])






  };

  // audioAnalyzer function analyzes the audio and sets the analyzerData state
  const audioAnalyzer = () => {



    // create an analyzer node with a buffer size of 2048
    const analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 2048;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);


    source = audioCtx.createMediaElementSource(audioElmRef.current);


    source.connect(analyzer);
    source.connect(audioCtx.destination);
    source.onended = () => {
      source.disconnect();
    };



    // set the analyzerData state with the analyzer, bufferLength, and dataArray
    setAnalyzerData({ analyzer, bufferLength, dataArray });


  };


  const fetchMusic = async (filename) => {
    // e.preventDefault()
    fetch(`http://127.0.0.1:5000/api/music/${filename}`)
      .then(response => response.blob())
      .then(blob => {
        const sfile = new File([blob], filename, { type: 'audio/mpeg' });
        if (!sfile) return;
        console.log(sfile)

        setAudioUrl(URL.createObjectURL(sfile));
        
        audioAnalyzer()


      });
  }

  const handleStart = async () => {
    try {
      await ctxRef.current.resume();
      console.log('Playback resumed successfully');
    } catch (error) {
      console.error('Failed to resume playback:', error);
    }
  }


  const playMedia = () => {
    if (playing === false) {
      handleStart()
    }

    setPlaying(true)
    audioElmRef.current.play();
  };

  const pauseMedia = () => {


    setPlaying(false)
    audioElmRef.current.pause();

  };

  const stopMedia = () => {
    audioElmRef.current.pause();
    audioElmRef.current.currentTime = 0;
  };

  const nextMedia = () => {

    stopMedia();

    let idx = (currentIndex + 1) % files.length
    setCurrentIndex(idx);
    console.log(files[idx])
    setPlaying(false)
    fetchMusic(files[idx])




  };

  const previousMedia = () => {
    stopMedia();

    let idx = (currentIndex - 1 + files.length) % files.length
    setCurrentIndex(idx);
    console.log(files[idx])
    setPlaying(false)
    fetchMusic(files[idx])


  };

  console.log(audioElmRef)


  const getFiles = async () => {
    const res = await fetch('http://127.0.0.1:5000/get-music-list')
    let jsonData = await res.json()
    const data = jsonData.map(item => item.filename)
    setFiles(data)
    console.log(data[currentIndex])

    fetchMusic(data[currentIndex])

  }


  useEffect(() => {

    getFiles()

  }, []);




  return (
    <div style={{ display: "flex", alignItems: "start", paddingTop: "40vh" }} >

      <div style={{ marginRight: "5vh", paddingTop: "50px" }}>
        <h2>Songs List</h2>
        {files && files.map((element, idx = 0) => {
          { idx++ }
          return <div
            style={{ paddingBottom: "10px" }}
          > <p style={{
            color: (element === files[currentIndex]) ? "green" : "white"
          }} key={idx}>{element}</p>

          </div>;
        })}
      </div>

      <div style={{ marginRight: "80vh" }}>

        <h1
          style={{

            textAlign: "center"

          }}
        >Sahil's Media Visualizer</h1>
        {analyzerData && <WaveForm analyzerData={analyzerData} />}
        <div
          style={{
            height: "",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection:"column"


          }}
        >
          <audio src={audioUrl ?? ""} ref={audioElmRef} />
          {(audioElmRef ===undefined)? "" : <ProgressBar audioElmRef={audioElmRef}/>}

          <div style={{paddingTop:"20px"}}>

          <CaretLeftSquareFill onTouchStart={()=>{console.log("touched")}} onClick={previousMedia} color="white" size={27} />

          {(playing === true)
            ? <PauseFill onClick={pauseMedia} color="white" size={30} />
            : <PlayFill onClick={playMedia} color="white" size={30} />}

          <CaretRightSquareFill onClick={nextMedia} color="white" size={27} />
          </div>




        </div>

        <div className="musicForm">
          <h3>Upload New Musics</h3>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit"><Upload onClick={nextMedia} size={10} /></button>



          </form>
        </div>


      </div>
    </div>
  );
}

