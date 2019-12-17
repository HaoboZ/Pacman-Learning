import Chart, { ChartData } from 'chart.js';
import Runner from './runner';


export default class Timeline {
	
	runner: Runner;
	
	chart: Chart;
	chartData: ChartData;
	
	constructor( runner: Runner ) {
		this.runner = runner;
		
		this.chartData = {
			labels:   [],
			datasets: [ {
				label:           'min',
				fill:            false,
				backgroundColor: 'red',
				borderColor:     'red',
				data:            []
			}, {
				label:           'avg',
				fill:            false,
				backgroundColor: 'blue',
				borderColor:     'blue',
				data:            []
			}, {
				label:           'max',
				fill:            false,
				backgroundColor: 'green',
				borderColor:     'green',
				data:            []
			} ]
		};
		this.chart = new Chart( 'chart', {
			type:    'line',
			data:    this.chartData,
			options: {
				aspectRatio: 1,
				title:       {
					display: true,
					text:    'NEAT Performance'
				},
				tooltips:    {
					mode:      'index',
					intersect: false
				},
				scales:      {
					xAxes: [ {
						display:    true,
						scaleLabel: {
							display:     true,
							labelString: 'Generation'
						}
					} ],
					yAxes: [ {
						display:    true,
						scaleLabel: {
							display:     true,
							labelString: 'Score'
						}
					} ]
				}
			}
		} );
	}
	
	addPoint( gen, min, avg, max ) {
		this.keepSameSizePush( this.chartData.labels, gen.toString() );
		this.keepSameSizePush( this.chartData.datasets[ 0 ].data, min );
		this.keepSameSizePush( this.chartData.datasets[ 1 ].data, avg );
		this.keepSameSizePush( this.chartData.datasets[ 2 ].data, max );
		this.chart.update();
	}
	
	keepSameSizePush( arr, val, length = 30 ) {
		if ( arr.push( val ) > length ) {
			arr.shift();
		}
	}
	
}
