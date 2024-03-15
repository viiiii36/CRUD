//our url
mockapi_url="https://65eea33008706c584d9bceeb.mockapi.io/api/v1/submissionLog";
//create a submission log that consists of: the person name who's submitting the log,
// name of the project that the tools are going to be used for, and a list of tools
class Submission{
    //operator name and the tool's destination
    constructor(name,project){
        this.destination=project;
        this.name=name;
        this.tools=[]
    }
    addTool(toolID,toolType){
        this.tools.push(new Tool(toolID,toolType));
        console.log(this.tools);
    }
}
//each tool has 2 info: internal assigned ID and a tool type
class Tool{
    constructor(toolID,toolType){
        this.toolID=toolID;
        this.toolType=toolType;
    }
}
//delete Submission attempt
var deleteSubmission = (id)=>{
    $.ajax({
        url: mockapi_url+`/${id}`,
        type: 'DELETE',
    })
    $(`#submission_${id}`).remove();

}
//add tools to the list
addToolToList=(id,type,submissionID)=>{
    let newTool=new Tool(id,type);
    $("tbody").append(
        `<tr>
        <td>${newTool.toolType}</td>
        <td>${newTool.toolID}</td>
      </tr>`)
      $.ajax({
        type: 'GET',
        url: mockapi_url+`/${submissionID}`,
        contentType: 'application/json',
        success: function(data){
            console.log(data.tool);
            toolArray=data.tool;
            toolArray.push(newTool);
            $.ajax({
                url: mockapi_url+`/${submissionID}`,
                type: 'PUT',
                contentType: "application/json",
                data: JSON.stringify({tool: toolArray}),
            })
        }
      })
}
//function to create new submission
var newSubmission=()=>{
    let usedID=0;
    let toolArray=[];
    let inputSubmission=new Submission($('#projectName').val(),$('#hooman').val());
    let submissionObject={
        hooman:inputSubmission.name,
        projectName:inputSubmission.destination,
        tool:inputSubmission.tools,
    }
    $.ajax({
        type:"POST",
        url: mockapi_url,
        contentType: "application/json",
        data: JSON.stringify(submissionObject),
        success: function(data){
            console.log("SUCCESS",data);
            usedID=JSON.parse(data.id);
            successSubmission();
            toolArray=data.tool;
            },
        error: function(error){
            console.log("ERROR",error);
        }
    })
    
    function successSubmission(){
    //Only taking submission from one person at a time
    $("#initialLog").remove();
    //add form to let the operator to submit the tools they want
    $("#list").prepend(
        `<div id='submission_${usedID}' class="card">
            <div class="card-header">
            <h2>${inputSubmission.name} @ ${inputSubmission.destination}</h2>
            <button class="btn btn-danger" onclick="deleteSubmission(usedID)">
            Delete this Submission
            </button>
        </div>
        <div class="card-body">
                    <div class="card>
                    <div class="row">
                    <div class="col-sm">
                        <div> <label for="tool-type">Tool Type </label>
                            <input class="form-control" type="text" id="toolType" placeholder="Input the name of the tool"></div>
                    </div>
                    <div class="col-sm">
                        <div><label for="tool-ID">Tool ID </label>
                        <input class="form-control" type="text" id="toolID" placeholder="Input the ID of the tool"></div>
                    </div>
                    <button id="new-tool" onclick="addToolToList($('#toolID').val(),$('#toolType').val(),${usedID},${toolArray})" class="btn btn-primary form-control">
                    Add tool</button>
                    <div id="tool-table"><h6>Tools to be checked out</h6>
                    <table class="table table-hover table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Tool Description</th>
                                <th scope="col">Assigned ID</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                        </tbody>
                </table></div><br>
                    </div>
                    </div>
                </div>
                </div>
                `)}
}
//function for searching tool
let searchTool = (toolName)=>{
    $.ajax({
        type:"GET",
        url: mockapi_url,
        contentType: "application/json",
        success: function(data){
            console.log("SUCCESS",data?.docs[0]);
        },
        error: function(error){
            console.log("ERROR",error);
        }
    })
}
//fucntion for update submission
let returnSubmission=(id) =>{
    $.ajax({
        type:"PUT",
        url: mockapi_url + `/${id}`,
        contentType: "application/json",
        data: JSON.stringify({returnDate: Date()}),
        success: function(data){
            console.log("SUCCESS",data);
        },
        error: function(error){
            console.log("ERROR",error);
        }
    })
}
/*
//Send http request
class CheckingOut{
    static mockapi_url="https://65eea33008706c584d9bceeb.mockapi.io/api/v1/submissionLog";
    //return all subimssion log from the url
    static getAllLog(){
        return $.get(this.mockapi_url);
    }
    //retrieve the specific submission from the api
    static getLog(id){
        return $.get(this.mockapi_url+`/${id}`)
    }
    static newSubmission(operator){
         return $.post(this.mockapi_url,operator)
    }
    //update a submission to "returned status"
    static returnTool(){
        return $.ajax({
            url: this.mockapi_url + `/${_id}`,
            dataType: 'json',
            data: JSON.stringify(tool),
            type:'PUT'

        })
    }
    
    //delete a submission
    static deleteSubmission(id){
        return $.ajax({
            url: this.mockapi_url + `/${_id}`,
            type:'DELETE'
        })
    }
}
//url: https://65eea33008706c584d9bceeb.mockapi.io/api/v1/
class DOMManager{
    static submissions;
    static createSubmission(operator){
        CheckingOut.createSubmission(new Submission())
    }
    static getAllLog(){
        CheckingOut.getAllLog().then(submissions=>this.render(submissions));
    }
    static deleteSubmission(id){
        CheckingOut.deleteSubmission(id)
        .then(()=>{
            return CheckingOut.getAllLog();
        })
        .then((submissions)=>{
            this.render(submissions);
        })
    }
    static activateReturn;
    static render(submissions){
        this.submissions=submissions;
        $('#list').empty();
        for (let submission of submissions){
            $("#list").prepend(
                `<div id='${submission._id}' class="card">
                    <div class="card-header">
                    <h2>${submission.name}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deleteSubmission('${submission._id}')">
                    Return tools from this Submission
                    </button>
                </div>
                <div class="card-body">
                    <div class="card>
                    <div class="row">
                    <div class="col-sm">
                        <div> <label for="tool-type">Tool Type </label>
                            <input class="form-control" type="text" id="${submission._id}-tool-type" placeholder="Input the name of the tool"></div>
                    </div>
                    <div class="col-sm">
                        <div><label for="tool-ID">Tool ID </label>
                        <input class="form-control" type="text" id="${submission._id}-tool-ID" placeholder="Input the ID of the tool"></div>
                    </div>
                    <button id="${submission._id}-new-tool" onclick=DOMManager.addTool("${submission._id}") class="btn btn-primary form-control">
                    Add tool</button>
                    </div>
                    </div>
                </div>
                </div><br>`
            );/*
            for (let i=0;i<submission.tools.length;i++){
                $(`#${submission._id}`).find(".card-body").append(
                    `<p>
                    <span id="name-${submission.tools[i]._id}> Tool description: ${submission.tools[i].toolType}</span>
                    <span id="id-${submission.tools[i]._id}> Assigned ID: ${submission.tools[i].toolID}</span>
                    <button class="btn btn-danger" onclick="DOMManager.returnTool("${submission._id}","${tool._id}")">Return this tool</button>
                    </p>`
                )
            }
        }
    }
}
DOMManager.getAllLog();
//function to create a checkout submision to the log
function submission(){
    //target by ID using jquery
    
    let submissionObject={
        toolName: toolName,
        hooman: submitter,
    }
    console.log(submissionObject);

   $.ajax({
        type: "POST",
        url: CRUD_URL+CRUD_API+resourceName,
        contentType:"application/json",
        data: JSON.stringify(submissionObject),
    //check if success

    ,
    })
}
$.ajax({
    type: "GET",
    url:  "https://65eea33008706c584d9bceeb.mockapi.io/api/v1/submissionLog",
    success: function(data){
        console.log("SUCCESS",data);
    },
    error: function(error){
        console.log("ERROR",error);
    },
})*/ 