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

var app = angular.module("wkoz", ["ngScrollSpy", "ngCookies", "duScroll", "ngDialog"]);
app.run(['$rootScope', '$window', '$http', function ($rootScope, $window, $http) {
	$rootScope.duOffset = 120;
	$rootScope.currentYear = new Date().getFullYear();
	// $http.get("api/music.json").then(function (result) {
	// 	if (result.data.length) {
	// 		$rootScope.categories = result.data;
	// 		$rootScope.player.selected = $rootScope.categories[0].songs[0];
	// 		$rootScope.player.switchPlaying(true);
	// 	}
	// })
}]);

app.config(['scrollspyConfigProvider', function (scrollspyConfigProvider) {
	scrollspyConfigProvider.config = {
		offset: "120|60"
	}
}]);
app.controller("NavController", ['$scope', '$window', function ($scope, $window) {
	app.scope = $scope;
	$scope.nav = {visible: false};
	$scope.toggleNav = function () {
		$scope.nav.visible = !$scope.nav.visible;
	};
	$scope.showNav = function () {
		$scope.nav.visible = true;
	};
	$scope.hideNav = function () {
		$scope.nav.visible = false;
	};
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
app.controller("GalleryController", ['$scope', '$http', function ($scope, $http) {
	var g = $scope.gallery = {selected: 0};
	g.next = function () {
		g.selected += ((g.selected < g.slideCount - 1) ? 1 : -g.selected);
	};
	g.previous = function () {
		g.selected -= (g.selected > 0 ? 1 : (-g.slideCount+ 1));
  };
  g.items = galleryItems
  g.slideCount = Math.ceil(galleryItems.length/3.0)
}]);

app.directive("galleryModal", ['ngDialog', function (ngDialog) {
	return {
		scope: {href: "="},
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
app.directive("musicPlayer", function () {
	return {
		restrict: "E",
		link: function (scope, elem) {
			var p = scope.$root.player = scope.player = {playing: false, selected: {}, volume: 40, audio: new Audio()};

			p.getSongById = function (id) {
				var cats = scope.categories;
				for (var i = 0; i < cats.length; i++)
					for (var j = 0; j < cats[i].songs.length; j++)
						if (cats[i].songs[j].id == id) return cats[i].songs[j]
			};
			var getCategoryById = function (id) {
				for (var i = 0; i < scope.categories.length; i++)
					if (scope.categories[i].id == id) return scope.categories[i];
			};

			p.getNextCategoryAfter = function (category) {
				var cats = scope.categories;
				return cats[category.ordr == cats.length ? 0 : category.ordr];
			};
			p.getPreviousCategoryBefore = function (category) {
				var cats = scope.categories;
				return cats[category.ordr == 1 ? cats.length - 1 : category.ordr - 2];
			};

			p.getNextSongAfter = function (song) {
				var cat = getCategoryById(song.cat_id);
				if (song.ordr == cat.songs.length)
					return p.getNextCategoryAfter(cat).songs[0];
				else
					return cat.songs[song.ordr];
			};
			p.getPreviousSongBefore = function (song) {
				var cat = getCategoryById(song.cat_id);
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
				if (p.audio)p.audio.volume = v / 100
			});
			p.audio.src = "";
			p.updatePlaying = function (pl) {
				p.playing = pl;
				if (pl) {
					if (p.audio.src.indexOf(p.selected.filename) < 0)
						p.audio.src = p.selected.filename;
					p.audio.play();
				}
				else {
					p.audio.pause();
				}
			};
			p.switchPlaying = function (force) {
				var newPlaying;
				if (force != null) newPlaying = force;
				else newPlaying = !p.playing;
				p.updatePlaying(newPlaying);
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

			var scrollbar = elem.children()[0].children[2].children[1];
			scope.vol = {clicked: false};
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
				if (scope.vol.clicked) {
					e.preventDefault();
					vol = Math.round(100 * Math.min(Math.max((e.offsetX || (e.clientX - scrollbar.getBoundingClientRect().left) || 0), 0) / scrollbar.offsetWidth, 1));
					scope.$apply(function () {
						p.volume = vol;
					});
				}
				else if (e.type == "touchmove") {
					e.preventDefault();
					vol = Math.round(100 * Math.min(Math.max(((e.changedTouches[0].clientX - scrollbar.getBoundingClientRect().left) || 0), 0) / scrollbar.offsetWidth, 1));
					scope.$apply(function () {
						p.volume = vol;
					})
				}
			};
			document.onkeydown = function (e) {
				scope.$apply(function () {
					switch (e.keyCode) {
						case 37:
							p.previousSong();
							break;
						case 39:
							p.nextSong();
							break;
						case 38:
							if (e.shiftKey)
								p.volumeUp();
							break;
						case 40:
							if (e.shiftKey)
								p.volumeDown();
							break;
						case 32:
							e.preventDefault();
							p.switchPlaying();
							break;
					}
				});
			};
			scope.$on("musicRequested", function (obj, val) {
				scope.$apply(function () {
					if (!(p.playing && p.selected.id == val.id)) {
						p.selected = p.getSongById(val.id);
						p.updatePlaying(true);
					} else {
						p.updatePlaying(false);
					}
				})
			})
		}
	}
});
app.directive("musicPlay", function () {
	return {
		scope: {
			musicPlay: "@"
		},
		link: function (scope, elem) {
			elem[0].onclick = function () {
				scope.$root.$broadcast("musicRequested", {id: +scope.musicPlay});
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
app.filter("range", function(){
	return function(input, total){
		for(var i = 0; i < total; i++)
			input.push(i);
		return input;
	}
});
app.directive("cookieConsent", ['$cookies', function($cookies){
	return {
		scope: false,
		link: function(scope){
			scope.cookiesAccepted = $cookies.get("acceptCookies");
			scope.acceptCookies = function(){
				var expires = new Date();
				expires.setFullYear(expires.getFullYear()+1);
				$cookies.put("acceptCookies", "true", {expires: expires});
				scope.cookiesAccepted = true;
			}
		}
	}
}]);

export default 'wkoz';
