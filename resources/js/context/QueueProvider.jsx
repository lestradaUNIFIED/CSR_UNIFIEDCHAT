import { createContext, useState } from "react";

const QueueContext = createContext({});

export const QueueProvider = ({ children }) => {
  const [queueRows, setQueueRows] = useState([]);
  const [queueActive, setQueueActive] = useState(false);

  return (
    <QueueContext.Provider value={{ queueRows, setQueueRows, queueActive, setQueueActive }}>
      {children}
    </QueueContext.Provider>
  );
};

export default QueueContext;
