myApp.controller("ProfileController", function($scope, $rootScope, 
	$location, $firebase, $firebaseSimpleLogin, FIREBASE_URL)
{
	var ref = new Firebase(FIREBASE_URL);
	var simpleLogin = $firebaseSimpleLogin(ref);

	if($rootScope.currentUser == null || $rootScope.currentUser == "undefined" || $rootScope.currentUser == undefined)
	{
		simpleLogin.$getCurrentUser().then(function(authUser) {
		    if (authUser !== null) 
		    {
		    	$scope.whichUser = authUser.username;
		    	var ref2 = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/profileInfo');
		    	ref2.on("value", function(snap){
		    		$scope.profileData = snap.val();
		    	});
		    }
		});
	}
	else
	{
		$scope.whichUser = $rootScope.currentUser.username;
		var ref2 = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/profileInfo');
		ref2.on("value", function(snap){
			$scope.profileData = snap.val();
		});
	}

	$scope.edit = function(){
		if(window.confirm("Are you sure you want to edit your profile?"))
		{
			var onComplete = function(error) {
			  if (error) {
			    alert('Something went wrong. Please try again.');
			  } else {
			    alert('Updated Successfully.');
			  }
			};
			var count = 0;
			if(document.getElementById("firstname").value == "" || document.getElementById("lastname").value == "" || 
			document.getElementById("dob").value == "" || document.getElementById("phone").value == "")
			{
				count++;
			}
			if(count == 0)
			{
				var fname = document.getElementById("firstname").value;
				var lname = document.getElementById("lastname").value;
				fname = fname.charAt(0).toUpperCase() + fname.substring(1);
				lname = lname.charAt(0).toUpperCase() + lname.substring(1);
				var ref2 = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/profileInfo');
				ref2.update({
				    firstname: fname,
				    lastname: lname,
				    date: document.getElementById("dob").value,
				    phoneNumber: document.getElementById("phone").value//,
				    //email: $scope.email
				}, onComplete);
				$location.path('/');
			}
			else
			{
				alert("Please fill all the details.");
			}
		}
	};
});
