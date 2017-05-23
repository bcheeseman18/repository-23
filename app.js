

const app = angular.module('GithubActivityApp', ['ui.router']);

app.config(function ($stateProvider) {

    $stateProvider.state({
        name: 'userlist',
        url: '/userlist',
        component: 'userList',
    });

    $stateProvider.state({
        name: 'userdetails',
        url: '/userdetails',
        component: 'userDetails',
    });
})

app.component('userList', {
    templateUrl: 'templates/userlist.html',
    controller: 'GithubListController',
});

app.component('userDetails', {
    templateUrl: 'templates/userdetails.html',
    controller: 'GithubDetailsController'
});

app.controller('GithubListController', function ($scope, FriendService) {
    $scope.user_name = '';
    $scope.add = function () {
        console.log('adding new user');
        FriendService.addFriend($scope.user_name);
        $scope.user_name = '';
    };
    $scope.friends = FriendService.getFriends();
    console.log('user');

});

app.controller('GithubDetailsController', function ($scope, FriendService) {
    $scope.friends = FriendService.getFriends();
    console.log('user');
});

app.factory('FriendService', function ($http) {
    const friends = [];

    return {
        addFriend(name) {

            const friend = {
                username: name,
                pic: null,
                post: '',
                realname: '',
                date: '',
                week: '',
                month: '', 

            };
            friends.push(friend);

            $http.get('https://api.github.com/users/' + name).then(function (response) {
                friend.pic = response.data.avatar_url;
                friend.post = response.data.public_repos;
                friend.realname = response.data.name;
                friend.update = response.data.updated_at;

                console.log(response);
            });

            $http.get('https://api.github.com/users/' + name + '/events').then(function (response) {

                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].created_at) {
                        console.log(response.data[i].created_at);
                        const date = moment(response.data[i].created_at);
                        const repo = date.public_repos; 
                        friend.week = repo; 
                        console.log('hello!!!')
                    }; 
                        // friend.date = date;
                        // const week = moment(date).subtract(7, 'days'); 
                        // friend.week = week; 
                        // const month = moment(date).subtract(30, 'days'); 
                        // friend.month = month; 
                        // console.log('hi there');

                        // if (response.data[i].created_at) {
                        //     console.log('hi');
                        // }; 


                        // const week = moment(response.data[i].created_at); 
                        // friend.week = week; 

                    // };
                };
            });
        },

        getFriends() {
            return friends;
        }
    };
}); 