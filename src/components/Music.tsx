export const Music = () => {
  // todo placeholders, logic, scroll, data
  return (
    <div
      id="music"
      scrollspy-broadcast
      clickable-hidenav
      scrollspy-offset="auto|60"
      ng-show="categories.length"
    >
      <div className="ninesixzero">
        <h1 className="heading">Muzyka</h1>
        <div className="col-sm-12 col-md-6 column">
          <div className="block" ng-show="categories.length">
            <div ng-repeat="category in categories.slice(0, 2)">
              <h2 ng-show="category.name.length">{/* category.name */}</h2>
              <ul>
                <li
                  ng-repeat="song in category.songs"
                  ng-className="{'playing':player.selected.id==song.id && player.playing}"
                  music-play="{{song.id}}"
                >
                  <i className="button">
                    <svg viewBox="0 0 40 40">
                      <use className="play" xlinkHref="#play_button"></use>
                      <use className="pause" xlinkHref="#pause_button"></use>
                    </svg>
                  </i>
                  {/* song.name */}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-6 column">
          <div className="block" ng-show="categories.length">
            <div ng-repeat="category in categories.slice(2)">
              <h2 ng-show="category.name.length">{/* category.name */}</h2>
              <ul>
                <li
                  ng-repeat="song in category.songs"
                  ng-className="{'playing':player.selected.id==song.id && player.playing}"
                  music-play="{{song.id}}"
                >
                  <i className="button">
                    <svg viewBox="0 0 40 40">
                      <use className="play" xlinkHref="#play_button"></use>
                      <use className="pause" xlinkHref="#pause_button"></use>
                    </svg>
                  </i>
                  {/* song.name */}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
