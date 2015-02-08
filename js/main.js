/**
 * Created by kubuk_000 on 2014-10-06.
 */
app = angular.module("wKoz", ["ngScrollSpy", "ngRoute", "duScroll", "ngDialog"]);
app.run(function ($rootScope, $window) {
    $rootScope.host = "http://"+$window.location.hostname+":8080/api";
    $rootScope.duOffset = 120;
})
app.config(function(scrollspyConfigProvider, $httpProvider){
    $httpProvider.defaults.withCredentials = true;
    scrollspyConfigProvider.config = {
        offset: "120|60"
    }
})
app.directive("sticker", function($timeout, SpyFactory){
    return{
        link: function(scope,elem,attr){
            scope.$on("spied", function(){
                if(SpyFactory.spies.length>1){
                    $timeout(function(){
                        attr.$set("active","true");
                    },20);
                }
                else{
                    $timeout(function(){
                        elem.removeAttr("active");
                    },20)
                }
            })
        }
    }
})
app.controller("NavController", function($scope, $window){
    app.scope = $scope;
    $scope.nav = {visible:false};
    $scope.toggleNav = function () {
        $scope.nav.visible = !$scope.nav.visible;
    }
    $scope.showNav = function(){
        $scope.nav.visible = true;
    }
    $scope.hideNav = function(){
        $scope.nav.visible = false;
    }
    angular.element($window).bind("resize", function(){
        if(this.innerWidth>980){
            $scope.$apply(function(){
                $scope.hideNav();
                if($scope.$root.isSmall) $scope.$root.isSmall = undefined;
            })
        }
        else if(!$scope.$root.isSmall) $scope.$root.isSmall = true;
        $scope.$root.duOffset = !$scope.$root.isSmall?120:80;
    });
    $scope.$root.$on("navCloseRequested", function(){
        $scope.hideNav();
    })
})
app.controller("GalleryController", function ($scope, $http) {
    var g = $scope.gallery = {selected: 0, size: 0};
    g.next = function(){
        g.selected+=((g.selected<g.size-1)?1:-g.selected);
    }
    g.previous = function(){
        g.selected-=(g.selected>0?1:(-g.size+1));
    }
    $http.get($scope.host+"/get_all.php").then(function(result){
        $scope.galrows = [];
        var currRow = [];
        for (var i = 0; i < result.data.gallery.length; i++) {
            currRow.push(result.data.gallery[i]);
            if(currRow.length == 3 || i == result.data.gallery.length-1){$scope.galrows.push(currRow); currRow = []}
        }
        g.size = $scope.galrows.length;
    })
})
app.directive("galleryModal", function(ngDialog){
    return {
        scope: {href: "="},
        link: function(scope, elem, attr){
            angular.forEach(elem, function(el){
                el.onclick = function(){
                    scope.attr = attr;
                    ngDialog.open({plain: true, template: "<div style='background: url({{attr.href}}) no-repeat center / contain'></div>", scope: scope});
                }
            })
        }
    }
})
app.directive("musicPlayer", function(){
    return{
        restrict: "E",
        link: function(scope,elem){
            var p = scope.$root.player = scope.player = { playing: false, selected: 0, volume: 40, audio: new Audio()};
            p.songs = scope.$root.songs = [
                {name: "God Is Dead?", file: "bs.mp3"},
                {name: "Get Lucky", file: "dp.mp3"},
                {name: "Feeling Good", file: "mb.mp3"}
            ];
            p.audio.volume = p.volume/100;
            p.audio.onended = function(){scope.$apply(function(){p.nextSong()})};
            scope.$watch(function(){return p.volume}, function(v){if(p.audio)p.audio.volume = v/100});
            p.audio.src = "music/"+p.songs[p.selected].file;
            p.updatePlaying = function(pl){
                p.playing=pl;
                if(pl){
                    if(p.audio.src.indexOf("music/"+ p.songs[p.selected].file)<0)
                        p.audio.src = "music/"+ p.songs[p.selected].file;
                    p.audio.play();
                }
                else{
                    p.audio.pause();
                }
            }
            p.switchPlaying = function(){
                p.updatePlaying(!p.playing);
            }
            p.nextSong = function(){
                p.selected+=(p.selected<p.songs.length-1?1:-(p.songs.length-1));
                p.updatePlaying(true);
            }
            p.previousSong = function(){
                p.selected-=(p.selected>0?1:-(p.songs.length-1));
                p.updatePlaying(true);
            }
            p.volumeUp = function(){
                p.volume = Math.min(100, p.volume+10);
            }
            p.volumeDown = function(){
                p.volume = Math.max(0, p.volume-10);
            }

            var scrollbar = elem.children()[0].children[2].children[1];
            scope.vol = {clicked:false};
            scrollbar.onmousedown = function(e){
                scope.$apply(function(){
                    scope.vol.clicked=true;
                })
                scrollbar.onmousemove(e);
            }
            document.onmouseup = function(){
                scope.$apply(function(){
                    scope.vol.clicked=false;
                })
            }
            scrollbar.ontouchmove = scrollbar.onmousemove = function(e){
                if(scope.vol.clicked){
                    e.preventDefault();
                    vol = Math.round(100*Math.min(Math.max((e.offsetX || (e.clientX-scrollbar.getBoundingClientRect().left) || 0), 0)/ scrollbar.offsetWidth, 1));   scope.$apply(function(){
                        p.volume = vol;
                    })
                }
                else if(e.type == "touchmove"){
                    e.preventDefault();
                    vol = Math.round(100*Math.min(Math.max(((e.changedTouches[0].clientX-scrollbar.getBoundingClientRect().left) || 0), 0)/ scrollbar.offsetWidth, 1));
                    scope.$apply(function(){
                        p.volume = vol;
                    })
                }
            }
            document.onkeydown = function(e){
                scope.$apply(function(){
                    switch(e.keyCode){
                        case 37:
                            p.previousSong();
                            break;
                        case 39:
                            p.nextSong();
                            break;
                        case 38:
                            if(e.shiftKey)
                                p.volumeUp();
                            break;
                        case 40:
                            if(e.shiftKey)
                                p.volumeDown();
                            break;
                        case 32:
                            e.preventDefault();
                            p.switchPlaying();
                            break;
                    }
                });
            }
            scope.$on("musicRequested", function(obj, val){
                scope.$apply(function () {
                    if(!(p.playing && p.selected == val.id)){
                        p.selected = val.id;
                        p.updatePlaying(true);
                    }else{
                        p.updatePlaying(false);
                    }
                })
            })
        }
    }
})
app.directive("musicPlay", function(){
    return{
        scope: {
            musicPlay: "@"
        },
        link: function(scope,elem){
            elem[0].onclick = function(){
                scope.$root.$broadcast("musicRequested", {id:+scope.musicPlay});
            }
        }
    }
})
app.directive("clickableHidenav", function(){
    return{
        link: function(scope,elem){
            elem[0].onclick = function(){
                scope.$root.$broadcast("navCloseRequested");
            }
        }
    }
})

/*
* todo favicon
* todo korzystanie z api, dostosowanie niedokończonego playera
* */