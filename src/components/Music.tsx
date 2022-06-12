import { FC } from "react";
import { PlayerState } from "./MusicPlayer";
import { Category, Track } from "./types";

type Props = {
  categories: readonly Category[];
  player: PlayerState;
  playSong: (songId: number) => void;
};

const TrackComp: FC<{
  trackName: string;
  playing: boolean;
  play: () => void;
}> = ({ trackName, playing, play }) => {
  return (
    <li className={playing ? "playing" : ""} onClick={() => play()}>
      <i className="button">
        <svg viewBox="0 0 40 40">
          <use className="play" xlinkHref="#play_button"></use>
          <use className="pause" xlinkHref="#pause_button"></use>
        </svg>
      </i>
      {trackName}
    </li>
  );
};

const CategoryComp: FC<{
  category: Category;
  player: PlayerState;
  playSong: (songId: number) => void;
}> = ({ category, player, playSong }) => {
  return (
    <div>
      <h2>{category.name}</h2>
      <ul>
        {category.songs.map((track) => {
          const playing = player.playing && player.selected.id == track.id;
          return (
            <TrackComp
              trackName={track.name}
              playing={playing}
              play={() => playSong(track.id)}
              key={track.id}
            />
          );
        })}
      </ul>
    </div>
  );
};

export const Music: FC<Props> = ({ categories, player, playSong }) => {
  // todo scroll
  return categories.length ? (
    <div
      id="music"
      scrollspy-broadcast
      clickable-hidenav
      scrollspy-offset="auto|60"
    >
      <div className="ninesixzero">
        <h1 className="heading">Muzyka</h1>
        <div className="col-sm-12 col-md-6 column">
          <div className="block">
            {categories.slice(0, 2).map((category) => (
              <CategoryComp
                category={category}
                player={player}
                key={category.id}
                playSong={playSong}
              />
            ))}
          </div>
        </div>
        <div className="col-sm-12 col-md-6 column">
          <div className="block">
            {categories.slice(2).map((category) => (
              <CategoryComp
                category={category}
                player={player}
                key={category.id}
                playSong={playSong}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
