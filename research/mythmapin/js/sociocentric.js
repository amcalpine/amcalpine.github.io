let g;

var svg = d3.select("svg")
  //.attr("width", window.innerWidth)
  //.attr("height", window.innerHeight);


var zoomLayer = svg.append("g");
var links = zoomLayer.append("g").attr("class", "links");
var nodes = zoomLayer.append("g").attr("class", "nodes");

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody().strength(-5000).distanceMax(2450).distanceMin(10))
  .force("center", d3.forceCenter(+svg.attr("width")*0.5, +svg.attr("height")*0.5));

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.4).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

var zoomed = function() {
  zoomLayer.attr("transform", d3.event.transform);
}

svg.call(d3.zoom()
    .scaleExtent([1/12, 30])
    .on("zoom", zoomed));


function networked(graph){

  g = graph;

  console.log(`links: ${g.links.length} Agents: ${g.nodes.length}  Migrants: ${g.nodes.filter(n => n.t == "Migrant").length} Recruiters: ${g.nodes.filter(n => n.t == "Recruiter").length} Facilitators: ${g.nodes.filter(n => n.t == "Facilitator").length} Smugglers: ${g.nodes.filter(n => n.t == "Smuggler").length} MDB: ${g.nodes.filter(n => n.t == "MyanmarDocumentBroker").length} TDB: ${g.nodes.filter(n => n.t == "ThailandDocumentBroker").length} Employers: ${g.nodes.filter(n => n.t == "Employer").length}`)
  
  var link = links
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("data-source", function(d){ return d.source })
    .attr("data-target", function(d){ return d.target })
    .attr("stroke-width", 5)
    .attr("stroke", function(d) { 
      let c = "gray"
      let st = d.source[0] == "m";
      let dt = d.target[0]
      if( st && dt == "m" ) c = "green";
      if( st && dt == "e" ) c = "blue";
      if( st && dt == "i" ){
        const nt = g.nodes.filter(n => n.id == d.target)[0].t;
        if(nt == "MyanmarDocumentBroker"){
          c = "#3f4d84";
        }else if(nt == "Recruiter"){
          c = "#8c4e95";
        }else if(nt == "Smuggler"){
          c = "#d34b84";
        }else if(nt == "Facilitator"){
          c = "#fe5f58";
        }else if(nt == "ThailandDocumentBroker"){
          c = "#ff920d";
        } 
      }
      return c; 
    })



  var node = nodes
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")
    // .merge(nodes)
    .attr("data-agent-type", function(d){ return d.t })
    .call(d3.drag()
    .on("start", dragstarted)
    .on("drag",  dragged)
    .on("end",   dragended))
    
  var employer = node.filter(function(d){ return d.id[0] != "m"; })
    .append("circle")
    .attr("fill","white")
    .attr("stroke", function(d) { 
      let c = "#36454f";
      if(d.t == "MyanmarDocumentBroker") c = "#3f4d84";
      if(d.t == "Recruiter") c = "#8c4e95";
      if(d.t == "Smuggler") c = "#d34b84";
      if(d.t == "Facilitator") c = "#fe5f58";
      if(d.t == "ThailandDocumentBroker") c = "#ff920d";
      if(d.t == "Employer") c = "blue"; 
      return c; 
    })
    .attr("stroke-width",6)
    // .attr("stroke-opacity",0.6)
    .attr("r",function(d){
      return 40 + d.ms*2;
    })


  var circles = node.append("circle")
    .attr("r", function(d) { 
      var size = d.t == "Migrant" ? 35 + d.ms*2 : 35;
      return size; 
    })
    .attr("fill", function(d) { 
      let c = "#36454f";
      if(d.t == "MyanmarDocumentBroker") c = "#3f4d84";
      if(d.t == "Recruiter") c = "#8c4e95";
      if(d.t == "Smuggler") c = "#d34b84";
      if(d.t == "Facilitator") c = "#fe5f58";
      if(d.t == "ThailandDocumentBroker") c = "#ff920d";
      if(d.t == "Employer") c = "blue";
      return c; 
    })
    .attr("stroke","white")
    .attr("stroke-width",3)



  var lables = node.append("text")
    .text(function(d){ return d.id; })
    .attr('y', 7)
    .attr('x', 0)
    .style("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "23")


  node.append("title").text(function(d) { return d.id; });

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link").links(graph.links);

  function ticked() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    node
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
  }

}
