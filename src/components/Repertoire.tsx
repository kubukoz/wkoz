export const Repertoire = () => {
  // todo: scrollspy stuff
  return (
    <div id="repertoire" scrollspy-broadcast scrollspy-offset="auto|60">
      <div className="ninesixzero inside clearfix">
        <h1 className="heading">Repertuar</h1>
        <div className="block">
          <h2 className="subheading">Jazz</h2>
          <hr />
          <div className="columns clearfix">
            <div className="col-xs-12 col-sm-6 text">
              <div>
                Wraz z&nbsp;moimi przyjaciółmi, muzykami, gramy
                przede&nbsp;wszystkim standardy muzyki amerykańskiej - utwory
                grane i&nbsp;śpiewane przez takie sławy jazzu jak&nbsp;
                <b>
                  Chick&nbsp;Corea, Herbie&nbsp;Hancock, Frank&nbsp;Sinatra,
                  Ray&nbsp;Charles, Duke&nbsp;Ellington, George&nbsp;Gershwin,
                  Ella&nbsp;Fitzgerald, Louis&nbsp;Armstrong, Diana&nbsp;Krall,
                  Michael&nbsp;Buble, Miles&nbsp;Davis, Pat&nbsp;Metheny,
                  John&nbsp;Coltrane, Antônio&nbsp;Carlos&nbsp;Jobim,
                  Keith&nbsp;Jarrett{" "}
                </b>
                i&nbsp;wielu&nbsp;innych.
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 text">
              Oprócz utworów&nbsp;jazzowych, w swoim&nbsp;repertuarze mamy
              również własne&nbsp;aranżacje kompozycji artystów takich&nbsp;jak{" "}
              <b>
                Stevie&nbsp;Wonder, The&nbsp;Beatles, Sting, Elvis&nbsp;Presley,
                Ewa&nbsp;Bem, Czesław&nbsp;Niemen...
              </b>
              .
              {/* <div>
                      <a href="#music" du-smooth-scroll offset="{{duOffset}}" music-play="14"><i><svg viewBox="0 0 40 40"><use xlink:href="#play_button"></use></svg></i>Isn't She Lovely</a>
                      </div> */}
            </div>
          </div>
        </div>
        <div className="block">
          <h2 className="subheading">Kolędy</h2>
          <hr />
          <div className="columns">
            <div className="col-xs-12 text">
              W okresie świątecznym gramy także&nbsp;kolędy{" "}
              <b>klasycznie&nbsp;i&nbsp;"na jazzowo".</b>
            </div>
            {/* <div class="col-xs-12 col-sm-6 text"><a href="#music" du-smooth-scroll offset="{{duOffset}}" music-play="0"><i><svg viewBox="0 0 40 40"><use xlink:href="#play_button"></use></svg></i>Kolęda polska</a></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
