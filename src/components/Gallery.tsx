export const Gallery = () => {
  // todo: logic, data, scroll
  return (
    <div
      id="gallery"
      scrollspy-broadcast
      clickable-hidenav
      scrollspy-offset="auto|60"
      ng-controller="GalleryController"
      ng-show="gallery.items"
    >
      <div className="wrapper">
        <div className="arrow left" ng-click="gallery.previous()">
          <svg viewBox="0 0 20.81 32.384">
            <defs>
              <g id="arrow">
                <path
                  d="M20.433,5.521c0.502-0.502,0.502-1.307,0-1.809l-3.336-3.336c-0.502-0.502-1.307-0.502-1.809,0L0.377,15.288
    c-0.502,0.502-0.502,1.307,0,1.809l14.912,14.912c0.502,0.502,1.307,0.502,1.809,0l3.336-3.336c0.502-0.502,0.502-1.307,0-1.809
    L9.762,16.192L20.433,5.521z"/>
              </g>
            </defs>
            <use xlinkHref="#arrow"></use>
          </svg>
        </div>
        <div className="arrow right" ng-click="gallery.next()">
          <svg viewBox="0 0 20.81 32.384">
            <use xlinkHref="#arrow"></use>
          </svg>
        </div>
        <div className="slides">
          <div
            ng-repeat="row in []|range:gallery.slideCount"
            className="slide"
            ng-className="{'unselected':gallery.selected!=$index, 'left':gallery.selected>$index, 'right':gallery.selected<$index}"
          >
            <div
              className="item"
              ng-repeat="item in gallery.items.slice($index*3, ($index+1)*3)"
            >
              <div
                className="image"
                ng-style="{'background-image': 'url('+item.image+')'}"
                gallery-modal
                ng-href="{{item.image}}"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
