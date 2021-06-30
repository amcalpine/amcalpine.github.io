function generateScenarioData( ms, fs, ims, es ){
  let fo = {
    "ticks" : outputData,
    "migrations" : migrationsMetrics( ms ),
  };

  saveJSON( fo, `scenario-${scenario}-seed-${seed}-${Date.now()}.json` );
}



function migrationsMetrics( ms ){
  let migrationsData = [];
  
  for( const [m, mig] of Object.entries(ms) ){ 
  	for( let i=0; i<mig.migrations.length; i++ ){
      if( mig.migrations[i].completed || mig.migrations[i].duration.employed > 0 ){
        let mp = mig.migrations[i].history;
        let t0 = null;
        for( const [t, p] of Object.entries( mp ) ){ 
          if( t0 == null ) t0 = t;
          p.r = t - t0;
        }  
        migrationsData.push( { 
          "id"         : mig.id, 
          "init"       : mig.migrations[i].init,
          "pathway"    : mig.migrations[i].pathway, 
          "totalCosts" : mig.migrations[i].totalMigrationCosts,
          "duration"   : mig.migrations[i].duration,
          "precarity"  : mp
        } );
      }
    }
  }
  
  return migrationsData;
}
