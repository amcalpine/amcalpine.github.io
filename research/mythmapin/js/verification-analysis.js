//------
function generateDataSubModel1( ms, fs, ims, es ){
	let ffs    = familyFinancialShock( fs );
	let pmwc   = percentMigrantsWealthConstraint( ms );
	let pmmc   = percentMigrantsMotivationConstraint( ms );
	let mms    = migrantsMotivation( ms );	
	let mws    = migrantsWealth( ms );
	let pfwp   = percentFamiliesWithState( "planning", fs, ms );
	let pmwoao = percentMigrationsWithoutAcceptedOffer( ms );
    let tp     = pathwayTotals( ms );   
	let sm1 = {
		"familyFinancialShock" : ffs,
		"percentMigrantsWealthConstraint" : pmwc,
		"percentMigrantsMotivationConstraint": pmmc,
		"migrantsMotivation" : mms,
		"migrantsWealth" : mws,
		"percentFamiliesWithPlanningMember" : pfwp,
		"percentMigrationsWithoutAcceptedOfer": pmwoao,
        "pathwayTotals": tp
	}

  saveJSON( sm1, `sm1-${Date.now()}.json` );
 }


//------
function generateDataSubModel2( ms, fs, ims, es ){
	let pmwmdb = percentMigrationsWithMDB( ms, ims );
	let pmwp   = percentMigrationsWithPassport( ms );
	let pmwwm  = percentMigrationsWithWorkPermit( ms );
	let pmwc   = percentMigrantsWealthConstraint( ms );
	let pmmc   = percentMigrantsMotivationConstraint( ms );
	let pmic   = percentMigrantsInfluenceConstraint( ms );
	let mms    = migrantsMotivation( ms );	
	let mws    = migrantsWealth( ms );
	let pfwp   = percentFamiliesWithState( "transit", fs, ms );
	let pmwoep = percentMigrationsWithoutEmployerPlan( ms );
	let pmwoao = percentMigrationsWithoutAcceptedOffer( ms );
    let tp     = pathwayTotals( ms );   
	let sm2 = {
		"percentMigrationsWithMDB": pmwmdb,
		"percentMigrationsWithPassport": pmwp,
		"percentMigrationsWithWorkPermit": pmwwm,
		"percentMigrantsWealthConstraint": pmwc,
		"percentMigrantsMotivationConstraint": pmmc,
		"percentMigrantsInfluenceConstraint": pmic,
		"migrantsMotivation": mms,
		"migrantsWealth": mws,
		"percentFamiliesWithTransitMember": pfwp,
		"percentMigrationsWithoutEmployerPlan": pmwoep,
		"percentMigrationsWithoutAcceptedOffer": pmwoao,
        "pathwayTotals": tp
	}

  saveJSON( sm2, `sm2-${Date.now()}.json` );
}


//------
function generateDataSubModel3( ms, fs, ims, es ){
	let pmwstp = percentMigrationsWithSelfTransportPlan( ms );
	let pmwubc = percentMigrationsWithUnofficialBorderCrossing( ms );
	let pmwc   = percentMigrantsWealthConstraint( ms );
	let pmmc   = percentMigrantsMotivationConstraint( ms );
	let pmic   = percentMigrantsInfluenceConstraint( ms );
	let mms    = migrantsMotivation( ms );	
	let mws    = migrantsWealth( ms );
	let pfwp   = percentFamiliesWithState( "employed", fs, ms );
	let pmwoao = percentMigrationsWithoutAcceptedOffer( ms );
    let tp     = pathwayTotals( ms );   
	let sm3 = {
		"percentMigrationsWithSelfTransportPlan": pmwstp,
		"percentMigrationsWithUnofficialBorderCrossing": pmwubc,
		"percentMigrantsWealthConstraint": pmwc,
		"percentMigrantsMotivationConstraint": pmmc,
		"percentMigrantsInfluenceConstraint": pmic,
		"migrantsMotivation": mms,	
		"migrantsWealth": mws,
		"percentFamiliesWithEmployedMember": pfwp,
		"percentMigrationsWithoutAcceptedOffer": pmwoao,
        "pathwayTotals": tp
	};
  
  saveJSON( sm3, `sm3-${Date.now()}.json` );
}


//------
function generateDataSubModel4( ms, fs, ims, es ){
	let pmwtpe = percentMigrationsWithTwoPlusEmployers( ms );
	let pmwtdb = percentMigrationsWithTDB( ms, ims );
	let pmld   = percentMigrationsLostDocumentation ( ms );
	let pmwc   = percentMigrantsWealthConstraint( ms );
	let pmmc   = percentMigrantsMotivationConstraint( ms );
	let pmic   = percentMigrantsInfluenceConstraint( ms );
	let mms    = migrantsMotivation( ms );	
	let mws    = migrantsWealth( ms );
	let pemsm  = percentEmployedMigrantsSixMonths( ms );
	let pmwoao = percentMigrationsWithoutAcceptedOffer( ms );
    let tp     = pathwayTotals( ms );   
	let sm4 = {
		"percentMigrationsWithTwoPlusEmployers": pmwtpe,
		"percentMigrationsWithTDB": pmwtdb,
		"percentMigrationsLostDocumentation": pmld,
		"percentMigrantsWealthConstraint": pmwc,
		"percentMigrantsMotivationConstraint": pmmc,
		"percentMigrantsInfluenceConstraint": pmic,
		"migrantsMotivation": mms,
		"migrantsWealth": mws,
		"percentEmployedMigrantsSixMonths": pemsm,
		"percentMigrationsWithoutAcceptedOffer": pmwoao,
        "pathwayTotals": tp
	};

  saveJSON( sm4, `sm4-${Date.now()}.json` );
}


//------
function pathwayTotals( ms ){
  let p = {
    "solo":0,
    "family":0,
    "mou":0,
    "informal":0,
    "null":0
  };
  for( const [m, mig] of Object.entries(ms) ){ 
    for( let i=0; i<mig.migrations.length; i++ ){
      p[ mig.migrations[i].pathway ] += 1;
    }
  }
  return p;
}


//------
function familyFinancialShock( fs ){
  let p = { "low":null, "high":null, "avg":0, "oneplus":0 };
  for( const [f, fam] of Object.entries(fs) ){ 
		if( fam.financialShocks > 0 ) p.oneplus +=1;
		if( p.low == null && p.high == null ){
			p.low  = fam.financialShocks;
			p.high = fam.financialShocks;
		}else{
			if( fam.financialShocks < p.low )  p.low  = fam.financialShocks;
			if( fam.financialShocks > p.high ) p.high = fam.financialShocks;
		}
		p.avg += fam.financialShocks;
	}
	p.avg /= 1000;
	p.oneplus /= 1000;
	return p;
}


//------
function percentMigrantsWealthConstraint( ms ){
	// % of migrants that execute 1+ low wealth constraint
	// % of migrants that execute 1+ high wealth constraint
	let p = {"low":0,"high":0};
  for( const [m, mig] of Object.entries(ms) ){ 
  	let low = 0;
  	let high = 0;
  	for( const [t, hist] of Object.entries(mig.history) ){ 
  		if( hist.constraints.wealth.low  ) low += 1;
  		if( hist.constraints.wealth.high ) high += 1;
  	}
  	if( low > 0  ) p.low  +=1;
  	if( high > 0 ) p.high +=1;
  }
	p.low /= 1000;
	p.high /= 1000;
	return p;
}

//------
function percentMigrantsInfluenceConstraint( ms ){
	// % of migrants that execute 1+ low influence constraint
	// % of migrants that execute 1+ high influence constraint
	let p = {"low":0,"high":0};
  for( const [m, mig] of Object.entries(ms) ){ 
  	let low = 0;
  	let high = 0;
  	for( const [t, hist] of Object.entries(mig.history) ){ 
  		if( hist.constraints.influence.low  ) low += 1;
  		if( hist.constraints.influence.high ) high += 1;
  	}
    if( low > 0  ) p.low  +=1;
  	if( high > 0 ) p.high +=1;
  }
	p.low /= 1000;
	p.high /= 1000;
	return p;
}


//------
function percentMigrantsMotivationConstraint( ms ){
	// % of migrants that execute 1+ low motivation constraint
	// % of migrants that execute 1+ high motivation constraint
	let p = {"low":0,"high":0};
  for( const [m, mig] of Object.entries(ms) ){ 
  	let low = 0;
  	let high = 0;
  	for( const [t, hist] of Object.entries(mig.history) ){ 
  		if( hist.constraints.motivation.low  ) low += 1
  		if( hist.constraints.motivation.high ) high += 1
  	}
    if( low > 0  ) p.low  +=1;
  	if( high > 0 ) p.high +=1;
  }
	p.low /= 1000;
	p.high /= 1000;
	return p;
}


// -----
function migrantsWealth( ms ){
  // population low / high /avg for the run
  let p = {"low":null,"high":null,"avg":0};
  for( const [m, mig] of Object.entries(ms) ){ 
  	// individual low / high /avg for the run
  	let m = {"low":null,"high":null,"avg":0};
  	for( const [t, hist] of Object.entries(mig.history) ){ 
			if( m.low == null && m.high == null ){
				m.low  = hist.w;
				m.high = hist.w;
			}else{
				if( hist.w < m.low ) m.low   = hist.w;
				if( hist.w > m.high ) m.high = hist.w;
			}
			m.avg += hist.w;
		}
		m.avg /= ticks;

		if( p.low == null && p.high == null ){
			p.low  = m.low;
			p.high = m.high;
		}else{
			if( m.low < p.low   ) p.low = m.low;
			if( m.high > p.high ) p.high = m.high;
		}
		p.avg += m.avg
	}
	p.avg /= 1000;

	return p;
}


// -----
function migrantsMotivation( ms ){
  // population low / high /avg for the run
  let p = {"low":null,"high":null,"avg":0};
  for( const [m, mig] of Object.entries(ms) ){ 
  	// individual low / high /avg for the run
  	let m = {"low":null,"high":null,"avg":0};
  	for( const [t, hist] of Object.entries(mig.history) ){ 
			if( m.low == null && m.high == null ){
				m.low  = hist.m;
				m.high = hist.m;
			}else{
				if( hist.m < m.low ) m.low   = hist.m;
				if( hist.m > m.high ) m.high = hist.m;
			}
			m.avg += hist.m;
		}
		m.avg /= ticks;

		if( p.low == null && p.high == null ){
			p.low  = m.low;
			p.high = m.high;
		}else{
			if( m.low < p.low   ) p.low = m.low;
			if( m.high > p.high ) p.high = m.high;
		}
		p.avg += m.avg
	}
	p.avg /= 1000;

	return p;
}


// -----
function percentFamiliesWithState( s, fs, ms ){
  let familiesCount = Object.keys( fs ).length;
  let familiesWithStateCount = 0;
  for( const [f, fam] of Object.entries(fs) ){ 
  	for( let i=0; i<fam.members.length; i++ ){
  		if( ms[ fam.members[i] ].state == s ){
  			familiesWithStateCount++;
  			break;
  		}
  	}
	}

	return familiesWithStateCount / familiesCount;
}


// review because there are a higher portion of migrations
// without offers than expected
// -----
function percentMigrationsWithoutAcceptedOffer( ms ){
  let totalMigrations = 0;
  let totalMigrationsWithoutAcceptedOffer = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		if( mig.migrations[i].migrationNetwork == mig.id ){
  			totalMigrationsWithoutAcceptedOffer += 1;
  		}
  	}
	}

	return totalMigrationsWithoutAcceptedOffer / totalMigrations;
}


// -----
function percentMigrationsWithMDB( ms, ims ){
  let totalMigrations = 0;
  let totalMigrationsWithMDB = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		if( mig.migrations[i].migrationNetwork.filter( mnm => mnm[0] == "i" && ims[ mnm.substring(1) ].constructor.name == "MyanmarDocumentBroker").length >0 ){
  			totalMigrationsWithMDB += 1;
  		}
  	}
	}

	return totalMigrationsWithMDB / totalMigrations;
}


// -----
function percentMigrationsWithPassport( ms ){
  let totalMigrations = 0;
  let totalMigrationsWithPassport = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		if( mig.migrations[i].documentation.filter( d => d.type == "passport" ).length > 0 ){
  			totalMigrationsWithPassport += 1;
  		}
  	}
	}

	return totalMigrationsWithPassport / totalMigrations;
}


// -----
function percentMigrationsWithWorkPermit( ms ){
  let totalMigrations = 0;
  let totalMigrationsWithWorkPermit = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		if( mig.migrations[i].documentation.filter( d => d.type == "work permit" ).length > 0 ){
  			totalMigrationsWithWorkPermit += 1;
  		}
  	}
	}

	return totalMigrationsWithWorkPermit / totalMigrations;
}


// -----
function percentMigrationsWithoutEmployerPlan( ms ){
  let totalMigrations = 0;
  let totalMigrationsWithoutEmployerPlan = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		if( mig.migrations[i].plan.employer == null ){
  			totalMigrationsWithoutEmployerPlan += 1;
  		}
  	}
	}

	return totalMigrationsWithoutEmployerPlan / totalMigrations;
}


// -----
function percentMigrationsWithSelfTransportPlan( ms ){
  let totalMigrations = 0;
  let totalMigrationsWithSelfTransportPlan = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		if( mig.migrations[i].plan.transport == mig.id ){
  			totalMigrationsWithSelfTransportPlan += 1;
  		}
  	}
	}

	return totalMigrationsWithSelfTransportPlan / totalMigrations;
}


// -----
function percentMigrationsWithUnofficialBorderCrossing( ms ){
  let totalMigrations = 0;
  let totalMigrationsWithUnofficialBorderCrossing = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		if( 
  			mig.migrations[i].plan.borderCrossing == "unofficial1" ||  
  			mig.migrations[i].plan.borderCrossing == "unofficial2"
  		){
  			totalMigrationsWithUnofficialBorderCrossing += 1;
  		}
  	}
	}

	return totalMigrationsWithUnofficialBorderCrossing / totalMigrations;
}


// -----
function percentMigrationsWithTwoPlusEmployers( ms ){
  let totalMigrations = 0;
  let totalMigrationsWithTwoPlusEmployers = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		if( mig.migrations[i].migrationNetwork.filter( mnm => mnm[0] == "e").length > 1 ){
  			totalMigrationsWithTwoPlusEmployers += 1;
  		}
  	}
	}

	return totalMigrationsWithTwoPlusEmployers / totalMigrations;
}


// -----
function percentMigrationsWithTDB( ms, ims ){
  let totalMigrations = 0;
  let totalMigrationsWithTDB = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		if( mig.migrations[i].migrationNetwork.filter( mnm => mnm[0] == "i" && ims[ mnm.substring(1) ].constructor.name == "ThailandDocumentBroker").length >0 ){
  			totalMigrationsWithTDB += 1;
  		}
  	}
	}

	return totalMigrationsWithTDB / totalMigrations;
}


// employed migrants that return before/after 180 ticks
function percentEmployedMigrantsSixMonths( ms ){
	let p = { "before":0, "after":0, "at":0 };
	let totalMigrations = 0;
  let totalMigrationsReturnBefore = 0;
  let totalMigrationsReturnAfter = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		
  		if( mig.migrations[i].duration.employed > 0 && mig.migrations[i].duration.employed < 180 ){
  			totalMigrationsReturnBefore += 1;
  		}
  		if( mig.migrations[i].duration.employed > 180 ){
  			totalMigrationsReturnAfter += 1;
  		}
  	}
	}
	p.before = totalMigrationsReturnBefore / totalMigrations;
	p.after  = totalMigrationsReturnAfter / totalMigrations;
	p.at  = 1 - p.before - p.after;
	return p;
}


function percentMigrationsLostDocumentation( ms ){
  let totalMigrations = 0;
  let totalMigrationsLostDocumentation = 0;
  for( const [m, mig] of Object.entries(ms) ){
  	totalMigrations += mig.migrations.length;
  	for( let i=0; i<mig.migrations.length; i++ ){
  		if( mig.migrations[i].lostDocumentation ){
  			totalMigrationsLostDocumentation += 1;
  		}
  	}
	}

	return totalMigrationsLostDocumentation / totalMigrations;
}
