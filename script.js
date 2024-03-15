//our url
mockapi_url="https://65eea33008706c584d9bceeb.mockapi.io/api/v1/submissionLog";
//create a submission log that consists of: the person name who's submitting the log,
// name of the project/destination that the tools are going to be used for, and a list of tools
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

//show everything on the api
activeLog = () =>{
    $.ajax({
        type: 'GET',
        url: mockapi_url,
        contentType: 'application/json',
        success: function(data){
            console.log("SUCCESS");
            $("#active").append(
                JSON.stringify(data)
            )
        },
        error: function(error){
            console.log("ERROR",error);
        }
    })
};
activeLog();
//delete Submission attempt delete the submission
var deleteSubmission = (id)=>{
    $.ajax({
        url: mockapi_url+`/${id}`,
        type: 'DELETE',
    })
    $(`#submission_${id}`).remove();
}
//add tools to the list, tool is going to be added in array
addToolToList=(id,type,submissionID)=>{
    //Tool class
    let newTool=new Tool(id,type);
    //show what tools got added in html
    $("tbody").append(
        `<tr>
        <td>${newTool.toolType}</td>
        <td>${newTool.toolID}</td>
      </tr>`)
      //get the right submission by taking the id and manipulate the tool array in that submission
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
    let inputSubmission=new Submission($('#hooman').val(),$('#projectName').val());
    let submissionObject={
        hooman:inputSubmission.name,
        projectName:inputSubmission.destination,
        tool:inputSubmission.tools,
    }
    //post a new submission when user clicks in "Log" button
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
            <button class="btn btn-danger" type='submit' onclick="deleteSubmission(${usedID})">
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
