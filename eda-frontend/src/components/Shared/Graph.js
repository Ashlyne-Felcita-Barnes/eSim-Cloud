/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import Chart from 'chart.js'

import 'chartjs-plugin-colorschemes'
let lineGraph

// Chart Style Options
Chart.defaults.global.defaultFontColor = '#e6e6e6'

class Graph extends Component {
  chartRef = React.createRef();

  componentDidMount () {
    this.buildChart()
  }

  componentDidUpdate () {
    this.buildChart()
  }

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext('2d')
    const { x, y, labels, xscale, yscale, precision } = this.props
    const scales = {
      si: { value: 1, ticks: 3 },
      m: { value: 0.001, ticks: 5 },
      u: { value: 0.000001, ticks: 7 },
      n: { value: 0.000000001, ticks: 9 },
      p: { value: 0.000000000001, ticks: 11 }
    }
    if (typeof lineGraph !== 'undefined') lineGraph.destroy()

    const dataset = () => {
      var arr = []
      console.log('xscale', xscale)
      for (var i = 0; i < y.length; i++) {
        if (labels[0] === labels[i + 1]) continue
        arr.push({
          label: labels[i + 1],
          data: y[i].map(e => (e / scales[yscale].value).toFixed(precision)),
          fill: false
          // borderColor: getRandomColor()
        })
      }
      return arr
    }
    const selectLabel = () => {
      if (labels[0] === 'time') {
        if (xscale === 'si') {
          return 'Time in S'
        } else {
          return `Time in ${xscale}S`
        }
      }
      if (labels[0] === 'v-sweep') {
        if (xscale === 'si') {
          return 'Voltage in V'
        } else {
          return `Voltage in ${xscale}V`
        }
      }
    }

    lineGraph = new Chart(myChartRef, {
      type: 'line',
      data: {

        // labels: x,
        labels: x.map(e => (e / scales[xscale].value).toFixed(precision)),
        datasets: dataset()
      },

      options: {
        plugins: {

          colorschemes: {

            scheme: 'brewer.SetOne9'

          }
        },
        responsive: true,
        title: {
          display: false,
          text: ''
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#39604d'
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                color: '#67737e'
              },
              scaleLabel: {
                display: true,
                // labelString: labels[0] === 'time' ? `TIME in ${xscale}s` : (labels[0] === 'v-sweep' ? `VOLTAGE in ${xscale}v` : labels[0])
                labelString: selectLabel()
              },
              // ticks:{
              //   source:'labels',
              //   maxTicksLimit: 10,
              // }
              ticks: {
                // maxTicksLimit: 10
                maxTicksLimit: scales[xscale].ticks
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Volatge ( V )'
              },
              gridLines: {
                color: '#67737e'
              },
              ticks: {
                beginAtZero: true,
                fontSize: 15,
                // maxTicksLimit: 10, //Set Y axes points
                padding: 25
              }
            }
          ]
        }
      }
    })
  };

  render () {
    return (
      <div>
        <canvas id="myChart" ref={this.chartRef} />
      </div>
    )
  }
}

export default Graph
