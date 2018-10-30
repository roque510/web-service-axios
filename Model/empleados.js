const oracledb = require('oracledb');
 
function getEmployee(empId) {
  return new Promise(function(resolve, reject) {
    let conn; // Declared here for scoping purposes.
 
    oracledb
      .getConnection()
      .then(function(c) {
        //console.log('Connected to database');
 
        conn = c;
 
        return conn.execute(
          `select CEDULA,NACION
          from arplme
          where no_emple = :emp_id`,
          [empId],
          {
            outFormat: oracledb.OBJECT
          }
        );
      })
      .then(
        function(result) {
          //console.log('Query executed');
 
          resolve(result.rows[0]);
        },
        function(err) {
          console.log('Error occurred', err);
 
          reject(err);
        }
      )
      .then(function() {
        if (conn) {
          // If conn assignment worked, need to close.
          return conn.close();
        }
      })
      .then(function() {
        //console.log('Connection closed');
      })
      .catch(function(err) {
        // If error during close, just log.
        //console.log('Error closing connection', err);
      });
  });
}

function getEmpleados(nocia,codpla) {
  return new Promise(function(resolve, reject) {
    let conn; // Declared here for scoping purposes.
 
    oracledb
      .getConnection()
      .then(function(c) {
        //console.log('Connected to database');
 
        conn = c;
 
        return conn.execute(
          `select  NO_CIA , COD_PLA , NO_EMPLE, BASE , EMPLEADO from t_cheques where NO_CIA = :nocia and COD_PLA = :codpla `,
          [nocia,codpla],
          {
            outFormat: oracledb.OBJECT
          }
        );
      })
      .then(
        function(result) {
          //console.log('Query executed');
 
          resolve(result.rows);
        },
        function(err) {
          console.log('Error occurred', err);
 
          reject(err);
        }
      )
      .then(function() {
        if (conn) {
          // If conn assignment worked, need to close.
          return conn.close();
        }
      })
      .then(function() {
        //console.log('Connection closed');
      })
      .catch(function(err) {
        // If error during close, just log.
        //console.log('Error closing connection', err);
      });
  });
}

function getPlaniAndFdesde(nocia,codpla) {
  return new Promise(function(resolve, reject) {
    let conn; // Declared here for scoping purposes.
 
    oracledb
      .getConnection()
      .then(function(c) {
        //console.log('Connected to database');
 
        conn = c;
 
        return conn.execute(
          `select NO_PLANI,F_DESDE from ARPLCP where NO_CIA = :nocia and CODPLA = :codpla `,
          [nocia,codpla],
          {
            outFormat: oracledb.OBJECT
          }
        );
      })
      .then(
        function(result) {
          //console.log('Query executed');
 
          resolve(result.rows);
        },
        function(err) {
          console.log('Error occurred', err);
 
          reject(err);
        }
      )
      .then(function() {
        if (conn) {
          // If conn assignment worked, need to close.
          return conn.close();
        }
      })
      .then(function() {
        //console.log('Connection closed');
      })
      .catch(function(err) {
        // If error during close, just log.
        //console.log('Error closing connection', err);
      });
  });
}
//select NO_PLANI,F_DESDE from ARPLCP where CODPLA = 'C3' AND NO_CIA = '06';


 
module.exports.getEmployee = getEmployee;
module.exports.getEmpleados = getEmpleados;
module.exports.getPlaniAndFdesde = getPlaniAndFdesde;