
import { AuthProvider } from "./AuthProvider";
import { QueueProvider } from "./QueueProvider";
import { RolesProvider } from "./RolesProvider";
import { WebsocketProvider } from "./WebsocketProvider";
import { NotificationProvider } from "./DesktopNotificationProvider";
import { combineComponents } from "./CombineAllContext";
import { DialogProvider } from "./DialogProvider";
import { ChatWindowProvider } from "./ChatWindowProvider";

const providers = [
  AuthProvider,
  NotificationProvider,
  QueueProvider,
  RolesProvider,
  WebsocketProvider,
  DialogProvider,
  ChatWindowProvider
];
export const AppContextProvider = combineComponents(...providers);
