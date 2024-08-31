const { object } = require('webidl-conversions');
const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) =>{
    let error ={...err};

    error.message = err.message
    // console.log(err)
    if(err.code === 11000){
        const message = `Duplicate feild value error`
        error = new ErrorResponse(message, 400)
    }
    if(err.name === "validation Error"){
        const message = object.values(err.errors).map((val)=> val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success : false ,
        error : error.message || "Server Errors"
    })
}

module.exports = errorHandler