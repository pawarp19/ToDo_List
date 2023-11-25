const taskinput=document.querySelector('.taskinput input');

let taskbox=document.querySelector('.taskbox');

let todos=JSON.parse(localStorage.getItem("todo-list"));

let editid;
let isedited=false;

let filters=document.querySelectorAll('.filters span');

let clearall=document.querySelector('.clear-btn');


const dateTimeElement = document.querySelector('.date-time');
function updateDateTime() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    const formattedDateTime = currentDate.toLocaleDateString('en-US', options);
    dateTimeElement.textContent = formattedDateTime;
}

updateDateTime();
setInterval(updateDateTime, 1000);


filters.forEach(btn => {
    btn.addEventListener('click',(e)=>{
        filters.forEach(btn=>{
            btn.classList.remove('active');
        })
        e.target.classList.add('active');
        showtodo(btn.id);
    })
})



function showtodo(filter){
    let li="";
    if(todos)
    {
        todos.forEach((todo,id) => {
        let iscompleted= todo.status == "completed" ? "checked" :"";
        const taskDate = new Date(todo.timestamp);
        const taskDateInfo = { date: taskDate.getDate(), month: taskDate.toLocaleString('default', { month: 'short' }) };
        if(filter == todo.status || filter =='all'){
        li +=`<li class="task">
        <label for="${id}">
            <input type="checkbox" onclick="updatestatus(this)" name="" id="${id}" ${iscompleted}>
            <p class="${iscompleted}">${todo.name}👉  ${taskDateInfo.date} ${taskDateInfo.month}</p>
        </label>
        <div class="settings">
            <i class="ri-more-fill" onclick="showmenu(this)"></i>
            <ul class="task-menu">
                <li onclick="edittask(${id},'${todo.name}')" ><i class="ri-pencil-fill"></i> Edit</li>
                <li onclick="deletetask(${id})"><i class="ri-delete-bin-7-line"></i> Delete</li>
            </ul>
        </div>
        </li>`
        }
        });
    }    
        taskbox.innerHTML=li ;     
}

showtodo("all");

function updatestatus(task){
    let taskname=task.parentElement.lastElementChild;
    if(task.checked){
        taskname.classList.add("checked");
        todos[task.id].status="completed";
    }
    else{
        taskname.classList.remove("checked");
        todos[task.id].status="pending";
    }
    localStorage.setItem("todo-list",JSON.stringify(todos));
}

function showmenu(task){
    let taskname=task.parentElement.lastElementChild;
    taskname.classList.add("show");
    document.addEventListener('click',e=>{
        if(e.target.tagName!="I" || e.target!=task){
            taskname.classList.remove("show");
        }
    })
}

function deletetask(deleteid){
    //remove selectd task from todos list
    taskinput.value="";
    todos.splice(deleteid,1);
    localStorage.setItem("todo-list",JSON.stringify(todos));
    showtodo('all');
}

function edittask(taskid,taskname){
    editid=taskid;
    taskinput.value = taskname;
    isedited=true;
}

clearall.addEventListener("click",()=>{
    todos.splice(0,todos.length);
    localStorage.setItem("todo-list",JSON.stringify(todos));
    taskinput.value="";
    showtodo('all');
})


taskinput.addEventListener('keyup',e=>{
    let userinput=taskinput.value.trim();
    if(e.key == "Enter" && userinput)
    {
        if(!isedited)
        {
            if(!todos){ 
            // if todo dose not exist pass an empty array to todos
                todos=[];
            }
            let taskinfo={name: userinput,status:"pending",timestamp: new Date().toISOString()};
            todos.push(taskinfo);
            taskinput.value="";
        }
        else{
            isedited=false;
            todos[editid].name=userinput;
        }
        localStorage.setItem("todo-list",JSON.stringify(todos));
        showtodo('all');
    
    }
})