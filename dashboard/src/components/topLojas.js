import { Bar, Pie, mixins} from 'vue-chartjs'
export default {
    extends: Pie,
    props: {data: Array, labels: Array},
    mounted () {
        console.log("achei");
      this.renderChart({
          labels: this.labels,
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