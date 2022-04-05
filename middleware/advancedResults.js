const colors=require('colors');

const advancedResults=(model,populate)=>async(req,res,next)=>{
    let query;
     //Copy req.query
     const reqQuery={...req.query};
     console.log(colors.yellow.underline("reqQuery",reqQuery));
     //Fields to exclude
    const removeFields=['select','sort','limit','fields'];
    //Loop over removeFields and delete them from request query
    removeFields.forEach(param=> delete reqQuery[param]);
    console.log(colors.yellow.underline("reqQuery2",reqQuery));
     //Create query string
     let queryStr=JSON.stringify(reqQuery);
     console.log(colors.yellow.underline("queryStr",queryStr));
     //Create query operators ($gt, $lt etc.)
     queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}`);
     console.log(colors.yellow.underline("queryStr after replace",queryStr));
     //finding resource
     query=model.find(JSON.parse(queryStr));
     
     
     //Select Fields
     if(req.query.select){
        console.log(colors.yellow.underline("req.query.select :",req.query.select));
         const fields=req.query.select.split(',').join(' ');
         console.log(colors.yellow.underline("fields:",fields,"req.query:",req.query));
         query=query.select(fields);
         console.log(colors.yellow.underline("query mj:",query));
         console.log(colors.yellow.bold(fields));
     }
     
     //Sort
     if(req.query.sort){
         const sortBy=req.query.sort.split(',').join(' ');
         query=query.sort(sortBy);
         console.log(colors.yellow.bold(sortBy));
     }
     else{
         query=query.sort('-createdAt');
     }

     //Pagination
     const page=parseInt(req.query.page,10)||1;
     const limit=parseInt(req.query.limit,10)||25;
     const startIndex=(page-1)*limit;
     const endIndex=page*limit;
     const total=await model.countDocuments();
     query=query.skip(startIndex).limit(limit);

     if(populate){
         query.populate(populate);
     }

     //Executing query
       const results=await query;

    //Pagination result
    const pagination={}
    if(endIndex<total){
        pagination.next={
            page:page+1,
            limit
        }
    }
    if(startIndex>0){
        pagination.prev={
            page:page-1,
            limit
        }
    }
    res.advancedResults={
        success:true,
        count:results.length,
        pagination,
        data:results 
    }
    next();
      
}

module.exports=advancedResults;