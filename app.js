$(document).ready(function(){
  var rootRef;

  $('#newAcct').click(function(evt) {
    evt.preventDefault();

    console.log('submitted');
    rootRef = new Firebase("https://sweltering-inferno-5956.firebaseio.com/");
    createUserAndLogin({
      email    : $('#signupEmail').val(),
      password : $('#signupPassword').val()
    }, function(response) {
      console.log(response);
    });
    // $.ajax({
    //   type: "POST",
    //   url: 'auth.php',
    //   data: $('#signupForm').serialize(),
    //   success: function(data) {
    //     console.log(data);
    //   },
    //   dataType: 'text'
    // });
  });
});

function authWithPassword(userObj) {
  var deferred = $.Deferred();
  console.log(userObj);
  rootRef.authWithPassword(userObj, function onAuth(err, user) {
    if (err) {
        deferred.reject(err);
    }

    if (user) {
        deferred.resolve(user);
    }
  });
  return deferred.promise();
}

// create a user but not login
// returns a promsie
function createUser(userObj) {
    var deferred = $.Deferred();
    rootRef.createUser(userObj, function (err) {

        if (!err) {
            deferred.resolve();
        } else {
            deferred.reject(err);
        }

    });

    return deferred.promise();
}

// Create a user and then login in
// returns a promise
function createUserAndLogin(userObj) {
    return createUser(userObj)
        .then(function () {
        return authWithPassword(userObj);
    });
}

