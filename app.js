;var rootRef = new Firebase("https://sweltering-inferno-5956.firebaseio.com/");

$(document).ready(function(){

  $('#newAcct').click(function(evt) {
    evt.preventDefault();
    // window.console && console.log('submitted');

    createUserAndLogin({
      email    : $('#signupEmail').val(),
      password : $('#signupPassword').val()
    });
  });
});
function makeid(n){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i=0; i < n; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
function bake_cookie(name, value) {
  var cookie = name+'='+value;//[name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
  document.cookie = cookie;
}
function read_cookie(name) {
 // var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
 // result && (result = JSON.parse(result[1]));
 var ary = document.cookie.split('=');
 return ary[1];
}
function delete_cookie(name) {
  document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}

function authWithPassword(userObj) {
  var deferred = $.Deferred();
  // window.console && console.log('authWithPassword', userObj);
  rootRef.authWithPassword(userObj, function onAuth(err, user) {
    // window.console && console.log('authWithPassword');
    if (err) { deferred.reject(err); }
    if (user) {
      rootRef.child("users").child(user.uid).set(user);
      var newKey = makeid(12), siteId = makeid(9), newKeymap = { apiKey: newKey, site: siteId, uid: user.uid };
      var nk = rootRef.child("keymap").push(newKeymap);
      var km = nk.key();
      window.console && console.log("user created and logged in", rootRef.getAuth());
      deferred.resolve(user);
      bake_cookie("retoldAuth", rootRef.getAuth().token);
      window.location.href = window.location.href + 'dashboard/'+km;
    }
  });
  return deferred.promise();
}

// create a user but not login
// returns a promsie
function createUser(userObj) {
  var deferred = $.Deferred();
  console.log('createUser', userObj);
  rootRef.createUser(userObj, function (err) {
      if (!err) { deferred.resolve(); }
      else { deferred.reject(err);}
  });
  return deferred.promise();
}

// Create a user and then login in
// returns a promise
function createUserAndLogin(userObj, callback) {
  return createUser(userObj)
      .then(function () {
      return authWithPassword(userObj);
  });
}

