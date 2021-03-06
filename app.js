
var app = angular.module('myApp', ['ngResource', 'ngRoute']);
    // .constant('UBER_CLIENT_ID', "ECWcv5urK26d-pz-OHio9c9ovHpahx4UBbQIzMTi")
app.controller("myCtrl", function ($scope,$resource,UserService) {

    $scope.songs = UserService.get();
    $scope.all_songs = [];
    $scope.rating = [];
    $scope.value2 = false;
    $scope.value3 = false;
    console.log($scope.songs);
    $scope.songs.$promise.then(function(response){

      response.results.forEach(function(item){
        if(item.genres.length > 0){
          var a = item.title +' ' + '[' + item.genres[0].name + ']';
          $scope.all_songs.push(a);
        }
        else{
          $scope.all_songs.push(item.title);
        }
        $scope.rating.push(item.rating);
        // console.log(item.genres[0].name);

        $scope.repeatData = $scope.all_songs.map(function(value, index) {
          return {
            data: value,
            value: $scope.rating[index]
          }
        });
      });

    });
    $scope.page_2 = function(){
      $scope.value3 = false;
      $scope.songs = UserService.get({page: 2});
      $scope.all_songs = [];
      $scope.rating = [];
      console.log($scope.songs);
      $scope.songs.$promise.then(function(response){
        // console.log(response.next);
        response.results.forEach(function(item){
          if(item.genres.length > 0){
            var a = item.title +' ' + '[' + item.genres[0].name + ']';
            $scope.all_songs.push(a);
          }
          else{
            $scope.all_songs.push(item.title);
          }
          $scope.rating.push(item.rating);


          $scope.repeatData = $scope.all_songs.map(function(value, index) {
            return {
              data: value,
              value: $scope.rating[index]
            }
          });
        });

      });
      $scope.value2 = true;

    };
    $scope.page_3 = function(){
      $scope.value2 = false;
      $scope.songs = UserService.get({page: 3});
      $scope.all_songs = [];
      console.log($scope.songs);
      $scope.songs.$promise.then(function(response){
        // console.log(response.next);
        response.results.forEach(function(item){
          if(item.genres.length > 0){
            var a = item.title +' ' + '[' + item.genres[0].name + ']';
            $scope.all_songs.push(a);
          }
          else{
            $scope.all_songs.push(item.title);
          }
          $scope.rating.push(item.rating);


          $scope.repeatData = $scope.all_songs.map(function(value, index) {
            return {
              data: value,
              value: $scope.rating[index]
            }
          });
        });

      });
      $scope.value3 = true;
    };

    $scope.search_song = function(){
      var url = 'http://104.197.128.152:8000/v1/tracks?title=' + $scope.search_song_name;
      var a = $resource(url).get();

      a.$promise.then(function(response){
        if(response.results.length != 0){
          if(response.results[0].genres.length!=0){
            alert("Song ID: " + response.results[0].id + "\nSong Title: " + response.results[0].title + "\nRating: " + response.results[0].rating + "\nGenre: " + response.results[0].genres[0].name );
          }
          else{
            alert("Song ID: " + response.results[0].id + "\nSong Title: " + response.results[0].title + "\nRating: " + response.results[0].rating);
          }

          // console.log(response.results);
        }
        else{
          alert("Song not Available");
        }

      });
    };

    $scope.add_track_display = function(){
      document.getElementById("info").style.display = "block";
    };

    $scope.add_track_display_close = function(){
      document.getElementById("info").style.display = "none";
    };

    $scope.add_track = function(){
      var a = UserService.get();
      a.title = $scope.song_name;
      a.rating = $scope.song_rating;
      a.genres = [];
      a.genres.push($scope.song_genre);
      UserService.save(a,function(success){
        console.log(success);
        alert("Song Added Successfully");
        document.getElementById("info").style.display = "none";
      },
        function(error){
          console.log(error);
          alert("Song couldn't be added");
        });

      // if($scope.song_name!=null && $scope.song_rating!=null && $scope.song_genre!=null)
    };

    $scope.update_track_display = function(){
      document.getElementById("info1").style.display = "block";
    };

    $scope.get_track_details = function(){
      var url = 'http://104.197.128.152:8000/v1/tracks/' + $scope.song_id;
      var a = $resource(url).get();
      console.log(a);
      a.$promise.then(function(response){
        $scope.song_name_from_id = response.title;
        $scope.song_rating_from_id = response.rating;
        if(response.genres.length > 0){
          $scope.song_genres_from_id = response.genres[0].name;
        }
        document.getElementById("track_details_btn").style.display = "none";
        document.getElementById("song_details").style.display = "block";
        document.getElementById("get_track_details_close_btn").style.display = "none";
        // console.log($scope.song_genres_from_id);
      },function(){
        alert("Song not Available");
      });
    };

    $scope.get_track_details_close = function(){
      document.getElementById("info1").style.display = "none";

    }

    $scope.edit_track = function(){
      var url = 'http://104.197.128.152:8000/v1/tracks/' + $scope.song_id;
      var a = $resource(url,{},{
        update :{
          method: 'POST'
        }
      }).get();
      a.title = $scope.song_name_from_id;
      a.rating = $scope.song_rating_from_id;
      a.genres = [];
      a.genres.push($scope.song_genres_from_id);
      a.$update(function(success){
        console.log(success);
        alert("Song updated successfully");
        document.getElementById("info1").style.display = "none";
      },function(error){
        console.log(error);
        alert("Couldn't update the Song");
      });

    };

    $scope.edit_track_close = function(){
      document.getElementById("info1").style.display = "none";
    };

    $scope.add_genre_display = function(){
      document.getElementById("info2").style.display = "block";
    };

    $scope.add_genre_close = function(){
      document.getElementById("info2").style.display = "none";
    };

    $scope.add_genre = function(){
      var a = $resource('http://104.197.128.152:8000/v1/genres').get();
      a.name = $scope.genre_name;

      a.$save(function(success){
        console.log(success);
        alert("Genre Added Successfully");
        document.getElementById("info2").style.display = "none";
      },
        function(error){
          console.log(error);
          alert("Genre couldn't be added");
        });
    };

    $scope.edit_genre_display = function(){
      document.getElementById("info3").style.display = "block";
    };

    $scope.get_genre = function(){
      var url = 'http://104.197.128.152:8000/v1/genres/' + $scope.genre_id;
      var a = $resource(url).get();
      a.$promise.then(function(response){
        $scope.genre_name_from_id = response.name;
        console.log($scope.genre_name_from_id);
        document.getElementById("get_genre_btn").style.display = "none";
        document.getElementById("get_genre_name").style.display = "block";
        document.getElementById("get_genre_close_btn").style.display = "none";
      },function(){
        alert("Genre Not Found");
      });

    };

    $scope.get_genre_close = function(){
      document.getElementById("info3").style.display = "none";
    };

    $scope.change_genre_name = function(){
      var url = 'http://104.197.128.152:8000/v1/genres/' + $scope.genre_id;
      var a = $resource(url,{},{
        update :{
          method: 'POST'
        }
      }).get();
      a.name = $scope.genre_name_from_id;
      a.$update(function(success){
        console.log(success);
        alert("Genre updated successfully");
        document.getElementById("info3").style.display = "none";
      },function(error){
        console.log(error);
        alert("Couldn't update the Genre Name");
      });
    };

    $scope.change_genre_name_close = function(){
      document.getElementById("info3").style.display = "none";
    };

  });

app.factory('UserService', function ($resource) {
    return $resource('http://104.197.128.152:8000/v1/tracks');

  });
