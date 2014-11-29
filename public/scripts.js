AWS.config.update({
  accessKeyId:'', 
  secretAccessKey:'',
});

var bucket = new AWS.S3({params: {Bucket: 'yh.interview'}})

angular.module('superhero', [])

.controller('superheroListCtrl', function($scope){
  $scope.categories=[
  {"id": 1, "name": "Upload Superhero Picture"},
  {"id": 2, "name": "View Superheroes"},
  ]

  $scope.currentCategory = null;
  $scope.edit = null

  function setCurrentCategory(category){; 
    $scope.edit = null
    $scope.currentCategory = category
    
  }

  function addSuperhero(){
    if($scope.currentCategory !== null && $scope.currentCategory.id === 1)  {
      return true
    }
  }

  function Superherolist(){
   if($scope.currentCategory !== null && $scope.currentCategory.id === 2)  {
    bucket.listObjects({
      Prefix: "tejalpatel" 
    }, function(err, data) {
      if (err) {
        console.log(err)
      }
      if (data) {
        $scope.lists = data.Contents
      }
    });
    return true
  }
 }


function setEditing(list){
  $scope.edit = list  
}

function editing(){
  if ($scope.edit !== null){
    $scope.currentCategory = null
    return true
  }
}

function resetForm(){
  $scope.name = " "
  $scope.newName = " "
}

function update(name){
  alert("File Name Has Been Edited")
  bucket.copyObject({
    CopySource: "http://yh.interview.s3.amazonaws.com/"+$scope.edit.Key,
    Key: "tejalpatel/"+name.name + ".gif",
    ACL: "public-read"  
  }, function(err, data) { 
    if (err) {
      console.log(err);
    }
    if (data) {
      deleting($scope.edit)
    }
  })
}

function deleting(list){
  bucket.deleteObject({
    Key: list.Key,
  }, function(err, data) { 
    if (err) {
      console.log(err);
    }
    if (data) {
       // $scope.edit = null
       // resetForm()
       window.location.reload()
     }
   })
}


function onFileSelect(element) {
  console.log(element.files[0])
  if ($scope.name){
    bucket.putObject({
      Key: "tejalpatel/"+$scope.name+".gif",
      ACL: "public-read", 
      Body: element.files[0] 
    }, function(err, data) { 
      if (err) {
        console.log(err);
      }
      if (data) {
        alert("File has  been added")   
        resetForm()
        $scope.currentCategory = null 
        window.location.reload()
      }
    })
  } else {
    alert("You have to give a name")
  }
};

$scope.setCurrentCategory = setCurrentCategory
$scope.addSuperhero = addSuperhero
$scope.Superherolist = Superherolist
$scope.setEditing = setEditing
$scope.editing = editing
$scope.update = update
$scope.deleting = deleting
$scope.onFileSelect = onFileSelect

})