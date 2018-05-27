var myApp = angular.module('myApp', 
  ['ngRoute', 'firebase', 'appControllers'])
.constant('FIREBASE_URL', 'https://collegehubproject.firebaseio.com/');

var appControllers = angular.module('appControllers', ['firebase']);

myApp.config(['$routeProvider', function($routeProvider) {

  $routeProvider.



    when('/notification', {
      templateUrl: 'views/collaboration/notification.html',
      controller:  'NotificationController'
    }).
    when('/:userid/viewcollabprofile', {
      templateUrl: 'views/collaboration/viewcollabprofile.html',
      controller:  'CollaboratorProfileController'
    }).





    when('/project/:userid/:pid/editProject', {
      templateUrl: 'views/edit/editproject.html',
      controller:  'EditProjectController'
    }).
    when('/project/:userid/:pid/:mid/editRequirement', {
      templateUrl: 'views/edit/editrequirement.html',
      controller:  'EditRequirementController'
    }).
    when('/editProfile', {
      templateUrl: 'views/edit/editprofile.html',
      controller:  'ProfileController'
    }).





    when('/login', {
      templateUrl: 'views/login/login.html',
      controller:  'RegistrationController'
    }).
    when('/register', {
      templateUrl: 'views/login/register.html',
      controller:  'RegistrationController'
    }).




    when('/home', {
      templateUrl: 'views/project/projects.html',
      controller:  'ProjectsController'
    }).
    when('/requirements/:uId/:mId', {
      templateUrl: 'views/project/requirements.html',
      controller:  'RequirementsController'
    }).
    when('/requirements/:uId/:mId/requirementsList', {
      templateUrl: 'views/project/requirementslist.html',
      controller:  'RequirementsController'
    }).
    when('/pipeline/:userid/:pid/showpipeline', {
      templateUrl: 'views/project/pipeline.html',
      controller:  'PipelineController'
    }).





    when('/findProjects', {
      templateUrl: 'views/search/findprojects.html',
      controller:  'FindProjectsController'
    }).
    when('/:ownerid/:userid/:pid/:pname/foundproject', {
      templateUrl: 'views/search/foundproject.html',
      controller:  'SearchResultController'
    }).





    when('/education', {
      templateUrl: 'views/userprofile/education.html',
      controller:  'EducationController'
    }).
    when('/certifications', {
      templateUrl: 'views/userprofile/certifications.html',
      controller:  'CertificationsController'
    }).
    when('/skills', {
      templateUrl: 'views/userprofile/skills.html',
      controller:  'SkillsController'
    }).
    when('/projects', {
      templateUrl: 'views/userprofile/showprojects.html',
      controller:  'ProjectsController'
    }).




    
    otherwise({
      redirectTo: '/home'
    });



}]);