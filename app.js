

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
                week: 0,
                month: 0, 
                long: 0, 

            };
            friends.push(friend);

            $http.get('https://api.github.com/users/' + name).then(function (response) {
                friend.pic = response.data.avatar_url;
                friend.post = response.data.public_repos;
                friend.realname = response.data.name;
                friend.update = response.data.updated_at;

                console.log(response);
            });

            $http.get('https://api.github.com/users/' + name + '/events' + '/events?per_page=100').then(function (response) {

                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].created_at) {
                        console.log(response.data[i].created_at);
                        const date = moment(response.data[i].created_at);
                        if (date > moment().subtract(7, 'days')) {
                            friend.week++;
                        }; 

                        if (date > moment().subtract(30, 'days')) {
                            friend.month++; 
                        }; 

                        if (date > moment().subtract(100, 'days')) {
                            friend.long++; 
                        }; 
                    }; 
                };
            });
        },

        getFriends() {
            return friends;
        }
    };
}); 