<template>
  <v-app dark>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-{xs through xl}>
        <v-layout row  >
          <v-flex sm-2 style="">
            <v-card-title class="headline">Faixa Etária</v-card-title>
           <Pie />
          </v-flex>
          <v-flex sm-2>
           <Pie />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
     <!-- <span style="margin: auto">&copy; 2018 Hackathon Shopping Recife</span>-->
    </v-footer>
  </v-app>
</template>

<script>
import firebase from "firebase"
var config = {
  apiKey: "AIzaSyBehGbs2KNIzDadkj6WrvipOr3pR5ZQAA4",
  authDomain: "argen-9f8f3.firebaseapp.com",
  databaseURL: "https://argen-9f8f3.firebaseio.com",
  storageBucket: "argen-9f8f3.appspot.com",
  messagingSenderId: "1055421395236",
  projectId: "argen-9f8f3"
};
firebase.initializeApp(config);
var db = firebase.firestore();

 db.collection('cliente').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

import HelloWorld from './components/HelloWorld'
import Pie from './components/CommitChart'
export default {
  name: 'App',
  components: {
    HelloWorld,
    Pie
  
  },
  data () {
    return {
      clipped: false,
     
      fixed: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      title: 'Argen'
    }
  },
  methods:{
    chamarTest: function(){
     
    },
    
  }
  
}
</script>

<style scoped>
  .graphs{
    height: 200px;
  }
</style>