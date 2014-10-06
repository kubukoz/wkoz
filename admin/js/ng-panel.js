/**
 * Created by kubuk_000 on 2014-10-01.
 */
app = angular.module("panel", ['ngSanitize', 'ngRoute', 'ngDialog', 'textAngular', "angularFileUpload"]);
app.run(function($rootScope, $http, ngDialog, authService){
    var dialogVisible = false;
    $rootScope.message = {text:""};
    $rootScope.authmessage = "Zaloguj się";
    $rootScope.host = "http://localhost";
//    $rootScope.host = "http://wlodekkozlowski.pl"; //todo
    $rootScope.apiHost = $rootScope.host+"/admin/api";
    $rootScope.title = {main: "WK Panel"/*todo*/, sub: ""};
    $rootScope.auth = function(user){
            authService.auth(user)
                .then(function(result){
                    if(result.data.user != undefined){
                        $rootScope.user = result.data.user;
                        ngDialog.close();
                        dialogVisible = false;
                    }
                    else if(result.data.error != undefined){
                        $rootScope.user = undefined;
                        switch(result.data.error){
                            case "no_data":
                                $rootScope.authmessage = "Zaloguj się";
                                break;
                            case "wrong_data":
                                $rootScope.authmessage = "Podane dane są nieprawidłowe. Spróbuj ponownie.";
                                break;
                        }
                        if(!dialogVisible){
                            ngDialog.open({
                                scope: $rootScope,
                                template: "logindialog.html",
                                closeByEscape: false,
                                closeByDocument: false,
                                showClose: false
                            });
                            dialogVisible = true;
                        }
                    }
                });
    };
    if($rootScope.user){
        $rootScope.auth();
    }
});
app.config(function($routeProvider, $httpProvider){
    $httpProvider.defaults.withCredentials = true;
    $routeProvider
        .when("/", {
            templateUrl: "templates/home.html",
            controller: function($scope){
                $scope.auth();
            }
        })
        .when("/logout", {
            template: "Trwa wylogowywanie.",
            controller: function($scope, $http, $location){
                $http.post($scope.host+"/admin/api/logout.php", null).then(function(){
                    $location.path("/");
                });
            }
        })
        .when("/users", {
            templateUrl: "templates/users.html"
        })
        .when("/gallery", {
            templateUrl: "templates/gallery.html"
        })
        .otherwise({
            redirectTo: "/"
        })
});
app.directive('ngThumb', function($window){
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
});
app.directive("message", function($timeout){
    return {
        link: function(scope,elem){
            scope.$watch('message.text', function(nv){
                if(nv){
                    elem.addClass("visible");
                    $timeout(function(){
                        elem.removeClass("visible");
                        $timeout(function(){
                            scope.message.text = "";
                        },500)
                    }, 3000);
                }
            })
        }
    }
})
app.service("authService", function($rootScope, $http){
    return {
        auth: function(user){
            return $http.post($rootScope.host+"/admin/api/login.php", {user:user});
        }
    }
})