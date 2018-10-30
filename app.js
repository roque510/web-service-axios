var oracledb = require('oracledb');
const axios = require('axios');
var https = require('https');
var fs = require('fs');
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support').default;
const tough = require('tough-cookie');
var config = require('./config/config')['development'];

const PAYLOAD = require('./payload');

let token = "";
let OrderNr = 1;

let PARAMS = process.argv;
const NOCIA = PARAMS[2];
const CODPLA = PARAMS[3];

if(!NOCIA){ //if NO_CIA var was not sent to app.js app must exit.
  console.error("NOCIA Param missing!");
  process.exit();//Exit app
}

if(!CODPLA){ //if COD_PLA var was not sent to app.js app must exit.
  console.error("CODPLA Param missing!");
  process.exit();//Exit app
}

let jsonOBJ = 
{
  "OrderTypeId" : "A",
  "OrderItems" : []
}
;

function addObject(p){  
  if (!p.NO_CIA || !p.NO_EMPLE || !p.COD_PLA || !p.NO_PLANI || !p.F_DESDE){ // check if all variables exist
    console.log("Something wrong happened");
    console.log(p);
    process.exit();//Exit app
  }

  var dateObj = p.F_DESDE;
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  let obj = {
        "OrderNr" : p.ORDERNR,
        "Payee" : 
          {
            "IdentityTypeId" : p.NACION === 'N' ? "DORN" : "DOPS",
            "IdentityNr" : p.CEDULA,
            "Name1" : p.EMPLEADO,
            "Name2" : ""
          },
        "CurrencyId" : "DOP",
        "PayeeId" : p.NO_EMPLE,
        "PayeeFullName" : p.EMPLEADO,
        "Reference" : p.NO_CIA+p.NO_EMPLE+p.COD_PLA+p.NO_PLANI+year+month+day,
        "NCF" : "",
        "DocumentClassId" : "PN",
        "DocumentDate" : p.F_DESDE,
        "PaymentDate" : new Date(),
        "PaymentMethodId" : "N",
        "BankAccountFromKey" : "0001",
        "BankAccountToKey" : "0001",
        "NetAmount" : p.BASE,
        "Memo" : "",
        "Remarks" : ""
        }

  jsonOBJ.OrderItems.push(obj) + 1;
}


//process.exit();/// for debuging ONLY//////////////////////////

// axiosCookieJarSupport(axios);
 
// const cookieJar = new tough.CookieJar();



// var instance = axios.create({

//     httpsAgent: new https.Agent({
//         cert: fs.readFileSync(`popular-Internediate-CA-2018.cer`),
//         rejectUnauthorized: false
//     })
// })


// instance.get('https://epagosuat.bpd.com.do:801/sap/opu/odata/sap/ZGW_COMMON_SRV/',{
// headers: {'X-CSRF-TOKEN': 'Fetch'},
// auth: {
//     username: 'UP0000000101',
//     password: 'Pruebar1'
//   },
//   jar: cookieJar, // tough.CookieJar or boolean
//   withCredentials: true
// }

//   )
//   .then(response => {
//     token = response.headers['x-csrf-token'];
//     axios.defaults.headers.common['x-csrf-token'] = token;    
//     instance.post('https://epagosuat.bpd.com.do:801/sap/opu/odata/sap/ZGW_COMMON_SRV/Orders/',PAYLOAD,
//     {
//       headers: {
//         'Accept-Language':'ES',
//         'X-CSRF-TOKEN' : token,
//         'Content-Type': 'application/json'
//       },
//       auth: {
//         username: 'UP0000000101',
//         password: 'Pruebar1'
//       },
//       jar: cookieJar, // tough.CookieJar or boolean
//       withCredentials: true
//     })
//     .then(function (response) {
//       console.log("=================== POST RESPONSE SUCCESSFULL=================",response.data);
//     })
//     .catch(function (error) {
//       console.log("=================== POST ERROR RESPONSE =================",error.response.data);
//     });
//     console.log("=================== GET RESPONSE SUCCESSFULL =================");
//     //console.log(response.data.explanation);
//   })
//   .catch(error => {
//     console.log("=================== GET ERROR RESPONSE =================",error);
// });

const employees = require('./Model/empleados.js');
 
oracledb.createPool(config.database)
  .then(function() {
    return employees.getEmpleados(NOCIA,CODPLA);
  })
  .then(function(emp) {
    let arrPromise = [];
    let jsonTest = emp.map((person,key) => {  
      let test = employees.getEmployee(person.NO_EMPLE)        
        .then((p) => {
          person.ORDERNR = key;
          person.CEDULA = p.CEDULA;
          person.NACION = p.NACION;
            
          return person;
      });        
        arrPromise.push(test);
    })


    return arrPromise;


  }).then( (ans) => {
    Promise.all(ans).then((e) => {
      
      e.map((person) => {
        addObject(person);
      });

      var json = JSON.stringify(jsonOBJ);
      var fs = require('fs');
      fs.writeFile('myjsonfile.json', json, 'utf8');
      console.log("JSON FILE DONE");
      
    })
  })
  .catch(function(err) {
    console.log("ERRR",err);
  });



// oracledb.getConnection(
//   {
//     user          : config.database.user,
//     password      : config.database.password,
//     connectString : config.database.connectString
//   },
//   function(err, connection)
//   {
//     if (err) { console.error(err); return; }
//     connection.execute(
//       "SELECT no_emple,nombre "
//     + "FROM datos_empleados "
//     + "WHERE no_cia = '06' and no_emple = '702059' "
//     + "ORDER BY no_emple",
//       function(err, result)
//       {
//         if (err) { console.error(err); return; }
//         console.log(result.rows);
//       });

//     connection.execute("select  NO_CIA , COD_PLA , NO_EMPLE, BASE , EMPLEADO from t_cheques where NO_CIA = '"+NOCIA+"' and COD_PLA = '"+CODPLA+"' ",
//       function(err, result)
//       {
//         if (err) { console.error(err); return; }
//         result.rows.map( function (person) { // iterate on rows

//           /*let CED ="",NAC = "";
          
//           connection.execute("select CEDULA,NACION FROM ARPLME  where NO_EMPLE = '"+person[2]+"' ", // filter by no_emple
//             function(err, result)
//             {
//               if (err) { console.error(err); return; }
              
//               result.rows.map(function (info){
//                 person.push(info[0]);
//                 person.nacimiento = info[1];
                

//               });


//             });///////// END QUERY*/
//           console.log(person);
          

//         })
//       });//// END QUERY T_CHEQUES



//   });