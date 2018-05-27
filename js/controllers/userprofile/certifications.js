myApp.controller("CertificationsController", function($scope, $rootScope, 
    $firebase, $firebaseSimpleLogin, FIREBASE_URL) {
	
	var ref = new Firebase(FIREBASE_URL);
	var simpleLogin = $firebaseSimpleLogin(ref);

	simpleLogin.$getCurrentUser().then(function(authUser) {
    if (authUser !== null) {

			$scope.certifications = [];
			var ref2 = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/certification');
			ref2.on("value", function(snapshot) {
			  $scope.testing = [];
			  $scope.certifications = snapshot.val();
			  for(key in $scope.certifications)
			  	{
			  		$scope.testing.push({ 'certification':$scope.certifications[key].certification, 'year': $scope.certifications[key].year, 'score':$scope.certifications[key].score, 'key': key });
			  	}
			}, function (errorObject) {
			  console.log("The read failed: " + errorObject.code);
			});

			var ref3 = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/certification');
			$scope.addRow = function(){
				if(document.getElementById("certi").value=="" || document.getElementById("year").value=="" || document.getElementById("score").value=="" || isNaN(document.getElementById("year").value) || !isNaN(document.getElementById("certi").value))
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
					      if(snap.val()[key].certification.toUpperCase().trim() == $scope.certi.toUpperCase().trim())
					      {
					        count++;
					        break;
					      }
					    }
					  }
					});
					if(count==0)
					{
					  var certiRef = $firebase(ref3);
					  certiRef.$push({
					    certification: $scope.certi.trim().toUpperCase(),
					    year: $scope.year,
					    score: $scope.score.trim().toUpperCase()
					  });
					  $scope.certi='';
					  $scope.year='';
					  $scope.score='';
					}
					else
					{
					  $scope.certi='';
					  $scope.year='';
					  $scope.score='';
					  alert("This certification already exists. No duplicates allowed.");
					}
				}
			};
			$scope.removeRow = function(name)
			{
				if(window.confirm("Are you sure you want to remove " + name + " from your certifications?"))
				{
					var index = 0;
					var deleted = 0;
					for(var i=0;i<$scope.testing.length;i++)
						{
							var temp = $scope.testing[i];
							if(temp.certification == name)
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
					var delRef = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/certification/' + deleted);
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