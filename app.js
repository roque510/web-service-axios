const axios = require('axios');
var https = require('https');
var fs = require('fs');
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support').default;
const tough = require('tough-cookie');

const PAYLOAD = require('./payload');

let token = "";

axiosCookieJarSupport(axios);
 
const cookieJar = new tough.CookieJar();



var instance = axios.create({

    httpsAgent: new https.Agent({
        cert: fs.readFileSync(`popular-Internediate-CA-2018.cer`),
        rejectUnauthorized: false
    })
})


instance.get('https://epagosuat.bpd.com.do:801/sap/opu/odata/sap/ZGW_COMMON_SRV/',{
headers: {'X-CSRF-TOKEN': 'Fetch'},
auth: {
    username: 'UP0000000101',
    password: 'Pruebar1'
  },
  jar: cookieJar, // tough.CookieJar or boolean
  withCredentials: true
}

  )
  .then(response => {
    token = response.headers['x-csrf-token'];
    axios.defaults.headers.common['x-csrf-token'] = token;    
    instance.post('https://epagosuat.bpd.com.do:801/sap/opu/odata/sap/ZGW_COMMON_SRV/Orders/',PAYLOAD,
    {
      headers: {
        'Accept-Language':'ES',
        'X-CSRF-TOKEN' : token,
        'Content-Type': 'application/json'
      },
      auth: {
        username: 'UP0000000101',
        password: 'Pruebar1'
      },
      jar: cookieJar, // tough.CookieJar or boolean
      withCredentials: true
    })
    .then(function (response) {
      console.log("=================== POST RESPONSE SUCCESSFULL=================",response.data);
    })
    .catch(function (error) {
      console.log("=================== POST ERROR RESPONSE =================",error.response.data);
    });
    console.log("=================== GET RESPONSE SUCCESSFULL =================");
    //console.log(response.data.explanation);
  })
  .catch(error => {
    console.log("=================== GET ERROR RESPONSE =================",error);
});
