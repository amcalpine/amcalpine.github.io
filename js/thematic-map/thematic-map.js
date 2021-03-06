console.log("hello");
var svg = d3.select("svg#thematic-map")
  width = +svg.attr("width"),
  height = +svg.attr("height");

var zoomLayer = svg.append("g");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody().strength(-500).distanceMax(350).distanceMin(10))
  .force("center", d3.forceCenter(width*0.5, height*0.5));

d3.json("./json/pinboard_export-2020_04_30.json", function(error, graph) {
  if (error) throw error;

  // create graph.links and graph.nodes
  graph.links = [];
  graph.nodes = [];
  //graph.nodes.push({"id":"tag","nodeType":"tag","group":10,"href":"","description":"","extended":"","meta":"","hash":"","time":"","shared":"no","toread":"no","tags":""});
  for(var i = 0; i < graph.length; i++){
    // this node
    graph[i].id = graph[i].meta;
    graph[i].nodeType = "pin";
    graph[i].group = 20;
    graph.nodes.push(graph[i]);
    
    // this node's tags
    var tags = graph[i].tags.split(" ");
    for(var j = 0; j < tags.length; j++){
      var newTag = true;
      if(tags[j] != ""){
        for(var k = 0; k < graph.nodes.length; k++){
          if(graph.nodes[k].id == tags[j]){ 
            newTag = false;
            break;
          }
        }
        if(newTag)graph.nodes.push({"id":tags[j],"nodeType":"tag","group":1,"href":"","description":"","extended":"","meta":"","hash":"","time":"","shared":"no","toread":"no","tags":""});
        graph.links.push({"source":graph[i].id, "target":tags[j], "value": 1});
        //graph.links.push({"source":"tag", "target":tags[j], "value": 1});
      }
    }

    // for a pin, link each of its tags together
    for(var j = 0; j < tags.length; j++){
      for(var k = j+1; k < tags.length; k++){
        graph.links.push({"source":tags[j], "target":tags[k], "value": 0});
      }
    }
        
  }

  // ---------------------------------
  // LOGGING
  var numOfTags =0;
  for(var i = 0; i < graph.nodes.length; i++){
    if(graph.nodes[i].nodeType == "tag")numOfTags++;
  }
  console.table("number of nodes: " + graph.nodes.length);
  console.table("number of pin nodes: " + (graph.nodes.length-numOfTags));
  console.table("number of tag nodes: " + numOfTags);
  console.table("number of links: " + graph.links.length);
  // ---------------------------------
  
  var link = zoomLayer.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = zoomLayer.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")
    
  var circles = node.append("circle")
    .attr("r", function(d) { 
      var size = d.nodeType == "tag" ? 7:5;
      return size; 
    })
    .attr("fill", function(d) { return color(d.group); })
    .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  var lables = node.append("text")
    .text(function(d) {
      text = d.nodeType == "tag" ? d.id : ""; 
      //text = d.nodeType == "tag" ? d.id : d.description;
      //text =  d.id;
      return text;
    })
    .attr('x', 6)
    .attr('y', 3);

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

});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
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
    .scaleExtent([1/2, 12])
    .on("zoom", zoomed));

