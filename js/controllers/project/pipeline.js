myApp.controller('PipelineController', function(
  $scope, $rootScope, $firebase, $routeParams,
  $firebaseSimpleLogin, $location, FIREBASE_URL) {

	$scope.whichProject = $routeParams.pid;
	$scope.whichUser = $routeParams.userid;

  $scope.isOwner = "false";
  if($rootScope.currentUser == null || $rootScope.currentUser == "undefined" || $rootScope.currentUser == undefined)
  {
    var ref = new Firebase(FIREBASE_URL);
    var simpleLogin = $firebaseSimpleLogin(ref);

    simpleLogin.$getCurrentUser().then(function(authUser) {

      if (authUser !== null)
      {
          $scope.whichUser = authUser.username;
          if(authUser.username == $routeParams.userid)
          {
            $scope.isOwner = "true";
          }
          else
          {
            $scope.isOwner = "false";
          }
      }
    });
  }
  else
  {
    $scope.whichUser = $rootScope.currentUser.username;
    if($rootScope.currentUser.username == $routeParams.userid)
    {
      $scope.isOwner = "true";
    }
    else
    {
      $scope.isOwner = "false";
    }
  }

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

  $scope.moveToDo = function(key){
		var ref1 = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/owned/' + $scope.whichProject + '/requirements/' + key);
	  ref1.update({requirementStatus: 'To-Do'});
    var ref2 = new Firebase(FIREBASE_URL + '/projects/' + $scope.whichProject + '/requirements/' + key);
    ref2.update({requirementStatus: 'To-Do'});
  };

  $scope.moveDoing = function(key){
  	var ref1 = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/owned/' + $scope.whichProject + '/requirements/' + key);
  	ref1.update({requirementStatus: 'Doing'});
    var ref2 = new Firebase(FIREBASE_URL + '/projects/' + $scope.whichProject + '/requirements/' + key);
    ref2.update({requirementStatus: 'Doing'});
  };

  $scope.moveDone = function(key){
  	var ref1 = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/owned/' + $scope.whichProject + '/requirements/' + key);
  	ref1.update({requirementStatus: 'Done'});
    var ref2 = new Firebase(FIREBASE_URL + '/projects/' + $scope.whichProject + '/requirements/' + key);
    ref2.update({requirementStatus: 'Done'});
    var ref = new Firebase(FIREBASE_URL + '/users/' + key + '/');
  };
});