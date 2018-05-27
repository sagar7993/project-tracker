myApp.factory('Authentication', function($firebase, $firebaseSimpleLogin, FIREBASE_URL, $rootScope, $location) {

  var ref = new Firebase(FIREBASE_URL);
  var simpleLogin = $firebaseSimpleLogin(ref);

  var myObject = {

    login : function(user) {

      return simpleLogin.$login('password', {
        email: user.email,
        password: user.password
      });
    }, //login

    register : function(user) {
      return simpleLogin.$createUser(user.email, user.password)
      .then(function(regUser){
        var ref = new Firebase(FIREBASE_URL + 'users');
        var firebaseUsers = $firebase(ref);
        user.firstname = user.firstname.charAt(0).toUpperCase() + user.firstname.substring(1);
        user.lastname = user.lastname.charAt(0).toUpperCase() + user.lastname.substring(1);
        var userInfo = {
          profileInfo:
          {
            date: Firebase.ServerValue.TIMESTAMP,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            username: user.username,
            credit: "500"
          }
        };


        firebaseUsers.$set(user.username, userInfo);
      }); //add user
    }, //register

    logout : function() {
      return simpleLogin.$logout();
    }, //logout

    signedIn: function() {
      return simpleLogin.user != null;
    }

  } //myObject

  //add the function to the rootScope

  $rootScope.signedIn = function() {
    return myObject.signedIn();
  }

  return myObject;
});