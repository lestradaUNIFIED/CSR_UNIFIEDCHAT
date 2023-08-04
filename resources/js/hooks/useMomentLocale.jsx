import momentLocal from "moment";
import mt from 'moment-timezone';

const useMomentLocale = () => {
    
    momentLocal.locale();


    const toPHTime = (DATE_INPUT) => {
        const phTime = momentLocal(DATE_INPUT).add(8, 'hours').format();

        return momentLocal(phTime).format("YYYY-MM-DD HH:mm:ss");
    }

    const getDurationStr = (dateFrom, dateTo) => {
        const duration = momentLocal.duration(dateTo.diff(dateFrom));
        const seconds = duration.seconds()
              const minutes = duration.minutes();
              const hours = duration.hours();
              const days = duration.days();
              const weeks = duration.weeks();
              const months = duration.months();
              const years = duration.years();

              let durationStr = ``;
              if (years > 0 ){
                durationStr += ` ${years}Y` 
              }

              if (months > 0 ){
                durationStr += ` ${months}M` 
              }
              
              if (weeks > 0 ){
                durationStr += ` ${weeks}W` 
              }
              if (days > 0 ){
                durationStr += ` ${days}D` 
              }
              if (hours > 0 ){
                durationStr += ` ${hours}h` 
              }
              if (minutes > 0 ){
                durationStr += ` ${minutes}m` 
              }
              if (seconds > 0 ){
                durationStr += ` ${seconds}s` 
              }
              
              return durationStr;
          }


    return {

        momentLocal,
        toPHTime,
        getDurationStr
    }
        
}

export default useMomentLocale;