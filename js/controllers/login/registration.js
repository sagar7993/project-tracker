myApp.controller('RegistrationController', function($scope, $firebase,
 $firebaseSimpleLogin, $location, Authentication, $rootScope, FIREBASE_URL) {
  
  $scope.login = function() {

    temp = $scope.user.email;
    temp = temp.replace(/\./g, ",");
    $scope.user.username = temp;

    Authentication.login($scope.user)
      .then(function(user) {
      $location.path('/home');
    }, function(error) {
      $scope.message = error.toString();
    });
  } //login

  $scope.register = function() {

    temp = $scope.user.email;
    temp = temp.replace(/\./g, ",");
    $scope.user.username = temp;

    Authentication.register($scope.user)
      .then(function(user) {
      Authentication.login($scope.user);
      $location.path('/home');
    }, function(error) {
      $scope.message = error.toString();
    });
  } //register

}); //RegistrationController