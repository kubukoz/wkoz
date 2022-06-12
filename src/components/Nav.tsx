import { FC, useEffect, useState } from "react";
import _ from "underscore";
import { SmoothLink } from "../SmoothLink";

type Props = { hasMusic: boolean; hasGallery: boolean };

const useIsInViewport = (target: readonly string[]) => {
  const [inViewport, setInViewport] = useState(false);

  const onScroll = () => {
    const header = document.getElementById("header");

    if (!header) return;

    const isInPort = (elem: Element) => {
      const headerHeight =
        header.getBoundingClientRect().bottom -
        header.getBoundingClientRect().top;

      const byTop = elem.getBoundingClientRect().top - headerHeight < 0;
      const byBottom = elem.getBoundingClientRect().bottom > headerHeight;

      return byTop && byBottom;
    };

    const elems = target.map((t) => {
      return document.querySelector(t);
    });

    setInViewport(_.any(elems, (elem) => (elem ? isInPort(elem) : false)));
  };

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, [target]);
  return inViewport;
};

const NavLink = ({
  target,
  children,
}: {
  target: readonly string[];
  children: JSX.Element;
}) => {
  const inViewport = useIsInViewport(target);

  return <li className={inViewport ? "active" : ""}>{children}</li>;
};

export const Nav: FC<Props> = ({ hasMusic, hasGallery }) => {
  const [visible, setVisible] = useState(false);

  const music = hasMusic && (
    <NavLink target={["#music"]}>
      <SmoothLink href="#music">Muzyka</SmoothLink>
    </NavLink>
  );

  const gallery = hasGallery && (
    <NavLink target={["#gallery"]}>
      <SmoothLink href="#gallery">Galeria</SmoothLink>
    </NavLink>
  );

  return (
    <nav id="nav">
      <ul className={visible ? "active" : ""} onClick={() => setVisible(false)}>
        <NavLink target={["#about"]}>
          <SmoothLink href="#about">O mnie</SmoothLink>
        </NavLink>
        <NavLink target={["#repertoire"]}>
          <SmoothLink href="#repertoire">Repertuar</SmoothLink>
        </NavLink>
        <NavLink target={["#about_se", "#locations"]}>
          <SmoothLink href="#about_se">O Standard Express</SmoothLink>
        </NavLink>
        {music}
        {gallery}
        <NavLink target={["#contact", "#footer"]}>
          <SmoothLink href="#contact">Kontakt</SmoothLink>
        </NavLink>
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
