

const websocket = (url) => {
 // return new WebSocket(`wss://unifiedchatapi.azurewebsites.net/${url}`);
   // return new WebSocket(`ws://localhost:3002/${url}`);
   return new WebSocket(`ws://localhost:8086/${url}`);
 //  return new WebSocket(`ws://172.168.1.212:8086/${url}`);
   
    
}


export default websocket

