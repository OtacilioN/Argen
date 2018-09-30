import { Bar, Pie, mixins} from 'vue-chartjs'

// export default {
//   extends: Pie,
//   //mixins: [mixins.reactiveProp],
//   props: {chartData:{
//                 masculino: Number,
//                 feminino: Number,
//                 outros: Number,
//                 naoRespondido: Number,
//             }
//         },
//   mounted () {
//     // Overwriting base render method with actual data.
//     this.renderChart({
     
//       labels: ['masculino','feminino','outros','não respondido'],
      
//       datasets: [
//         {
//           label: 'GitHub Commits',
//           backgroundColor: ['#f87979', '#812338','#612772', '#fff'],
//           data: [this.props.chartData.masculino    , this.props.chartData.feminino, this.props.chartData.outros, this.props.chartData.naoRespondido]
//         }
       
//       ]
//     })
//   }
// }
// LineChart.js
//import {Pie } from 'vue-chartjs'
const { reactiveProp } = mixins;
export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: {data: Array},
  mounted () {
      console.log("achei");
    this.renderChart({
        labels: ['Masculino', 'Feminino', 'Outros','Não Respondido'],
        datasets: [
          {
            // label: 'GitHub Commits',
            backgroundColor: ['#97191D','#E5321D','#579C86', '#F07D35'],
            data: this.data
          }
        ]
      }, this.options)
  }
}