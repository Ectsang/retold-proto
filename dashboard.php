<?php
// include_once "firebasetokengen/vendor/autoload.php";//FirebaseToken.php";
// $tokenGen = new Services_FirebaseTokenGenerator($_SERVER['RETOLD_FIREBASE_SECRET']);
// $userId = $_REQUEST['u'];
$keymapId = $_REQUEST['km'];
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
<link rel="stylesheet" type="text/css" href="../overrides.css">
<style type="text/css">
  body {padding-top: 50px;}
  .spinner {
    width: 40px;
    height: 40px;

    position: relative;
    margin: 100px auto;
  }

  .double-bounce1, .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #333;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;

    -webkit-animation: bounce 2.0s infinite ease-in-out;
    animation: bounce 2.0s infinite ease-in-out;
  }

  .double-bounce2 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  @-webkit-keyframes bounce {
    0%, 100% { -webkit-transform: scale(0.0) }
    50% { -webkit-transform: scale(1.0) }
  }

  @keyframes bounce {
    0%, 100% {
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    } 50% {
      transform: scale(1.0);
      -webkit-transform: scale(1.0);
    }
  }
</style>
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
          <li><a href="javascript:logOut()">Logout</a></li>
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
                <div class="spinner">
                  <div class="double-bounce1"></div>
                  <div class="double-bounce2"></div>
                </div>
                <span id="nullmsg" style="display:none">You don't have any annotations yet.</span>
              </div>
            </div>
          </div>
          <br><br>
        </div>

        <div role="tabpanel" class="tab-pane " id="documentation">
          <h2>Quick Start</h2><br><br>
          <h4 style="color:#0088CC">1. Paste the javascript snippet into your web pages, right before the &lt;/body&gt; tag</h4>
          <div id="mycode" class="well">
          </div>
          <strong>*TIP* -- If you need to include this in every page of your site, consider placing the snippet in a common include file, such as your footer.</strong>
          <br><br><br><br>
          <h4 style="color:#0088CC">2. Now your clients can give feedback directly on those web pages.</h4>
          <br><br>
          <hr>
          <br>
          <h2>API Documentation</h2><br><br>
          <p>Coming soon.</p>
          <br><br><br>
        </div>

      </div>
    </div>
  </div>


<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src='https://cdn.firebase.com/js/client/2.0.4/firebase.js'></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js"></script>
<script type="text/javascript" src="../app.js"></script>
<script type="text/javascript">
  function authHandler(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
      window.location.href = '/';
      return;
    } else {
      console.log("Authenticated successfully with payload:", authData);
      var kmSearch = 'keymap/<?php echo $keymapId ?>';
      var siteRef = new Firebase(_STORE_BASE_URL);
      ref.child(kmSearch).once('value', function(dataSnapshot) {
        _SITES = 'sites/'+dataSnapshot.val().site;
        _APIKEY = dataSnapshot.val().apiKey;

        getMyCode(_APIKEY);

        ref.child(_SITES).once('value', function(ds) {
          if (ds.val().count == 0) {
            $(".spinner").hide();
            $("#nullmsg").show();
          }

          ref.child(_SITES).on('child_added', function(snapshot) {
            // console.log('child_added');
            $(".spinner").hide();
            $("#nullmsg").hide();
            if (snapshot.val() !== 0) {
              var nodeAddr = snapshot.val();
              var id = snapshot.key();
              insertAnnotation(nodeAddr, id);
            }
          });
          ref.child(_SITES).on('child_changed', function(snapshot) {
            // console.log('child_changed');
            var nodeAddr = snapshot.val();
            var id = snapshot.key();
            updateAnnotation(nodeAddr, id);
          });
        });
      });
    }
  }

  var _STORE_BASE_URL = 'https://sweltering-inferno-5956.firebaseio.com/';
  var _SITES, apiKey;

  var ref = new Firebase(_STORE_BASE_URL);
  if (token = read_cookie("retoldAuth")) ref.authWithCustomToken(token, authHandler);
  else window.location.href = '/';

  function insertAnnotation(node, id) {
    // console.log(node);
    var idAuthor = id + "_author",
        idComment = id + "_comment",
        idSpinner = id + "_spinner",
        idScreenshot = id + "_screenshot";
    var t = moment(node.data.time).format("dddd, MMMM Do YYYY, h:mm:ss a");
    // var markup = '<div id="'+id+'" class="thumbnail"><div class="caption"><p id="'+idAuthor+'">'+node.data.author+': <code id="'+idComment+'">'+node.data.comment+'</code> <span class="pull-right"><a href="#" class="btn btn-primary" role="button">Mark as read</a></span></p></div><br><hr>';
    var markup = '<div id="'+id+'" class="thumbnail"><div class="caption"><strong>'+t+'</strong>  --  <a href="'+node.data.url+'">'+node.data.url+'</a><br><code id="'+idComment+'">'+node.data.comment+'</code><span class="pull-right"><a href="#" class="btn btn-primary" role="button">Mark as read</a></span></div><br><hr>';
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
  function getMyCode(id) {
    // var markup = '&lt;script type="text/javascript" src="http://retold.io/dist/retold-all.js"&gt;&lt;/script&gt;&lt;script type="text/javascript"&gt;window.retold = window.retold || {};retold.init({apiKey: "'+id+'"});&lt;/script&gt';
    var markup = '&lt;script type="text/javascript"&gt;!function(src,cb){var s,r,t;r=false;s=document.createElement("script");s.type="text/javascript";s.src=src;s.onload=s.onreadystatechange=function(){if(!r&&(!this.readyState||this.readyState=="complete")){r=true;cb();}};t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);}("http://retold.io/dist/retold-all.js",function(){window.retold=window.retold||{};retold.init({apiKey:"'+id+'"});});&lt;/script&gt;';
    $('#mycode').prepend(markup);
  }
</script>

<script type="text/javascript">
!function(src,cb){var s,r,t;r=false;s=document.createElement("script");s.type="text/javascript";s.src=src;s.onload=s.onreadystatechange=function(){if(!r&&(!this.readyState||this.readyState=="complete")){r=true;cb();}};t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);}("http://retold.io/dist/retold-all.js",function(){window.retold=window.retold||{};retold.init({apiKey:"Jwc2xovsnDvh"});});
</script>

</body>
</html>
