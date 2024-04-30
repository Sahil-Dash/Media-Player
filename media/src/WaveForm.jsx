import { useRef, useEffect } from "react";

// Function to animate the bars
function animateBars(analyser, canvas, canvasCtx, dataArray, bufferLength) {

    analyser.getByteFrequencyData(dataArray);

    const HEIGHT = canvas.height / 2;

    var barWidth = Math.ceil(canvas.width / bufferLength) * 2.5;

    let barHeight;
    let x = 0;

    for (var i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * HEIGHT;

        const maximum = 1;
        const minimum = -1;
        var r = 0 + Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        var g = 255 + Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        var b = 0 + Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

        // Set the canvas fill style to the random RGB values.
        canvasCtx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';



        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}


// Component to render the waveform
const WaveForm = ({ analyzerData }) => {
    // Ref for the canvas element
    const canvasRef = useRef(null);
    const { dataArray, analyzer, bufferLength } = analyzerData;

    // Function to draw the waveform
    const draw = (dataArray, analyzer, bufferLength) => {
        const canvas = canvasRef.current;
        if (!canvas || !analyzer) return;
        const canvasCtx = canvas.getContext("2d");

        const animate = () => {
            requestAnimationFrame(animate);
            canvas.width = canvas.width;
            animateBars(analyzer, canvas, canvasCtx, dataArray, bufferLength);
        };

        animate();
    };

    // Effect to draw the waveform on mount and update
    useEffect(() => {
        draw(dataArray, analyzer, bufferLength);
    }, [dataArray, analyzer, bufferLength]);

    // Return the canvas element
    return (
        <canvas
            style={{
                position: "absolute",
                top: "0",
                left: "0",
                zIndex: "-10",
                backgroundColor:"black"
            }}
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
        />
    );
};

export default WaveForm;