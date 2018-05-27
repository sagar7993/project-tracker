myApp.controller('ProjectsController', function($scope, $rootScope, $firebase, $firebaseSimpleLogin, FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);
  var simpleLogin = $firebaseSimpleLogin(ref);

  simpleLogin.$getCurrentUser().then(function(authUser) 
  {
    if (authUser !== null) {
      var ref = new Firebase(FIREBASE_URL + '/users/' 
          + authUser.username + '/projects/owned/');
      var projectsInfo = $firebase(ref);
      var refProjects = new Firebase(FIREBASE_URL + '/projects/');
      var refProjectsInfo = $firebase(refProjects);
      var projectsObj = $firebase(ref).$asObject();
      var projectsArray = $firebase(ref).$asArray();

      $scope.whichUser = authUser.username;

      var ref2 = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/notifications/received/');
      var notif = $firebase(ref2).$asArray();
      notif.$loaded().then(function(data) {
        $rootScope.howManyNotifications = notif.length;
      }); // Notifications Array Loaded
      notif.$watch(function(event) {
        $rootScope.howManyNotifications = notif.length;
      });//? whats the use of this????

      projectsObj.$loaded().then(function(data) {
        $scope.projects = projectsObj;
      }); // projects Object Loaded

      projectsObj.$watch(function(event) {
        $scope.projects = projectsObj;
      }); // projects Object Loaded

      projectsArray.$loaded().then(function(data) {
        $rootScope.howManyProjects = projectsArray.length;
      }); // projects Array Loaded

      projectsArray.$watch(function(event) {
        $rootScope.howManyProjects = projectsArray.length;
      });//? whats the use of this????

      var collabProj = new Firebase(FIREBASE_URL + '/users/' 
          + authUser.username + '/projects/collaborated/');
      var collabRef = $firebase(collabProj).$asObject();
      var collabArray = $firebase(collabProj).$asArray();
      collabRef.$loaded().then(function(data){
        $scope.collaboratedProjects = collabRef
      });
      collabRef.$watch(function(event){
        $scope.collaboratedProjects = collabRef
      });
      collabArray.$loaded().then(function(data){
        $scope.howManyCollaboratedProjects = collabArray.length;
      });
      collabArray.$watch(function(event){
        $scope.howManyCollaboratedProjects = collabArray.length;
      });
      
      $scope.moveOpen = function(key) {
        var ref1 = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/projects/owned/' + key);
        ref1.update({projectStatus: 'Open'});
        var ref2 = new Firebase(FIREBASE_URL + '/projects/' + key);
        ref2.update({projectStatus: 'Open'});
      };
      $scope.moveClosed = function(key) {
        var ref1 = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/projects/owned/' + key);
        ref1.update({projectStatus: 'Closed'});
        var ref2 = new Firebase(FIREBASE_URL + '/projects/' + key);
        ref2.update({projectStatus: 'Open'});
      };

      $scope.deleteCollaborator = function(user, proj)
      {
        console.log("owner = " + user + " collab = " + $scope.whichUser + " project = " + proj);
        if(window.confirm("Are you sure you want to cancel your collaboration?"))
        {
          var ref = new Firebase(FIREBASE_URL + '/users/' + user + '/projects/owned/'
            + proj + '/collaborators/');
          var refInfo = $firebase(ref);
          refInfo.$remove($scope.whichUser);

          var ref2 = new Firebase(FIREBASE_URL + '/projects/' + proj + '/collaborators/');
          var refInfo2 = $firebase(ref2);
          refInfo2.$remove($scope.whichUser);

          var ref3 = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/collaborated/');
          ref3.on("value", function(snapshot)
          {
            refInfo3 = snapshot.val();
            for(key in refInfo3)
            {
              if(refInfo3[key] != null && key == proj)
              {
                ref3 = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/collaborated/' + key);
                ref3.remove();
                break;
              }
            }
          });

          var ref4 = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/notifications/sent/');
          ref4.on("value", function(snapshot) {
            refInfo4 = snapshot.val();
            for(key in refInfo4)
            {
              if(refInfo4[key] != null && refInfo4[key].hasOwnProperty("to") 
              && refInfo4[key].to == user && refInfo4[key].username == $scope.whichUser 
              && refInfo4[key].projectId == proj)
              {
                ref4 = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/notifications/sent/' + key);
                ref4.remove();
                break;
              }
            }
          });
        }
      };

      $scope.addProject=function() {

        if (document.getElementById('test1').checked) {
          var open = document.getElementById('test1').value;
        }
        if (document.getElementById('test2').checked) {
          var closed = document.getElementById('test2').value;
        }
        if(open == "on")
          $scope.projectstatus = "Open";
        else if(closed == "on")
          $scope.projectstatus = "Closed";
        else
          alert("Please specify whether the project is open or closed");

        if($scope.projectstatus == "Open" || $scope.projectstatus == "Closed")
        {
          //$scope.projectstartdate = $scope.projectstartdate.toString();
          $scope.projectstartdate = document.getElementById("projectstartdate").value;
          $scope.projectname = $scope.projectname.charAt(0).toUpperCase() + $scope.projectname.substring(1);
          $scope.projectsummary = $scope.projectsummary.charAt(0).toUpperCase() + $scope.projectsummary.substring(1);
          var projectData = 
          {
            projectTitle: $scope.projectname,
            projectSummary: $scope.projectsummary,
            projectStatus: $scope.projectstatus,
            projectOwner: authUser.username,
            projectStartDate: $scope.projectstartdate
          };
          projectsInfo.$push(projectData).then(function() {
            ref.once("value", function(snap) {
              var newKey = Object.keys(snap.val())[Object.keys(snap.val()).length-1];
              refProjectsInfo.$set(newKey, projectData);
            });
          });
        }
        //addproject to users then to projects

        $scope.projectname = '';
        $scope.projectsummary = '';
        $scope.projectstatus = '';
        $scope.projectstartdate = '';
              
      }; //addproject

      $scope.deleteProject=function(key) {
        projectsInfo.$remove(key);
        refProjectsInfo.$remove(key)
      }; //deleteproject

    } // user exists

  }); //get current user

}); //ProjectsController