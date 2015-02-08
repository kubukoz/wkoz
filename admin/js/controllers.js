/**
 * Created by kubuk_000 on 2014-10-02.
 */
app = angular.module("panel");
app.controller("UsersController", function($scope, entityService, authService){
    $scope.title.sub = "Użytkownicy";
    entityService.scope = $scope;
    var strings = $scope.$root.strings = {
        TYPE: "users",
        FORM: {
            CREATE_ENTITY: "Dodaj użytkownika",
            EDIT_ENTITY: "Edytuj użytkownika",
            CHOOSE_ENTITY: "Wybierz użytkownika",
            CANT_REMOVE_MYSELF: "Nie możesz usunąć swojego konta."
        },
        CREATED: "Dodano użytkownika.",
        DELETED: "Usunięto użytkownika.",
        ERR_FOUND: "Użytkownik o tej nazwie już istnieje. Wybierz inną i spróbuj ponownie.",
        NOTFOUND: "Wybrany użytkownik nie istnieje. Spróbuj ponownie.",
        UPDATED: "Zaktualizowano użytkownika.",
        DELETE_QUESTION: "Czy aby na pewno chcesz usunąć tego użytkownika?",

        INVALID: "Nie wypełniono wszystkich pól. Spróbuj ponownie.",
        ERROR: "Wystąpił błąd. Spróbuj ponownie.",
        FILL_ALL_FIELDS: "Wypełnij wszystkie pola.",
        CREATE_PLS: "Dodaj",
        UPDATE_PLS: "Aktualizuj",
        DELETE_PLS: "Usuń"
    };
    $scope.entities = [];
    $scope.newEntity = {};
    $scope.editedEntity = {};
    $scope.$watch("selectedEntity", function(){
        angular.copy($scope.selectedEntity, $scope.editedEntity);
    })

    $scope.createEntity = function(){
        if($scope.createEntity_form.$valid){
            entityService.createEntity(strings.TYPE, $scope.newEntity, function(data, code){
                switch(code) {
                    case entityService.codes.ENTITY_CREATED:
                        $scope.message.text = strings.CREATED;
                        break;
                    case entityService.codes.ENTITY_INVALID:
                        $scope.message.text = strings.INVALID;
                        break;
                    case entityService.codes.ENTITY_FOUND:
                        $scope.message.text = strings.ERR_FOUND;
                        break;
                    default:
                        $scope.message.text = strings.ERROR;
                        break;
                }
            })
        }
    }
    $scope.updateEntity = function(){
        if($scope.updateEntity_form.$valid){
            entityService.updateEntity(strings.TYPE, $scope.editedEntity, function(data,code){
                switch(code) {
                    case entityService.codes.ENTITY_UPDATED:
                        $scope.message.text = strings.UPDATED;
                        if(data.id==$scope.user.id){
                            $scope.user = data;
                            authService.auth($scope.user);
                        }
                        break;
                    case entityService.codes.ENTITY_INVALID:
                        $scope.message.text = strings.INVALID;
                        break;
                    case entityService.codes.ENTITY_NOTFOUND:
                        $scope.message.text = strings.NOTFOUND;
                        break;
                    default:
                        $scope.message.text = strings.ERROR;
                        break;
                }
            });
        }
    }
    $scope.deleteEntity = function(){
        event.preventDefault();
        if ($scope.user.id != $scope.editedEntity.id && confirm(strings.DELETE_QUESTION)) {
            entityService.deleteEntity(strings.TYPE, $scope.editedEntity, function (data, code) {
                switch (code) {
                    case entityService.codes.ENTITY_DELETED:
                        $scope.message.text = strings.DELETED;
                        break;
                    case entityService.codes.ENTITY_NOTFOUND:
                        $scope.message.text = strings.NOTFOUND;
                        break;
                    default:
                        $scope.message.text = strings.ERROR;
                        break;
                }
            });
        }
    }
    $scope.getEntities = function () {
        entityService.getEntities(strings.TYPE, function(data){
            $scope.entities = data;
        })
    }
    $scope.auth(undefined, function callback(){
        $scope.getEntities();
    });
});
app.controller("GalleryController", function($scope, entityService, FileUploader, $http){
    $scope.title.sub = "Galeria";
    entityService.scope = $scope;
    var strings = $scope.$root.strings = {
        TYPE: "gallery",
        FORM: {
            CREATE_ENTITY: "Dodaj zdjęcie",
            EDIT_ENTITY: "Edytuj zdjęcie",
            CHOOSE_ENTITY: "Wybierz zdjęcie"
        },
        CREATED: "Dodano zdjęcie.",
        DELETED: "Usunięto zdjęcie.",
        NOTFOUND: "Wybrane zdjęcie nie istnieje. Spróbuj ponownie.",
        UPDATED: "Zaktualizowano zdjęcie.",
        REORDERED: "Przeniesiono zdjęcie.",
        DELETE_QUESTION: "Czy aby na pewno chcesz usunąć to zdjęcie?",

        INVALID: "Nie wypełniono wszystkich pól. Spróbuj ponownie.",
        ERROR: "Wystąpił błąd. Spróbuj ponownie.",
        FILL_ALL_FIELDS: "Wypełnij wszystkie pola.",
        CREATE_PLS: "Dodaj",
        UPDATE_PLS: "Aktualizuj",
        DELETE_PLS: "Usuń"
    };
    $scope.entities = [];
    $scope.newEntity = {};
    $scope.editedEntity = {};
    var nUploader = $scope.nUploader = new FileUploader({withCredentials:true, url: $scope.host+'/admin/api/images/image_upload.php'});
    var eUploader = $scope.eUploader = new FileUploader({withCredentials:true, url: $scope.apiHost+"/gallery/update.php"});
    var filter = {
        name: 'imageFilter',
        fn: function(item, options){
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };
    nUploader.filters.push(filter);
    eUploader.filters.push(filter);
    $scope.$watch("selectedEntity", function(){
        angular.copy($scope.selectedEntity, $scope.editedEntity);
    })
    $scope.removeImage = function(){
        event.preventDefault();
        $scope.editedEntity.image = null;
    }
    $scope.createEntity = function(){
        if($scope.createEntity_form.$valid && (nUploader.queue.length || $scope.newEntity.image.length)){
            $scope.uploading = true;
            entityService.createEntity(strings.TYPE, $scope.newEntity, function(data, code){
                $scope.uploading = false;
                switch(code) {
                    case entityService.codes.ENTITY_CREATED:
                        if(nUploader.queue.length){
                            var filename = data.id;
                            nUploader.onSuccessItem = function(fileItem, response){
                                $scope.uploading = false;
                                nUploader.queue = [];
                                $scope.message.text = strings.CREATED;
                                $scope.newEntity = {}; $scope.editedEntity = {};
                                $scope.getEntities();
                            }
                            nUploader.queue[0].formData= [{filename:filename, folder:"gallery"}];
                            nUploader.uploadAll();
                        }
                        break;
                    case entityService.codes.ENTITY_INVALID:
                        $scope.message.text = strings.INVALID;
                        break;
                    default:
                        $scope.message.text = strings.ERROR;
                        break;
                }
            })
        }
    }
    $scope.updateEntity = function(){
        if($scope.updateEntity_form.$valid && (eUploader.queue.length || $scope.editedEntity.image.length)){
            $scope.uploading = true;
            eUploader.onSuccessItem = function(fileItem, response){
                $scope.uploading = false;
                switch(response.message) {
                    case entityService.codes.ENTITY_UPDATED:
                        $scope.message.text = strings.UPDATED;
                        $scope.editedEntity = {};
                        eUploader.queue = [];
                        $scope.getEntities();
                        break;
                    case entityService.codes.ENTITY_INVALID:
                        $scope.message.text = strings.INVALID;
                        break;
                    case entityService.codes.ENTITY_NOTFOUND:
                        $scope.message.text = strings.NOTFOUND;
                        break;
                    default:
                        $scope.message.text = strings.ERROR;
                        break;
                }
            };
            if(eUploader.queue.length){
                eUploader.queue[0].formData= [{form:JSON.stringify($scope.editedEntity)}];
                eUploader.uploadAll();
            } else
                $http.post($scope.apiHost+"/gallery/update.php", {form: JSON.stringify($scope.editedEntity)}).then(function(result){
                    eUploader.onSuccessItem(null, result.data);
                })
        }
    }
    $scope.deleteEntity = function(){
        event.preventDefault();
        if (confirm(strings.DELETE_QUESTION)) {
            entityService.deleteEntity(strings.TYPE, $scope.editedEntity, function (data, code) {
                switch (code) {
                    case entityService.codes.ENTITY_DELETED:
                        $scope.message.text = strings.DELETED;
                        break;
                    case entityService.codes.ENTITY_NOTFOUND:
                        $scope.message.text = strings.NOTFOUND;
                        break;
                    default:
                        $scope.message.text = strings.ERROR;
                        break;
                }
            });
        }
    }
    $scope.getEntities = function () {
        entityService.getEntities(strings.TYPE, function(data){
            $scope.entities = data;
        })
    }

    $scope.reorderEntity = function(entity, change){
        $http.post($scope.apiHost+"/gallery/reorder.php", {form: JSON.stringify(entity), change: change}).then(function(){
            $scope.message.text = strings.REORDERED;
            $scope.getEntities();
        });
    }
    $scope.auth(undefined, function callback(){
        $scope.getEntities();
    })
});
app.controller("MusicController", function($scope, entityService, FileUploader, $http){
    $scope.title.sub = "Muzyka";
    entityService.scope = $scope;

    var filter = {
        name: 'musicFilter',
        fn: function(item, options){
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|mp3|'/*+'wav|'*/.indexOf(type) !== -1;
        }
    };

    var strings = $scope.$root.strings = {
        TYPE: "music",
        FORM: {
            CREATE_ENTITY: "Dodaj kategorię"
        },
        CREATED: "Dodano kategorię.",
        DELETED: "Usunięto kategorię.",
        UPDATED: "Zaktualizowano kategorię.",
        REORDERED: "Przeniesiono kategorię.",
        DELETE_QUESTION: "Czy aby na pewno chcesz usunąć tę kategorię wraz ze wszystkimi utworami w niej?",

        DELETE_SONG_QUESTION: "Czy na pewno chcesz usunąć ten utwór?",
        INVALID: "Nie wypełniono wszystkich pól. Spróbuj ponownie.",
        ERROR: "Wystąpił błąd. Spróbuj ponownie.",
        FILL_ALL_FIELDS: "Wypełnij wszystkie pola.",
        CREATE_PLS: "Dodaj",
        UPDATE_PLS: "Aktualizuj",
        DELETE_PLS: "Usuń"
    };

    /**
     * Poniższe 2 funkcje to dużo śmieszków
    * */
    $scope.getNewUploader = function(category){
        for(var i = 0; i < $scope.newUploaders.length; i++){
            if($scope.newUploaders[i].id == category.id) return $scope.newUploaders[i].uploader;
        }
    }
    $scope.getEditedUploader = function(song){
        for(var i = 0; i < $scope.editedUploaders.length; i++){
            if($scope.editedUploaders[i].id == song.id)
                return $scope.editedUploaders[i].uploader;
        }
    }

    $scope.createCategory = function() {
        entityService.createEntity(strings.TYPE + "/cats", $scope.newCategory, function (data, code) {
            switch (code) {
                case entityService.codes.ENTITY_CREATED:
                    $scope.message.text = strings.CREATED;
                    $scope.newCategory = {};
                    $scope.getEntities();
                    break;
                case entityService.codes.ENTITY_INVALID:
                    $scope.message.text = strings.INVALID;
                    break;
                default:
                    $scope.message.text = strings.ERROR;
                    break;
            }
        })
    }
    $scope.updateCategory = function(cat) {
        entityService.updateEntity(strings.TYPE + "/cats", cat, function (data, code) {
            switch (code) {
                case entityService.codes.ENTITY_UPDATED:
                    $scope.message.text = strings.UPDATED;
                    $scope.getEntities();
                    break;
                case entityService.codes.ENTITY_INVALID:
                    $scope.message.text = strings.INVALID;
                    break;
                case entityService.codes.ENTITY_NOTFOUND:
                    $scope.message.text = strings.NOTFOUND;
                    break;
                default:
                    $scope.message.text = strings.ERROR;
                    break;
            }
        });
    }
    $scope.reorderCategory = function(entity, change){
        $http.post($scope.apiHost+"/"+strings.TYPE+"/cats/reorder.php", {form: JSON.stringify(entity), change: change}).then(function(){
            $scope.message.text = strings.REORDERED;
            $scope.getEntities();
        });
    }
    $scope.deleteCategory = function(category){
        if(confirm(strings.DELETE_QUESTION)){
            entityService.deleteEntity(strings.TYPE+"/cats", category, function(data, code){
                switch (code) {
                    case entityService.codes.ENTITY_DELETED:
                        $scope.message.text = "Usunięto kategorię.";
                        $scope.getEntities();
                        break;
                    case entityService.codes.ENTITY_NOTFOUND:
                        $scope.message.text = "Wybrana kategoria nie istnieje.";
                        break;
                    default:
                        $scope.message.text = strings.ERROR;
                        break;
                }
            })
        }
    }

    $scope.createTrack = function(category){
        entity = category.nsong;
        entity.category = category.id;
        nUploader = $scope.getNewUploader(category);
        if(category.nsong.name.length && nUploader.queue.length && !$scope.uploading){
            $scope.uploading = true;
            entityService.createEntity(strings.TYPE, entity, function(data, code){
                $scope.uploading = false;
                switch(code) {
                    case entityService.codes.ENTITY_CREATED:
                        if(nUploader.queue.length){
                            var filename = (data.id + "_" + nUploader.queue[0].file.name).split(" ").join("_");
                            nUploader.onSuccessItem = function(fileItem, response){
                                $scope.uploading = false;
                                if(response.message != "no_files"){
                                    nUploader.queue = [];
                                    $scope.message.text = "Dodano piosenkę.";
                                    $scope.getEntities();
                                }
                                else{
                                    $scope.message.text = "Nie wybrano pliku. Spróbuj ponownie.";
                                }
                            }
                            nUploader.queue[0].formData= [{filename:filename, id: data.id}];
                            $scope.uploading = true;
                            nUploader.uploadAll();
                        }
                        break;
                    case entityService.codes.ENTITY_INVALID:
                        $scope.message.text = strings.INVALID;
                        break;
                    default:
                        $scope.message.text = strings.ERROR;
                        break;
                }
            })
        }
    }
    $scope.reorderTrack = function(entity, categoryId, change){
        $http.post($scope.apiHost+"/"+strings.TYPE+"/reorder.php", {form: JSON.stringify(entity), category: categoryId, change: change}).then(function(){
            $scope.message.text = "Przeniesiono piosenkę.";
            $scope.getEntities();
        });
    }
    $scope.deleteTrack = function(track){
        event.preventDefault();
        if (confirm(strings.DELETE_SONG_QUESTION)) {
            entityService.deleteEntity(strings.TYPE, track, function (data, code) {
                switch (code) {
                    case entityService.codes.ENTITY_DELETED:
                        $scope.message.text = "Usunięto utwór.";
                        $scope.getEntities();
                        break;
                    case entityService.codes.ENTITY_NOTFOUND:
                        $scope.message.text = "Wybrany utwór nie istnieje.";
                        break;
                    default:
                        $scope.message.text = strings.ERROR;
                        break;
                }
            });
        }
    }
    $scope.updateTrack = function(track){
        var eUploader = $scope.getEditedUploader(track);
        if(track.name.length && !$scope.uploading){
            $scope.uploading = true;
            if(eUploader.queue.length){
                var filename = (track.id + "_" + eUploader.queue[0].file.name).split(" ").join("_");
                eUploader.onSuccessItem = function(fileItem, response){
                    $scope.uploading = false;
                    if(response.message != "no_files"){
                        eUploader.queue = [];
                        $scope.message.text = "Zmieniono piosenkę.";
                        $scope.getEntities();
                    }
                    else{
                        $scope.message.text = "Nie wybrano prawidłowego pliku. Spróbuj ponownie.";
                    }
                }
                eUploader.queue[0].formData = [{filename: filename, id: track.id, name: track.name}];
                eUploader.uploadAll();
            }
            else{
                $http.post($scope.apiHost+"/music/update.php", {id: track.id, name: track.name}).then(function(result){
                    $scope.uploading = false;
                    if(result.data.message != "no_files"){
                        $scope.message.text = "Zmieniono nazwę piosenki.";
                        $scope.getEntities();
                    }
                    else $scope.message.text = "Wystąpił błąd. Spróbuj ponownie.";
                })
            }
        }
    }

    $scope.getEntities = function(){
        entityService.getEntities(strings.TYPE+"/cats", function(data){
            $scope.categories = data;
            $scope.newUploaders = [];
            $scope.editedUploaders = [];
            $scope.newCategory = {};
            /**
             * Tu też dużo śmieszków
             * */
            for(var i = 0; i < data.length; i++){
                var nUploader = new FileUploader({withCredentials:true, url: $scope.host+'/admin/api/music/upload.php'});
                nUploader.filters.push(filter);
                $scope.newUploaders.push({id: data[i].id, uploader: nUploader});
                data[i].nsong = {};
                for(var j = 0; j < data[i].songs.length; j++){
                    var eUploader = new FileUploader({withCredentials:true, url: $scope.host+'/admin/api/music/update.php'});
                    eUploader.filters.push(filter);
                    $scope.editedUploaders.push({id: data[i].songs[j].id, uploader: eUploader});
                }
            }
        })
    }

    $scope.auth(null, function callback(){
        $scope.getEntities();
    });
});
app.service("entityService", function($rootScope, $http){
    scope = null;
    codes = {ENTITY_CREATED: 1,
        ENTITY_UPDATED: 2,
        ENTITY_DELETED: 3,
        ENTITY_NOTFOUND: -1,
        ENTITY_INVALID: 0,
        ENTITY_FOUND: -2,
        SERVER_ERROR: -13};
    return {
        scope: scope,
        codes: codes,
        createEntity: function(entityUri, entityObject, callback){
            this.callAPI("create", entityUri, callback, entityObject, this.scope);
        },
        deleteEntity: function(entityUri, entityObject, callback){
            this.callAPI("delete", entityUri, callback, entityObject);
        },
        updateEntity: function(entityUri, entityObject, callback){
            this.callAPI("update", entityUri, callback, entityObject);
        },
        getEntities: function(entityUri, callback){
            this.callAPI("get_all", entityUri, callback);
        },
        callAPI: function (method, entityUri, callback, entityObject){
            var scope = this.scope;
            $http.post($rootScope.apiHost+"/"+entityUri+"/"+method+".php", {form: entityObject}).then(function(result){
                callback(result.data.content, result.data.message);
                if(method=="create" && result.data.message==codes.ENTITY_CREATED && entityUri!="teachers") {scope.newEntity = {}; scope.editedEntity = {}}
                else if(method=="update" && result.data.message==codes.ENTITY_UPDATED) scope.editedEntity = {};
                else if(method=="delete" && result.data.message==codes.ENTITY_DELETED) scope.editedEntity = {};
            });
            if(method != "get_all") this.scope.getEntities();
        }
    }
})
