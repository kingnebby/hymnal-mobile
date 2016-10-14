const api_base_url = 'http://hymnal-api.kingnebby.com/hymn'
const api_search_path = '?keyword='
const api_id_path = '/'

angular.module('app.controllers', ['ionic'])

// The Home Controller! Searches stuff and provides a help button.
.controller('homeCtrl', function($scope, $http, $ionicPopup) {

  var options = {
    scope: $scope,
    templateUrl: 'my-modal.html',
  }

  var poppy
  $scope.showInfo = function () {
    poppy = $ionicPopup.show(options)
  }
  $scope.closeInfo = function () {
    poppy.close()
  }

  $scope.form = {
    search: undefined
  }
  // Got errors with this http://stackoverflow.com/questions/37367200/deferred-long-running-timer-tasks-to-improve-scrolling-smoothness
  const search_delay = 500

  var errHandler = function(res) {
    console.error("Server Response: " + res.statusText + " Status Code: " + res.status)
  }

  $scope.docs = []

  $scope.search = function (e) {
    console.log(e)
  }

  var timeout
  // var handleSearchChange

  $scope.$watch('form.search', handleSearchChange)

 function handleSearchChange (n, o, s) {
    clearTimeout(timeout)
    // TODO: If number, search only on hymn numbers. !isNaN(Number(n)) -- should be server option.
    // TODO: insert regexs between spaces to account for punctuation? -- should be server option.
    // TODO: sort on number. - should be server default.
    if (n) {
      timeout = setTimeout(function() {
        $http.get(api_base_url + api_search_path + n).then(function(res) {
          if (res && res.data && res.data.results) {
            var ret = res.data.results.sort(function(a,b) {
              return Number(a.hymn_number) - Number(b.hymn_number)
            })
            ret = _.filter(ret, function(el) {
              return el.hymn_number.match(n)
            })
            // console.log("Result count: " + res.data.results.length)
            $scope.docs = res.data.results
          }
        }, errHandler)
      }, search_delay)
    } else {
      $scope.docs = []
    }
  }
})

.controller('hymnCtrl', function($scope, $stateParams, $http) {
  var errHandler = function(res) {
    console.error("Server Response: " + res.statusText + " Status Code: " + res.status)
  }
  $http.get(api_base_url + api_id_path + $stateParams.id).then(function(res) {
    $scope.hymn = res.data.results
  }, errHandler)
})