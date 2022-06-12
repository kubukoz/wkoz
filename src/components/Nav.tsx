import { FC, useState } from "react";

type Props = { hasMusic: boolean; hasGallery: boolean };

export const Nav: FC<Props> = ({ hasMusic, hasGallery }) => {
  const [visible, setVisible] = useState(false);

  const music = hasMusic && (
    <li scrollspy-listen="music" ng-show="categories.length">
      <a href="#music" clickable-hidenav du-smooth-scroll>
        Muzyka
      </a>
    </li>
  );

  const gallery = hasGallery && (
    <li scrollspy-listen="gallery">
      <a href="#gallery" clickable-hidenav du-smooth-scroll>
        Galeria
      </a>
    </li>
  );

  // todo: scroll stuff
  return (
    <nav id="nav">
      <ul className={visible ? "active" : ""} onClick={() => setVisible(false)}>
        <li scrollspy-listen="about">
          <a href="#about" clickable-hidenav du-smooth-scroll>
            O mnie
          </a>
        </li>
        <li scrollspy-listen="repertoire">
          <a href="#repertoire" clickable-hidenav du-smooth-scroll>
            Repertuar
          </a>
        </li>
        <li scrollspy-listen="about_se|locations">
          <a href="#about_se" clickable-hidenav du-smooth-scroll>
            O Standard Express
          </a>
        </li>
        {music}
        {gallery}
        <li scrollspy-listen="contact|footer">
          <a href="#contact" clickable-hidenav du-smooth-scroll>
            Kontakt
          </a>
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
