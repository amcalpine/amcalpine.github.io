/*
 *  Website ABM
 *
 */

let randomWalkABM = p5i => {
  p5i.disableFriendlyErrors = true;

  var fr = 30;
  var pause = true;
  p5i.wEnv = p5i.select("#abm-holder").width;
  p5i.hEnv = p5i.select("#abm-holder").height;
  var wEnv = p5i.wEnv;
  var hEnv = p5i.hEnv;

  p5i.randomWalkers = [];
  p5i.numOfRandomWalkers = 120;//90;
  var randomWalkerDiameter = 10;
 
  p5i.setup = function() {
    var canvas = p5i.createCanvas(wEnv, hEnv,p5i.P2D);
    canvas.mousePressed(p5i.repop);
    p5i.background(255);
    p5i.frameRate(fr);
    p5i.textSize(30);
    p5i.setSketch();
    p5i.loop();
    pause = false;
  }


  p5i.draw = function() {
    for(var i = 0; i < p5i.randomWalkers.length; i++){p5i.randomWalkers[i].update();}

    p5i.beginShape(p5i.POINTS);
    for(var i = 0; i < p5i.randomWalkers.length; i++){
      p5i.stroke(p5i.randomWalkers[i].networks[p5i.randomWalkers[i].network].stroke);
      p5i.vertex(p5i.randomWalkers[i].pos.x,p5i.randomWalkers[i].pos.y)
    }
    p5i.endShape();
  }


  p5i.setSketch = function(){
    p5i.logMigrantStates = [];
    pause = true;
    
    p5i.populate();
    p5i.noLoop();
    p5i.redraw();
  }


  p5i.pauseSketch = function(){
    pause = pause ? false : true;
    pause?p5i.noLoop():p5i.loop();
  }

  p5i.windowResized = function(){
    p5i.resizeCanvas(p5i.select("#abm-holder").width,p5i.select("#abm-holder").height);
  }

  p5i.repop = function(){
    p5i.populate();
    p5i.loop();
  }
  
  p5i.populate = function(){
    p5i.newRandomWalkers();
    p5i.noLoop();
  }


  p5i.newRandomWalkers = function(){
    p5i.randomWalkers = [];
    for(var i = 0; i < p5i.numOfRandomWalkers; i++){
      p5i.randomWalkers.push(
        new RandomWalker(p5i, 
          p5i.random(0+randomWalkerDiameter,wEnv-randomWalkerDiameter), 
          p5i.random(0+randomWalkerDiameter,hEnv-randomWalkerDiameter), 
        0, 0, randomWalkerDiameter)
      );
    }
  }

}


let headerabm = new p5(randomWalkABM,'abm-holder');
