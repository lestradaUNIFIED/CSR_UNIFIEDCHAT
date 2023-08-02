import { createContext, useState } from "react";
const DialogContext = createContext({});

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({ open: false, message: "" });
  
  return (
    <DialogContext.Provider value={{ dialog, setDialog }}>
            {children}
    </DialogContext.Provider>
  );
};

export default DialogContext;
