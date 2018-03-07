var ctracker;

delete emotionModel['disgusted'];
delete emotionModel['fear'];
var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();

function setup() {
    // setup camera capture
    var videoInput = createCapture();
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
    clear();
    // darken video bg
    fill(0,150);
    rect(0,0,width,height);

    fill(255);
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
        console.log('happy '+happy);
        if (happy >= 0.6){
            text("Only 37 days until your next Workiversay!", 220, height-90);
             
        }

        
    }
    text("Make a happy face!", 220, height-10);
    //text("ANGRY", 20, height-40);
    //text("SAD", 130, height-40);
    //text("SURPRISED", 220, height-40);
    //text("HAPPY", 340, height-40);

}
