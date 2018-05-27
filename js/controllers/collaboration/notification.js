myApp.controller('NotificationController', function($scope, $rootScope, $firebase, $firebaseSimpleLogin, FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);
  var simpleLogin = $firebaseSimpleLogin(ref);

    simpleLogin.$getCurrentUser().then(function(authUser) 
    {

      if (authUser !== null) 
      {
        var ref = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/notifications/received/');
        var notifObj = $firebase(ref).$asObject();

        notifObj.$loaded().then(function(data) {
          $rootScope.notification = notifObj;
        }); // notif Object Loaded

        notifObj.$watch(function(event) {
          $rootScope.notification = notifObj;
        }); // notif Object Loaded

        var ref2 = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/notifications/received/');
        var notif = $firebase(ref2).$asArray();
        notif.$loaded().then(function(data) {
          $rootScope.howManyNotifications = notif.length;
        }); // Notifications Array Loaded
        notif.$watch(function(event) {
          $rootScope.howManyNotifications = notif.length;
        });//? whats the use of this????

        $scope.addCollaborator = function(notification, key)
        {
          var notifKey = Object.keys(key)[Object.keys(key).length-1];
          var collaboratorData = {
            collaboratorName : notification.from,
            collaboratorId : notification.username,
            projectName : notification.projectName,
            projectId : notification.projectId,
            projectOwner : notification.to
          };
          console.log(collaboratorData);
          var userCollabRef = new Firebase(FIREBASE_URL + '/users/' + notification.to + '/projects/owned/' 
            + notification.projectId + '/collaborators/');
          var collab = $firebase(userCollabRef);
          collab.$set(notification.username , collaboratorData);
          var projCollabRef = new Firebase(FIREBASE_URL + '/projects/' + notification.projectId 
            + '/collaborators/');
          var proj = $firebase(projCollabRef);
          proj.$set(notification.username , collaboratorData);
          
          var collaboratorRef = new Firebase(FIREBASE_URL + '/users/' + notification.username
           + '/projects/collaborated/');
          var collabRefSet = $firebase(collaboratorRef);

          var setProject = new Firebase(FIREBASE_URL + '/users/' + notification.to + '/projects/owned/' 
            + notification.projectId);

          setProject.on("value", function(snap){
            var temp = snap.val();
            var projectInfo = {
              projectId:notification.projectId,
              projectTitle: temp.projectTitle,
              projectOwner: temp.projectOwner,
              projectStatus: temp.projectStatus,
              projectSummary: temp.projectSummary,
              projectStartDate: temp.projectStartDate
            };
            collabRefSet.$set(notification.projectId, projectInfo);
          });
          var status = "Accept";
          $scope.deleteNotification(notifKey, notification.to);
          $scope.generateNotification(notification.to, notification, status);
          alert(notification.from + " has been added as a collaborator for " + notification.projectName);
        };
        $scope.rejectCollaborator = function(notification, key)
        {
          var status = "Reject";
          var newKey = Object.keys(key)[Object.keys(key).length-1];
          $scope.deleteNotification(newKey, notification.to);
          var notifKey = new Firebase(FIREBASE_URL + '/users/' + notification.username + '/notifications/sent/' + newKey);
          notifKey.remove();
          $scope.generateNotification(notification.to, notification, status);            
        };
        $scope.deleteNotification = function(key, owner){
          var notifKey = new Firebase(FIREBASE_URL + '/users/' + owner + '/notifications/received/' + key);
          notifKey.remove();  
        };
        $scope.generateNotification = function(owner, notification, status){

          var n = new Firebase(FIREBASE_URL + '/users/' + notification.username + '/notifications/received/');
          var nRef = $firebase(n);
          
          var notificationData = {
          from : notification.to,
          to : notification.username,
          username: notification.username,
          message: status,
          projectName: notification.projectName,
          projectId: notification.projectId,
          notificationType: 'Collaboration Response'
          };
          nRef.$push(notificationData);

          if(status == "Accept"){
            
          }

        };
      }
    }
  );
});

myApp.controller("CollaboratorProfileController", function($scope, $routeParams,
 $rootScope, $firebase, $firebaseSimpleLogin, FIREBASE_URL){
  $scope.whichUser = $routeParams.userid;
  var ref = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser);
  // ref.on("value", function(snapshot){
  //   $scope.profileData = snapshot.val();
  //   alert(snapshot.val().profileInfo.firstname);
  // });
  var info = $firebase(ref).$asObject();
  info.$loaded().then(function(data) {
    $scope.profileData = info;
  }); // Users Array Loaded
  info.$watch(function(event) {
    $scope.profileData = info;
  });

});