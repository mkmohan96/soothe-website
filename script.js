// var SERVER_ADDRESS = 'http://127.0.0.1:5501';
var SERVER_ADDRESS = 'http://52.91.255.41:5501';
// var SERVER_ADDRESS = 'http://54.191.33.102:5501';

window.onload = function () {
    var dps = [
        // { x: new Date(2012, 0, 1, 11, 45), y: 12.0 },
        // { x: new Date(2012, 0, 1, 11, 46), y: 12.8 },
        // { x: new Date(2012, 0, 1, 11, 47), y: 11.9 },
        // { x: new Date(2012, 0, 1, 11, 48), y: 10.5 },
        // { x: new Date(2012, 0, 1, 11, 49), y: 9.0 },
        // { x: new Date(2012, 0, 1, 11, 50), y: 8.3 },
    ];
    
    var chart = new CanvasJS.Chart(
        "chartContainer",
        {

            title:{
                text: "Anxiety over time"
            },

            axisX:{ 
                title: "Time"
            },
            
            axisY:{ 
                title: "Anxiety Level",
                minimum: 5,
                maximum: 13      
            },
            
            data: [
                {
                    type: "line",
                    axisX:{
                    },
                    dataPoints: dps
                }
            ]
        });

    function updateLineChart() {
        $.get(SERVER_ADDRESS + '/getLatestAverages')
            .done(function(data) {
                var times = data['times'];
                var values = data['values'];
                
                for(var i=0; i<times.length; i++) {
                    var date = new Date(times[i]);
                    var value = values[i];
                    dps[i] = {x: date, y: value};
                }

                chart.render()
            });

        setTimeout(updateLineChart, 5000);
    }

    chart.render();
    updateLineChart();

    var rtPoint = [ { x: 10, y: 20.0, label: "Tension", color: "Black"} ];

    var rtChart = new CanvasJS.Chart(
        "biofeedbackContainer",
        {
            title:{
                text: "Real-time Anxiety Level"
            },

            axisY:{ 
                // title: "Anxiety Level",
                minimum: 5,
                maximum: 13      
            },

            data: [

                {
                    dataPoints: rtPoint
                }
            ]
        });

    rtChart.render();

    var typeColors = {
        0: 'Green',
        1: 'Yellow',
        2: 'Red',
        3: 'Black'
    };
    
    function updateRTChart() {
        $.get(SERVER_ADDRESS + '/getLatestSM')
            .done(function(data) {
                var tdiff = data['timediff'];
                var value = data['value'];
                var type = data['tag'];

                if(tdiff > 2000) {
                    value = null;
                }

                // console.log(value);
                
                rtPoint[0]['y'] = value;
                rtPoint[0]['color'] = typeColors[type];
                
                rtChart.render();

            });

        setTimeout(updateRTChart, 500);
    }

    updateRTChart();
};
