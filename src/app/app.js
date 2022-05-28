import angular from 'angular';
import ngCookies from 'angular-cookies'
import duScroll from 'angular-scroll'
import ngDialog from 'ng-dialog'

//custom styles
import '../style/reset.css'
import '../style/app.scss'

//custom scripts
import '../plugins/ng-scrollSpy.js'

//library styles
import 'font-awesome/css/font-awesome.css'
import 'bootstrap-css-only/css/bootstrap.css'
import 'ng-dialog/css/ngDialog-theme-default.css'
import 'ng-dialog/css/ngDialog.css'

//data
import galleryItems from '../data/gallery'

const flatMap = (f, arr) => arr.reduce((x, y) => [...x, ...f(y)], []);

const app = angular.module("wkoz", ["ngScrollSpy", "ngCookies", "duScroll", "ngDialog"]);
app.run(['$rootScope', function ($rootScope) {
  $rootScope.duOffset = 120;
}]);

app.config(['scrollspyConfigProvider', function (scrollspyConfigProvider) {
  scrollspyConfigProvider.config = {
    offset: "120|60"
  }
}]);
app.controller("NavController", ['$scope', '$window', function ($scope, $window) {
  app.scope = $scope;
  angular.element($window).bind("resize", function () {
    if (this.innerWidth > 980) {
      $scope.$apply(function () {
        $scope.hideNav();
        if ($scope.$root.isSmall) $scope.$root.isSmall = undefined;
      })
    }
    else if (!$scope.$root.isSmall) $scope.$root.isSmall = true;
    $scope.$root.duOffset = !$scope.$root.isSmall ? 120 : 80;
  });
  $scope.$root.$on("navCloseRequested", function () {
    $scope.hideNav();
  })
}]);
app.controller("GalleryController", ['$scope', function ($scope) {
  var g = $scope.gallery = { selected: 0 };
  g.next = function () {
    g.selected += ((g.selected < g.slideCount - 1) ? 1 : -g.selected);
  };
  g.previous = function () {
    g.selected -= (g.selected > 0 ? 1 : (-g.slideCount + 1));
  };
  g.items = galleryItems
  g.slideCount = Math.ceil(galleryItems.length / 3.0)
}]);

app.directive("galleryModal", ['ngDialog', function (ngDialog) {
  return {
    scope: { href: "=" },
    link: function (scope, elem, attr) {
      angular.forEach(elem, function (el) {
        el.onclick = function () {
          scope.attr = attr;
          ngDialog.open({
            plain: true,
            template: "<div style='background: url({{attr.href}}) no-repeat center / contain'></div>",
            scope: scope
          });
        }
      })
    }
  }
}]);
app.directive("musicPlayer", ['$rootScope', function ($rootScope) {
  return {
    restrict: "E",
    link: function (scope, elem) {
      const p = $rootScope.player = scope.player = {
        playing: false,
        selected: {},
        volume: 80,
        audio: new Audio()
      };

      p.audio.preload = "none";

      p.getSongById = function (id) {
        return flatMap(category => category.songs, scope.categories)
          .find(song => song.id === id);
      };

      const getCategoryById = id => scope.categories.find(cat => cat.id === id);

      p.getNextCategoryAfter = function (category) {
        var cats = scope.categories;
        return cats[category.ordr == cats.length ? 0 : category.ordr];
      };
      p.getPreviousCategoryBefore = function (category) {
        var cats = scope.categories;
        return cats[category.ordr == 1 ? cats.length - 1 : category.ordr - 2];
      };

      p.getNextSongAfter = function (song) {
        var cat = getCategoryById(song.catId);
        if (song.ordr == cat.songs.length)
          return p.getNextCategoryAfter(cat).songs[0];
        else
          return cat.songs[song.ordr];
      };
      p.getPreviousSongBefore = function (song) {
        var cat = getCategoryById(song.catId);
        if (song.ordr == 1) {
          var pcat = p.getPreviousCategoryBefore(cat);
          return pcat.songs[pcat.songs.length - 1];
        }
        else
          return cat.songs[song.ordr - 2];
      };

      p.audio.volume = p.volume / 100;
      p.audio.onended = function () {
        scope.$apply(function () {
          p.nextSong()
        })
      };
      scope.$watch(function () {
        return p.volume
      }, function (v) {
        if (p.audio) p.audio.volume = v / 100
      });
      p.audio.src = "";
      p.updatePlaying = function (shouldPlay) {
        p.playing = shouldPlay;
        const isDifferentTrack = p.audio.src.indexOf(p.selected.filename) < 0;

        if (shouldPlay) {
          if (isDifferentTrack) {
            p.audio.src = p.selected.filename;
          }
          p.audio.play()
        } else {
          p.audio.pause()
        }
      };
      p.switchPlaying = function () {
        p.updatePlaying(!p.playing)
      };
      p.nextSong = function () {
        p.selected = p.getNextSongAfter(p.selected);
        p.updatePlaying(true);
      };
      p.previousSong = function () {
        p.selected = p.getPreviousSongBefore(p.selected);
        p.updatePlaying(true);
      };
      p.volumeUp = function () {
        p.volume = Math.min(100, p.volume + 10);
      };
      p.volumeDown = function () {
        p.volume = Math.max(0, p.volume - 10);
      };

      const scrollbar = elem.children()[0].children[2].children[1];
      scope.vol = { clicked: false };
      scrollbar.onmousedown = function (e) {
        scope.$apply(function () {
          scope.vol.clicked = true;
        });
        scrollbar.onmousemove(e);
      };
      document.onmouseup = function () {
        scope.$apply(function () {
          scope.vol.clicked = false;
        });
      };

      scrollbar.ontouchmove = scrollbar.onmousemove = function (e) {
        let vol;
        if (scope.vol.clicked) {
          e.preventDefault();
          vol = Math.round(100 * Math.min(Math.max((e.offsetX || (e.clientX - scrollbar.getBoundingClientRect().left) || 0), 0) / scrollbar.offsetWidth, 1));
        } else if (e.type === "touchmove") {
          e.preventDefault();
          vol = Math.round(100 * Math.min(Math.max(((e.changedTouches[0].clientX - scrollbar.getBoundingClientRect().left) || 0), 0) / scrollbar.offsetWidth, 1));
        }
        if (vol !== undefined) scope.$apply(() => p.volume = vol)
      };

      document.onkeydown = function (e) {
        scope.$apply(function () {
          switch (e.key) {
            case "ArrowLeft":
              p.previousSong();
              break;
            case "ArrowRight":
              p.nextSong();
              break;
            case "ArrowUp":
              if (e.shiftKey)
                p.volumeUp();
              break;
            case "ArrowDown":
              if (e.shiftKey)
                p.volumeDown();
              break;
            case " ":
              e.preventDefault();
              p.switchPlaying();
              break;
          }
        });
      };
      scope.$on("musicRequested", function (obj, val) {
        const shouldAutoStart = val.playing === undefined || val.playing;

        const currentlyPlayingSameSong = p.playing && p.selected.id === val.id;
        if (!currentlyPlayingSameSong) {
          p.selected = p.getSongById(val.id);
          p.updatePlaying(shouldAutoStart);
        } else {
          p.updatePlaying(false);
        }
      })
      $rootScope.$broadcast("playerLoaded")
    }
  }
}]);
app.directive("musicPlay", function () {
  return {
    scope: {
      musicPlay: "@"
    },
    link: function (scope, elem) {
      elem[0].onclick = function () {
        scope.$root.$apply(() => scope.$root.$broadcast("musicRequested", { id: +scope.musicPlay }));
      }
    }
  }
});
app.directive("clickableHidenav", function () {
  return {
    link: function (scope, elem) {
      elem[0].onclick = function () {
        scope.$root.$broadcast("navCloseRequested");
      }
    }
  }
});
app.filter("range", function () {
  return function (input, total) {
    for (var i = 0; i < total; i++)
      input.push(i);
    return input;
  }
});
app.directive("cookieConsent", ['$cookies', function ($cookies) {
  return {
    scope: false,
    link: function (scope) {
      scope.cookiesAccepted = $cookies.get("acceptCookies");
      scope.acceptCookies = function () {
        var expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        $cookies.put("acceptCookies", "true", { expires: expires });
        scope.cookiesAccepted = true;
      }
    }
  }
}]);

export default 'wkoz';
