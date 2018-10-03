/******External API's*****/
var express = require('express');
//Firebase
var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyBehGbs2KNIzDadkj6WrvipOr3pR5ZQAA4",
  authDomain: "argen-9f8f3.firebaseapp.com",
  databaseURL: "https://argen-9f8f3.firebaseio.com",
  projectId: "argen-9f8f3",
  storageBucket: "argen-9f8f3.appspot.com",
  messagingSenderId: "1055421395236"
};
var points = {}
firebase.initializeApp(config);
//Firestore
const admin = require('firebase-admin');
var serviceAccount = require('argen_key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();
  const settings = {timestampsInSnapshots: true};
  admin.firestore().settings(settings);
//Dialogflow
var fs = require('fs');
var app = express();
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
//QR Codes
let cheerio = require('cheerio');
let request = require('request');
var QrCode = require('qrcode-reader');
var Jimp = require("jimp");


//Initialize Express
app.use(express.bodyParser());
app.get('/', function(req, res){
    console.log('GET /')
    var html = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

//Comunicates with the Dialogflow platform through POST requests
app.post('/webhook', function(request, response){
    console.log("REQUESTED");
      const agent = new WebhookClient({ request, response });
      const parameter = request.body.queryResult.parameters;//paramaters sent by the DialogFlow intents
      
          console.log(agent.request_.body);

      function welcome(agent) {
      }
     
        //Fallback is called when a message is not identified or when an image is sent
      function fallback(agent) {
        const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments //URL of the image sent in the chat
        
        //If there is an image of a receipt, process it's QR Code Data and save it to the Database
        if (imageUrl != undefined){
            let imageUrlFinal = imageUrl[0].payload.url;
            console.log("Image URL: " + imageUrlFinal);
            let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
            processImage(imageUrlFinal, id)
            var sug = new Suggestion({
                title:"Recebi sua foto, vamos analisar e lhe dar seus RecPoints!",
                reply:"Voltar ao Menu"
            });
            sug.addReply_('Meus RecPoints')
            agent.add(sug);
          }
          
          else{
            console.log("undefined");
          }
      }
    
        //Called to get the name of the client
      function getName(agent) {
        let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
        console.log(id);
        var docRef = db.collection('cliente').doc(id);
        docRef.set({
          'nome': parameter.username,
          'compras': []
        });
        points[id] = 0;
      }
      
        //Called to get and save the age if the client
      function getAge(agent) {
        console.log("get age");
        let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
        console.log(id);
        var docRef = db.collection('cliente').doc(id);
        docRef.update({
          'idade': parameter.age
        });
      }
      
        //Called to get and save the gender of the client
      function getGender(agent) {
        console.log("get gender");
        let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
        console.log(id);
        var docRef = db.collection('cliente').doc(id);
        docRef.update({
          'genero': parameter.gender
        });
      }
      
      //Called to get the amount of RecPoints a client has, offering qvailable promotions according to the ammount of RecPoints the person has
      function getRecPoints(agent){
        console.log("get recPoints");
        console.log(points);
        let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
        if (points[id] > 0){
            agent.add("Você possui: "+ points[id]) + " RecPontos";
            
            var sugst = new Suggestion({
                title:"Você já consegue adquirir as seguintes promoções:",
                reply:"Voltar para o Menu"
            });
            if(points[id] >= 620){
                sugst.addReply_("Kit Cerveja | 620")
            }
            if(points[id] >= 500){
                sugst.addReply_("Sorteio Gol | 500")
            }
            agent.add(sugst)
        }
        else{
            var sugst = new Suggestion({
                title:"Você ainda não possui RecPoints",
                reply:"Voltar ao Menu"
            });
            agent.add(sugst)
            console.log("doesnt have");
        }
      }
      
      //Functions to buy promotions
      function getGol(agent){
          let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
          points[id] -= 500;
      }
      function getCerveja(agent){
          let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
          points[id] -= 620;
      }
      
      
      //Intent Map for the chatbot
      let intentMap = new Map();
      intentMap.set('Default Welcome Intent', welcome);
      intentMap.set('Default Fallback Intent', fallback);
      intentMap.set('Gives Name', getName);
      intentMap.set('Gives Age', getAge);
      intentMap.set('GivesGender', getGender);
      intentMap.set('Consultar RecPoints', getRecPoints);
      intentMap.set('Sorteio Gol | 500', getGol);
      intentMap.set('Kit Cerveja | 620', getCerveja);
      agent.handleRequest(intentMap);
});

//QR CODE PROCESSING TO RETRIEVE ALL RECEIPT DATA
 function processImage(url, id){
    Jimp.read(url, function(err, image) {
        if (err) {
            console.error(err);
            console.log("error img");
            return true;
        }
    
        var qr = new QrCode();
        qr.callback = function(err, value) {
            if (err) {
                console.error(err);
                console.log("error qr");
            } 
            else {
                console.log(value.result);
                var url = value.result;
                console.log("process receipt");
                //Check if Link is for development page and turn it into a standard link
                if(url.indexOf("p=") >= 0){
                    console.log("FOUND STRANGE!");
                    url = url.split("|")[0];
                    console.log("Split: " + url);
                    url = url.replace("p=", "chNFe=");
                    console.log("Final: " + url);
                }
                    
                var html;
                request(url, function (error, response, body) {
                html = body;

                let doc = cheerio.load(html);
                // NFe not available
                console.log(doc.html)
                if (doc('xNome').text() === "") {
                        
                } else {
                        var prodName = [];
                        var prod = {};
                        doc('xProd').each(function (i, element) {
                            prodName[i] = doc(this).text().replace(/\.|#|\[|\]|\/|&|\*|%/g, " ")
                            prod[prodName[i]] = {
                                qtd: 0
                            };
                        });
                        doc('cProd').each(function (i, element) {
                            (prod[prodName[i]])["code"] = doc(this).text();
                        });
                        doc('uCom').each(function (i, element) {
                            (prod[prodName[i]])["un"] = doc(this).text();
                        });
                        doc('qCom').each(function (i, element) {
                            (prod[prodName[i]])["qtd"] += parseFloat(doc(this).text());
                        });
                        doc('vUnCom').each(function (i, element) {
                            (prod[prodName[i]])["priceUnit"] = parseFloat(doc(this).text());
                        });

                        var price = helper.listPrice(prod);

                        var address = {
                            street: doc('xLgr').text(),
                            num: doc('nro').text(),
                            neighborhood: doc('xBairro').text(),
                            city: doc('xMun').text(),
                            uf: doc('UF').text(),
                            cep: doc('CEP').text(),
                            country: doc('xPais').text(),
                        };

                        var metadata = {
                            name: doc('xNome').text(),
                            cnpj: doc('CNPJ').text(),
                            address: address,
                            price: helper.roundNum(price),
                            prod: prod,
                            date: doc('dhRecbto').text()
                        };

                        console.log(metadata)

                        var userListData = {
                            cnpj: metadata.cnpj,
                            name: metadata.name,
                            prod: metadata.prod,
                            address: metadata.address,
                            date: metadata.date,
                            price: metadata.price,
                        };

                        points[id] += parseInt(price)*200;

                        var docRef = db.collection('cliente').doc(id);
                        
                        db.runTransaction(transaction => {
                          return transaction.get(docRef).then(snapshot => {
                            const largerArray = snapshot.get('compras');
                            largerArray.push(userListData);
                            transaction.update(docRef, 'compras', largerArray);
                          });
                        });
                    }
              });
          }
      };
      qr.decode(image.bitmap);
  });
}

//Start the REST API
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){

});


//Count the entire price
var helper = {listPrice: function(prod){
    var price = 0;
    Object.keys(prod).forEach((i) => {
        price += helper.roundNum(prod[i]["qtd"] * prod[i]["priceUnit"]);
    });
    return price;
},
roundNum: function (num) {
    return parseFloat(num.toFixed(2));
}
}