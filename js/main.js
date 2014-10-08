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
            if(!(/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera)){
                var s = skrollr.init({smoothScrollingDuration:1, forceHeight: false});
            }
        }
    }
})
app.directive("musicPlayer", function(){
    return{
        restrict: "AE",
        link: function(scope,elem,attr){
            scope.playing = true;
            scope.currentSong = "Isn't she lovely";
            scope.switchPlaying = function(){
                scope.playing=!scope.playing;
            }
            scope.nextSong = function(){

            }
            scope.previousSong = function(){

            }
        }
    }
})