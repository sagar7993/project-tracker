myApp.controller("EducationController", function($scope, $rootScope, 
    $firebase, $firebaseSimpleLogin, FIREBASE_URL) {
	
	var ref = new Firebase(FIREBASE_URL);
	var simpleLogin = $firebaseSimpleLogin(ref);

	simpleLogin.$getCurrentUser().then(function(authUser) {
    if (authUser !== null) {

			$scope.education = [];
			var ref2 = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/education');
			ref2.on("value", function(snapshot) {
			  $scope.testing = [];
			  $scope.education = snapshot.val();
			  for(key in $scope.education)
			  	{
			  		$scope.testing.push({ 'degree':$scope.education[key].degree, 'year': $scope.education[key].year, 'score':$scope.education[key].score, 'key': key });
			  	}
			}, function (errorObject) {
			  console.log("The read failed: " + errorObject.code);
			});

			var ref3 = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/education');
			$scope.addRow = function()
			{
				if(document.getElementById("degree").value=="" || document.getElementById("year").value=="" || document.getElementById("score").value=="" || isNaN(document.getElementById("year").value) || !isNaN(document.getElementById("degree").value))
				{
					alert("Please enter correct value");
				}
				else{
					
					var count = 0;
					ref3.once("value", function(snap) {
					  if(snap.val() != null)
					  {
					    for(key in snap.val())
					    {
					      if(snap.val()[key].degree.toUpperCase().trim() == $scope.degree.toUpperCase().trim())
					      {
					        count++;
					        break;
					      }
					    }
					  }
					});
					if(count==0)
					{
					  var eduRef = $firebase(ref3);
					  eduRef.$push({
					    degree: $scope.degree.degree.toUpperCase().trim(),
					    year: $scope.year,
					    score: $scope.score.degree.toUpperCase().trim()
					  });
					  $scope.degree='';
					  $scope.year='';
					  $scope.score='';
					}
					else
					{
					  $scope.degree='';
					  $scope.year='';
					  $scope.score='';
					  alert("This degree already exists. No duplicates allowed.");
					}
				}
			};
			$scope.removeRow = function(name)
			{
				if(window.confirm("Are you sure you want to delete " + name + " from your education?"))
				{
					var index = 0;
					var deleted = 0;
					for(var i=0;i<$scope.testing.length;i++)
						{
							var temp = $scope.testing[i];
							if(temp.degree == name)
							{
								deleted = temp.key;
								break;
							}
							else
							{
								index++;
							}
						}
					$scope.testing.splice(index,1);
					var delRef = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/education/' + deleted);
					var completed = function(error) {
					  if (error) {
					    alert('Delete failed');
					  } else {
		    			  alert("Deleted Successfully");
					    }
					};
					delRef.remove(completed);
				}
			};

		} //authUser != null
	}); //getCurrentUser
});