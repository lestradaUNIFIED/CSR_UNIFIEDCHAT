import "../../assets/styles/dashboard.css";
import UpsButtonIcon from "../../Components/UpsButtonIcon";
import UpsSimpleInput from "../../Components/UpsSimpleInput";
import UpsInputNoborder from "../../Components/UpsInputNoborder";
import avatar1 from "../../assets/images/sample/avatar1.png";
import upsLogo from "../../assets/images/icons/ups-logo.png";
import crownIcon from "../../assets/images/icons/icon-crown.png";
import ellipsis from "../../assets/images/icons/icon-ellipsis.png";
import sampleMedia from "../../assets/images/sample/media1.png";
import btnArrowB from "../../assets/images/icons/btn-blue-post.png";
import likeIcon from "../../assets/images/icons/icon-like.png";
import CommentIcon from "../../assets/images/icons/icon-comment.png";
import shareIconActive from "../../assets/images/icons/icon-share-active.png";
import shareIcon from "../../assets/images/icons/icon-share.png";
import iconVerified from "../../assets/images/icons/icon-verified.png";

/*LEONARD */
import useToken from "../../services/Auth";
import { Navigate } from "react-router-dom";
function Newsfeed() {
  const { token } = useToken();


  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-wrapper mt-3">
      {/* <SideNav /> */}
      <div className="news-feed">
        <div className="header-content">
          <span>News Feed</span>
          <div className="search">
            <UpsSimpleInput
              type="text"
              placeholder="Find Something Cool Here..."
            />
            <UpsButtonIcon />
          </div>
        </div>
        <div className="create-post">
          <img
            src={avatar1}
            alt=""
            className="icon-small"
            style={{ marginRight: "15px" }}
          />
          <UpsInputNoborder
            type="text"
            placeholder="Anything to share to your network, Topson?"
          />
          <button type="button" className="btn-create-post">
            Create Post
          </button>
        </div>
        <span className="header-label">Recent Updates</span>
        {/* Scrollable-content */}
        <div className="scrollable-container">
          {/* Post with Media-Content */}
          <div className="card-post">
            <div className="card-post-header">
              <img
                src={upsLogo}
                alt=""
                className="icon-small"
                style={{ marginRight: "15px" }}
              />
              <div className="header-info">
                <div className="account-con">
                  <span className="acc-name">
                    Unified & Servicess
                    <img
                      src={crownIcon}
                      alt=""
                      srcSet=""
                      style={{
                        width: "14px",
                        height: "14px",
                        marginLeft: "8px",
                        paddingBottom: "2px",
                      }}
                    />
                  </span>
                  <div className="acc-network">
                    <span className="post-tag1">Promoted Post</span>
                    <span className="post-tag">Announcement</span>
                    <span className="post-tag">Global</span>
                  </div>
                </div>
                <div className="date-con">
                  <small>
                    11:11 PM 06/06/2022 <img src={ellipsis} alt="" srcSet="" />
                  </small>
                </div>
              </div>
            </div>
            <div className="card-post-content">
              <div className="post-caption">
                <p>This is my first ever post. Let’s get Unified. :)</p>
              </div>
              <div className="media">
                <img src={sampleMedia} alt="" className="media-img" />
              </div>
            </div>
            <div className="card-post-toolbar">
              <div className="toolbar">
                <button className="btn-like-active">
                  <span className="btn-icon-active">
                    <span style={{ marginRight: "8px" }}>
                      <img src={likeIcon} alt="" srcSet="" />
                    </span>
                    Like
                  </span>
                </button>
                <button className="btn-comment-active">
                  <span className="btn-icon-active">
                    <span style={{ marginRight: "8px" }}>
                      <img src={CommentIcon} alt="" srcSet="" />
                    </span>
                    Comment
                  </span>
                </button>
                <button className="btn-share-active">
                  <span className="btn-icon-active">
                    <span style={{ marginRight: "8px" }}>
                      <img src={shareIconActive} alt="" srcSet="" />
                    </span>
                    Share
                  </span>
                </button>
              </div>
              <div className="toolbar-status">
                <button className="btn-like-status">
                  <span className="btn-icon-active">
                    <span className="status-count">66</span>Likes
                  </span>
                </button>
                <button className="btn-like-status">
                  <span className="btn-icon-active">
                    <span className="status-count">22</span>Comments
                  </span>
                </button>
                <button className="btn-like-status">
                  <span className="btn-icon-active">
                    <span className="status-count">6</span>Shares
                  </span>
                </button>
                <button className="btn-arrow-b">
                  <img src={btnArrowB} alt="" />
                </button>
              </div>
            </div>
          </div>
          {/* Post Non-Media-Content */}
          <div className="card-post" style={{ marginTop: "1em" }}>
            <div className="card-post-header">
              <img src={avatar1} alt="" className="icon-small" />
              <span className="badge-active"></span>
              <div className="header-info">
                <div className="account-con">
                  <span className="acc-name">
                    Ben Ten
                    <img
                      src={iconVerified}
                      alt=""
                      srcSet=""
                      style={{
                        width: "14px",
                        height: "14px",
                        marginLeft: "8px",
                      }}
                    />
                  </span>
                  <div className="acc-network">
                    <span className="post-tag-nobullet">F123456789</span>
                    <span className="post-tag">Network</span>
                  </div>
                </div>
                <div className="date-con">
                  <small>
                    11:11 PM 06/06/2022 <img src={ellipsis} alt="" srcSet="" />
                  </small>
                </div>
              </div>
            </div>
            <div className="card-post-content">
              <div className="post-caption">
                <p>This is my first ever post. Let’s get Unified. :)</p>
              </div>
            </div>
            <div className="card-post-toolbar">
              <div className="toolbar">
                <button className="btn-like-active">
                  <span className="btn-icon-active">
                    <span style={{ marginRight: "8px" }}>
                      <img src={likeIcon} alt="" srcSet="" />
                    </span>
                    Like
                  </span>
                </button>
                <button className="btn-comment-active">
                  <span className="btn-icon-active">
                    <span style={{ marginRight: "8px" }}>
                      <img src={CommentIcon} alt="" srcSet="" />
                    </span>
                    Comment
                  </span>
                </button>
                <button className="btn-share">
                  <span className="btn-icon">
                    <span style={{ marginRight: "8px" }}>
                      <img src={shareIcon} alt="" srcSet="" />
                    </span>
                    Share
                  </span>
                </button>
              </div>
              <div className="toolbar-status">
                <button className="btn-like-status">
                  <span className="btn-icon-active">
                    <span className="status-count">66</span>Likes
                  </span>
                </button>
                <button className="btn-like-status">
                  <span className="btn-icon-active">
                    <span className="status-count">22</span>Comments
                  </span>
                </button>
                <button className="btn-like-status">
                  <span className="btn-icon">
                    <span className="status-count">6</span>Shares
                  </span>
                </button>
                <button className="btn-arrow-b">
                  <img src={btnArrowB} alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="side-content"></div>
    </div>
  );
}

export default Newsfeed;
