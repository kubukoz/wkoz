import { ReactComponent as FacebookLogo } from "../fb.svg";

export const Contact = () => {
  const WeseleZKlasaTitle =
    "Trio na przyjęcie weselne, obiad, jazz. Standard Express";

  return (
    <div id="contact">
      <div className="inside ninesixzero">
        <div className="col-xs-12 col-sm-6 tag">
          <h1 className="heading">Kontakt</h1>
        </div>
        <div className="col-xs-12 col-sm-6 data">
          <div className="left">
            <div className="name">Włodzimierz Kozłowski</div>
            <a href="mailto:wlodekozlowski@wp.pl">
              <i className="fa fa-envelope"></i>wlodekozlowski@wp.pl
            </a>
            <a>
              <i className="fa fa-phone"></i>697 103 600
            </a>
          </div>
          <div className="right">
            <a
              className="fb"
              href="https://www.facebook.com/standardexpresss"
              target="_blank"
            >
              <FacebookLogo />
            </a>
            <a
              title={WeseleZKlasaTitle}
              className="wesele-z-klasa"
              href="https://www.weselezklasa.pl/ogloszenia-weselne/jazz-na-ekskluzywne-przyjecia,36368/"
              target="_blank"
            >
              <img
                alt={WeseleZKlasaTitle}
                src="https://www.weselezklasa.pl/banery/Weselezklasa/logo104x128przezroczystetloczarnewypelnienie.png"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
