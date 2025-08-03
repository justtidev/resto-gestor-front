import {io} from "socket.io-client";

//Detectar el entorno de desarrollo 
const socket = io(`http://${window.location.hostname}:3000`, {
    transports: ['websocket'],  // Asegurarse de usar WebSocket
});

export default socket;