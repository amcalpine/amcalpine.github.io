/*
 * RandomWalker Instance
 *
 */

function RandomWalker (p5i,xPos,yPos,xDir,yDir,diameter){

  this.pos = p5i.createVector(xPos,yPos);
  this.network = p5i.random() <= 0.5 ? "a" : "b";
  //this.d = diameter;
  this.d = 0;

  var parent = this;
  this.networks = {
    "a" : {
      move:function(){parent.recruitingWalk()},
      color:p5i.color(255),
      //stroke:p5i.color(75,75,75)
      stroke:p5i.color(255,255,255)
    },
    "b" : {
      move:function(){parent.recruitingWalk()},
      color:p5i.color(10),
      stroke:p5i.color(255,140,0)
    }
  };


  this.update = function(){
    this.networks[this.network].move();
  }


  this.recruitingWalk = function(){
      this.randomWalk(
      -1, 1, 0.5, 0-this.d, p5i.wEnv - this.d,
      -1, 1, 0.5, 0+this.d, p5i.hEnv-this.d
    );
  } 


  this.randomWalk = function(xStepMin,xStepMax,xSpread,xMin,xMax,yStepMin,yStepMax,ySpread,yMin,yMax){
    var nextMove = this.pos.copy().add(p5i.random() >= xSpread ? xStepMin : xStepMax,p5i.random() >= ySpread ? yStepMin : yStepMax);
    if((nextMove.x >= xMin && nextMove.x <= xMax) && (nextMove.y >= yMin && nextMove.y <= yMax))this.pos = nextMove;
  }
}
