const api_base_url = 'http://hymnal-api.kingnebby.com/hymn'

angular.module('app.controllers', ['ionic'])

// The Home Controller! Searches stuff and provides a help button.
.controller('homeCtrl', function($scope, $http, $ionicPopup) {

  var options = {
    scope: $scope,
    templateUrl: 'my-modal.html',
  }

  // Used to display the info box.
  var poppy
  $scope.showInfo = function() {
    poppy = $ionicPopup.show(options)
  }
  $scope.closeInfo = function() {
    poppy.close()
  }

  $scope.form = {
    search: undefined
  }

  // Got errors with this http://stackoverflow.com/questions/37367200/deferred-long-running-timer-tasks-to-improve-scrolling-smoothness
  const search_delay = 500

  var errHandler = function(res) {
    if (res) {
      if (res.statusText) {
        console.error("Server Response: " + res.statusText + " Status Code: " + res.status)
      } else {
        console.error(res)
      }
    } else {
      console.error(new Error('Unknown exception.'))
    }
  }

  $scope.docs = []

  var timeout

  $scope.$watch('form.search', handleSearchChange)

  function handleSearchChange(n, o, s) {
    $scope.searching = null
    clearTimeout(timeout)
    if (n) {
      timeout = setTimeout(function() {
        $scope.searching = "Searching..."
        $scope.loading = true

        var url
          // Check if number.
        if (!isNaN(Number(n))) {
          url = `${api_base_url}?hymn_number=${n}`
        } else {
          // Check title/first line.
          url = `${api_base_url}?title=${n}&first_line=${n}&author=${n}`
        }

        // Search.
        $http.get(url).then(function(res) {
          // catch errors and pass data forward.
          if (!res || !res.data) {
            return Promise.reject(new Error("No data from server."))
          }
          return res.data.results
        }).then(function(results) {
          // If results, just pass along.
          if (results && results.length > 0) {
            return results
          }

          // if no results, expand to search for phrase.
          $scope.searching = "Looking deeper..."
          url = `${api_base_url}?phrase=${n}`
          return $http.get(url).then(function(res) {
            if (!res || !res.data) {
              return Promise.reject(new Error("No data from server."))
            }
            return res.data.results
          })
        }).then(function(results) {
          if (results && results.length > 0) {
            return results
          }
          $scope.searching = "One last try..."
          url = `${api_base_url}?phrase=${n}&expanded=true`
          return $http.get(url).then(function(res) {
            if (!res || !res.data) {
              return Promise.reject(new Error("No data from server."))
            }
            return res.data.results
          })
        }).then(function(results) {
          $scope.loading = false
          if (!results || results.length == 0) {
            $scope.searching = "Sorry, no results found."
            $scope.docs = []
            return
          }
          $scope.searching = null

          $scope.docs = results
        }).catch(errHandler)

      }, search_delay)
    } else {
      $scope.docs = []
    }
  }
})

// Gets the specific hymn.
.controller('hymnCtrl', function($scope, $stateParams, $http) {
  var errHandler = function(res) {
    if (res) {
      if (res.statusText) {
        console.error("Server Response: " + res.statusText + " Status Code: " + res.status)
      } else {
        console.error(res)
      }
    } else {
      console.error(new Error('Unknown exception.'))
    }
  }
  $http.get(`${api_base_url}/${$stateParams.id}`).then(function(res) {
    $scope.hymn = res.data
  }, errHandler)
})