const ErrorResponse = require("../routes/utils/errorResponse");
const colors= require('colors')
const errorHandler=(err,req,res,next)=>{
  let error={...err}
  error.message=err.message
  console.log(err);

  //log for the dev
  console.log(colors.red(err));
  console.log(err.name.green);
  //Mongoose bad ObjectId
  if(err.name==='CastError'){
      const message=`Resource not found`;
      error= new ErrorResponse(message,404);
  }
  //Mongoose error code
  if(err.code===11000){
      const message="duplicate field is not allowed";
      error= new ErrorResponse(message,400);
  }

  //Mongoose validation error
  if(err.name==="ValidationError"){
      const message=Object.values(err.errors).map(val=>val.message);
      error= new ErrorResponse(message,400);
  }
  res.status(error.statusCode||500).json({
      success:false,
      error:error.message||"server error"
  })
}

module.exports=errorHandler;