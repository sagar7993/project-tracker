myApp.controller("SkillsController", function($scope, $rootScope, 
    $firebase, $firebaseSimpleLogin, FIREBASE_URL) {
	
	var ref = new Firebase(FIREBASE_URL);
	var simpleLogin = $firebaseSimpleLogin(ref);

	simpleLogin.$getCurrentUser().then(function(authUser) {
    if (authUser !== null) {

			$scope.skills = [];
			var ref2 = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/skills');
			ref2.on("value", function(snapshot) {
			  $scope.testing = [];
			  $scope.skills = snapshot.val();
			  for(key in $scope.skills)
			  	{
			  		$scope.testing.push({ 'skill':$scope.skills[key].skill, 'proficiency': $scope.skills[key].proficiency, 'key': key });
			  	}
			}, function (errorObject) {
			  console.log("The read failed: " + errorObject.code);
			});

			var ref3 = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/skills');

			$scope.addRow = function(){
				if(document.getElementById("skill").value=="" || document.getElementById("proficiency").value=="" || !isNaN(document.getElementById("skill").value) || !isNaN(document.getElementById("proficiency").value))
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
					      if(snap.val()[key].skill.toUpperCase().trim() == $scope.skill.toUpperCase().trim())
					      {
					        count++;
					        break;
					      }
					    }
					  }
					});
					if(count==0)
					{
					  var skillRef = $firebase(ref3);
  					  skillRef.$push({
  					    skill: $scope.skill.toUpperCase().trim(),
  					    proficiency: $scope.proficiency.toUpperCase().trim()
  					  });
	  				  $scope.skill='';
	  				  $scope.proficiency='';
					}
					else
					{
					  $scope.skill='';
	  				  $scope.proficiency='';
					  alert("This skill already exists. No duplicates allowed.");
					}
				}
			};

			$scope.removeRow = function(name, pro){
				if(window.confirm("Are you sure you want to delete " + name + " from your skills?"))
				{
					var index = 0;
					var deleted = 0;
					for(var i=0;i<$scope.testing.length;i++)
					{
						var temp = $scope.testing[i];
						if(temp.skill == name && temp.proficiency == pro)
						{
							deleted = temp.key;
							break;
						}
						else
						{
							index++;
						}
					}
					$scope.testing.splice( index, 1 );
					var delRef = new Firebase(FIREBASE_URL + '/users/' + authUser.username + '/skills/' + deleted);
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
