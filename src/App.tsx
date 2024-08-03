import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import { AboutSE } from "./components/AboutSE";
import { AboutWlod } from "./components/AboutWlod";
import { Contact } from "./components/Contact";
import { Gallery } from "./components/Gallery";
import { Locations } from "./components/Locations";
import { Music } from "./components/Music";
import { MusicPlayer, usePlayerState } from "./components/MusicPlayer";
import { Nav } from "./components/Nav";
import { Repertoire } from "./components/Repertoire";
import { Image } from "./components/types";
import { Videos } from "./components/Videos";
import gallery from "./data/gallery.json";
import musicCategories from "./data/music.json";
import videos from "./data/videos.json";
import { ReactComponent as Logo } from "./logo.svg";
import { SmoothLink } from "./SmoothLink";

const Header: FC = () => (
  <header id="header">
    <div className="inside ninesixzero clearfix">
      <SmoothLink href="#about">
        <div id="logo_main">
          <Logo />
        </div>
      </SmoothLink>
      <Nav hasMusic={!!musicCategories.length} hasGallery={!!gallery.length} />
    </div>
  </header>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer">
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
    const MILLIS_PER_YEAR = 1000 * 3600 * 24 * 365;

    const expires = new Date(new Date().valueOf() + MILLIS_PER_YEAR);

    setCookie("cookie-consent", true, { expires });
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
      <Videos videos={videos} />
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
