import React, { useRef } from "react";
import YouTube from "react-youtube";

export type VideoPlayback = {
  pauseAll(): void;
  pauseExcept(vid: YouTube): void;
  setRef(vid: YouTube, index: number): void;
  getPlayer(index: number): YouTube;
};

export const useVideoPlayback = (videos: readonly unknown[]): VideoPlayback => {
  const refs = useRef<YouTube[]>([]);

  if (refs.current.length !== videos.length) {
    refs.current = Array(videos.length)
      .fill(null)
      .map((_, i) => refs.current[i] || React.createRef());
  }

  function onPlay(itemThatPlays: YouTube | undefined) {
    refs.current.forEach((item) => {
      if (item !== itemThatPlays) item.getInternalPlayer()?.pauseVideo();
    });
  }

  return {
    pauseAll() {
      return onPlay(undefined);
    },
    pauseExcept(vid) {
      return onPlay(vid);
    },
    setRef(vid, index) {
      refs.current[index] = vid;
    },
    getPlayer(index) {
      return refs.current[index];
    },
  };
};
