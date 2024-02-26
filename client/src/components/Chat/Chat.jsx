// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import queryString from "query-string";
// import io from "socket.io-client";
// import InfoBar from "../InfoBar/InfoBar";
// import "./Chat.css";
// import Input from "../Input/Input";
// import Messages from "../Messages/Messages";
// import TextContainer from "../TextContainer/TextConatiner";

// let socket;

// const Chat = () => {
//   const location = useLocation();
//   const [name, setname] = useState("");
//   const [room, setRoom] = useState("");
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState("");

//   const ENDPOINT = "http://localhost:5000";

//   useEffect(() => {
//     const { name, room } = queryString.parse(location.search);
//     socket = io(ENDPOINT, {
//       withCredentials: true,
//     });

//     setname(name);
//     setRoom(room);

//     socket.emit("join", { name, room }, () => {});

//     return () => {
//       socket.emit("disconnection");

//       socket.off();
//     };
//   }, [ENDPOINT, location.search]);

//   useEffect(() => {
//     socket.on("message", (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });
//     socket.on("roomData", ({ users }) => {
//       setUsers(users);
//     });
//   }, []);

//   const sendMessage = (event) => {
//     event.preventDefault();

//     if (message) {
//       socket.emit("sendMessage", message, () => setMessage(""));
//     }
//   };

//   console.log(message, messages);

//   return (
//     <div className="outerContainer">
//       <div className="container">
//         <InfoBar room={room} />
//         <Messages messages={messages} name={name} />

//         <Input
//           message={message}
//           setMessage={setMessage}
//           sendMessage={sendMessage}
//         />
//       </div>
//       {/* <TextContainer users={users} /> */}
//     </div>
//   );
// };

// export default Chat;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import "./Chat.css";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextConatiner";

const Chat = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState("");
  const [socket, setSocket] = useState(null);

  const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    setName(name);
    setRoom(room);

    const socket = io(ENDPOINT, {
      withCredentials: true,
    });

    setSocket(socket);

    socket.emit("join", { name, room }, () => {});

    return () => {
      socket.emit("disconnection");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.off("message");
      socket.off("roomData");
    };
  }, [socket]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message && socket) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      {/* <TextContainer users={users} /> */}
    </div>
  );
};

export default Chat;
