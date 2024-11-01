const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// const asyncHandler = ()=>{}
// const asyncHandler = (func)=> ()=>{}
// const asyncHandler = (func)=> async() => {}

//   Another way to write the same function

// const asyncHandler = (func) =>async(req,res,next) =>{
//     try {
//         await func(req,res,next)
//     } catch (error) {
//         res.status(err.code||500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }
