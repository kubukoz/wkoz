import { ReactComponent as Sax } from "../sax.svg";

export const AboutSE = () => (
  // todo scroll stuff
  <div
    id="about_se"
    scrollspy-broadcast
    clickable-hidenav
    scrollspy-offset="auto|60"
  >
    <div className="background"></div>
    <div className="inside ninesixzero clearfix">
      <h1 className="heading">O Standard Express</h1>
      <div className="top">
        <div className="col-xs-12 col-sm-4 sax">
          <Sax />
        </div>
        <div className="col-xs-12 col-sm-8 right">
          <h2 className="subheading">Zespoły, instrumenty</h2>
          <p>
            Występujemy najczęściej w kameralnych składach (trio, kwartet,
            duet). Na specjalne okoliczności przygotowujemy skład wieloosobowy.
          </p>
          <p>
            Fortepian, gitara, skrzypce, saksofon, trąbka, bas i perkusja to
            najczęściej wykorzystywane przez nas instrumenty. Współpracujemy
            również z wokalistami.
          </p>
          <p>
            Skład zespołu i repertuar starannie dobieramy do charakteru
            wydarzenia.
          </p>
          <p className="bigger">
            <b>Posiadamy własny sprzęt nagłośnieniowy.</b>
          </p>
        </div>
      </div>
      <hr />
      <p className="text">
        Artyści, z którymi miałem i mam przyjemność współpracować, to m.in.:
        wybitny skrzypek jazzowy
        <b>Maciej&nbsp;Strzelczyk</b>, pianiści{" "}
        <b>Jarosław&nbsp;Małys, Witold&nbsp;Janiak</b>, gitarzyści
        <b>Krzysztof&nbsp;Woliński, Romuald&nbsp;Erenc</b>, perkusista{" "}
        <b>Grzegorz&nbsp;Grzyb</b> i aktorka&nbsp;
        <b>Grażyna&nbsp;Błęcka-Kolska</b>.
      </p>
    </div>
  </div>
);
