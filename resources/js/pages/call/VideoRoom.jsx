import video from "../../assets/images/sample/video.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faRecordVinyl,
  faPhone
} from "@fortawesome/free-solid-svg-icons";
function VideoRoom(){
    return(
       <div className="video-room-wrapper">
         <span className="video-call-title">Sample Meeting</span>
         <div className="video-call">
              <div className="you-panel" style={{backgroundImage: `url(${video})`}}>
                <div className="name-tag">You</div>
                <div className="toolbar">
                    <button className="btn-circle"> 
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        style={{ color: "white" }}
                      />
                    </button>
                    <button className="btn-circle">
                        <FontAwesomeIcon
                        icon={faRecordVinyl}
                        style={{ color: "white" }}
                        />
                    </button>
                    <button className="btn-circle">
                        <FontAwesomeIcon
                        icon={faVideo}
                        style={{ color: "white" }}
                        />
                    </button>
                    <button className="btn-end-call">
                        <FontAwesomeIcon className="phone-icon"
                        icon={faPhone}
                        style={{ color: "white" }}
                        />
                    </button>
                </div>
              </div>
              <div className="participants">
                 <div className="participant" style={{backgroundImage: `url(${video})`}}>
                    <button className="btn-circle" style={{margin: '0.5em'}}> 
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        style={{ color: "white" }}
                      />
                    </button>
                    <span className="participant-name-tag">Kristine Mae</span>
                 </div>
                 <div className="participant" style={{backgroundImage: `url(${video})`}}></div>
                 <div className="participant" style={{backgroundImage: `url(${video})`}}></div>
              </div>
         </div>
       </div>
    )

}

export default VideoRoom;