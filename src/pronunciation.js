import React, { useState, useRef } from 'react';

function PronunciationForm() {
    const [targetPhrase, setTargetPhrase] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [response, setResponse] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);

    const startRecording = async () => {
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorderRef.current.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            setAudioFile(audioBlob);  // Guardar el audio grabado como archivo
        };

        mediaRecorderRef.current.start();
    };

    // Detener la grabación
    const stopRecording = () => {
        setIsRecording(false);
        mediaRecorderRef.current.stop();
    };
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('target_phrase', targetPhrase);
        formData.append('audio', audioFile);

        try {
            const res = await fetch('http://127.0.0.1:5000/check_pronunciation', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            setResponse(data.message);
        } catch (error) {
            console.error('Error:', error);
            setResponse('Error: ' + error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <label>
                    Frase a practicar:
                    <input
                        className='pronun-input'
                        type="text"
                        value={targetPhrase}
                        onChange={(e) => setTargetPhrase(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Sube tu audio:
                    <input
                        className='upload-audio'
                        type="file"
                        onChange={(e) => setAudioFile(e.target.files[0])}
                    />
                </label>
                <br />
                <div className='grabanding'>

                    {isRecording && (
                        <div className="recording-indicator">
                            <div className="dot"></div>
                            <span>Grabando...</span>
                        </div>

                    )}
                    <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={isRecording ? 'recording' : ''}
                    >
                        {isRecording ? 'Detener' : 'Grábate'}
                    </button>
                </div>

                <br />
                <button className='pronun-btn' type="submit">¡Pruébate!</button>
            </form>
            <h4 className='respuesta-audio'>{response}</h4>
        </div>
    );
}

export default PronunciationForm;
