const sql 	  =	require('mssql');
//const logger  = require('../Logger/log');
const exp     = module.exports;
const dotenv  = require('dotenv');
const { debug } = require('winston');
dotenv.config();

let   connection;

var config  = {
	user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
	server: `${process.env.DB_SERVER}`,
	port:parseInt(process.env.DB_PORT),
	database:`${process.env.DB_DATABASE}`,
	pool:{
		max:10,
		min:0
	}
}	

let conn = function(){
	return new Promise((resolve, reject) => {
		if(!connection) {
			connection = new sql.connect(config);
		}
		resolve(connection);
	});
}

exp.query = (query, params) => {
    return new Promise((resolve, reject) => {
        conn().then(pool => {
            let request = pool.request();
            if(params) {
				params.forEach(function(value) {	
					request.input(value.name, sql[value.type], value.value);
				});
			}
            return request.query(query);
        })
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
}



// sql.on('error', function() {

// });



// const conn = function() {
//     console.log(connection);
//     if(!connection) {
//         connection = new sql.connect(config);
//     }
//     return(connection);
// }

// exp.query = function(query, params) {
// 	return new Promise((resolve, reject) => {
// 		conn().then((result) => {
// 			connection = result
// 			let request = new sql.Request(connection);
            
// 			if(params) {
// 				params.forEach(function(value) {
// 					request.input(value.name, sql[value.type], value.value);
// 				});
// 			}

// 			request.query(query, (err, res) => {
// 				if(err) {
// 					reject(err);
// 				}
// 				resolve(res);
// 			})
//         })
//         .catch(err => reject(err));
// 	})
// }

// exp.procedure = async(procedure, params) => {
//     conn().then((result) => {
//         connection = result;
//         let request = new sql.Request(connection);
        
//         if(params) {
//             params.forEach(function(value) {
//                 request.input(value.name, sql[value.type], value.value);
//             });
//         }

//         let result = request().execute(procedure);
        
//     });
// }

exp.procedure = (procedure, params) => {
    
    return new Promise((resolve, reject) => {
         
        conn().then(pool => {
            let request = pool.request();

     

            if(params) {
                
				params.forEach(function(value) {	
                    
					request.input(value.name, sql[value.type], value.value);
                });
                request.execute(procedure, (err, result) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
                

            }

            
        })
    });
}






// exp.procedure = function(procedure, params, callback) {
//     var connection = new sql.Connection(config, function(err) {
//         //Check Errors
//         if(err){
//             //sql.close();
//             return callback(err);
            
//         }
        
//         var request = new sql.Request(connection);
        
//         if(params){
//             //GET PROCEDURE PARAMS
//             params.forEach(function(value){
//                 //
//                 request.input(value.name, sql[value.type](value.length), value.value);			
//             });
//         }
        
//         //CALL PROCEDURE
//         request.execute(procedure,  function(err, recordset, returnValue) {	
//             //
//             if(err){
//                 connection.close();
//                 return callback(err, recordset, returnValue);                                             
//             }
//             else{
//                 connection.close();
//                 return callback(err, recordset);
//             }
//         });
//     });
// }



// exp.query = function(query, params, callback) {

// 	var connection = new sql.Connection(config, function(err) {
//     // ... error checks

// 	    if(err) {
// 			//sql.close();
// 			return callback(err);
// 		}

// 		var request = new sql.Request(connection); // or: var request = connection.request();

// 		if(params){
// 			// Query
// 			params.forEach(function(value) {
// 				request.input(value.name, sql[value.type], value.value);	
// 			});
// 		}
		
// 		request.query(query, function(err, recordset) {
// 		    // ... error checks
// 		   if(err) {
// 				connection.close();
// 				return callback(err, recordset);	
// 			}
// 			else{
// 				connection.close();
// 				return callback(err, recordset);
// 			}
// 		});
// 	});
// }

// exp.procedure = function(procedure, params, callback) {
// 	var connection = new sql.Connection(config, function(err) {
// 		//Check Errors
// 		if(err){
// 			//sql.close();  
// 			return callback(err);
			
// 		}
		
// 		var request = new sql.Request(connection);
		
// 		if(params){
// 			//GET PROCEDURE PARAMS
// 			params.forEach(function(value){
// 				//
// 				request.input(value.name, sql[value.type](value.length), value.value);			
// 			});
// 		}
		
// 		//CALL PROCEDURE
// 		request.execute(procedure,  function(err, recordset, returnValue) {	
// 			//
// 			if(err){	
// 				//console.log(recordset);
// 				//console.log(recordset);
// 				connection.close();
// 				return callback(err, recordset, returnValue);                                             
// 			}
// 			else{
// 				connection.close();
// 				return callback(err, recordset);
// 			}
// 		});
// 	});
// }
