import { FC } from "react";
import { AboutWlod as AboutWlod } from "./components/AboutWlod";
import { Nav } from "./components/Nav";
import { ReactComponent as Logo } from "./logo.svg";
import { Repertoire } from "./components/Repertoire";
import { AboutSE } from "./components/AboutSE";
import { Locations } from "./components/Locations";
import { Contact } from "./components/Contact";

const Header: FC = () => {
  // todo
  return (
    <header id="header" scrollspy-broadcast scrollspy-offset="auto">
      <div className="inside ninesixzero clearfix">
        <a href="#about" du-smooth-scroll /* offset="{{duOffset}}" */>
          <div id="logo_main">
            <Logo />
          </div>
        </a>
        <Nav />
      </div>
    </header>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // todo scroll
  return (
    <footer
      scrollspy-broadcast
      id="footer"
      clickable-hidenav
      scrollspy-offset="auto|60"
    >
      <div className="ninesixzero">
        <div className="copyright">
          <h2>Copyright &copy; { currentYear }</h2>
          <h2>
            <b>Standard Express</b>
          </h2>
        </div>
        <div className="logo">
          <svg viewBox="0 0 386.823 144.517">
            <use xlinkHref="#logo_svg"></use>
          </svg>
        </div>
        <div className="authors">
          <h2>
            Projekt:{" "}
            <a href="http://kumalg.pl" target="_blank">
              Kamil Golec
            </a>
          </h2>
          <h2>
            Wykonanie:{" "}
            <a href="http://kubukoz.com" target="_blank">
              Jakub Kozłowski
            </a>
          </h2>
        </div>
      </div>
    </footer>
  );
};

const App = () => (
  <>
    <Header />
    <AboutWlod />
    <Repertoire />
    <AboutSE />
    <Locations />
    <div>todo: music</div>
    <div>todo: gallery</div>
    <Contact />
    <Footer />
  </>
);

export default App;
