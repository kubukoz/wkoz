import { FC, useRef, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { Category, Track } from "./types";
import { useKeyPress } from "../hooks/useKeyPress";
import { VolumeBar } from "./VolumeBar";
import { clampOrJump } from "./Gallery";

export type PlayerState = {
  selected: Track;
  playing: boolean;
  volume: number;
};

type Player = {
  state: PlayerState;
  play: {
    previous(): void;
    next(): void;
    song(songId: number): void;
    switch(): void;
    start(): void;
    pause(): void;
  };
  volumeControl: {
    volumeUp(): void;
    volumeDown(): void;
    setVolume(vol: number): void;
  };
};

type PlayerArgs = { categories: readonly Category[] };

export const usePlayerState = ({ categories }: PlayerArgs): Player => {
  const [state, setState] = useState<PlayerState>({
    selected: categories[0].songs[0],
    playing: false,
    volume: 80,
  });

  const setVolume = (volume: number) =>
    setState((s) => ({
      ...s,
      volume: Math.min(100, Math.max(0, volume)),
    }));

  const allSongs = categories.flatMap((c) => c.songs);
  const songIndex = allSongs.findIndex((t) => t.id === state.selected.id);

  const setSong = (s: Track) => {
    setState((state) => ({ ...state, selected: s, playing: true }));
  };

  const playPrevious = () => {
    const previousSong = clampOrJump(songIndex - 1, allSongs);

    setSong(previousSong);
  };

  const playNext = () => {
    const nextSong = clampOrJump(songIndex + 1, allSongs);
    setSong(nextSong);
  };

  const playSong = (songId: number) => {
    const theSong = allSongs.find((s) => s.id === songId);
    if (!theSong) throw new Error("No such song!");

    setSong(theSong);
  };

  const switchPlaying = () => setState({ ...state, playing: !state.playing });
  const setPlaying = (playing: boolean) => setState({ ...state, playing });

  return {
    state,
    play: {
      previous: playPrevious,
      next: playNext,
      song: playSong,
      switch: switchPlaying,
      start() {
        setPlaying(true);
      },
      pause() {
        setPlaying(false);
      },
    },
    volumeControl: {
      volumeDown() {
        setVolume(state.volume - 10);
      },
      volumeUp() {
        setVolume(state.volume + 10);
      },
      setVolume,
    },
  };
};

const useKeyboardControl = ({
  play,
  volumeControl,
  enabled,
}: Pick<Player, "play" | "volumeControl"> & { enabled: boolean }) => {
  const ifEnabled = (f: () => void) => () => enabled ? f() : {};

  useKeyPress(ifEnabled(play.previous), ["ArrowLeft"]);
  useKeyPress(ifEnabled(play.next), ["ArrowRight"]);
  useKeyPress(ifEnabled(play.switch), [" "], ["PREVENT_DEFAULT"]);
  useKeyPress(ifEnabled(volumeControl.volumeUp), ["ArrowUp"], ["NEEDS_SHIFT"]);
  useKeyPress(
    ifEnabled(volumeControl.volumeDown),
    ["ArrowDown"],
    ["NEEDS_SHIFT"]
  );
};

const AudioPlayer: FC<Pick<Player, "play" | "state">> = ({
  play,
  state: { playing, volume, selected },
}) => {
  const audioRef = useRef<ReactAudioPlayer | null>();

  const currentAudioEl = audioRef.current?.audioEl.current;

  if (currentAudioEl) {
    if (playing) currentAudioEl.play();
    else currentAudioEl.pause();
  }

  return (
    <ReactAudioPlayer
      src={selected.filename}
      autoPlay={playing}
      onEnded={() => play.next()}
      preload="auto"
      volume={volume / 100.0}
      ref={(a) => (audioRef.current = a)}
      onPlay={() => play.start()}
      onPause={() => play.pause()}
    ></ReactAudioPlayer>
  );
};

export const MusicPlayer: FC<{ player: Player; controllable: boolean }> = ({
  player: { state, play, volumeControl },
  controllable,
}) => {
  const { selected, playing, volume } = state;
  useKeyboardControl({ play, volumeControl, enabled: controllable });

  // todo: condition on categories being non-empty
  // todo: all the logic, classes, bidir connection with music gallery component

  const leftArrow = (
    <div className="control left" onClick={() => play.previous()}>
      <svg viewBox="0 0 40 40">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20,0c11.046,0,20,8.954,20,20s-8.954,20-20,20S0,31.046,0,20
S8.954,0,20,0z M19.981,36.201c8.836,0,16-7.163,16-16c0-8.836-7.164-16-16-16s-16,7.164-16,16
C3.98,29.038,11.145,36.201,19.981,36.201z M17.75,13v14l-10.5-7L17.75,13z M29.75,27l-10.5-7l10.5-7V27z"
        />
      </svg>
    </div>
  );

  const mainButton = (
    <div
      className={(() => {
        const base = "control playing";

        const extra = playing ? "" : " paused";

        return base + extra;
      })()}
      onClick={() => play.switch()}
    >
      <div className="play">
        <svg viewBox="0 0 40 40">
          <defs>
            <path
              id="play_button"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20,40C8.954,40,0,31.046,0,20S8.954,0,20,0s20,8.954,20,20
S31.046,40,20,40z M20.019,3.799c-8.836,0-16,7.163-16,16c0,8.836,7.164,16,16,16s16-7.164,16-16
C36.02,10.962,28.855,3.799,20.019,3.799z M15,10l15,10L15,30V10z"
            />
          </defs>
          <use xlinkHref="#play_button"></use>
        </svg>
      </div>
      <div className="pause">
        <svg viewBox="0 0 40 40">
          <defs>
            <path
              id="pause_button"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20,40C8.954,40,0,31.046,0,20S8.954,0,20,0s20,8.954,20,20
                      S31.046,40,20,40z M20.019,3.799c-8.836,0-16,7.163-16,16c0,8.836,7.164,16,16,16s16-7.164,16-16
                      C36.02,10.962,28.855,3.799,20.019,3.799z M22,11h5v18h-5V11z M13,11h5v18h-5V11z"
            />
          </defs>
          <use xlinkHref="#pause_button"></use>
        </svg>
      </div>
    </div>
  );

  const rightArrow = (
    <div className="control right" onClick={() => play.next()}>
      <svg viewBox="0 0 40 40">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20,40C8.954,40,0,31.046,0,20S8.954,0,20,0s20,8.954,20,20
S31.046,40,20,40z M20.019,3.799c-8.836,0-16,7.163-16,16c0,8.836,7.164,16,16,16s16-7.164,16-16
C36.02,10.962,28.855,3.799,20.019,3.799z M22.25,27V13l10.5,7L22.25,27z M10.25,13l10.5,7l-10.5,7V13z"
        />
      </svg>
    </div>
  );

  return (
    <div id="music-player">
      <div className="ninesixzero">
        <div className="section" id="now_playing">
          <span>Teraz grane:</span>
          <b>{selected.name}</b>
        </div>
        <div className="section" id="controls">
          {leftArrow}
          {mainButton}
          <AudioPlayer play={play} state={state} />
          {rightArrow}
        </div>
        <VolumeBar volume={volume} setVolume={volumeControl.setVolume} />
      </div>
    </div>
  );
};
