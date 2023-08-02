import momentLocal from "moment";
import mt from 'moment-timezone';

const useMomentLocale = () => {
    
    momentLocal.locale();


    const toPHTime = (DATE_INPUT) => {
        const phTime = momentLocal(DATE_INPUT).add(8, 'hours').format();

        return momentLocal(phTime).format("YYYY-MM-DD HH:mm:ss");
    }

    return {

        momentLocal,
        toPHTime
    }
        
}

export default useMomentLocale;