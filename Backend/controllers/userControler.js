const users = [
    { id: 1, name: 'John Doe', age: 25 },
    { id: 2, name: 'Jane Doe', age: 30 },
  ];
  
 const  getUsers=(req,res)=>{
   console.log(req);

   res.send({status:200,data:users});
   
   


}
module.exports={getUsers}