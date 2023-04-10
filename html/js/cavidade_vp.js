console.log('Cavidade', env.IP, env.USER, env.HOSTNAME);

var novo = '127.0.0.1:8001';
var rpiIP =  novo;
var openValvuleTime = 100;

var start_f_txt = "20Mhz"
var stop_f_txt = "30MHz"
var step_f_txt = "0.1MHz"
var n_itera_txt = "3"
var start_f = "3306000000"
var stop_f = "3891000000"
var step_f = "500000"
var n_itera = "5"
var descarga = 1
var bomba = 1
var valvula_vacu = 1
var file_names = null;
var state = null;
var frist = 0
let Results = setInterval(getPoints,5000);
var Names 


var R = 0
var R_old = 0
var Iteration = 0
var name = ''
var dados_f = [];
var point_in_1 = 0
var total_point_1 = 0
var Pin_Val = [0,0,0,0,0];
let cnt =0 

let updateCount = 0;
let numberElements = 240;
var graph 

function Val_Action(Pin){
	Pin_Val[Pin-1] =1 - Pin_Val[Pin-1]; 
	console.log(Pin_Val)
	JSON = '{"experiment_name": "Arduino_Temp", "experiment_action": {"val_'+Pin.toString()+'":'+ Pin_Val[Pin-1]+'}}'
	//var url = 'http://' + rpiIP + ':8085/gpio/switch?pin=4&status=on&time=' + time;
	var url = 'http://' + rpiIP + '/action_experiment';
	console.log(JSON)
	// $.ajax({
	// 	url: url,      //Your api url
	// 	type: 'POST',   //type is any HTTP method
	// 	contentType: 'application/json;charset=UTF-8',
	// 	data: JSON,
	// 	//Data as js object
	// 	success: function (response) {
	// 	  console.log('PUT Response Pin : ' +  response);
	// 	}
	//   });
}



function Start(){
	// JSON = '{"experiment_name": "Arduino_Temp", "config_experiment": {"R":"5","I":"5"}}'
	// var url = 'http://' + rpiIP + '/start_experiment';
	// frist = 0;
	// cnt = 0;
	// console.log('JSON : ' +  url);
	// console.log('JSON : ' +  JSON);
	// dados_f=[]
	// // dados_f = [];
	
	// // if (R_old !== R)
	// // {
	// // 	Plotly.purge('graph');
	// // 	desenharCSV(R);
	// // 	point_in_1 = 0
	// // 	total_point_1 = 0
	// // }
	// $.ajax({
    //   url: url,      //Your api url
    //   type: 'POST',   //type is any HTTP method
    //   contentType: 'application/json;charset=UTF-8',
	//   data: JSON,
    //   //Data as js object
    //   success: function (response) {
	// 	console.log('PUT Response Pin : ola ' +  response);
    //   }
    // });

	// myStartFunction();
	// getPoints();
	
	
	// R_old =R;
	//recursively_ajax();
}

function Stop(){
	JSON = '{"experiment_name": "Arduino_Temp"}';
	var url = 'http://' + rpiIP + '/stop_experiment';
	dados_f=[]
	$.ajax({
      url: url,      //Your api url
      type: 'POST',   //type is any HTTP method
      contentType: 'application/json;charset=UTF-8',
	  data: JSON,
      //Data as js object
      success: function (response) {
		console.log('PUT Response Pin : ola 2 ' +  response);
		// Plotly.deleteTraces('graph', 0);
		dados_f = [];
      }
    });
}


function getPoints()
{
	var url = 'http://' + rpiIP + '/temperature_list/1';
	var dados = {}
	$.ajax({
      url: url,      //Your api url
      type: 'GET',   //type is any HTTP method
      success: function (response) {
		console.log(response)
		if (response.length  >1)
		{
			console.log("para fazer a list plot")
		}
		else if(response.length  == 1)
		{
			response = response[0]
			// if (frist == 0)
			// {
			// 	Names = Object.keys(response.value);
			// 	//desenharCSV(response.value);
			// 	frist = 1;
			// }
			
			/* console.log('GET Result : ' +  (response.Data));
			console.log(response.status === 'Experiment Ended'); */
			
			/* if (response.Data !== 'undefined')
				*/
			console.log(response);
			console.log(typeof response);
			if (response.status !== 'undefined' && response.status === 'Experiment Ended')
			{
				console.log("estou no End");
				console.log(response.status);
				myStopFunction();
			} 
			else{
				//console.log("Isto é inter")
				if (typeof response.value === 'object')
				{
					// let j = parseInt(response.Data.circ,10);
					/* console.log(j); 
					console.log(typeof response.Data); */
					//Plotly.extendTraces('graph', {x: Array(6).fill([response.value.sample]),y: [[response.value.temp],[response.value.temp_bot],[response.value.temp_in],[response.value.temp_north],[response.value.temp_south],[response.value.temp_top]]}, [0,1,2,3,4,5],240);
					plot_data_charjs(response)
					
				}
				// getPoints()
			}
			//document.getElementById('resultPoint').innerHTML = 'Pressure [mbar]: ' + response.resultPoint;
		}
      }
    });
	
}

function getPoints_old()
{
	var url = 'http://' + rpiIP + '/temperature_list/1';
	var dados = {}
	$.ajax({
      url: url,      //Your api url
      type: 'GET',   //type is any HTTP method
      success: function (response) {
		console.log(response)
		if (response.length  >1)
		{
			console.log("para fazer a list plot")
		}
		else if(response.length  == 1)
		{
			response = response[0]
			if (frist == 0)
			{
				Names = Object.keys(response.value);
				desenharCSV(response.value);
				frist = 1;
			}
			
			/* console.log('GET Result : ' +  (response.Data));
			console.log(response.status === 'Experiment Ended'); */
			
			/* if (response.Data !== 'undefined')
				*/
			console.log(response);
			console.log(typeof response);
			if (response.status !== 'undefined' && response.status === 'Experiment Ended')
			{
				console.log("estou no End");
				console.log(response.status);
				myStopFunction();
			} 
			else{
				//console.log("Isto é inter")
				if (typeof response.value === 'object')
				{
					// let j = parseInt(response.Data.circ,10);
					/* console.log(j); 
					console.log(typeof response.Data); */
					Plotly.extendTraces('graph', {x: Array(6).fill([response.value.sample]),y: [[response.value.temp],[response.value.temp_bot],[response.value.temp_in],[response.value.temp_north],[response.value.temp_south],[response.value.temp_top]]}, [0,1,2,3,4,5],240);
					
					// cnt++;
					// if (cnt >120){
					// 	Plotly.relayout('graph',{
					// 		xaxis: {
					// 			range: [cnt-120,cnt]
					// 		}
					// 	});

					// }
					
					// if (j === 1)
					// {
					// 	point_in_1 = point_in_1+1;
					// 	document.getElementById('point_in').innerHTML = 'Points in : ' + parseInt(point_in_1,10);
					// }
					// total_point_1 = total_point_1 +1
					// document.getElementById('total_point').innerHTML = 'Total points : ' + parseInt(total_point_1,10);
					// document.getElementById('pi').innerHTML = 'PI : ' + (4*parseFloat(point_in_1,10)/parseFloat(total_point_1,10));
					
				}
				// getPoints()
			}
			//document.getElementById('resultPoint').innerHTML = 'Pressure [mbar]: ' + response.resultPoint;
		}
      }
    });
	
}


function plot_data_charjs(data)
{
	if (data){
		console.log("data")
		console.log(data.value)
		graph.data.labels.push(data.value.sample);
		graph.data.datasets[0].data.push(data.value.temp);
	}
	if (updateCount > numberElements){
		graph.data.labels.shift();
		graph.data.datasets[0].data.shift();
	}
	else updateCount++;
	graph.update();
}
ctx = $("#plot_data_time")[0].getContext('2d');
graph = new Chart(ctx, {
	type: 'line',
	labels: [],
	data: {
		datasets: [{
			borderColor: "blue",
			backgroundColor: "blue",
			pointRadius:1,
			showLine:false,
			borderWidth:1,
			data: [ ],
		},],
	},
	options: {
		plugins: {
			legend: {
				display: false,
			}, 
			autocolors: false,
		},
		scales: {
			y: {
				title:{
					display: true, 
					text: 'Temperature [K]',
				}
				//  min: 8.5,
				//max: 9.5,
			},
			x: {
				title:{
					display: true, 
					text: 'Time [HH:MM:SS]',
				},
			},
		},
	}
});
//{'msg_id': '11', 'timestamp': '1626908928778728200', 'status': 'Experiment Ended', 'Data': ''}
function myStopFunction() {
  clearInterval(Results);
  console.log(Results);
}

function myStartFunction() {
  Results = setInterval(getPoints,5000)
  console.log("Valor da função");
  console.log(Results);
}


 var point_x
 var point_y

//  https://plotly.com/javascript/streaming/
function desenharCSV(plotdata) {
	console.log(plotdata)
	var keys = Object.keys(plotdata);
	console.log(keys)
	color = ['#80CAF6','#DF56F1','#FF5733','#2A79DE','#AA2ADE','#32DE2A'];
	var dados_f = [];
	for (let i=1; i < keys.length; i++){
		
		dados_f.push({
					name: keys[i].toString(),
					x: [],
					y: [],
					mode: 'lines+markers',
					marker: {
					color: color[i-1],
					size: 3,
					},
					line: {
					color: color[i-1],
					width: 1,
					},
					// type: 'scatter',
				});

	}
	var layout = {
		// xaxis: {
		// 	type: 'date'
		//   },
		title: 'Temp\'s',
		width: 1600,
		height: 700,	
		xaxis:{
			title:{
				text:'Time',
			},
			titlefont:{
				size:20,
			},
			autorange: true,
		},
		yaxis:{
			title:{
				text:'Temperature [ºC]',
			},
			titlefont:{
				size:20,
			},
			autorange: true,
		}
		// yaxis: {range: [24, 30]},	
	};
	// console.log(dados_f);
	Plotly.newPlot('graph', dados_f, layout);
}