import { createContext, useEffect, useState } from "react";

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
 const [notif, setNotif] = useState({open : false, message: ""});

 useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Notifications are not supported")
    } else {
      Notification.requestPermission();
    }
  }, [])

  const showNotification = (message) => {
    new Notification(message);
  }

  useEffect(() => {

    if (notif.open) {
        showNotification(notif.message);
    }

  }, [notif]);
  

  return (
    <NotificationContext.Provider value={{ notif, setNotif }}>{children}</NotificationContext.Provider>
  );
};

export default NotificationContext;
