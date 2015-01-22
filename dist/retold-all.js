/*
<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
<style type="text/css">
#retoldInit { cursor: pointer }
</style>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.js"></script>
<script type="text/javascript" src='//cdn.firebase.com/js/client/2.0.4/firebase.js'></script>
<script type="text/javascript" src="../html2canvas/dist/html2canvas.js"></script>
*/
window.retold = {
  // 1. load jquery, firebase client, html2canvas

  init: function(options) {
    this.renderMarkup();
    this.hookupPageEvents();
    this.apiKey = options.apiKey;

    this._STORE_URL = 'https://sweltering-inferno-5956.firebaseio.com/';
    this._SITE_URL = this._STORE_URL + 'sites/' // + btoa(window.location.href);
    // this.dataRef = new Firebase(this._SITE_URL);
    this.siteDataRef = new Firebase(this._SITE_URL);
    this.siteDataRef.authAnonymously(function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  },

  renderMarkup: function() {
    var retoldMarkup = '<input id="retoldTargetHtml" type="hidden" value="" />'+
    '<img id="mousePtr" class="follow" style="display:none;position:absolute;z-index:3000;right:20px;bottom:20px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAeCAYAAACrI9dtAAACq0lEQVR42t2Xz0tiURTH/Y9mUZmCvzIlTJK0IMiNgUErxbAcqoVCLgRBaxW5MFEQaxfSRnIhEW4sRFMxKgTBhbvAlYvvcC68hzOTP8beew194S2E8+75eO+553yfTPbdBOBHu91uPj8/o16v4/X1Fe/v7z8lB0mn09BoNJiZmRn5zM7OYn9/H51OpyAKyO3tLaxWKxQKxViYj57FxUX4/X4IAvPw8ACn08n+NZdgbW0NJycnuLu7Ax1bv9/HoFqtFsrlMq6uruB2uzE/P8+/azAYcHZ2Nj3c9fU1v5hcLsfu7i6q1SqmUSwWw/LyMr/e9vY2pqobboHV1VW8vLxACEUiEX7XNzc3JwejbeeANjY2ILRKpRIPZrfbJwPT6XTsBZfLBbFUq9X4SxONRkeDBQIBFriysgKxRZeFchmNxtFQS0tLLPDi4gJSiFoF5cvn88PBlEolCxKqsMdpb2+P5aMmOxSKK0CpFA6Hx99Ervh6vZ4kUMfHx+P7ll6vZ0GFQkESqK2tLZaPin4oFPUNCvJ4PKIDNRoNNinm5uZATmMoVKVSYUEERk1OTHEb4HA4xjdQGsAUrFKpRAPa2dnhpwZtxERd3WazsRe0Wi3u7+8FBaKbxgElk8nJ5x85SK6R0kOd/rNKpVKwWCz8mjRjp7Iv5Ie43kXj4F/19PSETCbzG8zCwgKy2eznDN/BwQFbjI50UNT14/E4bm5uUCwW8fj4yJKdn5/j8PCQ1eSg+6TfR0dHwrhPk8nEFj09PeWBCIKu86R2OBgMQlB/ziVvNpsMyOfz8UdKR0FHo1armRVZX19nlicUCoGca7fbzQj+wTDYS/60tF6vFzKpRQb/o6Og3UkkEtIDXV5e/gVDc1GwQp1Gg59FZrMZuVzu62A40YB8e3v7epD/Sb8AFRCMD6cU2FwAAAAASUVORK5CYII=" />'+
    '<div id="retoldComment" style="z-index:10000;padding:5px;position:absolute;background:white;color:black;border:1px solid blue;border-top:5px solid blue;display:none">'+
      '<textarea id="retoldCommentText" cols="50" placeholder="Write down your feedback. What would you like changed?"></textarea><br>'+
      '<button id="retoldCommentBtn">Save Comment</button>'+
    '</div>'+
    '<div id="retold" style="position:fixed; right:20px; bottom:20px; background:white; padding:6px;">'+
      '<a id="retoldInit" data-trigger="hover" data-placement="left" title="Make a comment"><i id="retoldInitIcon" class="fa fa-comments-o fa-3x"></i></a>'+
    '</div>';

    $(retoldMarkup).appendTo('body');
  },

  hookupPageEvents: function() {
    $(document).mousemove(function(e){
        $('#mousePtr').css({left:e.pageX-10, top:e.pageY-35});
    });

    $(document).keydown(function(e) {
      if (e.keyCode == 82 && e.ctrlKey) {
        $('#retoldInit').trigger('click');
      }
    });

    $(document).keyup(function(e){
      if (e.which == 27) {
        retold.cleanSlate();
      }
    });

    $('#retoldInit').click(function() {
      // console.log("retoldInit");
      if ($('#retoldInitIcon').hasClass('fa-comments-o')) {
        $('#retoldInitIcon').addClass('fa-close');
        $('#retoldInitIcon').removeClass('fa-comments-o');
        $('body').css('cursor: none;'); // custom cursor
        retold.stripClickEvents(); // disable all button events on page
        $('#mousePtr').show();
        $('body').css({cursor:'pointer'});
        document.onclick = retold.captureClick;
      } else {
        retold.cleanSlate();
      }
    });

    $('#retoldCommentBtn').click(function(evt, data) {
      var newKey = retold.saveComment(evt, data);

      // newKey was in fact not false
      if (newKey !== false) {

        retold.createScreenshot(newKey);

        // Clone retoldComment that shows up on mouseover
        var copyCat = $('#retoldComment').clone();
        copyCat.attr('id', newKey);
        var newIdStr = '#'+newKey;
        // console.log(copyCat);
        copyCat.appendTo("body");

        // Copy commentText
        var newTextArea = $(newIdStr+' textarea');
        newTextArea.val($('#retoldCommentText').val());
        var newTextAreaId = "textArea_" + newKey;
        newTextArea.attr('id', newTextAreaId);

        // Change button Id
        var newButton = $(newIdStr+' button');
        var newButtonId = "btn_" + newKey;
        newButton.attr('id', newButtonId);

        // Set click event on new button
        $('#'+newButtonId).click(function(evt, newKey) {
          retold.updateComment(newKey);
        });

        // Reset + Hide original retoldComment
        $('#retoldCommentText').val('');
        $('#retoldComment').hide();
      }
    });
  },

  authHandler: function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  },

  cleanSlate: function() {
    $('#retoldInitIcon').addClass('fa-comments-o');
    $('#retoldInitIcon').removeClass('fa-close');
    $('body').css('cursor: auto;'); // reset custom cursor
    $('#retoldComment').hide();
    $('#mousePtr').hide();
    $('body').css({cursor:'default'});
    document.onclick = function(){};
  },

  dataURItoBlob: function(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  },

  stripClickEvents: function() {
    // console.log("stripClickEvents");
    $("a").each(function() {
      $(this).css("cursor","arrow").click(false);
    });
    $("button").each(function() {
      $(this).css("cursor","arrow").click(false);
    });
    // $(":input").each(function() {
    //   if (!(this.id === "retoldCommentText" ||
    //         this.id === "retoldCommentBtn" ||
    //         this.id.indexOf("textArea_") !== -1 ||
    //         this.id.indexOf("btn_") !== -1 )) {
    //     $(this).prop("disabled", true);
    //   }
    // });
  },

  captureClick: function(evt) {
    var evt=window.event || evt; // window.event for IE
    evt.preventDefault();

    if (!evt.target) evt.target=evt.srcElement; // extend target property for IE
    if (!(evt.target.id == 'retoldInitIcon' ||
          evt.target.id == 'retoldComment' ||
          evt.target.id == 'retoldCommentText' ||
          evt.target.id.indexOf("textArea_") !== -1 ||
          evt.target.id.indexOf("btn_") !== -1 )) {
      var mouseLocation = retold.getMouseXY(evt);

      retold.createComment(mouseLocation.x, mouseLocation.y);
      $('#retoldTargetHtml').val(evt.target.outerHTML);
      $('#retoldCommentText').focus();
    }
  },

  getMouseXY: function(e) {
    // console.log("getMouseXY");
    var IE = document.all ? true : false;
    if (!IE) document.captureEvents(Event.MOUSEMOVE);
    if (IE) {
      tempX = event.clientX + document.body.scrollLeft;
      tempY = event.clientY + document.body.scrollTop;
    } else {
      tempX = e.pageX;
      tempY = e.pageY;
    }
    return {x: tempX, y: tempY};
  },

  createComment: function(x,y) {
    // console.log("createComment");
    $('#retoldComment').css('left', x);
    $('#retoldComment').css('top', y);

    $('#retoldComment').prop('disabled', false); // enable this
    $('#retoldComment').show();
  },

  saveComment: function(evt) {
    console.log("saveComment");
    try {
      var data = {
        time: Date.now(),
        author: retold.siteDataRef.getAuth().uid,
        targetHtml: $('#retoldTargetHtml').val(),
        mouseLocation: this.getMouseXY(evt),
        url: window.location.href,
        comment: $('#retoldCommentText').val()
      };
      // console.log(data);
      var newComment = retold.siteDataRef.push( { data: data } );
      var newKey = newComment.key();
      return newKey;

    } catch (ex) {
      console.error(ex);
      return false;
    }
  },

  updateComment: function(e) {
    // console.log("updateComment");
    e = e || window.event;
    var targ = e.target || e.srcElement;
    if (targ.nodeType == 3) targ = targ.parentNode;

    var annotationId = e.target.id.replace("btn_", "");

    var myCommentRef = new Firebase(this._STORE_URL + '/' + annotationId + '/data');
    myCommentRef.update({
      comment: $('#textArea_'+annotationId).val(),
      time: Date.now()
    });

    this.createScreenshot(annotationId);
  },

  createScreenshot: function(id) {
    html2canvas(document.body, {
      timeout: 0,
      // allowTaint: false,
      // logging: true,
      // useCORS: true,
      type: 'view',
      height: $(window).height(), // only context
      // proxy: 'https://ancient-crag-5418.herokuapp.com'
    }).then(function(canvas){
      var dataURL = canvas.toDataURL('image/png');

      blobSupport = (function(){ try { return !!new Blob(); } catch (e) { console.error(e); return false; }}());

      if (blobSupport) {
        var blob = retold.dataURItoBlob(dataURL);
        retold.saveScreenshot(id, dataURL, blob);
      } else {
        retold.saveScreenshot(id, dataURL, null);
      }
    });
  },

  saveScreenshot: function(id, dataURL, blob) {
    var _COMMENT_URL = this._SITE_URL + '/' + id + '/screenshot';
    var myCommentRef = new Firebase(_COMMENT_URL);
    if (blob !== null)
      myCommentRef.update({ dataURL: dataURL, blob: blob });
    else
      myCommentRef.update({ dataURL: dataURL });
  }

};



// function saveScreenshot (id, dataURL, blob) {
//   var _COMMENT_URL = _SITE_URL + '/' + id + '/screenshot';

//   var myCommentRef = new Firebase(_COMMENT_URL);
//   if (blob !== null)
//     myCommentRef.update({ dataURL: dataURL, blob: blob });
//   else
//     myCommentRef.update({ dataURL: dataURL });
// }



