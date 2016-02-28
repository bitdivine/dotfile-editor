( function(){

	// From bluecoin: curl(url).then((res)=>{ console.log(res); })
	function curl(u){return new Promise(function(resolve,reject){var x=new XMLHttpRequest();if(!XMLHttpRequest)return reject();var self=this;x.validateOnParse=false;x.onreadystatechange=function(){if(x.readyState!==4)return;if((x.status!==200)&&(x.status!==304))reject("Bad status("+x.status+") for: "+u);resolve(x);};x.onerror=function(e){console.error("rejecting",u,e);reject(e);};x.open('GET',u,true);x.send(null);});}
function protoUrl(url){return(/^https?:/.test(url)?'':window.location.protocol)+url;}
function spike(url){console.log("spike:",url);new Image().src=protoUrl(url);}

	function keyvals(dict, cb){return Object.keys(dict).map(function(k){return cb(k,dict[k]);});}

	function drawGraph(){
		console.log("Loaded");
		// Parse the DOT syntax into a graphlib object.
		var graph_json = graphlibDot.read( document.getElementById('graphText').value);
		//console.log("Parsed:", graph_json, JSON.stringify(graph_json,null,2));
graph_json 

		try {
			var render = new dagreD3.render();
			render(d3.select("svg g"), graph_json);
		} catch(e){ console.error("Render:", e, e.stack); }


		// Optional - resize the SVG element based on the contents.
		var svg = document.querySelector('#graphContainer');
		var bbox = svg.getBBox();
		svg.style.width = bbox.width + 40.0 + "px";
		svg.style.height = bbox.height + 40.0 + "px";
	}

	function urlBoxChange(){
		var url = document.getElementById('graphUrl').value;
		document.location.hash = url;
		document.getElementById('graphText').value = '';
		loadHashUrl();
	}
	function urlHashChange(){
		var url = document.location.hash.substr(1);
		document.getElementById('graphUrl').value = url;
		document.getElementById('graphText').value = '';
		loadHashUrl();
	}

	function loadHashUrl(){
		var url = document.location.hash.substr(1);
		if (url) curl (url).then((res)=>{
			console.log("Loaded URL:", url);
			document.getElementById('graphUrl').value = url;
			try {
				var json = JSON.parse(res.responseText);
				var graph = dagreD3.graphlib.json.read(json);
				var dot = graphlibDot.write(graph);
				document.getElementById('graphText').value = dot;
			} catch (e){
				// Presume dot file:
				document.getElementById('graphText').value = res.responseText;
			}
			drawGraph();
		});
	}

	function onLoad(){
		document.getElementById('graphText').addEventListener('input', drawGraph);
		document.getElementById('graphUrl').addEventListener('change', urlBoxChange);
		urlHashChange();
	}


	window.onload = onLoad;

})();
