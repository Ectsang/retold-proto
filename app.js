;var rootRef = new Firebase("https://sweltering-inferno-5956.firebaseio.com/");
var sitesRef = new Firebase("https://sweltering-inferno-5956.firebaseio.com/sites");

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
  var cookie = name+'='+value;
  document.cookie = cookie;
}
function read_cookie(name) {
 var ary = document.cookie.split('=');
 return ary[1];
}
function delete_cookie(name) {
  document.cookie = name + '=; Max-Age=0';
}
function login() {
  return loginWithPassword({
    email:$('#loginEmail').val(),
    password:$('#loginPassword').val()
  });
}
function logOut() {
  delete_cookie('retoldAuth');
  rootRef.unauth();
  window.location.href = '/';
}
function loginWithPassword(userObj) {
  var deferred = $.Deferred();
  rootRef.authWithPassword(userObj, function onAuth(err, user) {
    if (err) { deferred.reject(err); }
    if (user) {
      window.console && console.log("user logged in", rootRef.getAuth());
      rootRef.child('keymap').orderByChild("uid").equalTo(user.uid).once("value", function(snapshot) {
        bake_cookie("retoldAuth", rootRef.getAuth().token);
        var km = Object.keys(snapshot.val())[0];
        window.location.href = window.location.href + 'dashboard/'+km;
      });
      deferred.resolve(user);
    }
  });
  return deferred.promise();
}
function authWithPassword(userObj) {
  var deferred = $.Deferred();
  // window.console && console.log('authWithPassword', userObj);
  rootRef.authWithPassword(userObj, function onAuth(err, user) {
    if (err) { deferred.reject(err); }
    if (user) {
      rootRef.child("users").child(user.uid).set(user);
      var newKey = makeid(12), siteId = makeid(9), newKeymap = { apiKey: newKey, site: siteId, uid: user.uid };
      var ns = sitesRef.child(siteId).set({count:0});
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
function createUserAndLogin(userObj) {
  return createUser(userObj)
      .then(function () {
      return authWithPassword(userObj);
  });
}

