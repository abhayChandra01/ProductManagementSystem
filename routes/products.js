var express=require('express')
var router=express.Router()

var pool=require("./pool")
var upload=require("./multer")

var LocalStorage = require('node-localstorage').LocalStorage;
const e = require('express');
var localStorage = new LocalStorage('./scratch');


router.get("/productinterface",function(req,res){
     var aresult=JSON.parse(localStorage.getItem("ADMIN"))

if(aresult==null)
     res.redirect("/admin/adminlogin")
 
else
  res.render("productinterface",{"message":"",aresult:aresult})


})


router.get("/displayproducts",function(req,res)
{
     var aresult=JSON.parse(localStorage.getItem("ADMIN"))
     
     if(aresult==null)
     res.redirect("/admin/adminlogin")
 
     else
     pool.query("select P.*,(select U.unitvalue from units U where U.unitid=P.unitid) as unitname,(select PT.typename from producttypes PT where PT.typeid=P.producttypeid) as producttypename from products P",function(error,result)
     {
         if(error)
         {
              res.render("displayallproducts",{result:[],aresult:aresult,msg:"Server Error"})

          } 
         else
         {
              if(result.length==0)
              {
                    res.render("displayallproducts",{result:[],aresult:aresult,msg:"No Records Found"})

               }
               else
               {    

                    res.render("displayallproducts",{result:result,aresult:aresult,msg:""})
               }

          }     



     })



})





router.post("/productsubmit",upload.single('picture'),function(req,res){
console.log("BODY:",req.body)
console.log("File:",req.body)

var aresult=JSON.parse(localStorage.getItem("ADMIN"))
     
if(aresult==null)
     res.redirect("/admin/adminlogin")
 
else
pool.query("insert into products(productname,productmodel,category,gst,producttypeid,unitid,currencytype,price,offertype,offerrate,stock,picture)values(?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.productname,req.body.productmodel,req.body.category,req.body.gst,req.body.producttype,req.body.units,req.body.currency,req.body.price,req.body.offer,req.body.offerrate,req.body.stock,req.filename],function(error,result)
     {
          if(error)
          {
               res.render("productinterface",{"message":"Server Error....",aresult:aresult})
   
          }          
          else
          {
               console.log(result)
               res.render("productinterface",{"message":"Record Submitted Successfully....",aresult:aresult})
          
          }

     

     })
     
     
   })

router.get("/getproducttype",function(req,res){
  pool.query("select * from producttypes where category=?",[req.query.category],function(error,result){

   if(error)
   {
        res.status(500).json([])
        console.log(error)
   }

   else
   {
        res.status(200).json(result)
   }
   
  })


})
router.get("/getunits",function(req,res){
  pool.query("select * from units where typeid=?",[req.query.typeid],function(error,result){

   if(error)
   {
        res.status(500).json([])
        console.log(error)
   }

   else
   {
        res.status(200).json(result)
   }
   
  })


})

router.get("/getprice",function(req,res){
     pool.query("select * from units where unitid=?",[req.query.unitid],function(error,result){
   
      if(error)
      {
           res.status(500).json([])
           console.log(error)
      }
   
      else
      {
           res.status(200).json(result)
      }
      
     })
   
   
   })
   


   router.get("/displaybyid",function(req,res)
   {
     var aresult=JSON.parse(localStorage.getItem("ADMIN"))
        
     if(aresult==null)
     res.redirect("/admin/adminlogin")
 
     else
     pool.query("select P.*,(select U.unitvalue from units U where U.unitid=P.unitid) as unitname,(select PT.typename from producttypes PT where PT.typeid=P.producttypeid) as producttypename from products P where P.productid=?",[req.query.pid],function(error,result)
        {
            if(error)
            {
                 res.render("displaybyid",{result:[],aresult:aresult})
   
             } 
            else
            {
                
   
                    res.render("displaybyid",{result:result[0],aresult:aresult})
                  
   
             }     
   
   
   
        })
   
   
   
   })

   
   router.get("/searchbyid",function(req,res)
   {
     var aresult=JSON.parse(localStorage.getItem("ADMIN"))
        
     if(aresult==null)
     res.redirect("/admin/adminlogin")
 
     else
     res.render("searchbyid",{message:'',aresult:aresult})
                  
   
     
   
   
   })





   router.post("/updateproduct",function(req,res){
     console.log("BODY:",req.body)
     if(req.body.btn=="Update")
     {
     
          pool.query("update products set productname=?,productmodel=?,category=?,gst=?,producttypeid=?,unitid=?,currencytype=?,price=?,offertype=?,offerrate=?,stock=? where productid=?",[req.body.productname,req.body.productmodel,req.body.category,req.body.gst,req.body.producttype,req.body.units,req.body.currency,req.body.price,req.body.offer,req.body.offerrate,req.body.stock,req.body.productid],function(error,result)
          {
               if(error)
               {
                    res.redirect("/products/displayproducts")
        
               }          
               else
               {
                    console.log(result)
                    res.redirect("/products/displayproducts")
               }
     
          
     
          })
     }    
     else
     {    
          pool.query("delete from products where productid=?",[req.body.productid],function(error,result)
          {
               if(error)
               {
                    res.redirect("/products/displayproducts")
        
               }          
               else
               {
                    console.log(result)
                    res.redirect("/products/displayproducts")
               }
     
          
     
          })

     }
          
        })
     
     router.get("/editpicture",function(req,res)
     {
          var aresult=JSON.parse(localStorage.getItem("ADMIN"))
          
          if(aresult==null)
     res.redirect("/admin/adminlogin")
 
          else
          res.render("editpicture",{data:req.query,aresult:aresult})          
          
               
               
     })
   
     router.post("/uploadnewimage",upload.single('picture'),function(req,res){
          console.log("BODY:",req.body)
          console.log("File:",req.body)
          
          
               pool.query("update products set picture=? where productid=?",[req.filename,req.body.productid],function(error,result)
               {
                    if(error)
                    {
                         res.redirect("/products/displayproducts")
             
                    }          
                    else
                    {
                         console.log(result)
                         res.redirect("/products/displayproducts")
                    }
          
               })
               
               
             })
          


module.exports = router;