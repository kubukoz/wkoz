import { FC } from "react";
import { PlayerState } from "./MusicPlayer";
import { Category, Track } from "./types";

type Props = { categories: readonly Category[]; player: PlayerState };

const TrackComp: FC<{ track: Track; player: PlayerState }> = ({
  track,
  player,
}) => {
  const playing = player.selected.id == track.id && player.playing;

  return (
    <li className={playing ? "playing" : ""} music-play="{{track.id}}">
      <i className="button">
        <svg viewBox="0 0 40 40">
          <use className="play" xlinkHref="#play_button"></use>
          <use className="pause" xlinkHref="#pause_button"></use>
        </svg>
      </i>
      {track.name}
    </li>
  );
};

const CategoryComp: FC<{ category: Category; player: PlayerState }> = ({
  category,
  player,
}) => {
  return (
    <div>
      <h2>{category.name}</h2>
      <ul>
        {category.songs.map((track) => (
          <TrackComp track={track} player={player} />
        ))}
      </ul>
    </div>
  );
};

export const Music: FC<Props> = ({ categories, player }) => {
  // todo logic, scroll
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
              <CategoryComp category={category} player={player} />
            ))}
          </div>
        </div>
        <div className="col-sm-12 col-md-6 column">
          <div className="block">
            {categories.slice(2).map((category) => (
              <CategoryComp category={category} player={player} />
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
