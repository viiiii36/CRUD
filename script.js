//Tool class that has 3 tool characteristics: tool ID, description of the tool and the tool's calibration info
class Submission{
    //operator name and the tool's destination
    constructor(name,location){
        this.location=location;
        this.name=name;
        this.tools=[]
    }
    addTool(toolID,toolType){
        this.tools.push(new Tool(toolID,toolType));
    }
}
//Submission has 3 infos: check out timestamp, which tool ID that gets checked out and who is checking the tool out
class Tool{
    constructor(toolID,toolType){
        this.toolID=toolID;
        this.toolType=toolType;
        
    }
    
}
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
    static getAllLog(){
        CheckingOut.getAllLog().then(submissions=>this.render(submissions));
    }
    static activateReturn
    static render(submissions){
        this.submissions=submissions;
        $('#list').empty();
        for (let submission of submissions){
            $("#list").prepend(
                `<div id='${submission._id}' class="card">
                    <div class="card-header">
                    <h2>${submission.name}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.activeReturn('${submission._id}')">
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
            );
            for (let tool of submission.tools){
                $(`#${submission._id}`).find(".card-body").append(
                    `<p>
                    <span id="name-${tool._id}> Tool description: ${tool.toolType}</span>
                    <span id="id-${tool._id}> Assigned ID: ${tool.toolID}</span>
                    <button class="btn btn-danger" onclick="DOMManager.returnTool("${submission._id}","${tool._id}")">Return this tool</button>
                    </p>`
                )
            }
            
        }
    }
}
DOMManager.getAllLog();
/*
//function to create a checkout submision to the log
function submission(){
    //target by ID using jquery
    let toolType=$('#tool-Type').val();
    let toolID=$('#tool-ID').val();
    let toolName=`${toolType} with ID: ${toolID}`;
    let submitter=$('#hooman').val();
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

    success: function(data){
        console.log("SUCCESS",data);
    },
    error: function(error){
        console.log("ERROR",error);
    },
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




