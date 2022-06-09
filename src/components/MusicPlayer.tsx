import { FC, useState } from "react";
import { Category, Track } from "./types";

export type PlayerState = {
  selected: Track;
  playing: boolean;
};

type Player = {
  state: PlayerState;
  switchPlaying: () => void;
  play: {
    previous: () => void;
    next: () => void;
  };
};

type PlayerArgs = { categories: readonly Category[] };

export const usePlayer = ({ categories }: PlayerArgs): Player => {
  const [state, setState] = useState<PlayerState>({
    selected: categories[0].songs[0],
    playing: false,
  });
  const allSongs = categories.flatMap((c) => c.songs);
  const songIndex = allSongs.findIndex((t) => t.id === state.selected.id);

  const playPrevious = () => {
    const previousSong =
      allSongs[(songIndex + allSongs.length - 1) % allSongs.length];

    setState({ ...state, selected: previousSong });
  };

  const playNext = () => {
    const nextSong = allSongs[(songIndex + 1) % allSongs.length];
    setState({ ...state, selected: nextSong });
  };

  return {
    state,
    switchPlaying() {
      setState({ ...state, playing: !state.playing });
    },
    play: {
      previous: playPrevious,
      next: playNext,
    },
  };
};

export const MusicPlayer: FC<{ player: Player }> = ({
  player: {
    state: { selected, playing },
    switchPlaying,
    play,
  },
}) => {
  // todo: condition on categories being non-empty
  // todo: all the logic, classes, bidir connection with music gallery component

  const leftArrow = (
    <div className="control left" onClick={() => play.previous()}>
      <svg viewBox="0 0 40 40">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
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
      onClick={() => switchPlaying()}
    >
      <div className="play">
        <svg viewBox="0 0 40 40">
          <defs>
            <path
              id="play_button"
              fill-rule="evenodd"
              clip-rule="evenodd"
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
              fill-rule="evenodd"
              clip-rule="evenodd"
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
          fill-rule="evenodd"
          clip-rule="evenodd"
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
          {rightArrow}
        </div>
        <div className="section" id="volume">
          <i
            className="fa"
            ng-className="{'fa-volume-off': player.volume<20, 'fa-volume-down':player.volume>=20 && player.volume<70, 'fa-volume-up': player.volume>=70}"
          ></i>
          <div className="progressbar">
            <div className="line">
              <div
                className="inside"
                ng-attr-style="width: {{player.volume}}%"
                ng-className="{'clicked':vol.clicked}"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
