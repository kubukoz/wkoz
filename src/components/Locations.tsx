export const Locations = () => (
  <div
    id="locations"
    scrollspy-broadcast
    clickable-hidenav
    scrollspy-offset="auto|60"
  >
    <div className="inside ninesixzero clearfix">
      <h1 className="heading">Miejsca</h1>
      <hr />
      <p>Mieliśmy przyjemność grać na imprezach takich jak:</p>
      <ul>
        {[
          "wystawy, wernisaże, galerie plastyczne",
          "kabarety",
          "odczyty, przemówienia, konferencje, prezentacje, wykłady",
          "spotkania autorskie",
          "garden party",
          "uroczyste otwarcia inwestycji, lokali itp.",
          "ekskluzywne przyjęcia weselne",
        ].map((party, i) => (
          <li key={i}>
            <span>{party}</span>
          </li>
        ))}
      </ul>
      <p>
        Można nas także posłuchać w klubach jazzowych, pubach, restauracjach.
      </p>
      <p>Działamy na terenie całego kraju.</p>
    </div>
  </div>
);
