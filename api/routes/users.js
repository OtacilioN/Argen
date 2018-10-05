var express = require('express');
var router = express.Router();

var firebase = require("firebase");
    var config = {
      apiKey: "AIzaSyBehGbs2KNIzDadkj6WrvipOr3pR5ZQAA4",
        authDomain: "argen-9f8f3.firebaseapp.com",
        databaseURL: "https://argen-9f8f3.firebaseio.com",
        projectId: "argen-9f8f3",
        storageBucket: "argen-9f8f3.appspot.com",
        messagingSenderId: "1055421395236"
    };
    firebase.initializeApp(config);


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//Rota retorna a faixa etaria dos usuarios da Iris.
router.get('/faixaEtaria', function(req, res, next) {
  var db = firebase.firestore();
    var faixaEtaria = [0,0,0,0,0,0,0];
    db.collection('cliente').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
          console.log(doc.data().nome);
        if(doc.data().idade < 18){
            faixaEtaria[0] = faixaEtaria[0] + 1;
        }
        else if(doc.data().idade < 25 && doc.data().idade >= 18){
            faixaEtaria[1] = faixaEtaria[1] + 1;
        }
        else if(doc.data().idade < 35 && doc.data().idade >= 25){
            faixaEtaria[2] = faixaEtaria[2] + 1;
        }
        else if(doc.data().idade < 45 && doc.data().idade >= 35){
            faixaEtaria[3] = faixaEtaria[3] + 1;
        }
        else if(doc.data().idade < 60 && doc.data().idade >= 45){
            faixaEtaria[4] = faixaEtaria[4] + 1;
        }
        else if(doc.data().idade >= 60){
            faixaEtaria[5] = faixaEtaria[5] + 1;
        }
        else{
            faixaEtaria[6] = faixaEtaria[6] + 1;
        }
        
      });
      res.jsonp({ 
          faixaEtaria: faixaEtaria
      });
 
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

});
//Rota retorna as lojas com maior quantidade de notas ficais publicadas na Iris
router.get('/topLojas', function(req, res, next) {
  var db = firebase.firestore();
    var nomeLojasArray = [];
    var rankingLojasNomes=[];
    var rankingLojasQuant=[];
    db.collection('cliente').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
          
           if(doc.data().compras != undefined){
           for(var compra in doc.data().compras){
             console.log(doc.data().compras[compra].name);
             nomeLojasArray.push( doc.data().compras[compra].name);
           }
         }
      });
    
      var i = 0; 
        for(i = 0; i < nomeLojasArray.length; i++){ 
           // console.log('my length'+ nomeLojasArray.length);
           if ( rankingLojasNomes.includes(nomeLojasArray[i])) {
              rankingLojasQuant[rankingLojasNomes.indexOf(nomeLojasArray[i])] += 1;
           }
           else{
             rankingLojasNomes.push(nomeLojasArray[i]);
             rankingLojasQuant.push(1);
           }
          
        }
      
       
      res.jsonp({ 
          rankingLojasNomes: rankingLojasNomes,
          rankingLojasQuant: rankingLojasQuant
      });
 
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

});
//Rota retorna as compras de acordo com o horario do dia.
router.get('/horarioCompras', function(req, res, next) {
  var db = firebase.firestore();
    var horarioDevendas = [];
    var numeroDeVendas = [];
     
    db.collection('cliente').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
          
           if(doc.data().compras != undefined){
           for(var compra in doc.data().compras){
             var manipulando= "";
             manipulando = doc.data().compras[compra].date;
             manipulando = manipulando.slice(11,13);
             console.log('A hora é: ' + manipulando)
             manipulando = parseInt(manipulando,10);
             if(horarioDevendas.includes(manipulando)){
                 
                 numeroDeVendas[horarioDevendas.indexOf(manipulando)] += 1;
             }
             else{
                horarioDevendas.push(manipulando); 
                 numeroDeVendas.push(1);
             }
             
           }
         }
      });
        var resultVendas = [];
        for (var item in horarioDevendas ){
            resultVendas.push({hora: horarioDevendas[item], quantidade: numeroDeVendas[item]})
        }
        
        resultVendas.sort(function(a,b){return a.hora-b.hora });
        console.log(resultVendas);
        
      res.jsonp({ 
          resultadoVendas: resultVendas
      });
 
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

});
//calcula o ticket medio dos usuarios da Iris.
router.get('/gastoMedio', function(req, res, next) {
  var db = firebase.firestore();
  var gastos = [];
  var quantidadeUsuarios = 0;
  var teste = 0;
  // var compraPadrao = {
  //   address : Object,
  //   cnpj: String,
  //   date: String,
  //   name: String,
  //   price: Number,
  //   prod: Object,
  // };
  var teste2 = [];
    db.collection('cliente').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
         var i;
         quantidadeUsuarios = quantidadeUsuarios + 1;
         //console.log(doc.data().compras[0].price);
         if(doc.data().compras != undefined){
           for(var compra in doc.data().compras){
             console.log(doc.data().compras[compra].price);
             teste += doc.data().compras[compra].price;
           }
         }
    
      });
      console.log("final: " + teste);
      res.jsonp({ montante : teste, quantidade : quantidadeUsuarios
      });
 
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

});
//
router.get('/generoBalanco', function(req, res, next) {
    var homens = 0;
    var mulheres = 0;
    var outros = 0;
    var nRespondeu = 0;
    var db = firebase.firestore();
    db.collection('cliente').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        //res.send(doc.id + '=>');
       // res.send(doc.data().gender);
        if( doc.data().genero == "Masculino" || doc.data().genero == "masculino"){
            homens = homens + 1;    
        }
        else if(doc.data().genero == "Feminino" || doc.data().genero == "feminino"){
            mulheres = mulheres + 1;
        }
        else if(doc.data().genero == "Outros" || doc.data().genero == "outros"){
            outros = outros + 1;
        }
        else{
            nRespondeu = nRespondeu + 1; 
        }
      });
      res.jsonp({ masculino : homens,
                feminino : mulheres,
                outros : outros,
                naoRespondido : nRespondeu
      });
 
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

    //res.send(soma);
});


module.exports = router;
