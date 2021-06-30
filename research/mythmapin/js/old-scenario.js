function generateScenarioData( ms, fs, ims, es ){
  let mts  = migrationsStatesTimings( ms );
  let mpt  = migrationsPrecarityTimings( ms );
  
  let fo = {
    "migrantStates" : outputData,
    "migrationStatesTimings" : mts,
    "migrationPrecarities" : mpt,
    "addedAgents": addedAgents
  };

  saveJSON( fo, `scenario-${scenario}-seed-${seed}-${Date.now()}.json` );
}


function migrationsStatesTimings( ms ){
  let migrationsTimings = [];
  
  for( const [m, mig] of Object.entries(ms) ){ 
  	for( let i=0; i<mig.migrations.length; i++ ){
      if( mig.migrations[i].completed || mig.migrations[i].duration.employed > 0 ){
        migrationsTimings.push( { 
          "id"         : mig.id, 
          "pathway"    : mig.migrations[i].pathway, 
          "duration"   : mig.migrations[i].duration,
          "totalCosts" : mig.migrations[i].totalMigrationCosts
        } );
      }
    }
  }
  
  return migrationsTimings;
}


function migrationsPrecarityTimings( ms ){
  let migrationsPrecarities = [];
  
  for( const [m, mig] of Object.entries(ms) ){ 
  	for( let i=0; i<mig.migrations.length; i++ ){
      if( mig.migrations[i].completed || mig.migrations[i].duration.employed > 0 ){
        let mp = mig.migrations[i].history;
        let t0 = null;
        for( const [t, p] of Object.entries( mp ) ){ 
          if( t0 == null ) t0 = t;
          p.r = t - t0;
        }
        migrationsPrecarities.push( { "id" : mig.id, "precarity": mp } );
      }
    }
  }
  
  return migrationsPrecarities;
}
