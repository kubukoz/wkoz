import { FC, useEffect, useRef, useState } from "react";

export const Slider: FC<{
  percentage: number;
  setPercentage(value: number): void;
}> = ({ percentage, setPercentage }) => {
  const [clicked, setClicked] = useState(false);

  const { dragRef, getDrag } = useDrag((p) => setPercentage(p), clicked);

  return (
    <div
      className="progressbar"
      ref={dragRef}
      onMouseDown={(e) => {
        setClicked(true);
        dragRef.current &&
          setPercentage(
            getDrag({ kind: "mouse", e: e.nativeEvent }, dragRef.current)
          );
      }}
      onMouseUp={() => setClicked(false)}
    >
      <div className="line">
        <div
          className={clicked ? "inside clicked" : "inside"}
          style={{
            width: `${percentage}%`,
          }}
        ></div>
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
