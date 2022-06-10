import { FC, useEffect, useRef, useState } from "react";

type Props = {
  volume: number;
  setVolume(vol: number): void;
};

export const VolumeBar: FC<Props> = ({ volume, setVolume }) => {
  return <VolumeBarControlled volume={volume} setVolume={setVolume} />;
};

const VolumeBarControlled: FC<{
  volume: number;
  setVolume(vol: number): void;
}> = ({ volume, setVolume }) => {
  const [clicked, setClicked] = useState(false);

  const iconClass =
    volume >= 70
      ? "fa-volume-up"
      : volume >= 20
      ? "fa-volume-down"
      : "fa-volume-off";

  const { dragRef, getDrag } = useDrag((p) => setVolume(p), clicked);

  return (
    <div className="section" id="volume">
      <i className={`fa ${iconClass}`}></i>
      <div
        className="progressbar"
        ref={dragRef}
        onMouseDown={(e) => {
          setClicked(true);
          if (dragRef.current) {
            setVolume(
              getDrag({ kind: "mouse", e: e.nativeEvent }, dragRef.current)
            );
          }
        }}
        onMouseUp={() => setClicked(false)}
      >
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

const useDrag = (onDrag: (percent: number) => void, clicked: boolean) => {
  const draggable = useRef<HTMLDivElement>(null);

  type VolumeTrigger =
    | {
        kind: "mouse";
        e: MouseEvent;
      }
    | {
        kind: "touch";
        e: TouchEvent;
      };

  const getDrag = (trigger: VolumeTrigger, bar: HTMLElement) => {
    const horizontalOffsetPx =
      trigger.kind == "mouse"
        ? trigger.e.offsetX ||
          trigger.e.clientX - bar.getBoundingClientRect().left ||
          0
        : trigger.e.changedTouches[0].clientX -
            bar.getBoundingClientRect().left || 0;

    return 100 * Math.min(Math.max(0, horizontalOffsetPx) / bar.offsetWidth, 1);
  };

  useEffect(() => {
    const bar = draggable.current;
    if (!bar) return;
    const onmove = (e: VolumeTrigger) => {
      if (e.kind == "touch") {
        e.e.preventDefault();
        onDrag(getDrag(e, bar));
      } else if (clicked) {
        onDrag(getDrag(e, bar));
      }
    };

    const onmousemove = (e: MouseEvent) => onmove({ e, kind: "mouse" });
    const ontouchmove = (e: TouchEvent) => onmove({ e, kind: "touch" });

    bar.addEventListener("mousemove", onmousemove);
    bar.addEventListener("touchmove", ontouchmove);
    return () => {
      bar.removeEventListener("touchmove", ontouchmove);
      bar.removeEventListener("mousemove", onmousemove);
    };
  }, [draggable.current, onDrag, clicked]);

  return { dragRef: draggable, getDrag: getDrag };
};
