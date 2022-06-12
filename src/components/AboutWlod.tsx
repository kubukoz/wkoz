export const AboutWlod = () => {
  const description = `Muzyka w moim życiu odgrywa ogromną rolę.
  Kiedyś, jako słuchacz, obecny byłem zarówno na wielu
  festiwalach,
  jak i koncertach w małych klubach. Obecnie - jako muzyk - podobnie, występowałem na dużych i małych
  scenach.
  Wieloletnie obserwacje życia muzycznego bardzo pomagają mi w relacjach między muzyką a jej
  odbiorcami.`;

  return (
    <div id="about" scrollspy-broadcast scrollspy-offset="auto|60">
      <div id="about_inside" className="ninesixzero clearfix">
        <div className="image col-xs-12 col-sm-4">
          <div className="inside"></div>
        </div>
        <div className="text col-xs-12 col-sm-8">
          <h1>Włodek Kozłowski</h1>
          <hr />
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};
