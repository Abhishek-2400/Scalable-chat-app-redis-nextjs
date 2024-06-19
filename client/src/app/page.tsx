"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const Home = () => {
  const [socket, setSocket] = useState<any>(undefined)
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");
  const [messages, setMessages] = useState<any>([]);

  const onChangeHandler = (e: any) => {
    setMessage(e.target.value)
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    socket.emit('message-client', message)
  };

  useEffect(() => {
    const socket = io('http://localhost:4000')
    setSocket(socket)
    socket.on('connect', () => {
      console.log(`User connected with socket id `, socket.id)
      setId(socket?.id || "")
    })

    socket.on('message-from-redis', (data) => {
      let parsedData = JSON.parse(data)
      parsedData = parsedData.data
      console.log(parsedData.data)
      setMessages((prevMessages: any) => [...prevMessages, parsedData]);
    })

    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    }
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <h1>Chit chat</h1>
      <h3>{`Your Socket id :${id}`}</h3>
      <div className="message">
        <label htmlFor="message">Message:</label>
        <input
          type="text"
          id="message"
          name="message"
          required
          value={message}
          onChange={onChangeHandler}
        />
      </div>
      <div className="submit">
        <button type="submit">Send</button>
      </div>


      <br></br>
      <br></br>


      {messages.map((val: any, index: any) => {
        return <div>
          <p>{val}</p>
        </div>
      })}
      <style jsx>{`
                form {
                    display: flex;
                    flex-direction: column;
                    max-width: 300px;
                    margin: auto;
                    padding: 1rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    text-align: center;
                    margin-bottom: 1rem;
                }
                .message {
                    margin-bottom: 1rem;
                }
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                }
                input {
                    width: 100%;
                    padding: 0.5rem;
                    box-sizing: border-box;
                }
                .submit {
                    display: flex;
                    justify-content: center;
                }
                button {
                    padding: 0.5rem 1rem;
                    background-color: #0070f3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #005bb5;
                }
                a {
                    display: block;
                    text-align: center;
                    margin-top: 1rem;
                    color: #0070f3;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            `}</style>
    </form>
  );
};

export default Home;
