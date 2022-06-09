import { FC } from "react";

type Props = { volume: number };

export const VolumeBar: FC<Props> = ({ volume }) => (
  <VolumeBarControlled volume={volume} clicked={false} />
);

const VolumeBarControlled: FC<{ volume: number; clicked: boolean }> = ({
  volume,
  clicked,
}) => {
  const iconClass =
    volume >= 70
      ? "fa-volume-up"
      : volume >= 20
      ? "fa-volume-down"
      : "fa-volume-off";

  return (
    <div className="section" id="volume">
      <i className={`fa ${iconClass}`}></i>
      <div className="progressbar">
        <div className="line">
          <div
            className={clicked ? "inside clicked" : "inside"}
            style={{
              width: `${volume}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
