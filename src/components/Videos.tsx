import React, { useRef } from "react";
import { FaYoutube } from "react-icons/fa";
import YouTube from "react-youtube";

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

  const refs = useRef<YouTube[]>([]);

  if (refs.current.length !== videos.length) {
    refs.current = Array(videos.length)
      .fill(null)
      .map((_, i) => refs.current[i] || React.createRef());
  }

  function onPlay(itemThatPlays: YouTube) {
    refs.current.forEach((item) => {
      if (item !== itemThatPlays) item.getInternalPlayer()?.pauseVideo();
    });
  }

  return (
    <div id="videos">
      <div className="inside clearfix">
        <h1 className="heading">Nagrania</h1>

        <div className="vidlist">
          {props.videos.map((vid, i) => (
            <VideoItem
              key={vid.videoId}
              setRef={(yt) => (refs.current[i] = yt)}
              onPlay={() => onPlay(refs.current[i])}
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
