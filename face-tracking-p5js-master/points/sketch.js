var ctracker;
function setup() {
    // setup camera capture
    var videoInput = createCapture();
    videoInput.size(700, 1330);
    videoInput.position(0, 0);
    videoInput.id("v");
    //videoInput.hide();
    var mv = document.getElementById("v");
    mv.muted = true;

    // setup canvas
    var cnv = createCanvas(700, 1330);
    cnv.position(0, 0);

    // setup tracker
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.setResponseMode("single",["lbp"])
    //pModel.style.display.opacity = 90;
    ctracker.start(videoInput.elt);
    noStroke();
}

function draw() {
    background(60);
    // get array of face marker positions [x, y] format
    var positions = ctracker.getCurrentPosition();
    var params = ctracker.getCurrentParameters();
    for (var i=0; i<params.length; i++){
      console.log(params[6]);
    }
    for (var i=0; i<positions.length -3; i++) {
        // set the color of the ellipse based on position on screen
        fill(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 255), 255);
        //console.log('positions[i] '+positions[i]);
        // draw ellipse
        ellipse(width - positions[i][0], positions[i][1], 2, 2);
        //console.log(positions[53][1] - positions[47][1]);
        //if (positions[57][1] - positions[60][1])

    }

}
