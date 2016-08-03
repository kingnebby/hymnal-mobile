angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, $http, BlankService) {
  $scope.form = {
    search: undefined
  }

  $scope.docs = []

  var timeout
  $scope.$watch('form.search', function(n, o, s) {
    clearTimeout(timeout)
    if (n) {
      timeout = setTimeout(function() {
        $http.get('http://localhost:8000/search?keyword=' + n).then(function(res) {
          $scope.docs = res.data.results
        })
      }, 200)
    } else {
      $scope.docs = []
    }
  })

})

.controller('hymnCtrl', function($scope, $stateParams, $http) {
  $http.get('http://localhost:8000/hymn/' + $stateParams.id).then(function(res) {
    $scope.hymn = res.data.results[0]
  })
})