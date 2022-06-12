import { FC, useState } from "react";
import { SmoothLink } from "../SmoothLink";

type Props = { hasMusic: boolean; hasGallery: boolean };

export const Nav: FC<Props> = ({ hasMusic, hasGallery }) => {
  const [visible, setVisible] = useState(false);

  const music = hasMusic && (
    <li scrollspy-listen="music" ng-show="categories.length">
      <SmoothLink href="#music">Muzyka</SmoothLink>
    </li>
  );

  const gallery = hasGallery && (
    <li scrollspy-listen="gallery">
      <SmoothLink href="#gallery">Galeria</SmoothLink>
    </li>
  );

  // todo: scroll stuff
  return (
    <nav id="nav">
      <ul className={visible ? "active" : ""} onClick={() => setVisible(false)}>
        <li scrollspy-listen="about">
          <SmoothLink href="#about">O mnie</SmoothLink>
        </li>
        <li scrollspy-listen="repertoire">
          <SmoothLink href="#repertoire">Repertuar</SmoothLink>
        </li>
        <li scrollspy-listen="about_se|locations">
          <SmoothLink href="#about_se">O Standard Express</SmoothLink>
        </li>
        {music}
        {gallery}
        <li scrollspy-listen="contact|footer">
          <SmoothLink href="#contact">Kontakt</SmoothLink>
        </li>
      </ul>
      <div
        id="drawer"
        onClick={() => setVisible(!visible)}
        className={visible ? "active" : ""}
      >
        <div className="lines">
          <div className="line" />
          <div className="line" />
          <div className="line" />
        </div>
      </div>
    </nav>
  );
};
