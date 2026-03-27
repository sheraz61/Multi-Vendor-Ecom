import ErrorHandler from "../utils/ErrorHandler.js";

const errorMiddleware  = (err,req,res,next)=>{
err.statusCode = err.statusCode || 500
err.message= err.message || 'Internal server error'

// wrong mongodb id error
if (err.name === "CastError"){
    const message = `Resources not found with this id.... invalid ${err.path}`
    err = new ErrorHandler(message,400)
}
// Duplicate key Error 
if (err.code === 11000){
const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`
err= new ErrorHandler(message,400)
}
// wrong jwt error (authentication)
if (err.name === "JsonWebTokenError"){
const message = `Your url is invalid place try again letter`
err=new ErrorHandler(message,400)
}

// jwt expired
if (err.name === 'TokenExpiredError'){
const message= `Your Url is expired please try again letter`
err=new ErrorHandler(message,400)
}
res.status(err.statusCode).json({
    success:false,
    message:err.message
})
}

export default errorMiddleware