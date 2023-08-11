
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || `wss://unifiedchatapi.azurewebsites.net`;
const websocket = (url) => {
  return new WebSocket(`${WEBSOCKET_URL}/${url}`);
}
export default websocket

 