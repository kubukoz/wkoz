import { FC, useState } from "react";
import { AboutWlod as AboutWlod } from "./components/AboutWlod";
import { Nav } from "./components/Nav";
import { ReactComponent as Logo } from "./logo.svg";
import { Repertoire } from "./components/Repertoire";
import { AboutSE } from "./components/AboutSE";
import { Locations } from "./components/Locations";
import { Contact } from "./components/Contact";
import { MusicPlayer, usePlayerState } from "./components/MusicPlayer";
import { Gallery } from "./components/Gallery";
import { Music } from "./components/Music";
import musicCategories from "./data/music.json";
import gallery from "./data/gallery.json";
import { useCookies } from "react-cookie";
import { Image } from "./components/types";

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
        <Nav
          hasMusic={!!musicCategories.length}
          hasGallery={!!gallery.length}
        />
      </div>
    </header>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // todo scroll
  return (
    <footer scrollspy-broadcast id="footer" scrollspy-offset="auto|60">
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
  const [cookies, setCookie] = useCookies<
    "cookie-consent",
    { "cookie-consent": boolean }
  >(["cookie-consent"]);
  const cookiesAccepted: boolean = cookies["cookie-consent"];
  const acceptCookies = () => {
    setCookie("cookie-consent", true);
  };

  return (
    <div id="cookie-consent" className={cookiesAccepted ? "" : "visible"}>
      <div className="ninesixzero">
        Strona korzysta z plików cookie w celach statystycznych.{" "}
        <a
          target="_blank"
          href="https://support.google.com/analytics/answer/6004245?hl=en"
        >
          Dowiedz się więcej
        </a>{" "}
        lub{" "}
        <a className="closer" onClick={acceptCookies}>
          Zamknij
        </a>
      </div>
    </div>
  );
};

const getCategories = () => {
  let songId = 0;
  return musicCategories.map((category, catIndex) => ({
    ...category,
    id: catIndex,
    ordr: catIndex + 1,
    songs: category.songs.map((song, songIndex) => ({
      ...song,
      id: ++songId,
      ordr: songIndex + 1,
      catId: catIndex,
    })),
  }));
};

const getImages = () => gallery.map((image, i) => ({ ...image, id: i }));

const App = () => {
  const categories = getCategories();
  const images = getImages();

  const [modalSelectedImage, setModalSelectedImage] = useState<Image>();

  const player = usePlayerState({
    categories,
  });

  return (
    <>
      <Header />
      <AboutWlod />
      <Repertoire />
      <AboutSE />
      <Locations />
      <Music
        categories={categories}
        player={player.state}
        playSong={(id) => player.play.song(id)}
      />
      <Gallery
        images={images}
        modalSelectedImage={modalSelectedImage}
        setModalSelectedImage={setModalSelectedImage}
      />
      <Contact />
      <Footer />
      <MusicPlayer player={player} controllable={!modalSelectedImage} />
      <CookieConsent />
    </>
  );
};

export default App;
