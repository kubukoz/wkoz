import React, { useRef } from "react";
import YouTube from "react-youtube";

export type VideoPlayback = {
  pauseAll(): void;
  pauseExcept(vid: YouTube): void;
  setRef(vid: YouTube, index: number): void;
  getPlayer(index: number): YouTube;
};

type Args = {
  videos: readonly unknown[];
  onPlay(): void;
};

export const useVideoPlayback = ({ videos, onPlay }: Args): VideoPlayback => {
  const refs = useRef<YouTube[]>([]);

  if (refs.current.length !== videos.length) {
    refs.current = Array(videos.length)
      .fill(null)
      .map((_, i) => refs.current[i] || React.createRef());
  }

  function onPlayInternal(itemThatPlays: YouTube | undefined) {
    onPlay();
    refs.current.forEach((item) => {
      if (item !== itemThatPlays) item.getInternalPlayer()?.pauseVideo();
    });
  }

  return {
    pauseAll() {
      return onPlayInternal(undefined);
    },
    pauseExcept(vid) {
      return onPlayInternal(vid);
    },
    setRef(vid, index) {
      refs.current[index] = vid;
    },
    getPlayer(index) {
      return refs.current[index];
    },
  };
};
