import { FC, useState } from "react";
import { Image } from "./types";
import _ from "underscore";

type Props = {
  images: readonly Image[];
};

const ImageComponent: FC<{ image: Image }> = ({ image }) => {
  return (
    <div className="item">
      <div
        className="image"
        style={{ backgroundImage: `url(${image.image})` }}
        gallery-modal
        img-href={image.image}
      ></div>
    </div>
  );
};

const Slide: FC<Props & { selectedSlideIndex: number; index: number }> = ({
  images,
  selectedSlideIndex,
  index,
}) => {
  const directionClass =
    selectedSlideIndex > index
      ? "left unselected"
      : selectedSlideIndex < index
      ? "right unselected"
      : "";

  return (
    <div className={`slide ${directionClass}`}>
      {images.map((image) => (
        <ImageComponent image={image} key={image.id} />
      ))}
    </div>
  );
};

export const Gallery: FC<Props> = ({ images }) => {
  // todo: scroll
  // todo: implement clickable-hidenav
  // if (!images.length) return null;

  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const slides = _.chunk(images, 3);

  const previous = () =>
    setSelectedSlideIndex((i) => (i + slides.length - 1) % slides.length);

  const next = () => setSelectedSlideIndex((i) => (i + 1) % slides.length);

  const slideElems = slides.map((slide, i) => (
    <Slide
      images={slide}
      index={i}
      selectedSlideIndex={selectedSlideIndex}
      key={i}
    />
  ));

  return (
    <div
      id="gallery"
      scrollspy-broadcast
      clickable-hidenav
      scrollspy-offset="auto|60"
    >
      <div className="wrapper">
        <div className="arrow left" onClick={previous}>
          <svg viewBox="0 0 20.81 32.384">
            <defs>
              <g id="arrow">
                <path
                  d="M20.433,5.521c0.502-0.502,0.502-1.307,0-1.809l-3.336-3.336c-0.502-0.502-1.307-0.502-1.809,0L0.377,15.288
    c-0.502,0.502-0.502,1.307,0,1.809l14.912,14.912c0.502,0.502,1.307,0.502,1.809,0l3.336-3.336c0.502-0.502,0.502-1.307,0-1.809
    L9.762,16.192L20.433,5.521z"
                />
              </g>
            </defs>
            <use xlinkHref="#arrow"></use>
          </svg>
        </div>
        <div className="arrow right" onClick={next}>
          <svg viewBox="0 0 20.81 32.384">
            <use xlinkHref="#arrow"></use>
          </svg>
        </div>
        <div className="slides">{slideElems}</div>
      </div>
    </div>
  );
};
