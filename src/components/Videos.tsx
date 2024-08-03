import { FaYoutube } from "react-icons/fa";
import YouTube from "react-youtube";
import { useVideoPlayback } from "../hooks/useVideos";

type VideoProps = {
  videoId: string;
  title: string;
};

const VideoItem = (
  props: VideoProps & {
    setRef: (yt: YouTube) => void;
    onPlay: () => void;
  }
) => {
  const { title, videoId, setRef } = props;

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
      onPlay={() => props.onPlay()}
    />
  );
};

export const Videos = (props: { videos: readonly VideoProps[] }) => {
  const { videos } = props;
  const playback = useVideoPlayback(videos);

  return (
    <div id="videos">
      <div className="inside clearfix">
        <h1 className="heading">Nagrania</h1>

        <div className="vidlist">
          {props.videos.map((vid, i) => (
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
