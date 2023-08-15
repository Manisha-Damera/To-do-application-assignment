const express=require("express");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const path=require("path");
const dbPath=path.join(__dirname,"todoApplication.db");
const app=express();
app.use(express.json());

let db=null;
const initializeDbAndServer=async()=>{
    try{
        db= await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(3000,()=>{
            console.log("Server running at http://localhost:3000/");
        });
    }catch(e){
        console.log('Error is${e.message}');
        process.exit(1);
    }
};
initializeDbAndServer();


const hasPriorityAndStatusProperties=(requestQuery)=>{
    return(
        requestQuery.priority!==undefined && requestQuery.status !==undefined
    );
};


const hasPriorityProperty=(requestQuery)=>{
    return (requestQuery.priority!==undefined);
};


const hasStatusProperty=(requestQuery)=>{
    return (requestQuery.status!==undefined);
};



const hasCategoryAndStatus=(requestQuery)=>{
    return (requestQuery.category!==undefined && requestQuery.status!==undefined);
};


const hasCategoryAndPriority=(requestQuery)=>{
    return (requestQuery.category!==undefined && requestQuery.priority!==undefined);

};


const hasSearchProperty=(requestQuery)=>{
    return (requestQuery.search_q!==undefined);
};


const hasCategoryProperty=(requestQuery)=>{
    return (requestQuery.category!==undefined);
};

const outputResult=(dbObject)=>{
    return{
        id:dbObject.id,
        todo:dbObject.todo,
        priority:dbObject.priority,
        category:dbObject.category,
        status:dbObject.status,
        dueDate:dbObject.due_date,
    };
};

app.get("/todos/",async(request,response)=>{
    let data=null;
    let getToDosQuery="";
    const {search_q="",priority,status,category}=request.query;
})

switch(true){
    case hasPriorityAndStatusProperties(request.query):
        if(priority==="HIGH"|| priority==="MEDIUM"||priority==="LOW"){
            if(
                status=== "TO DO"||
                status=== "IN PROGRESS"||
                status==="DONE"
            ){
                getToDosQuery=`
                SELECT * FROM todo WHERE 
                status='${status}' AND  priority='${priority}';`;
                data= await db.all(getToDosQuery);
                response.send(data.map((eachItem)=>outputResult(eachItem)));
            }
            else{
                response.status(400);
                response.send("Invalid Todo Status");
                }
        }else{
            response.status(400);
            response.send("Invalid Todo Priority");
        }
        break;

        case hasCategoryAndStatus(request.query);
        if(
            category==="WORK"||
            category==="HOME"||
            category==="LEARNING"
        ){
            if(
                status==="TO DO"||
                status==="IN PROGRESS"||
                status==="DONE"
            ){
                getToDosQuery=`
            SELECT * FROM todo WHERE 
            status='${status}' AND  category='${category}';`;
            data= await db.all(getToDosQuery);
            response.send(data.map((eachItem)=>outputResult(eachItem)));
            }
          else{
            response.status(400);
            response.send("Invalid Todo Status");
                }
            }else{
                response.status(400);
                response.send("Invalid Todo Category");
                }
        break
        
        case hasCategoryAndPriority(request.query):
        if(
            category==="WORK"||
            category==="HOME" ||
            category==="LEARNING"
        ){ if(
            priority==="HIGH" ||
            priority==="MEDIUM"||
            priority==="LOW"
        )
        {
            getToDosQuery=`SELECT * 
            FROM todo WHERE 
            category='${category} AND priority='${priority}';`;
            data=await db.all(getToDosQuery);
            response.send(data.map((eachItem)=>outputResult(eachItem)));
        }else{
            response.status(400);
            response.send("Invalid Todo Category");
        }
        else{
            response.status(400);
            response.send("Invalid Todo Priority")
        }
        break;
        
        case hasStatusProperty(request.query):
             if(status==="TO DO"||status==="IN PROGRESS"||status==="DONE"){

             getToDosQuery=`SELECT * FROM todo WHERE 
             status='${status}';`;
                data=await db.all(getToDosQuery);
                response.send(data.map((eachItem)=>outputResult(eachItem)));
                }else{
                    response.status(400);
                    response.send("Invalid Todo Status");
                     }
        break;
//Scenario 2
case hasPriorityProperty(request.query);
if(priority==="HIGH"||priority==="MEDIUM"||priority==="LOW"){
    getToDosQuery=`SELECT * FROM todo WHERE
    priority='${priority}';`;
    data=await db.all(getToDOsQuery);
    response.send(data.map((eachItem)=>outputResult(eachItem)));

}else{
    response.status(400);
    response.send("Invalid Todo priority");
}

break;
//


case hasSearchProperty(request.query):
getToDOsQuery=`SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;
data =await db.all(getToDOsQuery);
response.send(data.map((eachItem)=>outputResult(eachItem)));
break;




//scenario 6

case hasCategoryProperty(request.query):
if(category==="WORK"||category==="HOME"||category==="LEARNING"){
    getToDOsQuery=`SELECT * FROM todo WHERE
    category='${category}';`;
    data=await db.all(getToDOsQuery);
    response.send(data.map((eachItem)=>outputResult(eachItem)));
}else{
    response.status(400);
    response.send("Invalid Todo category");
}
break;
//scenario 4


default:
    getToDOsQuery=`SELECT * FROM todo;`;
    data=await db.all(getToDOsQuery);
    response.send(data.map((eachItem)=>outputResult(eachItem)));
}
    });

//API 2

app.get("/todos/:todoId/",async(request,response)=>{

const {todoId}=request.params;
const getApplicationDetails=`SELECT * FROM todo
WHERE id='${todoId}';`;

const initialTodoDetails=await db.get(getApplicationDetails);
response.send(outputResult(initialTodoDetails));



});

    


//Api 3
app.get("/agenda/",async(request,response)=>{

const {date}=request.query;
console.log(isMatch(date,"yyyy-M-dd"));
if(isMatch(date,"yyyy-MM-dd")){
    const newDate=format(new Date(date),"yyyy-MM-dd");
    console.log(newDate);
const getApplicationDetails=`SELECT * FROM todo
WHERE due_date='${newDate}';`;

const initialTodoDetails=await db.all(getApplicationDetails);
response.send(initialTodoDetails.map((eachItem)=>outputResult(eachItem)));
}else{
    response.status(400);
    response.send("Invalid Due Date")
}



});


//API 4


app.post("/todos/",async(request,response)=>{
    const newApplicationDetails=request.body;

    const {id,todo,priority,status,category,dueDate}=newApplicationDetails;
    if(priority==="HIGH"||priority==="LOW"||priority==="MEDIUM"){
        if(status==="To Do"||status==="IN PROGRESS"||status==="DONE"){
            if(category==="WORK"||category==="HOME"||category==="LEARNING"){
                if(isMatch(dueDate,"yyyy-MM-dd")){
                    const postNewDueDate=format(new Date(dueDate),"yyyy-MM-dd");
               
    const postNewDetailsQuery=`INSERT INTO
    todo(id,todo,priority,status,category,due_date)
    VALUES ('${id}','${todo}','${priority}','${status}','${category}','${postNewDueDate}');`;

    await db.run(postNewDetailsQuery);
   // const newApp=dbResponse.lastID;
    response.send("Todo Successfully Added");
                }else{
                    response.status(400);
                    response.send("Invalid Due Date");
                }
            }else{
                response.status(400);
                response.send("Invalid Todo Category");
            }
        }else{
                response.status(400);
                response.send("Invalid Todo Status");
            }
        }else{
                response.status(400);
                response.send("Invalid Todo Priority");
            }
        



});


//Api 5

app.put("/todos/:todoId/", async (request,response)=>{
    const {todoId}=request.params;
    let updateColumn="";
    const requestBody=request.body;
    console.log(requestBody);
    const previousTodoQuery=`SELECT * FROM todo 
                                     WHERE 
                                     id=${todoId};`;
    const previousTodo=await db.get(previousTodoQuery);

   const {
  todo = previousTodo.todo,
  status =previousTodo.status,
  priority = previousTodo.priority,
  category=previousTodo.category,
  dueDate=previousTodo.dueDate
 } = request.body;

 let updateTodoQuery;
switch(true){
   case requestBody.status!==undefined:
       if(status==="TO DO"||status==="IN PROGRESS"||status==="DONE"){
           updateTodoQuery=`UPDATE todo SET todo='${todo}',priority='${priority}',status='${status}',category='${category}',
           due_date='${dueDate}' WHERE id=${todoId};`;


           await db.run(updateTodoQuery);
           response.send("Status Updated");
       }else{
           response.status(400);
           response.send("Invalid Todo Status");
       }
       break;
//update priority
        case requestBody.priority!==undefined:
       if(priority==="HIGH"||priority==="MEDIUM"||priority==="LOW"){
           updateTodoQuery=`UPDATE todo SET todo='${todo}',priority='${priority}',status='${status}',category='${category}',
           due_date='${dueDate}'  WHERE id=${todoId};`;


           await db.run(updateTodoQuery);
           response.send("Priority Updated");
       }else{
           response.status(400);
           response.send("Invalid Todo Priority");
       }
       break;

//UPDATE TODO

        case requestBody.todo!==undefined:
      
           updateTodoQuery=`UPDATE todo SET todo='${todo}',priority='${priority}',status='${status}',category='${category}',
           due_date='${dueDate}' WHERE id=${todoId};`;


           await db.run(updateTodoQuery);
           response.send("Todo Updated");
      
       break;

//update category


case requestBody.category!==undefined:
    if(
        category==="WORK"||category==="HOME"||category==="LEARNING"
    ){
        updateTodoQuery=`UPDATE todo SET todo='${todo}',priority='${priority}',status='${status}',category='${category}',
        due_date='${dueDate}' WHERE id=${todoId};`;

        await db.run(updateTodoQuery);
        response.send("Category Updated");
    }else{
        response.status(400);
        response.send("Invalid Todo Category");
    }
    break;

    //update due date

    case requestBody.dueDate!==undefined:
        if(isMatch(dueDate,"yyyy-MM-dd")){
            const newDueDate=format(new Date(dueDate),"yyyy-MM-dd");
            updateTodoQuery=`UPDATE todo SET todo='${todo}',priority='${priority}',status='${status}',category='${category}',
            due_date='${newDueDate}' WHERE id=${todoId};`;

            await db.run(updateTodoQuery);
            response.send("Due Date Updated");
        }else{
            response.status(400);
            response.send("Invalid Due Date");
        }

        break;



    }
    });











  


app.delete("/todos/:todoId/",async(request,response)=>{
    const {todoId}=request.params;
    const deleteDetailsQuery=`DELETE FROM todo WHERE id='${todoId}';`;
    await db.run(deleteDetailsQuery);
    response.send("Todo Deleted");
});



module.exports=app;
    
