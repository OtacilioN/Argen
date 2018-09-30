<template>
  <v-app dark>
    <v-toolbar
      app
    
    >
      <img  style=" width:145px; margin: 0 auto" src="./assets/logo_iris_sem_ass.png"/>
      <!--   -->
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container justify-center  fluid grid-list-{xs through xl}>
        <v-layout column>
          <v-flex sm-1 wrap justify-center>
            <v-layout row style="background-color:#2B2825" align-center justify-center fill-height>
              <v-flex m-1 sm-6 m-0 p-0 >
                <v-card-title  m-0 p-0 v-if="chegouGastoMedio" class="ma-0  pa-0 headline justify-center"> <v-icon size="110px"  justify-center align-center class="justify-center" >people</v-icon></v-card-title>
                  <v-card-title m-0 p-0 v-if="chegouGastoMedio" class="pa-0 ma-0 headline justify-center" >{{quantidadePessoas}}</v-card-title>
                <v-card-title m-0 p-0 v-if="chegouGastoMedio" class="pa-0 pb-2 headline justify-center" >Quantidade de usuários</v-card-title>
              </v-flex>
              <v-flex sm-6 m-1 p-0 >
                <v-card-title  m-0 p-0 v-if="chegouGastoMedio" class="ma-0  pa-0 headline justify-center"> <v-icon size="100px"  justify-center align-center class="justify-center" >fas fa-dollar-sign</v-icon></v-card-title>
                  <v-card-title m-0 p-0 v-if="chegouGastoMedio" class="pa-0 headline justify-center" >R$: {{gastoMedio.toFixed(2)}}</v-card-title>
                <v-card-title m-0 p-0 v-if="chegouGastoMedio" class="pa-0 pb-2 headline justify-center" >Ticket médio</v-card-title>
              </v-flex>
             
             
            </v-layout>
          </v-flex>
          <v-flex justify-center  sm-3 wrap>
            <v-layout row justify-center>
              <v-flex sm-12 m-6 justify-center style="">
                <v-card-title class="headline">Gênero</v-card-title>
                <div v-if="hey">
              <GeneroPie style="height:30vh; width:30vw" v-bind:data="generoDatas"  />
              </div>
              </v-flex>
              <v-flex sm-6 m-6 justify-center style="">
              <v-card-title class="headline">Faixa Etária</v-card-title>
                <div v-if="chegouFaixaEtaria">
              <FaixaEtariaPie style="height:30vh; width:30vw"  v-bind:data="faixaEtaria"  />
              </div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex sm-3 wrap>
            <v-layout row justify-center class="">
              <v-flex sm-6 style="margin-top:40vh; ">
              <v-card-title class="headline">Top Lojas</v-card-title>
              <topLojasPie  style="height:30vh; width:30vw" v-if="chegouTopLojas" v-bind:data="toplojasQuant" v-bind:labels="toplojasNomes"/>
              </v-flex>
              <v-flex sm-6 style="margin-top:40vh; ">
              <v-card-title class="headline">Compras por horário</v-card-title>
              <horarioBar  style="height:10vh; width:30vw" v-if="chegouResultadoVendas" v-bind:objdata="resultadoVendas" />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
     <span style="margin: auto"> 2018 Hackathon Shopping Recife</span>
    </v-footer>
  </v-app>
</template>

<script>
const axios = require('axios');

import GeneroPie from './components/generoPie'
import FaixaEtariaPie from './components/faixaEtariaPie'
import topLojasPie from './components/topLojas'
import horarioBar from './components/horarioBar'
import { setInterval } from 'timers';
export default {
  name: 'App',
  components: {
    GeneroPie,
    FaixaEtariaPie,
    topLojasPie,
    horarioBar
  
  },
    
  created(){
    var vm = this;
     axios.get('https://argenapi-otacilioneto.c9users.io:8080/users/horarioCompras'
  ) 
  .then(function (response){
    console.log(response.data);
     
        vm.resultadoVendas =  response.data.resultadoVendas;
        console.log(vm.resultadoVendas);
        vm.chegouResultadoVendas = true;
  })
  .catch(function (error) {
  
    console.log(error);
  
  })
  .then(function () {
    
  });
    axios.get('https://argenapi-otacilioneto.c9users.io:8080/users/generoBalanco'
  ) 
  .then(function (response){
    console.log(response.data);
     
        vm.generoDatas.push(response.data.masculino);
    vm.generoDatas.push(response.data.feminino);
    vm.generoDatas.push(response.data.outros);
    vm.generoDatas.push(response.data.naoRespondido);
    console.log(vm.generoDatas);
    vm.hey = true;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
    console.log('dsasda');
  })
  .then(function () {
    // always executed
  });
   axios.get('https://argenapi-otacilioneto.c9users.io:8080/users/gastoMedio'
  ) 
  .then(function (response){
    console.log(response.data);
  
        vm.quantidadePessoas = response.data.quantidade;
    vm.montante = response.data.montante;
    vm.chegouGastoMedio = true;
    //console.log(vm.generoDatas);
   // vm.hey = true;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
     axios.get('https://argenapi-otacilioneto.c9users.io:8080/users/topLojas'
  ) 
  .then(function (response){
    console.log(response.data);
  
    vm.toplojasNomes= response.data.rankingLojasNomes;
    vm.toplojasQuant = response.data.rankingLojasQuant;
    vm.chegouTopLojas = true;
    //console.log(vm.generoDatas);
   // vm.hey = true;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });


    axios.get('https://argenapi-otacilioneto.c9users.io:8080/users/faixaEtaria'
  ) 
  .then(function (response){
    console.log(response.data);
  
        vm.faixaEtaria =response.data.faixaEtaria;
  
    vm.chegouFaixaEtaria = true;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
    console.log('dsasda');
  })
  .then(function () {
    // always executed
  });

  },
  data(){ 
    return{
      hey: false,
      chegouFaixaEtaria: false,
      quantidadePessoas: 0,
      montante: 0,
      fixed: true,
      generoDatas:[],//{masculino: 0, feminino: 0, outros: 0, naoRespondido: 0},
      faixaEtaria:[],
      title: 'Dashboard',
      chegouGastoMedio: false,
      chegouTopLojas: false,
      toplojasNomes: [],
      toplojasQuant: [],
      chegouResultadoVendas: false,
      resultadoVendas: [],
  
    }
  },
  computed:{
    gastoMedio(){
      return this.montante/this.quantidadePessoas;
    },
    
   
  },
  methods:{
    requestTeste(){
      var vm = this;
     axios.get('https://argenapi-otacilioneto.c9users.io:8080/users/horarioCompras'
  ) 
  .then(function (response){
    console.log(response.data);
     
        vm.resultadoVendas =  response.data.resultadoVendas;
        console.log(vm.resultadoVendas);
        vm.chegouResultadoVendas = true;
  })
  .catch(function (error) {
  
    console.log(error);
  
  })
  .then(function () {
    
  });
    axios.get('https://argenapi-otacilioneto.c9users.io:8080/users/generoBalanco'
  ) 
  .then(function (response){
    console.log(response.data);
    //  vm.generoDatas.masculino =  response.data.masculino;
    //  vm.generoDatas.feminino =  response.data.feminino;
    //  vm.generoDatas.outros=  response.data.outros;
    // vm.generoDatas.naoRespondido =  response.data.naoRespondido;  
        vm.generoDatas.push(response.data.masculino);
    vm.generoDatas.push(response.data.feminino);
    vm.generoDatas.push(response.data.outros);
    vm.generoDatas.push(response.data.naoRespondido);
    console.log(vm.generoDatas);
    vm.hey = true;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
    console.log('dsasda');
  })
  .then(function () {
    // always executed
  });
   axios.get('https://argenapi-otacilioneto.c9users.io:8080/users/gastoMedio'
  ) 
  .then(function (response){
    console.log(response.data);
  
        vm.quantidadePessoas = response.data.quantidade;
    vm.montante = response.data.montante;
    vm.chegouGastoMedio = true;
    //console.log(vm.generoDatas);
   // vm.hey = true;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
     axios.get('https://argenapi-otacilioneto.c9users.io:8080/users/topLojas'
  ) 
  .then(function (response){
    console.log(response.data);
  
    vm.toplojasNomes= response.data.rankingLojasNomes;
    vm.toplojasQuant = response.data.rankingLojasQuant;
    vm.chegouTopLojas = true;
    //console.log(vm.generoDatas);
   // vm.hey = true;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });


    axios.get('https://argenapi-otacilioneto.c9users.io:8080/users/faixaEtaria'
  ) 
  .then(function (response){
    console.log(response.data);
  
        vm.faixaEtaria =response.data.faixaEtaria;
  
    vm.chegouFaixaEtaria = true;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
    console.log('dsasda');
  })
  .then(function () {
    // always executed
  });
    }
    
  },
}
</script>

<style scoped>
  .graphs{
    height: 200px;
  }
</style>