
import { AuthProvider } from "./AuthProvider";
import { QueueProvider } from "./QueueProvider";
import { RolesProvider } from "./RolesProvider";
import { WebsocketProvider } from "./WebsocketProvider";
import { NotificationProvider } from "./DesktopNotificationProvider";
import { combineComponents } from "./CombineAllContext";
import { DialogProvider } from "./DialogProvider";
import { ChatWindowProvider } from "./ChatWindowProvider";
import { ChatProvider } from "./ChatProvider";

const providers = [
  AuthProvider,
  NotificationProvider,
  QueueProvider,
  RolesProvider,
  WebsocketProvider,
  ChatProvider,
  DialogProvider,
  ChatWindowProvider,
];
export const AppContextProvider = combineComponents(...providers);
