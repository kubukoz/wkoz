import { useUserAgent } from "@oieduardorabelo/use-user-agent";
import { FC } from "react";
import { Slider } from "./Slider";

export const VolumeBar: FC<{
  volume: number;
  setVolume(vol: number): void;
}> = ({ volume, setVolume }) => {
  const ua = useUserAgent();

  const isIOS = ua?.os?.name === "iOS";

  const iconClass =
    volume >= 70
      ? "fa-volume-up"
      : volume >= 20
      ? "fa-volume-down"
      : "fa-volume-off";

  return isIOS ? null : (
    <div className="section" id="volume">
      <i className={`fa ${iconClass}`}></i>
      <Slider percentage={volume} setPercentage={(v) => setVolume(v)}></Slider>
    </div>
  );
};
