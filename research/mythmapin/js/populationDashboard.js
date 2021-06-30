let p5Population;
setTimeout( function(){ p5Population = new p5(populationSketch, "populationDashboard") }, 2000 );

function populationSketch(p5Population){
  let numOfTicks, numOfMigrations, w, h;
  let border = 150;
  let pathways = [
    [ "solo", [0,0,0] ],
    [ "family", [255,255,255] ],
    [ "mou", [255,0,0] ],
    [ "informal", [0,255,0] ],
    [ "mixed", [0,0,255] ]
  ];

  p5Population.setup = function() {
    p5Population.createCanvas(900, 1080);
    p5Population.textAlign( p5Population.RIGHT, p5Population.TOP );
    p5Population.frameRate(15);
    p5Population.textSize(20)
    numOfTicks = ticks;
    numOfMigrations = 100;
    h = p5Population.map( numOfMigrations, 0, numOfMigrations, border, p5Population.height*0.5-border );
    w = p5Population.map( numOfTicks, 0, numOfTicks, border, p5Population.width-border );
  }


  p5Population.draw = function() {
    p5Population.background(120);
    // pathways
    // p5Population.drawPathwaysGraph();
    // p5Population.drawPathwaysTrendlines( outputData, pathways );
    // precarities
    p5Population.push();
    // p5Population.translate( 0, h + border );
    p5Population.drawPrecaritiesGraph();
    p5Population.drawPrecaritiesTrendlines( migrants );
    p5Population.pop();
    // interaction
    if( p5Population.mouseX > border && p5Population.mouseX < p5Population.width - border && p5Population.mouseY > border && p5Population.mouseY < p5Population.height - border ){
      p5Population.drawTickInfo( p5Population.mouseX, p5Population.floor(p5Population.map( p5Population.mouseX, border, w, 0, numOfTicks )), outputData, pathways );
    }else{
      p5Population.drawTickInfo( p5Population.floor(p5Population.map( frameCount,  0, numOfTicks, border, w )), frameCount, outputData, pathways );
    }
  }

  
  p5Population.drawPrecaritiesGraph = function(){
    p5Population.textAlign( p5Population.RIGHT, p5Population.BOTTOM );
    p5Population.text( "Pathway Precarity Over Migration Duration", w*0.5 + border, border );
    p5Population.textAlign( p5Population.RIGHT, p5Population.TOP );
    p5Population.line( border, h+2, w, h+2 ); // x axis
    p5Population.text( numOfTicks + " ticks", w, h+10 );
    p5Population.line( border, border, border, h ); // y axis
    p5Population.text( 1 + " ", border, border );
  }
  

  p5Population.drawPrecaritiesTrendlines = function( ms ){
    p5Population.push();
    p5Population.stroke(255,50);
    p5Population.noFill();
    // loop through each migrant's migrations
    let avg = {};
    for( let i=0; i<numOfTicks; i++ ){
      avg[i] = {
        "solo":{"sum":0,"count":0, "max":0,"min":1},
        "family":{"sum":0,"count":0, "max":0,"min":1},
        "mou":{"sum":0,"count":0, "max":0,"min":1},
        "informal":{"sum":0,"count":0, "max":0,"min":1},
      }
    }
    for( const [k, v] of Object.entries( ms ) ){
      // migrant
      for( let i=0; i < v.migrations.length; i++){
        // migration
        // if( v.migrations[i].completed || (v.state == "employed") ){
        if(v.migrations[i].pathway != null){
          let t0 = null;
          // get the data
          for( const [t, p] of Object.entries( v.migrations[i].history ) ){
            if( t0 == null ) t0 = t;
            avg[t-t0][v.migrations[i].pathway].count +=1;
            avg[t-t0][v.migrations[i].pathway].sum += p.precarity;            
            if( p.precarity > avg[t-t0][v.migrations[i].pathway].max ) avg[t-t0][v.migrations[i].pathway].max = p.precarity;
            if( p.precarity < avg[t-t0][v.migrations[i].pathway].min ) avg[t-t0][v.migrations[i].pathway].min = p.precarity;
          }
        }
        
      }
    }

    p5Population.push();
    p5Population.beginShape();
    p5Population.stroke(0,0,0,150);
    p5Population.strokeWeight(2);
      for( const [a, v] of Object.entries(avg) ){
        let x = p5Population.map( a, 0, numOfTicks,border, w );
        let y = p5Population.map( v["solo"].sum / v["solo"].count, 0, 1, h, border );
        p5Population.curveVertex( x, y ); 
      }
    p5Population.endShape();
    p5Population.pop();

//         p5Population.push();
//     p5Population.beginShape();
//     p5Population.stroke(0,0,0,150);
//     p5Population.strokeWeight(1);
//       for( const [a, v] of Object.entries(avg) ){
//         let x = p5Population.map( a, 0, numOfTicks,border, w );
//         let y = p5Population.map( v["solo"].max, 0, 1, h, border );
//         p5Population.curveVertex( x, y ); 
//       }
//     p5Population.endShape();
//     p5Population.pop();
    
//     p5Population.push();
//     p5Population.beginShape();
//     p5Population.stroke(0,0,0,150);
//     p5Population.strokeWeight(1);
//       for( const [a, v] of Object.entries(avg) ){
//         let x = p5Population.map( a, 0, numOfTicks,border, w );
//         let y = p5Population.map( v["solo"].min, 0, 1, h, border );
//         p5Population.curveVertex( x, y ); 
//       }
//     p5Population.endShape();
//     p5Population.pop();
    
    p5Population.push();
    p5Population.beginShape();
    p5Population.stroke(255,150);
    p5Population.strokeWeight(2);
      for( const [a, v] of Object.entries(avg) ){
        let x = p5Population.map( a, 0, numOfTicks,border, w );
        let y = p5Population.map( v["family"].sum / v["family"].count, 0, 1, h, border );
        p5Population.curveVertex( x, y ); 
      }
    p5Population.endShape();
    p5Population.pop();
    
//     p5Population.push();
//     p5Population.beginShape();
//     p5Population.stroke(255,150);
//     p5Population.strokeWeight(1);
//       for( const [a, v] of Object.entries(avg) ){
//         let x = p5Population.map( a, 0, numOfTicks,border, w );
//         let y = p5Population.map( v["family"].max, 0, 1, h, border );
//         p5Population.curveVertex( x, y ); 
//       }
//     p5Population.endShape();
//     p5Population.pop();
    
//     p5Population.push();
//     p5Population.beginShape();
//     p5Population.stroke(255,150);
//     p5Population.strokeWeight(1);
//       for( const [a, v] of Object.entries(avg) ){
//         let x = p5Population.map( a, 0, numOfTicks,border, w );
//         let y = p5Population.map( v["family"].min, 0, 1, h, border );
//         p5Population.curveVertex( x, y ); 
//       }
//     p5Population.endShape();
//     p5Population.pop();
    
    p5Population.push();
    p5Population.beginShape();
    p5Population.stroke(0,255,0,150);
    p5Population.strokeWeight(2);
      for( const [a, v] of Object.entries(avg) ){
        let x = p5Population.map( a, 0, numOfTicks,border, w );
        let y = p5Population.map( v["informal"].sum / v["informal"].count, 0, 1, h, border );
        p5Population.curveVertex( x, y ); 
      }
    p5Population.endShape();
    p5Population.pop();
    
//     p5Population.push();
//     p5Population.beginShape();
//     p5Population.stroke(0,255,0,150);
//     p5Population.strokeWeight(1);
//       for( const [a, v] of Object.entries(avg) ){
//         let x = p5Population.map( a, 0, numOfTicks,border, w );
//         let y = p5Population.map( v["informal"].max, 0, 1, h, border );
//         p5Population.curveVertex( x, y ); 
//       }
//     p5Population.endShape();
//     p5Population.pop();
    
//     p5Population.push();
//     p5Population.beginShape();
//     p5Population.stroke(0,255,0,150);
//     p5Population.strokeWeight(1);
//       for( const [a, v] of Object.entries(avg) ){
//         let x = p5Population.map( a, 0, numOfTicks,border, w );
//         let y = p5Population.map( v["informal"].min, 0, 1, h, border );
//         p5Population.curveVertex( x, y ); 
//       }
//     p5Population.endShape();
//     p5Population.pop();
    
    p5Population.push();
    p5Population.beginShape();
    p5Population.stroke(255,0,0,150);
    p5Population.strokeWeight(2);
      for( const [a, v] of Object.entries(avg) ){
        let x = p5Population.map( a, 0, numOfTicks,border, w );
        let y = p5Population.map( v["mou"].sum / v["mou"].count, 0, 1, h, border );
        p5Population.curveVertex( x, y ); 
      }
    p5Population.endShape();
    p5Population.pop();
    
//     p5Population.push();
//     p5Population.beginShape();
//     p5Population.stroke(255,0,0,150);
//     p5Population.strokeWeight(1);
//       for( const [a, v] of Object.entries(avg) ){
//         let x = p5Population.map( a, 0, numOfTicks,border, w );
//         let y = p5Population.map( v["mou"].max, 0, 1, h, border );
//         p5Population.curveVertex( x, y ); 
//       }
//     p5Population.endShape();
//     p5Population.pop();
    
//     p5Population.push();
//     p5Population.beginShape();
//     p5Population.stroke(255,0,0,150);
//     p5Population.strokeWeight(1);
//       for( const [a, v] of Object.entries(avg) ){
//         let x = p5Population.map( a, 0, numOfTicks,border, w );
//         let y = p5Population.map( v["mou"].min, 0, 1, h, border );
//         p5Population.curveVertex( x, y ); 
//       }
//     p5Population.endShape();
//     p5Population.pop();
    
    
          
//     p5Population.beginShape();
//     p5Population.stroke(255,0,0,150);
//     p5Population.strokeWeight(3);
//     for( const [t, p] of Object.entries( avg ) ){
//       if(t <= frameCount){
//         let x = p5Population.map( t, 0, numOfTicks,border, w );
//         let y = p5Population.map( p.sum / p.count, 0, 1, h, border );
//         p5Population.curveVertex( x, y );       
//       }
//     }
//     p5Population.endShape();
    
//     p5Population.beginShape();
//     p5Population.stroke(255,0,0,100);
//     p5Population.strokeWeight(1);
//     p5Population.fill(255,0,0,25);
//     for( const [t, p] of Object.entries( avg ) ){
//       if(t <= frameCount && p.max < 1){   
//         let x = p5Population.map( t, 0, numOfTicks,border, w );
//         let y = p5Population.map( p.max, 0, 1, h, border );
//         p5Population.vertex( x, y );  
//       }
//     }
//     let props = Object.keys(avg).reverse();
//     for( let i=0; i<props.length; i++ ){
//       let t = props[i];
//       let p = avg[ props[i] ];
//       if(t <= frameCount && p.min > 0){   
//         let x = p5Population.map( t, 0, numOfTicks,border, w );
//         let y = p5Population.map( p.min, 0, 1, h, border );
//         p5Population.vertex( x, y );  
//       }
//     }
//     p5Population.endShape(p5Population.CLOSE);

    
    p5Population.pop();
  }  
  
  
//   p5Population.drawPrecaritiesTrendlines = function( ms ){
//     p5Population.push();
//     p5Population.stroke(255,50);
//     p5Population.noFill();
//     // loop through each migrant's migrations
//     for( const [k, v] of Object.entries( ms ) ){
//       for( let i=0; i < v.migrations.length; i++){
//         if( v.migrations[i].completed || (v.state == "employed") ){
//           // create points from precarity values
//           p5Population.beginShape();
//           for( const [t, p] of Object.entries( v.migrations[i].history ) ){
//             let x = p5Population.map( t, 0, numOfTicks,border, w );
//             let y = p5Population.map( p.precarity, 0, 1, h, border );
//             p5Population.curveVertex( x, y );  
//           }
//           p5Population.endShape();
//         }
//       }

//     }
//     p5Population.pop();
//   }
  
  
  p5Population.drawPathwaysGraph = function(){
    p5Population.textAlign( p5Population.RIGHT, p5Population.BOTTOM );
    p5Population.text( "Pathways Over Time", w*0.5 + border, border );
    p5Population.textAlign( p5Population.RIGHT, p5Population.TOP );
    p5Population.line( border, h+2, w, h+2 ); // x axis
    p5Population.text( numOfTicks + " ticks", w, h+10 );
    p5Population.line( border, border, border, h ); // y axis
    p5Population.text( numOfMigrations + " ", border, border );
  }


  p5Population.drawPathwaysTrendlines = function( od, ps ){
    for(let i=0; i<ps.length; i++){
      let p = ps[i];
      p5Population.push();
      p5Population.noFill();
      p5Population.strokeWeight( 1 );
      p5Population.stroke( p[1][0], p[1][1], p[1][2] );
      p5Population.beginShape();
      for(const [k, v] of Object.entries( od )){
        if( k <= frameCount){
          let x = p5Population.map( k, 0, numOfTicks,border, w );
          let y = p5Population.map( v.pathways[ p[0] ], 0, numOfMigrations, h, border );
          p5Population.curveVertex( x, y );          
        }else{
          break;
        }
      }
      p5Population.endShape();
      p5Population.pop();
    }
    
    p5Population.push();
    p5Population.stroke(0,100);
    p5Population.line( 
      p5Population.map( frameCount, 0, numOfTicks,border, w ),
      border,
      p5Population.map( frameCount, 0, numOfTicks,border, w ),
      h
    );
    p5Population.pop();
    
  }


  p5Population.drawTickInfo = function( x, t, od, ps ){

    let avg = {};
    for( let i=0; i<numOfTicks; i++ ){
      avg[i] = {
        "solo":{"sum":0,"count":0, "max":0,"min":1},
        "family":{"sum":0,"count":0, "max":0,"min":1},
        "mou":{"sum":0,"count":0, "max":0,"min":1},
        "informal":{"sum":0,"count":0, "max":0,"min":1}
      }
    }
    for( const [k, v] of Object.entries( migrants ) ){
      // migrant
      for( let i=0; i < v.migrations.length; i++){
        // migration
        // if( v.migrations[i].completed || (v.state == "employed") ){
        if(v.migrations[i].pathway != null){
          let t0 = null;
          // get the data
          for( const [t, p] of Object.entries( v.migrations[i].history ) ){
            if( t0 == null ) t0 = t;
            avg[t-t0][v.migrations[i].pathway].count +=1;
            avg[t-t0][v.migrations[i].pathway].sum += p.precarity;            
            if( p.precarity > avg[t-t0][v.migrations[i].pathway].max ) avg[t-t0][v.migrations[i].pathway].max = p.precarity;
            if( p.precarity < avg[t-t0][v.migrations[i].pathway].min ) avg[t-t0][v.migrations[i].pathway].min = p.precarity;
          }
        }
        
      }
    }
    
    let padding = 20;

    p5Population.push();    
    p5Population.translate( 0, h+10 );
    p5Population.fill(0,100);
    p5Population.stroke(0,100);
    p5Population.strokeWeight(1);
    p5Population.line( x, -10, x, -(h+10) + border);
    p5Population.noStroke();
    p5Population.textAlign( p5Population.RIGHT, p5Population.TOP );
    p5Population.text( `${t} / `, w-90, 0 );
    
    if(t < 1824){
      p5Population.textAlign( p5Population.LEFT, p5Population.TOP );
      for( const [k, v] of Object.entries( avg[t] ) ){
        p5Population.translate( 0, padding );
        p5Population.fill(0,100);
        let perc = v.count == 0 ? 0.000 : (v.sum / v.count).toFixed(3);
        p5Population.text( perc + " : " + v.count + " " + k, x+5, 0 );
        if(k == "solo"){
          p5Population.fill( 0 );
        }else if(k =="mou"){
          p5Population.fill( 255,0,0 );
        }else if(k =="family"){
          p5Population.fill( 255 );
        }else if(k =="informal"){
          p5Population.fill( 0,255,0 );
        }else{
          p5Population.fill( 0,0,255 );
        }
        p5Population.rect( x - 15, 2, 15, 15 );
      }
      p5Population.pop();
    }
      
  }
  
}
  