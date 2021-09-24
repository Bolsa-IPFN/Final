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
let Results = 0//setInterval(getPoints,50)
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


function Val_Action(Pin){
	Pin_Val[Pin-1] =1 - Pin_Val[Pin-1]; 
	console.log(Pin_Val)
	JSON = '{"experiment_name": "Arduino_Temp", "experiment_action": {"val_'+Pin.toString()+'":'+ Pin_Val[Pin-1]+'}}'
	//var url = 'http://' + rpiIP + ':8085/gpio/switch?pin=4&status=on&time=' + time;
	var url = 'http://' + rpiIP + '/action_experiment';
	console.log(JSON)
	$.ajax({
		url: url,      //Your api url
		type: 'POST',   //type is any HTTP method
		contentType: 'application/json;charset=UTF-8',
		data: JSON,
		//Data as js object
		success: function (response) {
		  console.log('PUT Response Pin : ' +  response);
		}
	  });
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

	myStartFunction();
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
			if (frist == 0)
			{
				Names = Object.keys(response.value);
				desenharCSV(Names);
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
					Plotly.extendTraces('graph', {x: Array(6).fill([response.value.sample]),y: [[response.value.temp],[response.value.temp_bot],[response.value.temp_in],[response.value.temp_north],[response.value.temp_south],[response.value.temp_top]]}, [0,1,2,3,4,5]);
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
function desenharCSV(names) {
	console.log(names)
	var trace1 = {
		x: [],
		y: [],
		// xaxis: 'x1',
		// yaxis: 'y1',
		mode: 'lines',
		line: {
		  color: '#80CAF6',
		  shape: 'spline'
		},
		name: names[1]
	  };
	  
	  var trace2 = {
		x: [],
		y: [],
		
		// xaxis: 'x2',
		// yaxis: 'y2',
		mode: 'lines',
		line: {color: '#DF56F1'},
		name: names[2]
	  };
	  
	  var trace3 = {
		x: [],
		y: [],
		// xaxis: 'x3',
		// yaxis: 'y3',
		mode: 'lines',
		line: {color: '#FF5733'},
		name: names[3]
	  };
	  
	  var trace4 = {
		x: [],
		y: [],
		// xaxis: 'x4',
		// yaxis: 'y4',
		mode: 'lines',
		line: {color: '#2A79DE'},
		name: names[4]
	  };

	  var trace5 = {
		x: [],
		y: [],
		// xaxis: 'x5',
		// yaxis: 'y5',
		mode: 'lines',
		line: {color: '#AA2ADE'},
		name: names[5]
	  };
	  
	  var trace6 = {
		x: [],
		y: [],
		// xaxis: 'x6',
		// yaxis: 'y6',
		mode: 'lines',
		line: {color: '#32DE2A'},
		name: names[6]
	  };
	var dados_f = [trace1,trace2,trace3,trace4,trace5,trace6];
	var layout = {
		// xaxis: {
		// 	type: 'date'
		//   },
		title: 'Temp\'s',
		width: 1600,
		height: 700,	
		// yaxis: {range: [24, 30]},	
	};
	// console.log(dados_f);
	Plotly.newPlot('graph', dados_f, layout);
}


//Plotly.extendTraces('graph', {x: [[results.Data.eX]],y: [[results.Data.eY]]}, [results.Data.in]);
/* 
function putGPIO(Pin) {
    time = $("#time").val();
	if (Pin == 5){
        	descarga= 1-descarga;
		time = descarga
	}
        if (Pin == 12){
                bomba= 1-bomba;
                time = bomba
        }
        if (Pin == 13){
                time = $("#time_vacuo").val();
        }
	//var url = 'http://' + rpiIP + ':8085/gpio/switch?pin=4&status=on&time=' + time;
	var url = 'http://' + rpiIP + '/elab/gpio/switch?pin='+Pin+'&status=on&time=' + time;
    console.log('Button pressed time : ' +  time);
	$.ajax({
      url: url,      //Your api url
      type: 'PUT',   //type is any HTTP method
      data: {
        data: time
      },      //Data as js object
      success: function (response) {
		console.log('PUT Response Pin : ' +  response.pin);
		console.log('PUT Response Pin : ' +  response.result);
      }
    });
}

function getPressure() {
	var url = 'http://' + rpiIP + '/elab/pressure';
	$.ajax({
      url: url,      //Your api url
      type: 'GET',   //type is any HTTP method
      data: {
        data: null
      },      //Data as js object
      success: function (response) {
		//console.log('GET Response Result : ' +  response.result);
		document.getElementById('pressure').innerHTML = 'Pressure [mbar]: ' + response.pressure;
      }
    });
}

function getCsv() {
	var url = 'http://' + rpiIP + '/elab/arinst/list';
	$.ajax({
      url: url,      //Your api url
      type: 'GET',   //type is any HTTP method
      data: {
        data: null
      },      //Data as js object
      success: function (response) {
		console.log(response);
		//document.getElementById('filenames').innerHTML = 'Files : ' + response;
		//file_names = response;
		generateButtonsFiles (response);
      }
	  
    });
}




function putArinst() {
	//if ($("#start_f").val() != null){
		start_f = $("#start_f").val();
	//}
	//if ($("#stop_f").val() != null){
		stop_f = $("#stop_f").val();
	//}
	//if ($("#step_f").val() != null){
		step_f = $("#step_f").val();
    //}
	//if ($("#n_itera").val() != null){
		n_itera = $("#n_itera").val();
	//}
	///elab/arinst?port=COM9&start=3386000000&stop=3891000000&step=500000
	//var url_1= 'http://192.168.1.81/comm/arinst?start=3386000000&stop=3891000000&step=500000';
	var url = 'http://' + rpiIP + '/elab/arinst?start=' + start_f + '&stop=' + stop_f + '&step=' + step_f+ '&n_itera=' +n_itera;
    console.log('Button pressed start_f cavidade : ' + url);
    console.log('Button value n_itera : ' + n_itera);
	$.ajax({
      url: url,      //Your api url
      type: 'GET',   //type is any HTTP method
      data: {
        data: null
      },      //Data as js object
      success: function (response) {
		console.log('PME: ');
        	console.log('PUT Response Pin : ' + response); // aqui Problema TODO
		var keys = Object.keys(response[0]);
		console.log('Keys : ' + keys + '  ' + keys.length );
		var dados_0 = response.map(data => data[keys[0]]);
		console.log('PUT Response Pin :____ ' + dados_0[2] );
		desenharCSV(response);
		state = {
  		 'querySet': response,

                 'page': 1,
                 'rows': 200,
                 'window': 5,
                }
		buildTable();
      }
    });
}



 
                //the array
function generateButtonsFiles (listBrand) {
	//var listBrand = fileNames
	console.log('ww: '+listBrand);
    for (var i = 0; i < listBrand.length; i++) {
        var btn = document.createElement("button");
        btn.setAttribute("type", "file");
        btn.setAttribute("id", listBrand[i]); 
        var url = 'http://' + rpiIP + '/elab/arinst/csv/'+ listBrand[i];
        btn.setAttribute("onclick", 'getFileCSV(\''+listBrand[i]+'\')');
        var t = document.createTextNode(listBrand[i]);
        btn.appendChild(t);
        btn.onclick = function(){
        window.location.href = url;
        return false;
        };
        document.body.appendChild(btn);
		}
}
function getFileCSV(fileName){
    var url = 'http://' + rpiIP + '/elab/arinst/csv/'+ fileName;
    console.log('Button pressed start_f cavidade : ' + url);
    window.location.href = url;
	$.ajax({
      url: url,      //Your api url
      type: 'GET',   //type is any HTTP method
      data: {
        data: null
      },      //Data as js object
      success: function (response) {
        console.log('PUT Response Pin : ' +  response);
        
      }
    });
}


var amps;

let fre = [];
let amp = [];
let amp2 = [];


function parseData1() {
	var uploa = '/home/pi/Cavidade/elab/webcomm/uploads/';
	var res = uploa.concat(file_names[0]);
	let data_f =[];
	let helper = null;
	Papa.parse(file_names[0], {
		
		download: true,
		complete: function(results) {
			//console.log(results.data);
			for (let i=1; i < results.data.length-1; i++){
				
				//console.log(results.data[i][1]);
				helper =results.data[i][1].replace(/,/g, '.');
				//console.log(helper);
				
				//fre.push(parseFloat(results.data[i][0]));
					//console.log(results.data[i][1]);
				amp.push(helper);
					//console.log(amp);
								
				data_f.push(results.data[i]);
			}
			
		}
		
		
		
	});
			
	
}


function parseData2() {
	var uploa = '/home/pi/Cavidade/elab/webcomm/uploads/';
	var res = uploa.concat(file_names[0]);
	let data_f =[];
	let helper = null;
	Papa.parse(file_names[1], {
		
		download: true,
		complete: function(results) {
			//console.log(results.data);
			for (let i=1; i < results.data.length-1; i++){
				
				//console.log(results.data[i][1]);
				helper =results.data[i][1].replace(/,/g, '.');
				//console.log(helper);
				
				//fre.push(parseFloat(results.data[i][0]));
					//console.log(results.data[i][1]);
				amp2.push(helper);
					//console.log(amp);
								
				data_f.push(results.data[i]);
			}
			
		}
		
		
		
	});
			
	
}


			
			
			//console.log(fre);
function drawGraph() {	
			console.log(amp2);
			var ctx = document.getElementById('graph_1');
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: fre,
					datasets: [{
						label: 'Data 1',
						data: amp,
						backgroundColor:'rgb(0,200,0)',
						borderColor:'rgb(0,200,0)',
					},{
						label: 'Data 2',
						data: amp2,
						backgroundColor:'rgb(0,100,0)',
						borderColor:'rgb(0,100,0)',
					}]
				},
				options: {
					scales: {
						y: {
							suggestedMin: -120,
							suggestedMax: -90
						}
					}
				}
			});
			
		
}








function buildTable_antiga(response){
			var table = document.getElementById('myTable');
			var keys = Object.keys(response[0]);
			var key_n = [];
			key_n.push(keys[keys.length-1]);
			key_n = key_n.concat(keys.splice(0,keys.length-1));
			console.log(key_n);
			var pacrow = '<tr  class="bg-info" style="white-space: pre-line;">';
			Object(key_n).forEach((key_n) => {
				pacrow += '<th>'+key_n+'</th>';
			});
			pacrow+='</tr>';
			table.innerHTML += pacrow;
			
			pacrow = '<tr>';
			Object(response).forEach((row) => {
					pacrow = '<tr>';
					Object.values(key_n).forEach((key) => {
						pacrow+='<td>'+row[key]+'</td>';
					});
					pacrow+='</tr>';
					//console.log(pacrow);
					table.innerHTML += pacrow;
			});
				
			
			
			pacrow = '<tr>';
			Object(response).forEach((row) => {
					pacrow = '<tr>';
					Object.values(row).forEach((cell) => {
						pacrow+='<td>'+cell+'</td>';
					});
					pacrow+='</tr>';
					//console.log(pacrow);
					table.innerHTML += pacrow;
			});
			
		
}


function pagination(querySet, page, rows) {

  var trimStart = (page - 1) * rows;
  var trimEnd = trimStart + rows;

  var trimmedData = querySet.slice(trimStart, trimEnd);

  var pages = Math.round(querySet.length / rows);

  return {
    'querySet': trimmedData,
    'pages': pages,
  }
}


function pageButtons(pages) {
  var wrapper = document.getElementById('pagination-wrapper');

  wrapper.innerHTML = ``;
  console.log('Pages:', pages);

  var maxLeft = (state.page - Math.floor(state.window / 2));
  var maxRight = (state.page + Math.floor(state.window / 2));

  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = state.window;
  }

  if (maxRight > pages) {
    maxLeft = pages - (state.window - 1);

    if (maxLeft < 1) {
      maxLeft = 1;
    }
    maxRight = pages;
  }



  for (var page = maxLeft; page <= maxRight; page++) {
    wrapper.innerHTML += `<button value=${page} class="page btn btn-lg btn-info">${page}</button>`
  }

  if (state.page != 1) {
    wrapper.innerHTML = `<button value=${1} class="page btn btn-lg btn-info">&#171; First</button>` + wrapper.innerHTML
  }

  if (state.page != pages) {
    wrapper.innerHTML += `<button value=${pages} class="page btn btn-lg btn-info">Last &#187;</button>`
  }

  $('.page').on('click', function() {
    $('#myTable').empty();

    state.page = Number($(this).val());

    buildTable();
  });

}

function buildStateTable(state){
  return state
}

function buildTable() {
  var table = $('#myTable');

  var data = pagination(state.querySet, state.page, state.rows);
  var myList = data.querySet;

  var keys = Object.keys(myList[0]);
  var key_n = [];
  key_n.push(keys[keys.length-1]);
  key_n = key_n.concat(keys.splice(0,keys.length-1));
  console.log(key_n);
  var pacrow = '<tr  class="bg-info" style="white-space: pre-line;">';
  Object(key_n).forEach((key_n) => {
      pacrow += '<th>'+key_n+'</th>';
      });
  pacrow+='</tr>';
  table.append(pacrow);

   pacrow = '<tr>';
   Object(myList).forEach((row) => {
     pacrow = '<tr>';
     Object.values(key_n).forEach((key) => {
       pacrow+='<td>'+row[key]+'</td>';
     });
     pacrow+='</tr>';
     //console.log(pacrow);
     table.append(pacrow);
   });


  pageButtons(data.pages);
}
 */








/* function desenharCSV(results) {
			var keys = Object.keys(results[0]);
			var dados_f = [];
			for (let i=0; i < keys.length-1; i++){
				color = "#" + ((1<<24)*Math.random() | 0).toString(16)
				dados_f.push({label: 'Dados',
					      data: results.map(data => ""+data[keys[i]]+""),
					      backgroundColor:color,
				              borderColor:color,});

			}
			//console.log(dados_f);

			console.log(results.map(data => data[keys[0]]));
			console.log(results.map(data => data[keys[keys.length-1]]));
			var ctx = document.getElementById('graph_1').getContext('2d');
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: results.map(data =>  ""+data[keys[keys.length-1]]+""), 
					datasets: dados_f,
				},
				options: {
					responsive: true,
					scales: {
						x: {
						  display: true,
						  title: {
							display: true,
							text: 'Frequencia [Hz]'
						  }
						},
						y: {
						  display: true,
						  title: {
							display: true,
							text: 'Amplitude [dB]'
						  }
						}
					},
					plugins:{
						legend:{
							position: 'right',
							align: 'top',
						},
						//TODO: Zoom co o rato ou mesmo mudar para ploty.plot
					},
					elements:{
                        point:{
                            radius: 1
                        },
                        line:{
                            borderWidth: 1
                        }
                        
                    }
				}
				
			});
	
}
 */

			
			









/* function parseData() {
	var uploa = '/home/pi/Cavidade/elab/webcomm/uploads/';
	var res = uploa.concat(file_names[0]);
	let fre = [];
	let amp = [];
	let data_f =[];
	let helper = null;
	Papa.parse(file_names[0], {
		download: true,
		complete: function(results) {
			console.log(results.data);
			for (let i=1; i < results.data.length-1; i++){
				fre.push(parseFloat(results.data[i][0]));
				//console.log(results.data[i][1]);
				helper =results.data[i][1].replace(/,/g, '.');
				//console.log(helper);
				amp.push(helper);
				
				data_f.push(results.data[i]);
			}
			
			
			//console.log(fre);
			//console.log(amp);	
			
			var ctx = document.getElementById('graph_1');
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: fre,
					datasets: [{
						label: 'Data 1',
						data: amp,
						backgroundColor:'rgb(0,200,0)',
						borderColor:'rgb(0,200,0)',
					}]
				},
				options: {
					scales: {
						y: {
							suggestedMin: -120,
							suggestedMax: -90
						}
					}
				}
			});
			
		}
	});
} */



/* var ctx = document.getElementById('graph');
var myChart = new Chart(ctx, {
	type: 'line',
	data: {
	  labels: [65, 59, 80, 81, 56, 55, 40],
	  datasets: [{
		label: 'My First Dataset',
		data: [65, 59, 80, 81, 56, 55, 40],
		fill: false,
		borderColor: 'rgb(75, 192, 192)',
	  }]
	}
});
 */


/* 
$(document).ready(function(){
  //$("start_f").val(start_f_txt);
  //$("stop_f").val(stop_f_txt);
  //$("step_f").val(step_f_txt);
  //$("n_itera").val(n_itera_txt);

	function startReadPresssure(times) {
	  let numberSelected = 0;
	  for (let i = 0; i < times; i++) {
		console.log('Number selected' + numberSelected);
		numberSelected++;
		document.getElementById('pressure').innerHTML = 'Pressure : ' + numberSelected;
	  }
	}

	function stopReadPresssure() {
	  clearInterval(myVar);
	}

  
}); */
