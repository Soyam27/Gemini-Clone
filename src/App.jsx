import React, { useState } from 'react';
import './App.css';
import { BiSolidSend } from "react-icons/bi";
import { GiMaterialsScience } from "react-icons/gi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { BsTranslate } from "react-icons/bs";
import { FaRegNewspaper } from "react-icons/fa";

import { GoogleGenAI } from '@google/genai';

const App = () => {

  const GapiKeY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: GapiKeY});

  let [message, setMessage] = useState('');
  const [isResponseScreen, setIsResponseScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [responseGenerated, setResponseGenerated] = useState(false);
  // const [loading, setLoading] = useState(false); // Loader state

  const handleLandingPageText = (e) => {
    const div = e.target.closest('div');
    if (div) {
      const pTag = div.querySelector('p');
      const newMessage = pTag.innerText;
      setMessage(newMessage);
      setResponseGenerated(false);
      setIsResponseScreen(true);
      hitRequest(newMessage);
    }
  }

  const generateResponse = async (msg, wordLimit = 50) => {
    // setLoading(true);  // Show loader
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: msg,
    });
    // setLoading(false);  // Hide loader
    setResponseGenerated(true);
    let text = response.text;
    const words = text.split(' ');
    if (words.length > wordLimit) {
      text = words.slice(0, wordLimit).join(" ") + "...";
    }

    const newMessagesArray = [
      ...messages,
      { type: 'userMsgStyle', text: msg },
      { type: 'responseMsgStyle', text }
    ];

    setMessages(newMessagesArray);
    
  };

  const hitRequest = (msg = message) => {
    if (msg) {
      const userMessage = { type: 'userMsgStyle', text: msg };
      setMessages((prev) => [...prev, userMessage]);
      
      setResponseGenerated(false);
      setIsResponseScreen(true);
      
      // ✅ Generate response with the passed message
      generateResponse(msg);
  
      // ✅ Clear the input field
      setMessage('');
    } else {
      alert("You must write something...!");
    }
  };
  return (
    <div className="overflow-hidden container min-h-screen max-w-screen-lg mx-auto px-4 text-white">
      {isResponseScreen ? (
        <div className="min-h-[70vh] mt-5">
          <div className="header flex justify-between">
            <h3 onClick={() => {setIsResponseScreen(false); setMessages([])}} className='text-[1.5rem] bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text cursor-pointer'>
              AvgGpt
            </h3>
            <button className='bg-[#181818] p-2 px-4 rounded-full text-center hover:scale-105 transition-transform' onClick={() => {setMessages([])}}>
              New Chat
            </button>
          </div>
          <div className="message flex flex-col">
            {messages.map((array, index) => (
              <div key={index} className={array.type}>
                {array.text}
              </div>
            ))}
            {!responseGenerated && (
              <div className="loader w-full flex justify-center items-center mt-5">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="middle min-h-[70vh] mt-5 flex flex-col justify-center items-center">
          <h1 className="text-3xl md:text-4xl font-light bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
          <b>AvgGpt</b>
          </h1>

          <div className="mt-14 box grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            <div onClick={(e) => { handleLandingPageText(e) }} className="relative cursor-pointer min-h-[20vh] bg-[#212121] rounded-lg p-4 hover:scale-105 transition-transform">
              <p className="m-3">Explain the concept of quantum entanglement.</p>
              <GiMaterialsScience  className="absolute right-4 bottom-4 text-xl" />
            </div>

            <div onClick={(e) => { handleLandingPageText(e) }} className="relative cursor-pointer min-h-[20vh] bg-[#212121] rounded-lg p-4 hover:scale-105 transition-transform">
              <p className="m-3">Help me brainstorm ideas for a birthday gift</p>
              <LiaBirthdayCakeSolid  className="absolute right-4 bottom-4 text-xl" />
            </div>

            <div onClick={(e) => { handleLandingPageText(e) }} className="relative cursor-pointer min-h-[20vh] bg-[#212121] rounded-lg p-4 hover:scale-105 transition-transform">
              <p className="m-3">Translate "Hello, how are you?" into Hindi</p>
              <BsTranslate className="absolute right-4 bottom-4 text-xl" />
            </div>

            <div onClick={(e) => { handleLandingPageText(e) }} className="relative cursor-pointer min-h-[20vh] bg-[#212121] rounded-lg p-4 hover:scale-105 transition-transform">
              <p className="m-3">Summarize the latest news in India</p>
              <FaRegNewspaper className="absolute right-4 bottom-4 text-xl" />
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 flex flex-col items-center searchBox w-[100%]">
        <div className="gap-2 textBoxContainer h-[3rem] rounded-[30px] w-[80%] bg-[#181818] flex items-center">
          <input onKeyDown={(e) => {if (e.key === "Enter") {hitRequest(message)}}} value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Write your text here...' className='rounded-[30px] pl-5 p-[0.8rem] w-[95%] bg-[#181818] outline-none border-none' type="text" />
          {message && <BiSolidSend className='mr-3 text-[1.2rem] cursor-pointer' onClick={()=>hitRequest(message)} />}
        </div>
        <p className='text-[10px] text-[gray] mt-2 custom-sm:w-[15rem] text-center'>This Bot is developed by Soyam Paul. Using Gemini AI to generate replies.</p>
      </div>
    </div>
  );
};

export default App;
