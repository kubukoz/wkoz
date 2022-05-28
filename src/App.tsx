import { FC } from "react";
import { About } from "./components/About";
import { Nav } from "./components/Nav";
import { ReactComponent as Logo } from "./logo.svg";
import { Repertoire } from "./components/Repertoire";

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
    <About />
    <Repertoire />
  </>
);

export default App;
