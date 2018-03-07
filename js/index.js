/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';


var errorElement = document.querySelector('#errorMsg');
var video = document.getElementById('video');
var canvas1 = window.canvas = document.querySelector('canvas');
var clicker = document.getElementById("clicker");
var shareBtn = document.getElementById("shareBtn");
var download = document.getElementById("download");
var snapShot = document.getElementById("snapShot");
var f1 = document.getElementById('fireworks1');
var f2 = document.getElementById('fireworks2');
var prize = document.getElementById("prize");
var sayInk = document.getElementById("sayInk");
var block = document.getElementById('block');
var fbLogo = document.getElementById('fbLogo');
var twitterLogo = document.getElementById('twitterLogo');

var node1 = document.getElementById('container');


var thisUser;
//access token activated on graph explorer for the 'future forecast' app
var token = "";

var context = canvas1.getContext('2d');

var formData;
var dataURL;
var blobby;

var ctracker;

var videoInput;

delete emotionModel['disgusted'];
delete emotionModel['fear'];
var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();


// canvas.width = 480;
// canvas.height = 360;
clicker.addEventListener('click', function () {
    takePic()
})
fbLogo.addEventListener('click', function () {
	login();
})
// twitterLogo.addEventListener('click', function () {
// 	//login();
//   tweetTest();
// })
cancelText.addEventListener('click', function () {
	resetClicker();
})
// download.onclick = function() {downloadImg()};
// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
    audio: false,
    video: true
};

function resetClicker(){
  block.style.display = 'none';
  clicker.style.display = 'block';
  canvas1.style.display = 'none';
  successText.style.display = 'none';
  $("video").prop('disabled', false);
  video.style.display = 'block';
}
function handleSuccess(stream) {
    var videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log('Using video device: ' + videoTracks[0].label);
    console.log('Stream active');

    stream.oninactive = function() {
        console.log('Stream inactive');
    };
    window.stream = stream; // make variable available to browser console
    videoInput = stream;

    video.srcObject = stream;

//     ctracker = new clm.tracker();
//     ctracker.init(pModel);
//     ctracker.start(video.srcObject);
//     noStroke();
//     //var cnv = createCanvas(400, 300);
// //   cnv.position(0, 0);
//     draw();

}


function takePic() {
    canvas1.style.display = 'block';
    canvas1.width = video.videoWidth;
    canvas1.height = video.videoHeight;

    clicker.style.display = 'none';

    context.drawImage(video, 0, 0);
    $("video").prop('disabled', true);
    //$('video').remove();
    html2canvas(document.querySelector("#container")).then(canvas => {

    dataURL = canvas.toDataURL('image/jpeg', 0.8);
    blobby = dataURItoBlob(dataURL);

    video.style.display = 'none';

    enableShareBtn();
    });

};

function enableShareBtn() {
    window.setTimeout(function() {
        //shareBtn.style.display = 'block';
        block.style.display = 'block';
        fbLogo.style.display = "inline-block";
        shareText.style.display = 'block';
        document.getElementById('cancelText').innerHTML = 'CANCEL'
    }, 250);

}


function fbUpload(token){
  var formData = new FormData()
  formData.append('access_token', token)
  formData.append('source', blobby)
  formData.append('message', '#movableink #workiversary');
  var xhr = new XMLHttpRequest();
  xhr.open( 'POST', 'https://graph.facebook.com/me/photos', true )
  xhr.onload = xhr.onerror = function() {
    //console.log( xhr.responseText )
  };
  xhr.send( formData )
}

function dataURItoBlob(dataURI) {
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
  return new Blob([ab], {type: mimeString});
}
//
function login() {
  FB.login(function(response) {
    token = response.authResponse.accessToken;
    //userID = response.authResponse.userID;
    if (response.status === 'connected') {
        fbUpload(token)
        var uid = response.authResponse.userID;
        console.log("https://www.facebook.com/"+uid);
        document.getElementById('successText').innerHTML = 'NICE. Workiversary posted!';
        document.getElementById('cancelText').innerHTML = ''
        successText.style.display = 'block';
        shareText.style.display = 'none';
        //document.getElementById('loginBtn').style.visibility = 'hidden';
      } else if (response.status === 'not_authorized') {
        document.getElementById('status').innerHTML = 'We are not logged in.'
        document.getElementById('loginBtn').style.display = 'block';
      } else {
        document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
        document.getElementById('loginBtn').style.display = 'block';
      }
  }, {scope: 'publish_actions'});
}
function handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
        errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
            constraints.video.width.exact + ' px is not supported by your device.');
    } else if (error.name === 'PermissionDeniedError') {
        errorMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    }
    errorMsg('getUserMedia error: ' + error.name, error);
}

function errorMsg(msg, error) {
    errorElement.innerHTML += '<p>' + msg + '</p>';
    if (typeof error !== 'undefined') {
        console.error(error);
    }
}

navigator.mediaDevices.getUserMedia(constraints).
then(handleSuccess).catch(handleError);



var API = {
    UPDATE_WITH_MEDIA : "https://api.twitter.com/1.1/statuses/update_with_media.json"
};

function oAuthConfig() {
    var oAuthConfig = UrlFetchApp.addOAuthService("twitter");

    oAuthConfig.setAccessTokenUrl("https://api.twitter.com/oauth/access_token");
    oAuthConfig.setRequestTokenUrl("https://api.twitter.com/oauth/request_token");
    oAuthConfig.setAuthorizationUrl("https://api.twitter.com/oauth/authorize");

    oAuthConfig.setConsumerKey(ScriptProperties.getProperty("consumer_key"));
    oAuthConfig.setConsumerSecret(ScriptProperties.getProperty("consumer_secret"));
}

function postImage(tweetText, blobby) {
    oAuthConfig();

    var boundary = "cuthere",
        status   = tweetText,
        picture  = blobby;
        // picture  = UrlFetchApp.fetch(imageUrl).getBlob().setContentTypeFromExtension(),
        // requestBody, options, request;

    requestBody = Utilities.newBlob("--" + boundary + "\r\n" +
        "Content-Disposition: form-data; name=\"status\"\r\n\r\n" + status + "\r\n" +
        "--" + boundary + "\r\n" +
        "Content-Disposition: form-data; name=\"media[]\"; filename=\"" + picture.getName() + "\"\r\n" +
        "Content-Type: " + picture.getContentType() + "\r\n\r\n"
    ).getBytes();

    requestBody = requestBody.concat(picture.getBytes());
    requestBody = requestBody.concat(Utilities.newBlob("\r\n--" + boundary + "--\r\n").getBytes());

    options = {
        oAuthServiceName : "twitter",
        oAuthUseToken    : "always",
        method           : "POST",
        contentType      : "multipart/form-data; boundary=" + boundary,
        payload          : requestBody
    };

    return UrlFetchApp.fetch(API.UPDATE_WITH_MEDIA, options);
}

function tweetTest() {
    var tweetText = "I can look into the future. nbd.",
        imageUrl  = "http://blog-imgs-38.FC2.com/n/e/n/nenesoku/120ebf562bdd2446fbf8459b3e6265e7.jpg";

    postImage(tweetText, imageUrl);
}

function setup() {
    // setup camera capture
    videoInput = createCapture();
    videoInput.size(400, 300);
    videoInput.position(0, 0);
    videoInput.id("v");
    var mv = document.getElementById("v");
    mv.muted = true;

    // setup canvas
    var cnv = createCanvas(400, 300);
    cnv.position(0, 0);

    // setup tracker
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoInput.elt);
    noStroke();
}


function draw() {
    
    // darken video bg
    //fill(0,150);
    rect(0,0,width,height);
    //fill(255);

    var positions = ctracker.getCurrentPosition();
    for (var i=0; i<positions.length -3; i++) {
        ellipse(positions[i][0], positions[i][1], 2, 2);
    }

    var cp = ctracker.getCurrentParameters();
    var er = ec.meanPredict(cp);

    if (er) {
        //rect(i * 110+20, height-90, 30, -er[3].value * 30);
        //andry=0, sad=1, surprised=2, happy=3
        var happy = er[3].value;
        for (var i = 0;i < er.length;i++) {
            //console.log('er.length '+ (er[i].value));
            //rect(3 * 110+20, height-90, 30, -er[3].value * 30);
        }
       // console.log('happy '+happy);
        if (happy >= 0.85){
            //console.log("so happy");
            console.log(happy+" in the happy goal");
            prize.style.display = 'block';
           
            
            sayInk.style.display = 'none';
            er=null;
            return happy=null;
            return;
        }  else{

        }
        
    }
    
}

var granimInstance = new Granim({
    element: '#canvas-basic',
    name: 'basic-gradient',
    direction: 'top-bottom', // 'diagonal', 'top-bottom', 'radial'
    opacity: [1, 1],
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                ['#66c1d3', '#d5c4d8'],
                ['#cd7aa6', '#e58c9d']
            ]
        }
    }
});

