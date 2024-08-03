import { FaYoutube } from "react-icons/fa";
import YouTube from "react-youtube";
import { useVideoPlayback, VideoPlayback } from "../hooks/useVideos";

export type VideoParams = {
  videoId: string;
  title: string;
};

export type VideoItemProps = VideoParams & {
  setRef: (yt: YouTube) => void;
  onPlay: () => void;
};

const VideoItem = ({ title, videoId, setRef, onPlay }: VideoItemProps) => {
  return (
    <YouTube
      videoId={videoId}
      title={title}
      className="video"
      opts={{
        height: "auto",
        width: "auto",
      }}
      ref={setRef}
      onPlay={() => onPlay()}
    />
  );
};

export type VideosProps = {
  videos: readonly VideoParams[];
  playback: VideoPlayback;
};

export const Videos = ({ videos, playback }: VideosProps) => {
  return (
    <div id="videos">
      <div className="inside clearfix">
        <h1 className="heading">Nagrania</h1>

        <div className="vidlist">
          {videos.map((vid, i) => (
            <VideoItem
              key={vid.videoId}
              setRef={(yt) => {
                playback.setRef(yt, i);
              }}
              onPlay={() => playback.pauseExcept(playback.getPlayer(i))}
              {...vid}
            />
          ))}
        </div>
        <h2>
          <a
            className="seemore"
            href="https://www.youtube.com/playlist?list=PLO5u_Y0J5MPkVCNXe_QXqTlSmUYy0RZMw"
            target="_blank"
          >
            <FaYoutube className="yt" /> Zobacz więcej
          </a>
        </h2>
      </div>
    </div>
  );
};
