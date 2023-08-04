import { useState } from "react";


const useRandomColorGenerator = () => {
    
    const generateColor = () => {
       return Math.random().toString(16).substr(-6);
    }

    return {generateColor}
}

export default useRandomColorGenerator;