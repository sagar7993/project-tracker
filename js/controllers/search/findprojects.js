myApp.controller('FindProjectsController', function($scope, $rootScope, $firebase,
 $firebaseSimpleLogin, FIREBASE_URL) 
{
  var ref = new Firebase(FIREBASE_URL);
  var simpleLogin = $firebaseSimpleLogin(ref);
  simpleLogin.$getCurrentUser().then(function(authUser) {
    if (authUser !== null)
    {
      $scope.whichUser = authUser.username;
    }
  });

  $scope.showProjects = function(name, searchArray)
  {
    name = name.replace(/\+/g, "%20PLUS%20");
    name = name.replace(/\./g, "%20DOT%20");
    name = name.replace(/\#/g, "%20HASH%20");
    name = name.toUpperCase().trim();
    var skill = new Firebase(FIREBASE_URL + '/skills/' + name);
    var result;
    skill.once("value", function(snap){
      result = snap.val();
      if(result == null || result == "undefined" || result == '')
      {
        alert("No Results");
        $scope.result = '';
        $("#projectListing").html("");
      }
      else
      {
        $scope.result = result;
        $("#projectListing").html("");
        for(res in result)
        {
          var test = "<a href='#/" + $scope.whichUser + '/' + result[res].projectOwner + "/" + result[res].projectId + "/" + result[res].projectTitle + "/foundproject'>"
              +"<ul class='userlist cf'>"
                +"<li>"
                  +"<div class='checkin'>"
                    +"<div class='info'>"
                      +"<h6><b>Project Title : </b>" + result[res].projectTitle + "</h6>"
                      +"<h6><b>Project Summary : </b>" + result[res].projectSummary + "</h6>"
                      +"<h6><b>Project Status : </b>" + result[res].projectStatus + "</h6>"
                      +"<h6><b>Project Owner : </b>" + result[res].projectOwner + "</h6>"
                      +"<h6><b>Project Start Date : </b>" + result[res].projectStartDate + "</h6>"
                      +"<br/>"
                    +"</div>"
                  +"</div>"
                +"</li>"
              +"</ul>";
            +"</a>"
          $("#projectListing").append(test);
        }
      }
    });
  };
  $scope.searches = [];
  $scope.addRow = function(){ 
    if($scope.skill == "" || $scope.skill == null || $scope.skill == "undefined")
    {
      alert("Please enter something.");
    }
    else
    {
      var count = 0;
      //Check for duplicates
      for(search in $scope.searches)
      {
        if($scope.searches[search].skill.trim().toUpperCase() == $scope.skill.trim().toUpperCase())
        {
          count++;
          alert("This search parameter already exists. No duplicates allowed.");
          $scope.skill = '';
          break;
        }
      }
      if(count == 0)
      {
        $scope.searches.push({ 'skill':$scope.skill });
        $scope.showProjects($scope.skill, $scope.searches);
        $scope.skill='';
      }
    }
  };
  $scope.removeRow = function(skill){        
    var index = -1;   
    var comArr = eval( $scope.searches );
    for( var i = 0; i < comArr.length; i++ ) {
      if( comArr[i].skill === skill ) {
        index = i;
        break;
      }
    }
    if( index === -1 ) {
      alert( "Something gone wrong" );
    }
    $scope.searches.splice( index, 1 );
    if($scope.searches == '' || $scope.searches == null || $scope.searches == 'undefined')
      $("#projectListing").html("");
  };
});
// FindProjectsController