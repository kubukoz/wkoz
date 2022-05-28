import { FC } from "react";
import { AboutWlod as AboutWlod } from "./components/AboutWlod";
import { Nav } from "./components/Nav";
import { ReactComponent as Logo } from "./logo.svg";
import { Repertoire } from "./components/Repertoire";
import { AboutSE } from "./components/AboutSE";
import { Locations } from "./components/Locations";
import { Contact } from "./components/Contact";
import { MusicPlayer } from "./components/MusicPlayer";
import { Gallery } from './components/Gallery';

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
          <h2>Copyright &copy; {currentYear}</h2>
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

const CookieConsent = () => {
  // todo: cookies logic
  const cookiesAccepted = false;

  return (
    <div
      cookie-consent
      id="cookie-consent"
      className={cookiesAccepted ? "" : "visible"}
    >
      <div className="ninesixzero">
        Strona korzysta z plików cookie w celach statystycznych.{" "}
        <a
          target="_blank"
          href="https://support.google.com/analytics/answer/6004245?hl=en"
        >
          Dowiedz się więcej
        </a>{" "}
        lub{" "}
        <a className="closer" ng-click="acceptCookies()">
          Zamknij
        </a>
      </div>
    </div>
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
    <Gallery />
    <Contact />
    <Footer />
    <MusicPlayer />
    <CookieConsent />
  </>
);

export default App;
