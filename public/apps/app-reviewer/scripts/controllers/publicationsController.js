(function() {
    'use strict';

    angular
        .module('reviewerApp')
        .controller('publicationsCtrl', publicationsCtrl);

    publicationsCtrl.$inject = ['$scope', '$q', 'DataStorePublication'];

    function publicationsCtrl($scope, $q, DataStorePublication) {

        $scope.publications = [];
        $scope.publicationsLoading = true;
        $scope.publicationObject = {};
        $scope.modalType = modalType;
        $scope.deletePublication = deletePublication;
        $scope.updatePublication = updatePublication;

        function modalType(index, obj) {
            if(index == 0)
                $scope.modalTyper = true;
            else if(index == 2) {
                $scope.modalTyper = true;
                $scope.evalpub = obj;
            } else {
                  $scope.modalTyper = false;
                  $scope.evalpub = obj;
            }
        }
        init();
// Share authorId of logged in user
        function init() {
            var promises = [getPublicationsByReviewer("57515c128fdcdf4fbcba227a")];
            $q.all(promises).then(function() {
                console.log('The publications are ready');
            });
        }

        function getPublicationsByReviewer(authorId) {
            DataStorePublication.getPublicationsByReviewer(authorId)
            .then(function(publications) {
                $scope.publications = publications.data;
                $scope.publicationsLoading = false;
            })
            .catch(function(err) {
                console.error(err);
            });
        }

        function deletePublication(publicationId) {
            DataStorePublication.deletePublicationById(publicationId)
            .then(function(publication) {
              init();
            })
            .catch(function(err) {
              console.error(err);
            });
        }

        function updatePublication(publicationObj) {
            DataStorePublication.updatePublicationById(publicationObj)
            .then(function(publication) {
              init();
            })
            .catch(function(err) {
              console.error(err);
            });
        }

    }

})();
