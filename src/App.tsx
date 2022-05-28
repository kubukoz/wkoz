import { FC } from "react";
import { AboutWlod as AboutWlod } from "./components/AboutWlod";
import { Nav } from "./components/Nav";
import { ReactComponent as Logo } from "./logo.svg";
import { Repertoire } from "./components/Repertoire";
import { AboutSE } from "./components/AboutSE";
import { Locations } from "./components/Locations";
import { Contact } from './components/Contact';

export const Header: FC = () => {
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
  </>
);

export default App;
