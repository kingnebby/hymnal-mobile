angular.module('app.services', [])

.factory('BlankFactory', [function() {

}])

.service('BlankService', [function() {
  var this_hymn
  var service = {
    hymn: function(h) {
      if (h) {
        this_hymn = h
      }
      return this_hymn
    }
  }
  return service
}]);