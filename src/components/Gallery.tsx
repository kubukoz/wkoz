import { FC, useState } from "react";
import { Image } from "./types";
import _ from "underscore";
import styled from "styled-components";
import ReactModal from "react-modal";
import { useKeyPress } from "../hooks/useKeyPress";

type Props = {
  images: readonly Image[];
  modalSelectedImage?: Image;
  setModalSelectedImage(image?: Image): void;
};

const ImageComponent: FC<{ image: Image; open(): void }> = ({
  image,
  open,
}) => {
  return (
    <div className="item">
      <div
        className="image"
        style={{ backgroundImage: `url(${image.image})` }}
        onClick={open}
      ></div>
    </div>
  );
};

const Slide: FC<{
  images: readonly Image[];
  selectedSlideIndex: number;
  index: number;
  openImage(image: Image): void;
}> = ({ images, selectedSlideIndex, index, openImage }) => {
  const directionClass =
    selectedSlideIndex > index
      ? "left unselected"
      : selectedSlideIndex < index
      ? "right unselected"
      : "";

  return (
    <div className={`slide ${directionClass}`}>
      {images.map((image) => (
        <ImageComponent
          image={image}
          key={image.id}
          open={() => openImage(image)}
        />
      ))}
    </div>
  );
};

const ItemModalInternal: FC<{
  image: Image;
  previous(): void;
  next(): void;
}> = ({ image, previous, next }) => {
  useKeyPress(previous, ["ArrowLeft"]);
  useKeyPress(next, ["ArrowRight"]);

  const Image = styled.img`
    max-width: 80vw;
    max-height: 80vh;
    pointer-events: none;
  `;

  return <Image src={image.image} />;
};

const ItemModal: FC<{
  image: Image;
  close(): void;
  next(): void;
  previous(): void;
}> = ({ image, close, next, previous }) => {
  ReactModal.defaultStyles = {};

  return (
    <ReactModal
      isOpen
      onRequestClose={close}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <ItemModalInternal image={image} next={next} previous={previous} />
    </ReactModal>
  );
};

export const clampOrJump = <T extends unknown>(
  number: number,
  arr: readonly T[]
): T => arr[number < 0 ? arr.length - 1 : number >= arr.length ? 0 : number];

export const Gallery: FC<Props> = ({
  images,
  modalSelectedImage: selectedImage,
  setModalSelectedImage: selectImage,
}) => {
  if (!images.length) return null;
  const slideSize = 3;

  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const slides = _.chunk(images, slideSize);

  const moveToImage = (targetImage: Image) => {
    selectImage(targetImage);
    setSelectedSlideIndex(Math.floor(targetImage.id / slideSize));
  };

  const nextImage = (after: number) =>
    moveToImage(clampOrJump(after + 1, images));

  const previousImage = (before: number) =>
    moveToImage(clampOrJump(before - 1, images));

  const previous = () =>
    setSelectedSlideIndex((i) => (i + slides.length - 1) % slides.length);

  const next = () => setSelectedSlideIndex((i) => (i + 1) % slides.length);

  const slideElems = slides.map((slide, i) => (
    <Slide
      images={slide}
      openImage={selectImage}
      index={i}
      selectedSlideIndex={selectedSlideIndex}
      key={i}
    />
  ));

  const modal = selectedImage && (
    <ItemModal
      image={selectedImage}
      close={() => selectImage(undefined)}
      next={() => nextImage(selectedImage.id)}
      previous={() => previousImage(selectedImage.id)}
    />
  );

  return (
    <div id="gallery">
      {modal}
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
