import { Bar, Pie, mixins} from 'vue-chartjs'

export default {
  extends: Pie,
  mixins: [mixins.reactiveProp],
  props: ['dataGraph'],
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
     
      labels: ['menores de 18','18-25','25-30'],
      
      datasets: [
        {
          label: 'GitHub Commits',
          backgroundColor: ['#f87979', '#812338','#612772'],
          data: [40, 20, 40]
        }
       
      ]
    })
  }
}