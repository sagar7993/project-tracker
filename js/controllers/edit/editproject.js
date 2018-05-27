myApp.controller("EditProjectController", function(
	$scope, $rootScope, $firebase, $routeParams,
  $firebaseSimpleLogin, $location, FIREBASE_URL) {

  	$scope.whichProject = $routeParams.pid;
  	$scope.whichUser = $routeParams.userid;

  	if($rootScope.currentUser == null || $rootScope.currentUser == "undefined" || $rootScope.currentUser == undefined)
  	{
      var ref = new Firebase(FIREBASE_URL);
      var simpleLogin = $firebaseSimpleLogin(ref);

      simpleLogin.$getCurrentUser().then(function(authUser) {

        if (authUser !== null)
        {
            $scope.whichUser = authUser.username;
            if(authUser.username == $routeParams.uId)
            {
              //console.log("in if if");
              $scope.isOwner = "true";
              //console.log($scope.isOwner);
            }
            else
            {
              //console.log("in if else");
              $scope.isOwner = "false";
              //console.log($scope.isOwner);
            }
           
        }
    });
  }
  else
  {
    $scope.whichUser = $rootScope.currentUser.username;
    if($rootScope.currentUser.username == $routeParams.userid)
    {
      //console.log("in else if");
      $scope.isOwner = "true";
      //console.log($scope.isOwner);
    }
    else
    {
      //console.log("in else else");
      $scope.isOwner = "false";
      //console.log($scope.isOwner);
    }
    
  }

  var ref = new Firebase(FIREBASE_URL + '/users/' + $routeParams.userid + '/projects/owned/' + $routeParams.pid);
  var projectsInfo = $firebase(ref).$asObject();
  var refProjects = new Firebase(FIREBASE_URL + '/projects/' + $routeParams.pid);
  var refProjectsInfo = $firebase(refProjects).$asObject();

  projectsInfo.$loaded().then(function(data) {
    $scope.projectDetails = projectsInfo;
    if($scope.projectDetails.projectStatus == "Open")
    {
      document.getElementById("test1").checked = true;
    }
    else
    {
      document.getElementById("test2").checked = true;
    }
  }); // Notifications Array Loaded

  $scope.editProject=function() 
  {
  if(window.confirm("Are you sure you want to edit this project?"))
    {
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

      var count = 0;
      if(document.getElementById("projectname").value == "" ||
        document.getElementById("projectsummary").value == "" ||
        document.getElementById("projectstartdate").value == "")
        {
          count ++; 
        }

      if(($scope.projectstatus == "Open" || $scope.projectstatus == "Closed") && count ==0)
      {
        var pname = document.getElementById("projectname").value;
        pname = pname.charAt(0).toUpperCase() + pname.substring(1);
        var sname = document.getElementById("projectsummary").value;
        sname = sname.charAt(0).toUpperCase() + sname.substring(1);
        ref.update({
          projectTitle: pname,
          projectSummary: sname,
          projectStatus: $scope.projectstatus,
          projectOwner: $routeParams.userid,
          projectStartDate: document.getElementById("projectstartdate").value
        });

        refProjects.update({
          projectTitle: pname,
          projectSummary: sname,
          projectStatus: $scope.projectstatus,
          projectOwner: $routeParams.userid,
          projectStartDate: document.getElementById("projectstartdate").value
        });
        alert("Project Details Updated.");
        $location.path('/');
      }
      else
        alert("Please fill all the details");
    } //editproject
  }
});

myApp.controller("EditRequirementController", function(
  $scope, $rootScope, $firebase, $routeParams,
  $firebaseSimpleLogin, $location, FIREBASE_URL) {

  $scope.whichProject = $routeParams.pid;
  $scope.whichUser = $routeParams.userid;
  $scope.whichRequirement = $routeParams.mid;

  var ref1 = new Firebase(FIREBASE_URL + '/users/' + $routeParams.userid + '/projects/owned/'
    + $routeParams.pid + '/requirements/' + $routeParams.mid);
  var ref2 = new Firebase(FIREBASE_URL + '/projects/' + $routeParams.pid + '/requirements/' + $routeParams.mid);

  var reqInfo = $firebase(ref1).$asObject();
  reqInfo.$loaded().then(function(data) {
    $scope.requirementDetails = reqInfo;
    if($scope.requirementDetails.requirementStatus == "To-Do")
    {
      document.getElementById("requirementstatus1/"+$routeParams.mid).checked = true;
    }
    else if($scope.requirementDetails.requirementStatus == "Doing")
    {
      document.getElementById("requirementstatus2/"+$routeParams.mid).checked = true;
    }
    else if($scope.requirementDetails.requirementStatus == "Done")
    {
      document.getElementById("requirementstatus3/"+$routeParams.mid).checked = true;
    }
    if($scope.requirementDetails.kpa == "Yes")
    {
      document.getElementById("kpa1/"+$routeParams.mid).checked = true;
    }
    else if($scope.requirementDetails.kpa == "No")
    {
      document.getElementById("kpa2/"+$routeParams.mid).checked = true;
    }
  }); // Notifications Array Loaded

  $scope.editRequirement = function() {
    if(window.confirm("Are you sure you want to edit this requirement?"))
    {
      if (document.getElementById('kpa1/'+$routeParams.mid).checked) {
        var open = document.getElementById('kpa1/'+$routeParams.mid).value;
      }
      if (document.getElementById('kpa2/'+$routeParams.mid).checked) {
        var closed = document.getElementById('kpa2/'+$routeParams.mid).value;
      }
      if(open == "on")
        $scope.kpa = "Yes";
      else if(closed == "on")
        $scope.kpa = "No";
      else
        {
          alert("Please specify whether the requirement is a key process area or not.");
          $scope.kpa='';
          return;
        }

      if (document.getElementById('requirementstatus1/'+$routeParams.mid).checked) {
        var todo = document.getElementById('requirementstatus1/'+$routeParams.mid).value;
      }
      if (document.getElementById('requirementstatus2/'+$routeParams.mid).checked) {
        var doing = document.getElementById('requirementstatus2/'+$routeParams.mid).value;
      }
      if (document.getElementById('requirementstatus3/'+$routeParams.mid).checked) {
        var done = document.getElementById('requirementstatus3/'+$routeParams.mid).value;
      }
      if(todo == "on")
        $scope.requirementStatus = "To-Do";
      else if(doing == "on")
        $scope.requirementStatus = "Doing";
      else if(done == "on")
        $scope.requirementStatus = "Done";
      else
      {
        alert("Please specify the status of the requirement.");
        $scope.requirementStatus = '';
      }

      var kpaSelected="false";
      var reqStatusSelected="false"

      if($scope.kpa == "Yes" || $scope.kpa == "No")
        kpaSelected = "true";

      if($scope.requirementStatus == "To-Do" || $scope.requirementStatus == "Doing" || $scope.requirementStatus == "Done")
        reqStatusSelected = "true";

      console.log("kpaSelected = " + kpaSelected + " reqStatusSelected = " + reqStatusSelected);

      if(kpaSelected == "true" && reqStatusSelected == "true")
      {

        var rdesc = document.getElementById('requirementDesc/'+$routeParams.mid).value;
        rdesc = rdesc.charAt(0).toUpperCase() + rdesc.substring(1);
        var acomm = document.getElementById('additionalComments/'+$routeParams.mid).value;
        acomm = acomm.charAt(0).toUpperCase() + acomm.substring(1);

        var myData = {
          requirementDescription: rdesc,
          kpa: $scope.kpa,
          requirementStatus: $scope.requirementStatus,
          requirementStartDate: document.getElementById('requirementStartDate/'+$routeParams.mid).value,
          expectedDuration: document.getElementById('expectedDuration/'+$routeParams.mid).value,
          additionalComments: acomm
        };

        ref1.update({
          additionalComments: myData.additionalComments,
          expectedDuration: myData.expectedDuration,
          kpa: myData.kpa,
          requirementDescription: myData.requirementDescription,
          requirementStartDate: myData.requirementStartDate,
          requirementStatus: myData.requirementStatus
        });

        ref2.update({
          additionalComments: myData.additionalComments,
          expectedDuration: myData.expectedDuration,
          kpa: myData.kpa,
          requirementDescription: myData.requirementDescription,
          requirementStartDate: myData.requirementStartDate,
          requirementStatus: myData.requirementStatus
        });

        alert("Your requirement has been updated successfully.");
        $location.path('/requirements/' + $scope.whichUser + '/' +
          $scope.whichProject + '/requirementsList');
      }
    }
  };
});