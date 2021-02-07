import { ResponseAsset } from "@data/assets/responseasset";
import { TrackedAsset } from "@data/assets/trackedassets/trackedasset";

const width = 400;
const height = 400;

const exporter = require('highcharts-export-server');

exporter.initPool();

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function getChart(assets: {assets: Array<ResponseAsset>, total:number}): Promise<any> {
    const tickers = {};

    for(let i = 0; i < assets.assets.length; i++) {
        let asset = assets.assets[i];

        //tickers[asset.ticker] = asset.

        if(asset.ticker in tickers){
            tickers[asset.ticker] += asset.value;
        } else {
            tickers[asset.ticker] = asset.value;
        }
    };
    
    const data = new Array<any>();

    const keys = Object.keys(tickers);

    for(let i = 0; i < keys.length; ++i) {
        const name = keys[i];

        data.push({name: name, y: Number(tickers[keys[i]].toFixed(2))});
    }

    var exportSettings = {
        type: 'png',
        width: 800,
        options: {
            chart: {
                backgroundColor: '#36393E',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: `n3bs\'s portfolio</br>$${assets.total.toFixed(2)}`,
                style: {
                    color: '#7289DA',
                    fontFamily: '"Segoe UI", Georgia, Serif;',
                    fontSize: '24px'
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b></br>{point.percentage:.1f}%</br>${point.y}',
                        style: {
            			    color: '#FFF',
                            fontFamily: '"Segoe UI", Georgia, Serif;'
         				}
                    }
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: data
            }]
        }
    };

    let image: any = null;

    exporter.export(exportSettings, function (err, res) {
        image = res;
    });

    var iterations = 0;

    while(image == null) {
        if(iterations == 5) {
            break;
        }
        await delay(1000);
    }

    var buf = Buffer.from(image.data, "base64"); 

    return buf;
}
export { getChart };