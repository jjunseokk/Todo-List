// 유저가 값을 입력한다.
// + 버튼을 클릭하면, 할일이 추가된다.
// delete 버튼을 누르면 할일이 삭제된다.
// check 버튼을 누르면 할일이 끝나면서 밑줄이 간다.
// 1. check 버튼을 클릭하는 순간 true -> false
// 2. true 이면 끝난걸로 간주하고 밑줄보여주기
// 3. false이면 안끝난걸로 간주하고 그대로
// 진행중 끝남 탭을 누르면, 언더바가 이동한다.
// 끝남탭은, 끝난 아이템만, 진행중탭은 진행중인 아이템만
// 전체탭을 누르면 다시 전체 아이템으로 돌아옴.

let taskInput = document.getElementById("input-task"); // input값을 할당.
let addBtn = document.getElementById("addBtn"); // button +의 값을 할당.
let tabs = document.querySelectorAll(".task-tabs div"); //task-tabs 안에 있는 div를 전부 할당
let underLine = document.getElementById("under-line");
let taskList = []; //할일
let filterList =[]; //탭을 바꿀 때 taskList가 지워지지 않게 따로 배열 할당
let mode ="all"; //처음은 all 탭으로 설정;

let checkShow = document.getElementById("checkBtn");

//이벤트 함수 선언
// +버튼을 누르면 리스트를 추가하는 함수 선언.
addBtn.addEventListener("click", add); 

taskInput.addEventListener("focus", showFocus);

// enter눌렀을 때 입력하기.
taskInput.addEventListener("keypress", function(event){
    if(event.keyCode===13){
        add();
        taskInput.value="";
    }
});

// 마우스를 눌렀을 때 입력창 값 초기화
function showFocus(){
    taskInput.value ="";
}



// 탭선택할때, 클릭이벤트
for(let i=1; i<tabs.length; i++){
    tabs[i].addEventListener("click",function(event){
        filter(event)
    });
}
console.log(tabs);

// + 버튼을 클릭하면, 할일이 추가된다.
// 버튼 추가 함수 생성
function add(){
    let task ={
        // 항목을 지울 때 컴퓨터가 어떤 것을 지울지 알아야하는데 
        // 사람처럼 주민번호가 다 있듯이 각 항목에도 id가 있어야한다.
        id : randomIDGenerate(),
        taskContent : taskInput.value,
        isComplete : false
    };
    taskList.push(task);
    console.log(taskList);

    render();
}
// 처음 방법
// function add(){
//     let taskContent = taskInput.value
//     taskList.push(taskContent);
//     console.log(taskList);

//     render();
// }


// 버튼을 눌렀을 때 추가해야할 리스트 출력 내용
function render(){
    let list=[]; //taskList안에 있는 내용이 삭제 되지 않기 위해.
    if(mode=="all"){
        list=taskList;
    } else if(mode=="ongoing"){
        list=filterList;
    } else if(mode=="done"){
        list=filterList;
    }

    let resultHTML="";
    for(let i=0;i<list.length; i++){ //taskList배열안에 있는 것을 하나하나 꺼내..
        if(list[i].isComplete == true){
            resultHTML+=`<div class="task">
            <div class="task-done">${list[i].taskContent}</div>
            <div class="btnArea">
                <button onclick="checkBtn('${list[i].id}')" class="checkBtn"><i class="fa-solid fa-arrow-rotate-left"></i></button>
                <button onclick="trashBtn('${list[i].id}')" class="trashBtn"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`
        } else{
            resultHTML+=`<div class="task">
            <div class="task-ndone">${list[i].taskContent}</div>
            <div>
                <button onclick="checkBtn('${list[i].id}')" class="checkBtn"><i class="fa-solid fa-check"></i></button>
                <button onclick="trashBtn('${list[i].id}')" class="trashBtn"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`
        }
    }

    document.getElementById("text-area").innerHTML = resultHTML;
}


// 체크버튼 누를 때 이벤트 적용
function checkBtn(id){
    console.log("id: ",id);
        for(let i=0; i<taskList.length; i++){
            if(taskList[i].id == id){
                taskList[i].isComplete = !taskList[i].isComplete;
                break;
            }
        }
        render();
    }

// 삭제버튼 누를 때 이벤트 적용
function trashBtn(id){
    if(mode=="all"){
        for(let i=0; i<taskList.length; i++){
            if(taskList[i].id == id){
                taskList.splice(i,1);
                break;
            }
        }
        render();
    } else if(mode=="ongoing"||mode=="done") {
        for(let i=0; i< filterList.length; i++){
            if(filterList[i].id == id || taskList[i].id == id){
                filterList.splice(i,1);
                for(let i=0; i<taskList.length; i++){
                    if(taskList[i].id == id){
                        taskList.splice(i,1);
                        break;
                    }
                }
                break;
            }
        }
        render();
    } 
}

function filter(event){
    mode=event.target.id;
    filterList= [];

    // 하단 바..
    underLine.style.transition="1s";
    // offsetwidth 는 아이템의 가로길이
    underLine.style.width = event.target.offsetWidth + "px";
    underLine.style.left = event.target.offsetLeft + "px";
    underLine.style.top =
      event.target.offsetTop + (event.target.offsetHeight -4) + "px";
    // 하단 바 끝.

    if(mode=="all"){
        render();
    } else if(mode=="ongoing"){
        for(let i=0; i<taskList.length; i++){
            if(taskList[i].isComplete==false){
                filterList.push(taskList[i]);
            }
        }
        render();
    } else if(mode=="done"){
        for(let i=0; i<taskList.length; i++){
            if(taskList[i].isComplete==true){
                filterList.push(taskList[i]);
            }
        }
        render();
    }
}

// 랜덤아이디 출력.
function randomIDGenerate(){
    return '_' + Math.random().toString(36).substr(2, 9);
}
