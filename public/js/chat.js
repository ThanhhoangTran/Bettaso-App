// const socket = io();
// let chatForm = document.querySelector('#chatForm');
// let userId = document.querySelector('#chat-user-id');
// let userName = document.querySelector('#chat-user-name');
// const displayMessage = (message)=>{
//     const li = document.createElement('li');
//     li.innerHTML = `<strong class=${getCurrentUserClass(message.user)}>${message.userName}</strong>: ${message.content}`
//     document.querySelector('#chat').append(li);
//  }
// const getCurrentUserClass = (id)=>{
//      return userId.value === id ? "current-user": "";
// }
// if(chatForm){
//     chatForm.addEventListener('submit', (e)=>{
//         e.preventDefault();
//         let text = document.querySelector('#chat-input');
//         socket.emit("message", {
//             content: text.value,
//             userId: userId.value,
//             userName: userName.value
//         });
//         text.value="";
//     });
//     socket.emit("user connected", {
//         user: userId.value,
//         userName: userName.value
//     });
//     socket.on("user connected", data=>{ 
//         displayMessage({
//             userName: "Notice",
//             content: data.content
//         })
//     });
//     socket.on("message", (message)=>{
//         console.log("ghi nhaanj message")
//         displayMessage(message.content);
//         for(let i = 0; i<2; i++){
//             $('.chat-icon').fadeOut(200).fadeIn(200);
//         }
//     });
//     socket.on("load all messages", data=>{
//         data.forEach(message=>{
//             displayMessage(message)
//         })
//     })
//     socket.on("user disconnected", ()=>{
//         displayMessage({
//             userName: "Notice",
//             content:"User left the chat"
//         })
//     })
// }
// else {
//     socket.on("message", ()=>{
//         for(let i = 0; i<2; i++){
//             $('.chat-icon').fadeOut(200).fadeIn(200);
//         }
//     })
// }