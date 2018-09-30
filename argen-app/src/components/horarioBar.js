import { Bar, Pie, mixins} from 'vue-chartjs'
const { reactiveProp } = mixins;
export default {
    extends: Bar,
    mixins: [reactiveProp],
    props: {objdata: Array},
    
    mounted () {
        var resultado1 = [];
        var resultado2 = [];
        for (var item in this.objdata){
            resultado1.push(this.objdata[item].hora);
            resultado2.push(this.objdata[item].quantidade);
        }
        console.log(resultado1 +'   '+ resultado2);
      this.renderChart({
          labels: resultado1,
          datasets: [
            {
              label: 'Compras',
              backgroundColor: '#F9E343',
              data:  resultado2
            }
          ]
        }, this.options)
    }
  }