myApp.controller('RequirementsController', function(
  $scope, $rootScope, $firebase, $routeParams,
  $firebaseSimpleLogin, $location, FIREBASE_URL) {

  $scope.whichProject = $routeParams.mId;
  $scope.whichUser = $routeParams.uId;
  $scope.order="firstname"; 
  $scope.direction="";
  $scope.isOwner = "false";
  
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
            $scope.skills = [];
            var refSkill = new Firebase(FIREBASE_URL + '/users/' + $routeParams.uId + '/projects/owned/' + $scope.whichProject + '/skills');
            refSkill.on("value", function(snapshot) {
              $scope.testing = [];
              $scope.skills = snapshot.val();
              for(key in $scope.skills)
                {
                  $scope.testing.push({ 'skill':$scope.skills[key].skill, 'key': key });
                }
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            });
        }
    });
  }
  else
  {
    $scope.whichUser = $rootScope.currentUser.username;
    if($rootScope.currentUser.username == $routeParams.uId)
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
    $scope.skills = [];
    var refSkill = new Firebase(FIREBASE_URL + '/users/' + $routeParams.uId + '/projects/owned/' + $scope.whichProject + '/skills');
    refSkill.on("value", function(snapshot) {
      $scope.testing = [];
      $scope.skills = snapshot.val();
      for(key in $scope.skills)
        {
          $scope.testing.push({ 'skill':$scope.skills[key].skill, 'key': key });
        }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  var ref = new Firebase(FIREBASE_URL + '/users/' + $routeParams.uId + '/projects/owned/' + $scope.whichProject + '/requirements/');
  var checkinsList = $firebase(ref).$asArray();
  $scope.checkins = checkinsList;

  var refRequirements = new Firebase(FIREBASE_URL + '/projects/' + $scope.whichProject + '/requirements/');
  var refRequirementInfo = $firebase(refRequirements);

  var skillsRef = new Firebase(FIREBASE_URL + '/users/' + $routeParams.uId + '/projects/owned/' + $scope.whichProject + '/skills/');
  var skillsList = $firebase(skillsRef);

  var refSkills = new Firebase(FIREBASE_URL + '/projects/' + $scope.whichProject + '/skills/');
  var refSkillInfo = $firebase(refSkills);

  $scope.addToSkillsArray = function(skillName)
  {
    skillName = skillName.toUpperCase().trim()
    skillName = skillName.replace(/\./g, " DOT ");
    skillName = skillName.replace(/\#/g, " HASH ");
    skillName = skillName.replace(/\+/g, " PLUS ");
    var projectRef = new Firebase(FIREBASE_URL + '/projects/' + $scope.whichProject + '/');
    var skillArray = new Firebase(FIREBASE_URL + '/skills/' + skillName);
    var skillArrayRef = $firebase(skillArray);
    projectRef.once("value", function(snapshot){
        var projInfo = snapshot.val();
        var projectDetails = {
          projectOwner: projInfo.projectOwner,
          projectStatus: projInfo.projectStatus,
          projectSummary: projInfo.projectSummary,
          projectTitle: projInfo.projectTitle,
          projectStartDate: projInfo.projectStartDate,
          projectId: $scope.whichProject
        }
        skillArrayRef.$set($scope.whichProject,projectDetails);
    });
  };
  
  $scope.addRow = function(){
    if(document.getElementById("skill").value=="")
    {
      alert("Please enter some value");
    }
    else
    {
      var mySkill = {skill: $scope.skill.toUpperCase().trim()};
      var count = 0;
      skillsRef.once("value", function(snap) {
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
        skillsList.$push(mySkill).then(function() 
        {
          skillsRef.once("value", function(snap) 
          {
            var newKey = Object.keys(snap.val())[Object.keys(snap.val()).length-1];
            refSkillInfo.$set(newKey, mySkill);
            $scope.addToSkillsArray(mySkill.skill);
          });
        });
      }
      else
      {
        alert("This skill already exists. No duplicates allowed.");
      }
      $scope.skill='';
    }
  };

  $scope.removeRow = function(name){
  if(window.confirm("Are you sure you want to delete " + name + " from your skills?"))  
  {
    var index = 0;
      var deleted = 0;
      for(var i=0;i<$scope.testing.length;i++)
        {
          var temp = $scope.testing[i];
          if(temp.skill == name)
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
  
      name = name.toUpperCase().trim();
      name = name.replace(/\./g, " DOT ");
      name = name.replace(/\#/g, " HASH ");
      name = name.replace(/\+/g, " PLUS ");
  
      var delRefUser = new Firebase(FIREBASE_URL + '/users/' + $routeParams.uId + '/projects/owned/' + $scope.whichProject + '/skills/' + deleted);
      var delRefProject = new Firebase(FIREBASE_URL + '/projects/' + $scope.whichProject + '/skills/' + deleted);
      var delSkillArray = new Firebase(FIREBASE_URL + '/skills/' + name + '/' + $scope.whichProject);
      var completed1 = function(error) {
        if (error) {
          alert('Delete failed');
        } else {
            alert("Deleted Successfully");
          }
      };
      var completed2 = function(error) {
        if (error) {
          alert('Delete failed');
        } else {
            //alert("Deleted Successfully");
          }
      };
      delRefUser.remove(completed1);
      delRefProject.remove(completed2);
      delSkillArray.remove(completed2);
    }
  };

  $scope.addAssignee = function(myItem) 
  {
    
    var refAssignee = FIREBASE_URL+'/users/'+$routeParams.uId+'/projects/owned/'+$scope.whichProject+'/requirements/'+myItem.$id+'/assignees';
    var refLove = new Firebase(refAssignee);
    var checkinsObj = $firebase(refLove);

    var refAssignees = new Firebase(FIREBASE_URL+'/projects/'+$scope.whichProject+'/requirements/'+myItem.$id+'/assignees');
    var refAssigneesInfo = $firebase(refAssignees);

    var boxes = $('input[name=' + myItem.$id + ']:checked');
    var boxesValue = [];
    $(boxes).each(function(){
        boxesValue.push($(this).val());
    });
    if(boxesValue.length!=0)
    {
      refLove.once("value", function(snap) 
      {
        var temp = snap.val();
        if(temp == null)
        {
          for (var i = 0; i < boxesValue.length; i++) 
          {
            var myData = 
            {
              name: boxesValue[i].substring(boxesValue[i].indexOf('^')+1, boxesValue[i].length),
              id: boxesValue[i].substring(0, boxesValue[i].indexOf('^'))
            };
            checkinsObj.$push(myData);
            refAssigneesInfo.$push(myData);
            // .then(function()
            // {
            //   var newKey = Object.keys(temp)[Object.keys(temp).length-1];
            //   refAssigneesInfo.$set(newKey, myData);
            // });
          }
        }
        else
        {
          var count = 0;
          for (var i = 0; i < boxesValue.length; i++) 
          {
            var myData = 
            {
              name: boxesValue[i].substring(boxesValue[i].indexOf('^')+1, boxesValue[i].length),
              id: boxesValue[i].substring(0, boxesValue[i].indexOf('^'))
            };
            for(assignee in temp)
            {
              if(temp[assignee].name === myData.name && temp[assignee].id === myData.id)
              {
                count++;
              }
              else
              {
                //Do Nothing;
              }
            }
            if(count == 0)
            {
              checkinsObj.$push(myData);
              refAssigneesInfo.$push(myData);
              // .then(function()
              // {
              //   var newKey = Object.keys(temp)[Object.keys(temp).length-1];
              //   refAssigneesInfo.$set(newKey, myData);
              // });
            }
            else
            {
              alert("No duplicates allowed. Please unselect any duplicate entries and try again.");
              break;
            }
          }
        }
      });
    }
    else
    {
      alert("Please select something.");
    }
    $('input[type=checkbox]').removeAttr('checked');
  } //addAssignee

  $scope.deleteAssignee = function(checkinId, awardKey, assName, assId) {
  if(window.confirm("Are you sure you want to delete this assignee?"))  
  {
    var ref = new Firebase(FIREBASE_URL + '/users/' + 
        $routeParams.uId + '/projects/owned/' + 
        $scope.whichProject + '/requirements/' + checkinId + '/assignees');
      var record = $firebase(ref);
      record.$remove(awardKey);
  
      var refAss = new Firebase(FIREBASE_URL + '/projects/' + 
        $scope.whichProject + '/requirements/' + checkinId + '/assignees');
      var Ass = $firebase(refAss);
  
      refAss.once("value", function(snapshot){
        var temp = snapshot.val();
        for(key in temp)
        {
          if(temp[key].name === assName && temp[key].id === assId)
          {
            Ass.$remove(key);
            alert("Assignee deleted from this requirement.");
            break;
          }
        }
      });
    }
  }; //deleteAssignee

  $scope.showAssignee = function(myItem) {
    myItem.show = !myItem.show;

    if(myItem.userState == 'expanded') {
      myItem.userState = '';
    } else {
      myItem.userState = 'expanded';
    }
  } //showAssignee

  $scope.addRequirement = function() {

    if (document.getElementById('kpa1').checked) {
      var open = document.getElementById('kpa1').value;
    }
    if (document.getElementById('kpa2').checked) {
      var closed = document.getElementById('kpa2').value;
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

    if (document.getElementById('requirementstatus1').checked) {
      var todo = document.getElementById('requirementstatus1').value;
    }
    if (document.getElementById('requirementstatus2').checked) {
      var doing = document.getElementById('requirementstatus2').value;
    }
    if (document.getElementById('requirementstatus3').checked) {
      var done = document.getElementById('requirementstatus3').value;
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
      var checkinsObj = $firebase(ref);
      $scope.requirementDesc = $scope.requirementDesc.charAt(0).toUpperCase() + $scope.requirementDesc.substring(1);
      $scope.additionalComments = $scope.additionalComments.charAt(0).toUpperCase() + $scope.additionalComments.substring(1);
      var myData = {
        requirementDescription: $scope.requirementDesc,
        kpa: $scope.kpa,
        requirementStatus: $scope.requirementStatus,
        requirementStartDate: document.getElementById("requirementStartDate").value,
        expectedDuration: $scope.expectedDuration,
        additionalComments: $scope.additionalComments
      };

      checkinsObj.$push(myData).then(function(){
        ref.once("value", function(snap) {
          var newKey = Object.keys(snap.val())[Object.keys(snap.val()).length-1];
          refRequirementInfo.$set(newKey, myData);
        });
      });

      $location.path('/requirements/' + $scope.whichUser + '/' +
        $scope.whichProject + '/requirementsList');
    }
  }; //addCheckin

  $scope.deleteRequirement = function(id) {
    var record = $firebase(ref);
    record.$remove(id);

    var refReq = new Firebase(FIREBASE_URL + '/projects/' + $scope.whichProject + '/requirements/');
    var recordReq = $firebase(refReq);
    recordReq.$remove(id);
  }; //delete Checkin

  $scope.getCollaborators = function(){
    $scope.credits = [];
    var refCol = new Firebase(FIREBASE_URL + '/projects/' + $scope.whichProject + '/collaborators/');
    refCol.on("value", function(snapshot){
      var temp = snapshot.val();
      if(temp == null)
      {
        $scope.collabs = 'false';
      }
      else
      {
        $scope.collabs = "true";
        $scope.collab = temp;
        for(collab in temp)
        {
          var ref = new Firebase(FIREBASE_URL + '/users/' + temp[collab].collaboratorId + '/profileInfo/');
          ref.on("value", function(snap){
            $scope.credits.push({"Id":snap.val().username, "credit":snap.val().credit,
             "name": snap.val().firstname + ' ' + snap.val().lastname});
          });
        }
      }
    });
  };
  $scope.getCollaborators();

  $scope.deleteCollaborator = function(id, name){

    if(window.confirm("Are you sure you want to delete " + name + " ?"))
    {
      var ref = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/owned/'
        + $scope.whichProject + '/collaborators/');
      var refInfo = $firebase(ref);
      refInfo.$remove(id);

      var ref2 = new Firebase(FIREBASE_URL + '/projects/' + $scope.whichProject + '/collaborators/');
      var refInfo2 = $firebase(ref2);
      refInfo2.$remove(id);

      var ref3 = new Firebase(FIREBASE_URL + '/users/' + id + '/projects/collaborated/');
      ref3.on("value", function(snapshot)
      {
        refInfo3 = snapshot.val();
        for(key in refInfo3)
        {
          if(refInfo3[key] != null && key == $scope.whichProject)
          {
            ref3 = new Firebase(FIREBASE_URL + '/users/' + id + '/projects/collaborated/' + key);
            ref3.remove();
            break;
          }
        }
      });

      var ref4 = new Firebase(FIREBASE_URL + '/users/' + id + '/notifications/sent/');
      ref4.on("value", function(snapshot) {
        refInfo4 = snapshot.val();
        for(key in refInfo4)
        {
          if(refInfo4[key] != null && refInfo4[key].hasOwnProperty("to") 
          && refInfo4[key].to == $scope.whichUser && refInfo4[key].username == id 
          && refInfo4[key].projectId == $scope.whichProject)
          {
            ref4 = new Firebase(FIREBASE_URL + '/users/' + id + '/notifications/sent/' + key);
            ref4.remove();
            break;
          }
        }
      });

      var index = 0;
      for(var i=0;i<$scope.credits.length;i++)
      {
        var temp = $scope.credits[i];
        if(temp.name == name && temp.Id == id)
        {
          break;
        }
        else
        {
          index++;
        }
      }
      console.log("index = " + index); 
      $scope.credits.splice(index,1);

      alert(name + " has been removed as collaborator from this project.");
      //location.reload();  
    }
    
  };

  $scope.upvote = function(id, currentCredit, name){
    current = parseInt(currentCredit);
    current += 100;
    current = current.toString();
    var userRef = new Firebase(FIREBASE_URL + '/users/' + id + '/profileInfo');
    if(window.confirm("Are you sure you want to upvote " + name + " ?"))
    {
      var len = document.getElementsByClassName("collab^" + id + "^" + name).length;
      if(len>=2)
      {
        for(var i=0;i<len;i++)
        {
          document.getElementsByClassName("collab^" + id + "^" + name)[i].style.display = "none";
        }
      }
      else
      {
        document.getElementsByClassName("collab^" + id + "^" + name)[0].style.display = "none";
      }
      userRef.update({
        credit: current
      });
      // location.reload();  
    }
  };

  $scope.downvote = function(id, currentCredit, name){
    current = parseInt(currentCredit);
    current -= 50;
    if(current>=0)
    {
      current = current.toString();
      var userRef = new Firebase(FIREBASE_URL + '/users/' + id + '/profileInfo');
      if(window.confirm("Are you sure you want to downvote " + name + " ?"))
      {
        var len = document.getElementsByClassName("collab^" + id + "^" + name).length;
        if(len>=2)
        {
          for(var i=0;i<len;i++)
          {
            document.getElementsByClassName("collab^" + id + "^" + name)[i].style.display = "none";
          }
        }
        else
        {
          document.getElementsByClassName("collab^" + id + "^" + name)[0].style.display = "none";
        }
        userRef.update({
          credit: current
        });
        // location.reload();  
      }
    }
    else
    {
      alert("Cannot downvote this user anymore.");
    }
  };

}); //CheckInsController