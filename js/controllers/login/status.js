myApp.controller('StatusController', function(
  $scope, $rootScope, $firebaseSimpleLogin,
    $location, Authentication, $firebase, FIREBASE_URL) {

  $scope.logout = function() {
    Authentication.logout();
    $location.path('/login');
  }; //logout

  $rootScope.$on('$firebaseSimpleLogin:login', function(e, authUser) {

    temp = authUser.email;
    temp = temp.replace(/\./g, ",");
    authUser.username = temp;

    var ref = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/profileInfo');
    var user = $firebase(ref).$asObject();

    user.$loaded().then(function() {
      user.firstname = user.firstname.charAt(0).toUpperCase() + user.firstname.substring(1);
      $rootScope.currentUser = user;
    });
  }); 
  //$firebaseSimpleLogin:login

  $rootScope.$on('$firebaseSimpleLogin:logout', function(e, authUser) {
    $rootScope.currentUser = null;
  }); //$firebaseSimpleLogin:login

}); //StatusController