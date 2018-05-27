myApp.controller('SearchResultController', function(
  $scope, $rootScope, $firebase, $routeParams,
  $firebaseSimpleLogin, $location, FIREBASE_URL) {

	$scope.whichProject = $routeParams.pid;
	$scope.whichUser = $routeParams.userid;
  $scope.projectOwner = $routeParams.ownerid;

  $scope.isOwner = "false";

  // var ref = new Firebase(FIREBASE_URL);
  // var simpleLogin = $firebaseSimpleLogin(ref);

  // simpleLogin.$getCurrentUser().then(function(authUser) {

    // if (authUser !== null)
    // {

      //check if collaboration request has already been sent
      $scope.alreadySent = "false";
      var refNotif = new Firebase(FIREBASE_URL + '/users/' + $scope.projectOwner + '/notifications/sent/');
      refNotif.on("value", function(snap){
        for(key in snap.val()){
          if(snap.val()[key].to === $routeParams.userid  && snap.val()[key].notificationType == "Collaboration Request")
          {
            $scope.alreadySent = "true";
          }
          else
          {
            $scope.alreadySent = "false";
          }
        }
      });

      $scope.whichUser = $scope.projectOwner;
      if($scope.projectOwner == $routeParams.userid)
      {
        $scope.isOwner = "true";
      }
      else
      {
        $scope.isOwner = "false";
      }

      var profileRef = new Firebase(FIREBASE_URL + '/users/' 
          + $scope.projectOwner + '/profileInfo/');
      
      var profileSnapshot;
      profileRef.on("value", function(snapshot) 
      {
        profileSnapshot = snapshot.val();

        if(profileSnapshot==null||profileSnapshot==undefined||profileSnapshot=='undefined'){
          alert("something wrong");
        }
        else{
          $scope.profile = profileSnapshot;
        }

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

      var fromRefNotification = new Firebase(FIREBASE_URL + '/users/' 
          + $scope.projectOwner + '/notifications/sent/');
      var fromNotificationInfo = $firebase(fromRefNotification); //to push notification
      var toRefNotification = new Firebase(FIREBASE_URL + '/users/' 
          + $routeParams.userid + '/notifications/received/');
      var toNotificationInfo = $firebase(toRefNotification); //to push data

      $scope.collaborate = function(){
              
        $scope.message = "I would like to collaborate with you";
        var notificationData = {
          from : $scope.profile.firstname + " " + $scope.profile.lastname,
          to : $routeParams.userid,
          username: $scope.projectOwner,
          message: $scope.message,
          projectName: $routeParams.pname,
          projectId: $routeParams.pid,
          notificationType: 'Collaboration Request'
        };
        fromNotificationInfo.$push(notificationData).then(function(){
          fromRefNotification.once("value", function(snapNotif){
            var newKey = Object.keys(snapNotif.val())[Object.keys(snapNotif.val()).length-1];
            toNotificationInfo.$set(newKey, notificationData);
            alert("Collaboration request has been sent");
          });
        });
        $scope.alreadySent = "true";
      };
  //   }
  // });

  var ref = new Firebase(FIREBASE_URL + '/users/' + $routeParams.userid + '/projects/owned/' + $routeParams.pid + '/requirements/');
	var requirementsList = $firebase(ref).$asObject();

	requirementsList.$loaded().then(function(data) {
    $scope.requirements = requirementsList;
    if($scope.requirements.hasOwnProperty("$value") && $scope.requirements.$value == null)
    {
      $scope.howManyRequirements = 0;
    }
    else
    {
      $scope.howManyRequirements = Object.keys(requirementsList).length-3;
    }
  }); // requirements Object Loaded

  requirementsList.$watch(function(event) {
    $scope.requirements = requirementsList;
    if($scope.requirements.hasOwnProperty("$value") && $scope.requirements.$value == null)
    {
      $scope.howManyRequirements = 0;
    }
    else
    {
      $scope.howManyRequirements = Object.keys(requirementsList).length-3;
    }
  }); // requirements Object Watched

  var ProjectRef = new Firebase(FIREBASE_URL + '/projects/' + $routeParams.pid);
  var proj = $firebase(ProjectRef).$asObject();
  proj.$loaded().then(function(data) 
  {
      $scope.projectName = proj;
  }); // projects Object Loaded
});