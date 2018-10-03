import { Bar, Pie, mixins} from 'vue-chartjs'
export default {
    extends: Pie,
    props: {data: Array},
    
    mounted () {
        console.log("achei");
      this.renderChart({
          labels: ['Menos de 18 anos', '18 até 24', '25 até 34','35 até 44','45 até 59','de 60 pra cima','não respondido'],
          datasets: [
            {
              // label: 'GitHub Commits',
              backgroundColor: ['#F9E343','#F1843C','#F2B132', '#EA563C','#A1C181', '#F29822', '#8F9EA5' ],
              data: this.data
            }
          ]
        }, this.options)
    }
  }