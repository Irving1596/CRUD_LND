'use strict';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
AWS.config.setPromisesDependency(require('bluebird'));
const header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
};
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
        console.log(" candidate", candidateInfo);
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



/*

submitCandidateP(candidateInfo(fullname, email, experience))
    .then(res => {
        () => {
            statusCode: 200,
            body: JSON.stringify({
                message: `Usuario registrado satisfactoriamente ${email}`,
                candidateId: res.id
            })
        };
    })
    .catch(err => {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Unable to submit candidate with email ${email}`,
                ERR: err
            })
        }
    });

}

const submitCandidateP = candidate => {
    console.log('Registrando usuario');
    const candidateInfo = {
        TableName: process.env.USUARIOS_TABLE,
        Item: candidate,
    };
    console.log('tabla', candidateInfo);
    const res = await dynamoDb.put(candidateInfo).promise()
    console.log('res', res);
    return res;
};
*/

function getBodyUsuario(req) {
    const timestamp = new Date().getTime();
    const bodyUsuario = {
        id: uuid.v1(),
        fullname: req.NOMBRE,
        // email: email,
        //experience: experience,
        createdAt: timestamp,
        //  updatedAt: timestamp,
    };
    return bodyUsuario;
};
// Use this code if you don't use the http event with the LAMBDA-PROXY integration
// return { message: 'Go Serverless v1.0! Your function executed successfully!', event };