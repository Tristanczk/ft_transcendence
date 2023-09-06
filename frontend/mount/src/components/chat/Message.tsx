export default function Chat() {
	return (<div></div>)
};
// import React from 'react';
// import { MessageProps } from './Messages';

// const ChatMessage = ({ message, idSender } : {message: MessageProps, idSender: number}) => {
//   return (
//     <div className="chat-message">
//       <div className={`flex items-end ${idSender === 1 ? '' : 'justify-end'}`}>
//         <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${idSender === 1 ? 'order-2 items-start' : 'order-1 items-end'}`}>
//           <div>
//             <span className={`px-4 py-2 rounded-lg inline-block ${idSender === 1 ? 'bg-gray-300 text-gray-600' : 'rounded-br-none bg-blue-600 text-white'}`}>
//               {message.message}
//             </span>
//           </div>
//         </div>
//         {idSender === 1 && (
//           <img
//             src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
//             alt="My profile"
//             className="w-6 h-6 rounded-full order-1"
//           ></img>
//         )}
//         {idSender === 2 && (
//           <img
//             src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
//             alt="My profile"
//             className="w-6 h-6 rounded-full order-2"
//           ></img>
//         )}
//       </div>
//     </div>
//   );
// };

// const Chat = ({ messages } : {messages: MessageProps[]}) => {
//   let currentSender: number = 0;
//   let messageGroup = [];

//   return (
//     <div>
//       {messages.map((message, index) => {
//         if (message.idSender === currentSender) {
//           // Continue adding messages to the current message group
//           messageGroup.push(message.message);
//         } else {
//           // Render the current message group
//           if (messageGroup.length > 0) {
//             return (
//               <ChatMessage
//                 key={index}
//                 message={messageGroup.join(' ')} // Combine messages
//                 idSender={currentSender}
//               />
//             );
//           }

//           // Update currentSender and reset messageGroup
//           currentSender = message.idSender;
//           messageGroup = [message.message];
//         }

//         // If it's the last message, render it
//         if (index === messages.length - 1) {
//           return (
//             <ChatMessage
//               key={index}
//               message={messageGroup.join(' ')} // Combine messages
//               idSender={currentSender}
//             />
//           );
//         }

//         return null;
//       })}
//     </div>
//   );
// };
