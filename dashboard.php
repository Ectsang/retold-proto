<?php
  include_once "firebasetokengen/vendor/autoload.php";//FirebaseToken.php";

  $tokenGen = new Services_FirebaseTokenGenerator($_SERVER['RETOLD_FIREBASE_SECRET']);
  $token = $tokenGen->createToken(array("uid" => "simplelogin:1"));
?>
<!DOCTYPE html>
<html>
<head>
<title>Retold - Easy Feedback On Every Webpage</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/css/bootstrap.min.css">
<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
<link href='//fonts.googleapis.com/css?family=Ubuntu:500' rel='stylesheet' type='text/css'>
<style type="text/css">
body {padding-top: 50px;}
</style>
<link rel="stylesheet" type="text/css" href="overrides.css">
</head>
<body>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand active">Retold</a>
      </div>
      <div id="navbar" class="collapse navbar-collapse pull-right">
        <ul class="nav navbar-nav">
          <!-- <li class="active"><a href="#">Home</a></li>
          <li><a href="#about">About</a></li> -->
          <li><a href="#logout">Logout</a></li>
        </ul>
      </div><!--/.nav-collapse -->
    </div>
  </nav>
  <br>
  <div role="tabpanel">
    <div class="col-md-3">
      <ul class="nav nav-pills nav-stacked nav-tabs" role="tablist" style="top:0">

        <li role="presentation" class="active"><a href="#annotations" aria-controls="annotations" role="tab" data-toggle="tab">Annotations</a></li>
        <li role="presentation"><a href="#documentation" aria-controls="documentation" role="tab" data-toggle="tab">API Docs</a></li>
        <li role="presentation"><a href="mailto:tsang.eric+retold@gmail.com" aria-controls="settings">Email us</a></li>
      </ul>
    </div>

    <div class="col-md-8">
      <div class="tab-content">
        <div role="tabpanel" class="tab-pane active" id="annotations">

          <div class="row">
            <div id="annotationList" class="col-md-12">
              <!-- <div class="thumbnail">
                <div class="caption">
                  <h3>Annotation #1 <span class="pull-right"><a href="#" class="btn btn-primary" role="button">Mark as read</a> <a href="#" class="btn btn-default" role="button">OK</a></span></h3>
                </div>
                <img src="//placehold.it/300x180" alt="...">
              </div> -->
              <div class="text-center">
                <div id="loadingmsg"><br><br></div>
                <span id="nullmsg" style="display:none">You don't have any annotations yet.</span>
              </div>
            </div>
          </div>
          <br><br>
        </div>

        <div role="tabpanel" class="tab-pane " id="documentation">
          Not yet available. Please write us an email.
        </div>

      </div>
    </div>
  </div>


<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/js/bootstrap.min.js"></script>
<script src='https://cdn.firebase.com/js/client/2.0.4/firebase.js'></script>
<script type="text/javascript" src="js/spin.min.js"></script>
<script type="text/javascript">
  var opts = {
    lines: 12, // The number of lines to draw
    length: 1, // The length of each line
    width: 4, // The line thickness
    radius: 8, // The radius of the inner circle
    corners: 0.5, // Corner roundness (0..1)
    rotate: 9, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1.1, // Rounds per second
    trail: 52, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
  };
  var target = document.getElementById('loadingmsg');
  var spinner = new Spinner(opts).spin(target);
</script>
<script type="text/javascript">
  function authHandler(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:");//, authData);

      setTimeout(function() {
        ref.once('value', function(dataSnapshot) {
          if (!dataSnapshot.exists()) {
            $("#loadingmsg").hide();
            $("#nullmsg").show();
          }
        });
      }, 1000);
    }
  }

  var _STORE_BASE_URL = 'https://sweltering-inferno-5956.firebaseio.com/';
  var _SITES = 'sites/' + 'aHR0cDovL2xvY2FsaG9zdC9sZW5nbGVhZC5jb20v';

  var ref = new Firebase(_STORE_BASE_URL);
  ref.authWithCustomToken("<?php echo $token ?>", authHandler);

  ref.child(_SITES).on('child_added', function(snapshot) {
    // console.log('child_added');
    $("#loadingmsg").hide();
    $("#nullmsg").hide();
    var nodeAddr = snapshot.val();
    var id = snapshot.key();
    insertAnnotation(nodeAddr, id);
  });
  ref.child(_SITES).on('child_changed', function(snapshot) {
    // console.log('child_changed');
    var nodeAddr = snapshot.val();
    var id = snapshot.key();
    updateAnnotation(nodeAddr, id);
  });
  function insertAnnotation(node, id) {
    // console.log(node);
    var idAuthor = id + "_author",
        idComment = id + "_comment",
        idSpinner = id + "_spinner",
        idScreenshot = id + "_screenshot";
    var markup = '<div id="'+id+'" class="thumbnail"><div class="caption"><h3 id="'+idAuthor+'">'+node.data.author+': <code id="'+idComment+'">'+node.data.comment+'</code> <span class="pull-right"><a href="#" class="btn btn-primary" role="button">Mark as read</a></span></h3></div><br><hr>';
    if (node.screenshot) {
      markup += '<br><img id="'+idScreenshot+'" alt="..." src="'+node.screenshot.dataURL+'"></div><hr>';
    } else {
      markup += '<br><img id="'+idScreenshot+'" alt="..." style="display:none"><div id="'+idSpinner+'" class="text-center"><i class="fa fa-spinner fa-spin"></i><br><br></div></div><hr>';
    }
    $('#annotationList').prepend(markup);
  }
  function updateAnnotation(node, id) {
    // console.log(node);
    var idAuthor = id + "_author",
        idComment = id + "_comment",
        idSpinner = id + "_spinner",
        idScreenshot = id + "_screenshot";
    $("#" +idAuthor).val(node.data.author);
    $("#" +idComment).html(node.data.comment);
    $("#" +idSpinner).hide();
    $("#" +idScreenshot).attr('src', node.screenshot.dataURL);
    $("#" +idScreenshot).show();
  }
</script>

</body>
</html>
