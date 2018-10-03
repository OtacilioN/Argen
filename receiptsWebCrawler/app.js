//TODO remove
var client = "new_user";

//External APIs
let cheerio = require('cheerio');
let request = require('request');
var QrCode = require('qrcode-reader');
const async = require('async');
var fs = require('fs');
var firebase = require("firebase");

//Firebase configuration
var config = {
    apiKey: "AIzaSyBehGbs2KNIzDadkj6WrvipOr3pR5ZQAA4",
    authDomain: "argen-9f8f3.firebaseapp.com",
    databaseURL: "https://argen-9f8f3.firebaseio.com",
    storageBucket: "argen-9f8f3.appspot.com"
  };
var app = firebase.initializeApp(config);
console.log(app.name);
var database = app.database();

//Read from image file and decode QR code
var Jimp = require("jimp");
//TODO use url of image
var buffer = fs.readFileSync('nfc.jpg');
Jimp.read(buffer, function(err, image) {
    if (err) {
        console.error(err);
    }
    var qr = new QrCode();
    qr.callback = function(err, value) {
        if (err) {
            console.error(err);
        } else {
            
            console.log(value.result);

            var html;
            //TODO request('value.result')
            request('http://nfce.sefaz.pe.gov.br/nfce-web/consultarNFCe?chNFe=26180406057223027967650100000196741100418351&nVersao=100&tpAmb=1&dhEmi=323031382d30342d32395431303a32333a34322d30333a3030&vNF=663.96&vICMS=71.81&digVal=2f4e314952456f7149353159793352596972627664654e78574a413d&cIdToken=000001&cHashQRCode=3957073cfcd84f6ebb36718f179b3f65cf38f881', function (error, response, body) {
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
                            // cod_city: doc('cMun').text(),
                            uf: doc('UF').text(),
                            cep: doc('CEP').text(),
                            // cod_country: doc('cPais').text(),
                            country: doc('xPais').text(),
                            // phone: doc('fone').text(),
                        };

                        metadata = {
                            name: doc('xNome').text(),
                            cnpj: doc('CNPJ').text(),
                            address: address,
                            price: helper.roundNum(price),
                            prod: prod,
                            date: doc('dhRecbto').text()
                        };

                        console.log(metadata)

                        var marketProd = {};
                        async.forEach(Object.keys(metadata.prod), (i, element) => {
                            marketProd[i] = {
                                code: metadata.prod[i].code,
                                priceUnit: metadata.prod[i].priceUnit,
                                un: metadata.prod[i].un
                            }
                        });

                        var userListData = {
                            cnpj: metadata.cnpj,
                            name: metadata.name,
                            prod: metadata.prod,
                            address: metadata.address,
                            date: metadata.date,
                            price: metadata.price,
                            marketProd : marketProd
                        };

                        database.ref('/cliente/' + client).push(userListData);
                
                    }


            });
        }
    };
    qr.decode(image.bitmap);
});

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
