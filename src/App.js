import './App.css';
import logo from './img/logo.png';
import { useState } from 'react';
import zahuani from './audios/zahuani.00996.a01.wav'
import PronunciationPractice from './pronunciation';

// Diccionario y audio proviene de https://nahuatl.wired-humanities.org/

const API_KEY = process.env.REACT_APP_OPENAI_KEY;

const systemMessage = {
  "role": "system", "content": "Eres un profesor de náhuatl para niños de primaria.Crea una clase sobre el tema: [tema de la lección] usando el siguiente formato corto: Formato de Clase Corta Objetivo: Breve propósito de la lección. Vocabulario: Lista de 3-5 palabras/frases clave en náhuatl con traducción y pronunciación. Actividad: Una actividad simple para practicar (juego, dibujo, o ejercicio oral). Contexto Cultural: Breve explicación de cómo se usa el vocabulario en la cultura indígena. Ejercicio de Práctica: Un pequeño ejercicio de escritura o preguntas rápidas para reforzar."
}

function App() {
  // Mensajes con AI - OpenAI API
  const [messages, setMessages] = useState([
    {
      message: "¡Piali! ¿Qué repasaremos hoy?",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);


    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {


    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message }
    });



    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);
        setMessages([...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]);
        setIsTyping(false);
      });
  }
  // Obtener material - Google Books API
  const [show, setShow] = useState(false);
  const [bookItem, setItem] = useState();

  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyCQPpN03mHlWFxXHd-um4Afuk6BxMzML7Y`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error al buscar libros:", error);
    }
    setLoading(false);

  };
  // Practica tu pronunciación 
  const [targetPhrase, setTargetPhrase] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [response, setResponse] = useState('');

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
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: ' + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img className='logo' src={logo} alt="Logo" />
        <h1>Kualitok</h1>
      </header>
      <div className='main-container'>
        <div className="chat-container">
          <div className='mensajes'>
            <h2>Tlamaxtiketl</h2>
            {messages.map((msg, index) => (
              <pre key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
                {msg.message}
              </pre>
            ))}
            {isTyping && <p>El bot está escribiendo...</p>}
          </div>
          <div className='input-prompt-container'>
            <input className='input-prompt' type="text" onKeyDown={(e) => e.key === 'Enter' && handleSend(e.target.value)} placeholder=" Nijnekiskia nikitas..." />
            <button className='prompt-btn'
              onClick={() => handleSend(document.querySelector('.input-prompt').value)}
            >Enviar</button>
          </div>

        </div>
        <div className='no-dic'>
          <div className='dicc-voice-container'>
            <div className='dicc'>
              <h2>Diccionario</h2>
              <div className='dicc-container'>
                <div className='palabra-container'><h3>⋅˚₊‧⋅zahuāni‧₊˚</h3>
                  <p>Empieza a secar algún tipo de planta. “hace mucho calor por eso las plantitas empieza a secarse con tantito.” 2. Empieza a caerse las hojas del árbol porque ya es tiempo. “ya mero se caen las hojas de las plantas porque zahuaniya."</p>
                  <audio controls>
                    <source src={zahuani} type="audio/wav" />
                    Tu navegador no soporta el elemento de audio.
                  </audio></div>
                <div className='palabra-container'><h3>⋅˚₊‧⋅tzayanalli‧₊˚</h3>
                  <p>tzayanalquilitl = tzayanal-quilitl: tzayanalli, hendido, cortado en dos; quilitl, cortado o dividido en dos. Es una yerba acuática cuyas hojas están cortadas en dos. A esta circunstancia debe referirse el nombre."</p>
                  <audio controls>
                    <source src={zahuani} type="audio/wav" />
                    Tu navegador no soporta el elemento de audio.
                  </audio></div>
                <div className='palabra-container'><h3>⋅˚₊‧⋅zan no ye ic‧₊˚</h3>
                  <p>"De las plantas medicinales y de otras cosas medicinales."</p>
                  <audio controls>
                    <source src={zahuani} type="audio/wav" />
                    Tu navegador no soporta el elemento de audio.
                  </audio></div>
              </div>

            </div>

            <div className='voice-rec'>
              <h2>Practica pronunciación</h2>
              <PronunciationPractice></PronunciationPractice>
            </div>
          </div>
          <div className='context'>
            <h2>Recursos de clase</h2>

            <input
              className='input-media'
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe el título de un libro"
            />
            <button className='media-btn' onClick={handleSearch}>Buscar</button>
            <div className='books-container'>
              {loading && <p>Cargando...</p>}
              {
                books.map((item) => {
                  let thumbnail = item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.smallThumbnail;
                  if (thumbnail != undefined) {
                    return (

                      <div className="book" onClick={() => { setShow(true); setItem(item) }}>
                        <img src={thumbnail} alt="" />
                        <p className="title">{item.volumeInfo.title}</p>

                      </div>


                    )
                  }

                })
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
