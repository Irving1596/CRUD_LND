'use strict';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
AWS.config.setPromisesDependency(require('bluebird'));
module.exports.hello = async event => {
    return {
        statusCode: 200,
        body: JSON.stringify({
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: event,
            },
            null,
            2
        ),
    };

}
module.exports.getAll = async event => {
    var params = {
        TableName: process.env.USUARIOS_TABLE,
        ProjectionExpression: "id, fullname"
    };
    try {
        let result = await dynamoDb.scan(params).promise();

        console.log(result);

        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
                OK: true,
                MSG: "Data obtenida satisfactoriamente",
                DATA: result
            })
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                OK: false,
                MSG: `Error en el servidor`,
                ERR: error
            })
        }
    }
}

module.exports.agregar = async event => {
    try {
        const requestBody = JSON.parse(event.body);
        // const name = requestBody.name;
        //const fullname = requestBody.fullname;
        //const email = requestBody.email;
        // const experience = requestBody.experience;
        let usuario = getBodyUsuario(requestBody);
        const candidateInfo = {
            TableName: process.env.USUARIOS_TABLE,
            Item: usuario,
        };
        let result = await dynamoDb.put(candidateInfo).promise();
        console.log(">>>>>>>>>", result);
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            statusCode: 200,
            body: JSON.stringify({
                OK: true,
                MSG: "Usuario insertado",
            }),
        };
    } catch (error) {
        console.log(error);
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            statusCode: 500,
            body: JSON.stringify({
                OK: false,
                message: `Error en el servidor`,
                ERR: error
            })
        }
    }
}

module.exports.actualizar = async event => {
    try {
        const requestBody = JSON.parse(event.body);
        const ID = event.queryStringParameters.id;
        let usuario = updateBodyUsuario(requestBody);
        let params = {
            TableName: process.env.USUARIOS_TABLE,
            Key: {
                id: ID
            },
            UpdateExpression: "set fullname = :fullname",
            ExpressionAttributeValues: {
                ":fullname": usuario.fullname
            },
            ReturnValues: "UPDATED_NEW"
        };
        let result = await dynamoDb.update(params).promise();

        console.log(">>>>>>>>>", result);
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            statusCode: 200,
            body: JSON.stringify({
                OK: true,
                MSG: "Usuario Actualizado",
                DATA: result
            }),
        };
    } catch (error) {
        console.log(error);
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            statusCode: 500,
            body: JSON.stringify({
                OK: false,
                message: `Error en el servidor`,
                ERR: error
            })
        }
    }
}

module.exports.eliminar = async event => {
    try {
        const ID = event.pathParameters.id;
        console.log("ID", ID);
        let params = {
            TableName: process.env.USUARIOS_TABLE,
            Key: {
                id: ID
            }
        };
        let result = await dynamoDb.delete(params).promise();

        console.log(">>>>>>>>>", result);
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            statusCode: 200,
            body: JSON.stringify({
                OK: true,
                MSG: "Usuario Eliminado"
            }),
        };
    } catch (error) {
        console.log(error);
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            statusCode: 500,
            body: JSON.stringify({
                OK: false,
                message: `Error en el servidor`,
                ERR: error
            })
        }
    }
}

function getBodyUsuario(req) {
    const timestamp = new Date().getTime();
    let bodyUsuario = {
        id: uuid.v1(),
        fullname: req.NOMBRE,
        // email: email,
        //experience: experience,
        createdAt: timestamp,
        //  updatedAt: timestamp,
    };
    return bodyUsuario;
};

function updateBodyUsuario(req) {
    const timestamp = new Date().getTime();
    let bodyUsuario = {
        fullname: req.NOMBRE,
        // email: email,
        //experience: experience,
        // createdAt: timestamp,
        updatedAt: timestamp
    };
    return bodyUsuario;
};