/**
 * Created by kubuk_000 on 2014-10-06.
 * todo data
 */
app = angular.module("wKoz"/*todo*/, ["ngScrollSpy", "ngRoute", "duScroll", "ngDialog"]);
app.run(function ($rootScope) {
    $rootScope.host = "http://localhost";
//    $rootScope.host = "http://wlodekkozlowski.pl"; //todo
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
    angular.element($window).bind('resize', function(){
        if(this.innerWidth>1000){
            $scope.hideNav();
        }
    });
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
app.directive("skrollrEnabled", function(){
    return{
        link: function(){
            if(!(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/).test(navigator.userAgent.toLowerCase() || navigator.vendor.toLowerCase() || window.opera.toLowerCase())){
                var s = skrollr.init({smoothScrollingDuration:1, forceHeight: false});
            }
        }
    }
})
app.directive("musicPlayer", function(){
    return{
        restrict: "AE",
        link: function(scope,elem){
            var p = scope.player = { playing: false, selected: 0, volume: 40, audio: new Audio()};
            p.songs = [
                {name: "Get Lucky", file: "dp.mp3"},
                {name: "God Is Dead?", file: "bs.mp3"},
                {name: "Feeling Good", file: "mb.mp3"},
                {name: "God Is Dead? jeszcze raz", file: "bs.mp3"}
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
            scrollbar.onmousemove = function(e){
                if(scope.vol.clicked){
                    e.preventDefault();
                    var vol = Math.round(100*Math.min(Math.max((e.offsetX || (e.clientX-scrollbar.getBoundingClientRect().left) || 0), 0)/ scrollbar.offsetWidth, 1));
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
                for(var i = 0; i < p.songs.length; i++){
                    if(p.songs[i].file == val){
                        scope.$apply(function(){
                            p.selected = i;
                            p.updatePlaying(true);
                        });
                        break;
                    }
                }
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
                scope.$root.$broadcast("musicRequested", scope.musicPlay);
            }
        }
    }
})