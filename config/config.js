var config = {
development: {    
    
    //oracle connection settings
    database: {
        user          : "NAF46",
        password      : "NAF46",
        connectString : `rio-sdoranaf1:1521/ORCL`        
    }
},
production: {
    //url to be used in link generation
   
}
};
module.exports = config;