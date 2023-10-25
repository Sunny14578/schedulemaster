var indexTime = ["08:00:00","09:00:00","10:00:00","11:00:00","12:00:00","13:00:00","14:00:00","15:00:00","16:00:00","17:00:00"];
var bgcolor = ["#5F00FF", "#003399", "#FF5E00", "#22741C", "#F15F5F", "#D941C5", "#5D5D5D", "#664B00", "#5F00FF", "#003399", "#FF5E00", "#22741C"];
var monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const modifiedTdIds = [];
const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    sidebar2 = body.querySelector(".sidebar2"),
    teacher = body.querySelector(".nav_link.teacher"),
    teacher_add_btn = body.querySelector(".bx.bx-user-plus.toggle"),
    modal = body.querySelector(".modal"),
    exit = body.querySelector(".exit"),
    error_popup = body.querySelector(".errormodal"),
    error_exit = body.querySelector(".bx.bx-x-circle.exit.error"),
    error_message = body.querySelector("#error_message"),
    sidebar_nav_a = body.querySelectorAll(".sidebar .nav.a.close"),
    sidebar22 = body.querySelectorAll(".sidebar2"),
    sidebar22_icon = body.querySelectorAll(".nav_link > a > i"), 
    sidebar22_text = body.querySelectorAll(".nav_link > a > span"),
    lecture_modal = body.querySelector("#lecture_modal"),
    lecture_add_btn = body.querySelector(".bx.bx-user-plus.toggle.room"),
    lecture_exit = body.querySelector(".exit.room"),
    lecture_room_menu = body.querySelector("#sidebar_room .menu-links"),
    teacher_menu = body.querySelector("#sidebar_teacher .menu-links"),
    table_lecture_room = body.querySelector(".lecture_room"),
    table = body.querySelector(".cell-table"),
    main_body = body.querySelector(".home.table-menu"),
    table_tools = body.querySelectorAll(".border-menu i"),
    background_modal = body.querySelector(".background_modal"),
    background_icon = body.querySelector(".bx.bxs-color-fill.icon"),
    quick_menu_icon = body.querySelectorAll(".quick-menu i");
    memo_icon = body.querySelector(".bx.bx-memory-card.icon");
    
    const undoStack = [];
    let editCells = [];
    let preEditCells = [];

    // base js
    document.body.addEventListener("contextmenu", (event) => {
        event.preventDefault(); // 기본 컨텍스트 메뉴를 표시하지 않음
        onDataTeacherGet();
    });

    // 실행취소
    document.addEventListener("keydown", (event) => {
        
        if (event.ctrlKey && event.key == "z" || event.ctrlKey && event.key == "Z") {
            console.log(123);
            event.preventDefault();
            const preState = undoStack.pop();
            const postState = postEditCells.pop();
            console.log(preState);

            if (preState){
                preState.forEach((cell, index) =>{
                    cell.style.filter = 'none'
                    postState[index].replaceWith(cell);
                });
            }
        }
    });


    // 다른영역 클릭시 모달창 끄기
    document.addEventListener("click", function(event) {
        const clickedElement = event.target;
        const tools = body.querySelectorAll(".tools");
        
        const isContained = Array.from(quick_menu_icon).some(icon => icon.contains(clickedElement));

        if (!isContained) {
            tools.forEach((tool, index) =>{
                if (tool.classList.contains('hidden')) {
                 
                } else {
                    tool.classList.toggle("hidden");
                }
            })
        } 
    });
    

    // tools

    menuHover = body.querySelector("#quick-menu-hover");
    menuText = body.querySelector(".quick-text");

    // quick_menu hover
    quick_menu_icon.forEach((icon, index) =>{
        let iconHoverTimer;

        const contents = ["저장 (Ctrl+S)", "테두리", "", "개발 예정", "채우기 색상", "메모", "달 추가(2개월)"]
        const widths = ["80px", "50px", "", "50px", "60px", "40px", "90px"]

        icon.addEventListener("mouseenter", () => {
            iconHoverTimer = setTimeout(() => {
                if (index != 2){
                    menuText.textContent = contents[index];

                    const iconRect = icon.getBoundingClientRect();
                    const left = iconRect.right + window.scrollX-10; 
                    const bottom = iconRect.bottom + window.scrollY+13; 
                    menuHover.style.width = widths[index];

                    menuHover.style.left = left + "px";
                    menuHover.style.top = bottom + "px";
                    menuHover.classList.remove("hidden");
                }
            }, 700); 
        });
        
        icon.addEventListener("mouseleave", () => {
            clearTimeout(iconHoverTimer);
            menuHover.classList.add("hidden");
        });

        icon.addEventListener("click", function() {
            switch (index) {
                case 0:
                    onUpdateCell();
                    break;
                case 3:
                    // if (selectedTds.length > 1) {
                        
                    //     const firstCell = selectedTds[0];
                    //     const lastCell = selectedTds[selectedTds.length - 1];
            
                    //     firstCell.colSpan = lastCell.cellIndex - firstCell.cellIndex + 1;
                    //     firstCell.rowSpan = lastCell.parentElement.rowIndex - firstCell.parentElement.rowIndex + 1;
            
                    //     // 선택된 셀 클래스 초기화
                    //     selectedTds.forEach(function(cell) {
                    //         cell.classList.remove("selected");
                    //     });

                    //     editCells.push(selectedTds[0]);
            
                    //     // 선택된 셀 배열 초기화
                    //     selectedTds = [];
                    // }
                    break;
                case 4:
                    const iconRect = background_icon.getBoundingClientRect();
                    const teacherInfo = localStorage.getItem("teacherInfo");
                    const teacherInfoList = JSON.parse(teacherInfo);
                    
                    // 모달 창의 위치 계산
                    const left = iconRect.right + window.scrollX -130; // 클릭한 요소의 오른쪽
                    const bottom = iconRect.bottom + window.scrollY; // 클릭한 요소의 위
            
                    // 모달 창의 위치 설정
                    background_modal.style.left = left + "px";
                    background_modal.style.top = bottom + "px";
            
                    teacher_color_tag.innerHTML = "";
            
                    teacherInfoList.forEach((teacher) => {
                        const newDiv = document.createElement("div");
                       
                        newDiv.style.backgroundColor = teacher.color;
                        newDiv.addEventListener("click", () => {
                            handleColorDivClick(newDiv);
                        });
            
                        let hoverTimer;
            
                        newDiv.addEventListener("mouseenter", () => {
                            hoverTimer = setTimeout(() => {
                                // 1초 이상 호버되었을 때 스타일 변경 및 추가 작업 수행
                                teacher_text_tag.textContent = teacher.name;
            
                                const iconRect = newDiv.getBoundingClientRect();
                                const left = iconRect.right + window.scrollX+20; // 클릭한 요소의 오른쪽
                                const bottom = iconRect.bottom + window.scrollY; // 클릭한 요소의 위
            
                                // 모달 창의 위치 설정
                                teacher_hover_tag.style.left = left + "px";
                                teacher_hover_tag.style.top = bottom + "px";
                                teacher_hover_tag.classList.toggle("hidden");
                            }, 1000); // 1초 (1000 밀리초) 지연
                        });
                    
                        newDiv.addEventListener("mouseleave", () => {
                            clearTimeout(hoverTimer);
                            if (!teacher_hover_tag.classList.contains("hidden")) {
                                teacher_hover_tag.classList.toggle("hidden");
                            }
                        });
                    
                        teacher_color_tag.appendChild(newDiv);
                    });
            
                    background_modal.classList.toggle("hidden");
            }
        });

        
    });

    // background color
    palette_color = body.querySelectorAll(".palette div");
    recent_color_tag = body.querySelector(".recent-color");
    teacher_color_tag = body.querySelector(".teacher-color");
    teacher_hover_tag = body.querySelector("#teacher-hover");
    teacher_text_tag = body.querySelector(".teacher-text");

    let selectedTdsColor = [];
    
    palette_color.forEach((colorDiv) => {
        colorDiv.addEventListener("click", (event) => {
            handleColorDivClick(colorDiv);
        });
    });
    let localColors = [];
    let postEditCells = [];

    function handleColorDivClick(colorDiv) {
        const backgroundColor = window.getComputedStyle(colorDiv).backgroundColor;
        background_modal.classList.toggle("hidden");
        
        if (selectedTdsColor) {
            selectedTdsColor.forEach((cell) => {
                // const style = window.getComputedStyle(cell);
                // preEditCells.push(style.backgroundColor);
                const clonedCell = cell.cloneNode(true); // 선택한 셀을 복사
                preEditCells.push(clonedCell);
            
                cell.style.backgroundColor = backgroundColor;
                editCells.push(cell);
            });

            undoStack.push(preEditCells);
            postEditCells.push(selectedTdsColor);
            
            preEditCells = [];
            
            selectedTdsColor = [];
        }
    }

    // background icon end


    let preTool = null

    table_tools.forEach((tool, index) =>{
        tool.addEventListener("mouseover", ()=>{

            if (preTool){
                preTool.style.backgroundColor = "";
            }
            tool.style.backgroundColor = "#E4E9F7";
            preTool = tool;
        });

        tool.addEventListener("click", ()=>{
            let rowIndexList = []
            let cellIndexList = []

            selectedTds.forEach((td)=>{
                const rowIndex = td.parentElement.rowIndex;
                const cellIndex = td.cellIndex;

                rowIndexList.push(rowIndex);
                cellIndexList.push(cellIndex);
            })

            const rowMax = Math.max(...rowIndexList);
            const rowMin = Math.min(...rowIndexList);
            const colMax = Math.max(...cellIndexList);
            const colMin = Math.min(...cellIndexList);

            if (index == 0){
                selectedTds.forEach((td, index)=>{
                    const cellIndex = td.cellIndex;
               
                    if (cellIndex == colMax){
                        td.style.borderRight = "2px solid black";
                        editCells.push(td);
                    }
                })

            }
            else if (index == 1){
                selectedTds.forEach((td, index)=>{
                    const cellIndex = td.cellIndex;
               
                    if (cellIndex == colMin){
                        td.style.borderLeft = "2px solid black";
                        editCells.push(td);
                    }
                })
            }
            else if (index == 2){
                selectedTds.forEach((td, index)=>{
                    const rowIndex = td.parentElement.rowIndex;
               
                    if (rowIndex == rowMin){
                        td.style.borderTop = "2px solid black";
                        editCells.push(td);
                    }
                })

            }
            else if (index == 3){
                selectedTds.forEach((td, index)=>{
                    const rowIndex = td.parentElement.rowIndex;
               
                    if (rowIndex == rowMax){
                        td.style.borderBottom = "2px solid black";
                        editCells.push(td);
                    }
                    
                })
            }
            else if (index == 4){
                selectedTds.forEach((td)=>{
                    td.style.border = "";
                    editCells.push(td);
                })
            }
            else if (index == 5){
                selectedTds.forEach((td)=>{
                    td.style.border = "2px solid black";
                    editCells.push(td);
                })
            }
            else if (index == 6){
                selectedTds.forEach((td, index)=>{
                    const rowIndex = td.parentElement.rowIndex;
                    const cellIndex = td.cellIndex;
                    
                    if (rowIndex == rowMin){
                        td.style.borderTop = "2px solid black";
                    }

                    if (rowIndex == rowMax){
                        td.style.borderBottom = "2px solid black";
                    }

                    if (cellIndex == colMin){
                        td.style.borderLeft = "2px solid black";
                    }

                    if (cellIndex == colMax){
                        td.style.borderRight = "2px solid black";
                    }

                    editCells.push(td);
                })
            }
            border_modal.classList.toggle("hidden");
        })
        
    });

    // save icon
    document.addEventListener("keydown", (event) => {
        // 기본 저장 동작을 막음 (브라우저에서의 저장)
        if (event.ctrlKey && event.key == "s" || event.ctrlKey && event.key == "S") {
            event.preventDefault();
            onUpdateCell();
        }
    });


    document.body.addEventListener("click", function(event) {
        const clickedElement = event.target; // 클릭된 요소
    
        // 클릭된 요소가 메모 태그 또는 메모 태그 내부의 요소인 경우 이벤트 무시
        if (clickedElement === memo_icon ) {
            memo_check = 2;
        }else if (memo_check == 2){
            textareaTag.classList.toggle("hidden");
            pre_memo.style.border = "1px solid rgb(221, 221, 221)"
            memo_check = 0;
        }


    });


    // memo icon
    textareaTag = body.querySelector("#memo");
    let memo_check = 0
    let pre_memo;

    memo_icon.addEventListener("click", async() => {
        const iconRect = memo_list.getBoundingClientRect();
        const left = iconRect.right + window.scrollX+1; // 클릭한 요소의 오른쪽
        const bottom = iconRect.bottom + window.scrollY-18; // 클릭한 요소의 위
        memo_list.style.border = "2px solid rgb(0, 0, 0)";
        pre_memo = memo_list;
        // 모달 창의 위치 설정
        textareaTag.style.left = left + "px";
        textareaTag.style.top = bottom + "px";
        textareaTag.classList.toggle("hidden");
        memo_check = 1
    })
    

    

    // memo icon end

    // tools end

    // icon
    plus_icon = body.querySelector(".bx.bx-plus.icon.plus");

    plus_icon.addEventListener("click", async() =>{
        plusMonthCreateCell();
    })

    border_modal = body.querySelector("#border_modal");
    border_icon = body.querySelector('.bx.bx-border-all.icon.border');
    borderAdd_icon = body.querySelector('.bx.bx-chevron-down.icon.arrow');
    borderAdd_icon.addEventListener("click", async() =>{
        const iconRect = borderAdd_icon.getBoundingClientRect();
    
        // 모달 창의 위치 계산
        const left = iconRect.right + window.scrollX; // 클릭한 요소의 오른쪽
        const bottom = iconRect.bottom + window.scrollY + 30; // 클릭한 요소의 위

        // 모달 창의 위치 설정
        border_modal.style.left = left + "px";
        border_modal.style.top = bottom + "px";

        border_modal.classList.toggle("hidden");
    })

    // icon event end //

    // teacher color add //
    let teacher_check = false
    let teacher_color = null
    let canvas;

    teacher_menu.addEventListener("click", function(evnet){
        teacher_check = true
        const clickedElement = event.target;
        if (clickedElement.tagName === "A" && teacher_check){
            const inputColor = clickedElement.querySelector("input[type='color']")
            
            if (inputColor) {
                const colorValue = inputColor.value;
                teacher_color = colorValue;
                drawColorAtMousePosition(teacher_color, event.clientX, event.clientY);
            }
        }
    })

    function drawColorAtMousePosition(color, x, y) {
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }

        canvas = document.createElement("canvas");
        canvas.width = 10; // 점의 너비
        canvas.height = 10; // 점의 높이
        const context = canvas.getContext("2d");
        context.fillStyle = color;
        context.beginPath();
        context.arc(5, 5, 5, 0, 2 * Math.PI);
        context.fill();
    
        canvas.style.position = "fixed";
   
        canvas.style.left = x + "px";
        canvas.style.top = y + "px";
    
        document.body.appendChild(canvas);

        document.addEventListener("mousedown", teacherAddMouseDown);
        document.addEventListener("mousemove", teacherAddMouseMove);

        document.addEventListener("contextmenu", (event) => {
            if (teacher_check){
                event.preventDefault(); // 기본 컨텍스트 메뉴를 표시하지 않음
                teacher_color = null
                teacher_check = null

                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas); // Canvas 제거
                }
            }
          });
    }

    function teacherAddMouseDown(event){
        const clickedElement = event.target
        if (clickedElement.tagName == "TD" && teacher_check && event.button === 0){
            clickedElement.style.backgroundColor = teacher_color;

            if (!editCells.includes(clickedElement)) {
                editCells.push(clickedElement);
            }
            console.log(editCells);
        }
    }

    function teacherAddMouseMove(event){
        if (teacher_check){
            x = (event.clientX-5) - canvas.width / 2; // 마우스 X 좌표
            y = (event.clientY-5) - canvas.height / 2; // 마우스 Y 좌표

            // canvas 위치 업데이트
            canvas.style.left = x + "px";
            canvas.style.top = y + "px";
        }
    }
   
    //


    // table td event
    function getBorderStyles(element) {
        const computedStyle = window.getComputedStyle(element);
        return {
          borderTop: computedStyle.getPropertyValue("border-top"),
          borderBottom: computedStyle.getPropertyValue("border-bottom"),
          borderLeft: computedStyle.getPropertyValue("border-left"),
          borderRight: computedStyle.getPropertyValue("border-right")
        };
      }
      
    let selectedTd = null;
    let preBorderStyle = null;
    let memo_list;

    table.addEventListener("click", function(event) {
        const clickedElement = event.target;
        memo_list = clickedElement;
        // 클릭한 요소가 td 요소인 경우만 처리
        if (clickedElement.tagName === "TD" && !teacher_color) {
            preBorderStyle = getBorderStyles(clickedElement);
            
            clickedElement.contentEditable = true;

        // 클릭한 td 요소에 포커스를 줌
            clickedElement.focus();

            // td 요소에서 포커스가 빠져나갈 때 처리
            clickedElement.addEventListener("blur", function() {
                // td 요소의 내용을 편집 불가능 상태로 변경
                clickedElement.contentEditable = false;
            });

            const tdId = clickedElement.getAttribute("id");

        // td 요소에서 키 입력 이벤트 처리
        clickedElement.addEventListener("keydown", function(event) {
            // 엔터 키를 누르면 편집 모드를 끝내고 값을 적용
            if (!editCells.includes(clickedElement)) {
                editCells.push(clickedElement);
            }

            if (event.key === "Enter" && event.shiftKey) {
                event.preventDefault(); // 엔터 키의 기본 동작 방지
                document.execCommand('insertText', false, '\n'); // 개행 추가
            }

            if (event.key === "Enter"){
                event.preventDefault(); // 엔터 키의 기본 동작 방지
                clickedElement.contentEditable = false; // 편집 모드 종료
                // modifiedTdIds.push(tdId);
            }
        });
            console.log(clickedElement.style.backgroundColor, "확인해보자");
            clickedElement.style.border = "2px solid #695CFE";
            selectedTd = clickedElement;
            selectedTdsColor.push(selectedTd);

            if (selectedTd){
                selectedTd.style.borderTop = preBorderStyle.borderTop;
                selectedTd.style.borderBottom = preBorderStyle.borderBottom;
                selectedTd.style.borderLeft = preBorderStyle.borderLeft;
                selectedTd.style.borderRight = preBorderStyle.borderRight;
            }
        }
    });
    // event end

    // mouse block designation
    let idsMouseDown = false;
    let startTd = null;
    let endTd = null;
    let startRowIndex, startColIndex, endRowIndex, endColIndex;
    let selectedTds = [];
    let mouseDownTimer;

    table.addEventListener("mousedown", (event) => {
        deselectTds();
        console.log(selectedTds);
        const clickedElement = event.target
        clearTimeout(mouseDownTimer);
        event.preventDefault();

        if (clickedElement.tagName == "TD" && !teacher_color){
           
            idsMouseDown = true;
            startTd = clickedElement;
            endTd = clickedElement;
           
            const tdIndex = Array.from(clickedElement.parentElement.children).indexOf(clickedElement);
    
            startRowIndex = endRowIndex = clickedElement.parentElement.rowIndex;
            startColIndex = endColIndex = tdIndex;
            selectedTds.push(clickedElement);
            clickedElement.classList.toggle("selected");
        }else if (clickedElement.tagName == "TD" && teacher_color){
            idsMouseDown = true;
            startTd = clickedElement;
            endTd = clickedElement;
                
            const tdIndex = Array.from(clickedElement.parentElement.children).indexOf(clickedElement);
    
            startRowIndex = endRowIndex = clickedElement.parentElement.rowIndex;
            startColIndex = endColIndex = tdIndex;
            selectedTds.push(clickedElement);
        }
    });

    table.addEventListener("mousemove", (event) => {
        const clickedElement = event.target
        if (clickedElement.tagName == "TD" && idsMouseDown && !teacher_color){
            
            if(selectedTds[0] != event.target){
                const tdIndex = Array.from(clickedElement.parentElement.children).indexOf(clickedElement);
                endRowIndex = clickedElement.parentElement.rowIndex;
                endColIndex = tdIndex;

                selectTds();
            }
        }else if(clickedElement.tagName == "TD" && idsMouseDown && teacher_color){
            if(selectedTds[0] != event.target){
                const tdIndex = Array.from(clickedElement.parentElement.children).indexOf(clickedElement);
                endRowIndex = clickedElement.parentElement.rowIndex;
                endColIndex = tdIndex;  
            
                selectTds();
            }
        }
    });

    table.addEventListener("mouseup", () => {
        idsMouseDown = false;
    });

    function selectTds() {
       
        if (teacher_color){
            selectedTds.forEach((td) => {
                td.style.backgroundColor = teacher_color;
                if (!editCells.includes(td)) {
                    editCells.push(td);
                }
            });

            selectedTds = [];
        
            // 선택된 영역의 TD 선택
            for (let i = Math.min(startRowIndex, endRowIndex); i <= Math.max(startRowIndex, endRowIndex); i++) {
              const row = table.rows[i];
              for (let j = Math.min(startColIndex, endColIndex); j <= Math.max(startColIndex, endColIndex); j++) {
                const td = row.cells[j];
                selectedTds.push(td);
                td.style.backgroundColor = teacher_color;
              }
            }
        }else{
            selectedTds.forEach((td) => {
                td.classList.toggle("selected");
            });

            selectedTds = [];
        
            // 선택된 영역의 TD 선택
            for (let i = Math.min(startRowIndex, endRowIndex); i <= Math.max(startRowIndex, endRowIndex); i++) {
              const row = table.rows[i];
              for (let j = Math.min(startColIndex, endColIndex); j <= Math.max(startColIndex, endColIndex); j++) {
                const td = row.cells[j];
                selectedTds.push(td);
                td.classList.toggle("selected");
              }
            }
        }
        selectedTdsColor = selectedTds;

      } 

      function deselectTds() {
        // 모든 선택된 TD 초기화
        selectedTds.forEach((td) => {
          td.classList.remove("selected");
        });
        selectedTds = [];
      }

    
    toggle.addEventListener("click", () =>{
        sidebar.classList.toggle("close");
        
        sidebar22.forEach((side, index2) => {
            side.classList.toggle("close2");
        })
    })


    exit.addEventListener("click", () => {
        modal.classList.toggle("hidden");
    })

    lecture_exit.addEventListener("click", () => {
        lecture_modal.classList.toggle("hidden");
    })

    error_exit.addEventListener("click", () => {
        error_popup.classList.toggle("hidden");
    })


    teacher_add_btn.addEventListener("click", () => {
        modal.classList.toggle("hidden");
    })

    lecture_add_btn.addEventListener("click", () => {
        lecture_modal.classList.toggle("hidden");
    })   

    let preNavindex = null;
    
    sidebar_nav_a.forEach((nav, index) => {
        nav.addEventListener("click", () => {
            
            if (preNavindex === nav){
                main_body.classList.toggle("close");
                preNavindex = null;
            }else{
                if(preNavindex){
                    preNavindex = nav;
                }else{
                    main_body.classList.toggle("close");
                    preNavindex = nav;
                }
            }
            nav.classList.toggle("close");

            sidebar_nav_a.forEach((nav2, index2) => {
                if ( index != index2){
                    
                    nav2.className = "nav a close"
                }
                
            })

            sidebar22[index].classList.toggle("close");
            sidebar22_icon[index].classList.toggle("close");
            sidebar22_text[index].classList.toggle("close");
            

            sidebar22.forEach((side, index2) => {
                if (index == 0){
                    onDataTeacherGet();
                }

                if (index == 1){
                    onDataLectureGet();
                }
                
                if (index != index2){
                    if (sidebar.classList.toString() === "sidebar"){
                        
                        side.className = "sidebar2 close"
  
                    }else{
                        side.className = "sidebar2 close close2"
                    }
                }
            })

            sidebar22_icon.forEach((side, index2) => {
                if (index != index2){
                    side.classList.add("close");
                }
            })

            sidebar22_text.forEach((side, index2) => {
                if (index != index2){
                    side.className = "text nav-text close"
                }
            })
        })
    })


    
function onDataPost() {
    const emInput = document.querySelector('#email').value;
    const nameInput = document.querySelector('#name').value;
    const pwInput = document.querySelector('#password').value;
    const pnInput = document.querySelector('#phonenumber').value;
    
    const token = localStorage.getItem('authToken');
    let userdata = 1;

    if (token) {
        userdata = JSON.parse(localStorage.getItem('user'));
    } 
    const apiUrl = '/api/join/user/';
    
    const data = {
        email: emInput,
        name:nameInput,
        password: pwInput,
        phone_number:pnInput,
        role:2,
        company_id:userdata.company_id
    };
    
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        // console.log('서버 응답 데이터:', data);
        // 로그인 성공 또는 실패 여부를 처리
        if (data.message) {
            emInput.value = "";
            nameInput.value = "";
            pwInput.value = "";
            pnInput.value = "";
            alert("가입완료");

        } else {
            const labelElement = document.querySelector('label[for="email"]');
            
            if (labelElement) { // label 요소가 존재하는지 확인
                labelElement.classList.add('warning');
            }
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });
    }
    
    // 전체 화면에서 키 입력을 감지
    window.addEventListener('keydown', function(event) {
        if (event.keyCode === 13 && modal.classList.toString() === "modal") {
            onDataPost(); // 
        }
    });

async function onDataLecturePost() {
    const roomInput = document.querySelector('#room_name').value;
   
    const token = localStorage.getItem('authToken');
    let userdata = 1;
    
    if (token) {
            userdata = JSON.parse(localStorage.getItem('user'));
    } 
    const apiUrl = '/api/lecture/';

    const data = {
        room_name: roomInput,
        company_id: userdata.company_id,
    };
        
    try{
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        
        if (!response.ok) {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
        }

        const responseData = await response.json();
        
        if (responseData.message) {
            roomInput.value = "";
          
            onCreateCell(responseData.data.room_id);
           
        } else {
            const labelElement = document.querySelector('label[for="room_name"]');

            if (labelElement) { // label 요소가 존재하는지 확인
                labelElement.classList.add('warning');
            }
        }
    } catch (error){
        console.error("에러 발생:", error);
    }
}
    
    window.onload = function(){
        onDataLectureRoomGet();
        onDataCellGet();
    }


function onDataLectureGet(){
    const apiUrl = '/api/lecture/';

    fetch(apiUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        lecture_room_menu.innerHTML = '';
        const roomNames = data.map(item => item.room_name);

        for (var i=0; i<roomNames.length; i++){
            var new_litag = document.createElement("li");
            new_litag.className = "nav_link room";

            var new_atag = document.createElement("a");
            new_atag.className = "nav a close";

            var new_span = document.createElement("span");
            new_span.className = "text nav-text name";
            new_span.textContent = roomNames[i];

            new_litag.appendChild(new_atag);
            new_atag.appendChild(new_span);
            lecture_room_menu.appendChild(new_litag);
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });
}

function onDataTeacherGet(){
    const apiUrl = '/api/teacher/';

    fetch(apiUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        teacher_menu.innerHTML = '';
        const teacherNames = data.map(item => item.name);
        const colors = data.map(item => item.color)

        const teacherInfo = data.map(item => ({ id: item.id, name: item.name, color: item.color}));
        localStorage.setItem('teacherInfo', JSON.stringify(teacherInfo));

        for (var i=0; i<teacherNames.length; i++){
            var new_litag = document.createElement("li");
            new_litag.className = "nav_link teacher";

            var new_atag = document.createElement("a");
            new_atag.className = "nav a close";

            var new_span = document.createElement("span");
            new_span.className = "text nav-text name";
            new_span.textContent = teacherNames[i];

            var new_input = document.createElement("input");
            new_input.className = "nav-color color";
            new_input.type = "color"
            new_input.value = colors[i];


            new_litag.appendChild(new_atag);
            new_atag.appendChild(new_span);
            new_atag.appendChild(new_input);
            teacher_menu.appendChild(new_litag);
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });
}


async function onDataLectureRoomGettest() {
    const apiUrl = '/api/lecture/';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
        }

        const data = await response.json();
        const roomNames = data.map(item => item.room_name);
        const roomIdNames = data.map(item => item.room_id);
        
        localStorage.setItem('roomIdNames', roomIdNames);
    
        const table_lecture_room_test = document.querySelector('.lecture_room');

        for (var i = 0; i < roomNames.length; i++) {
            var new_litag = document.createElement("li");
            new_litag.contentEditable = true;
            new_litag.textContent = roomNames[i];

            table_lecture_room_test.appendChild(new_litag);
        }
    } catch (error) {
        console.error('에러 발생:', error);
    }
}


function onDataLectureRoomGet(){
    const apiUrl = '/api/lecture/';

    fetch(apiUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        table_lecture_room.innerHTML = '';
        const roomNames = data.map(item => item.room_name);
        const roomIdNames = data.map(item => item.room_id);
        console.log(roomIdNames);
        localStorage.setItem('roomIdNames', roomIdNames);

        for (var i=0; i<roomNames.length; i++){
            var new_litag = document.createElement("li");
            new_litag.contentEditable = true;
            new_litag.textContent = roomNames[i];

            table_lecture_room.appendChild(new_litag);
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });
}

function onCreateCell(lecture_room_id){
    var currentDate = new Date();
    var monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    data_group = [] // post 요청을 줄이기위해 데이터 그룹화
   
    let maxMonthList = localStorage.getItem("maxMonthList");
    let minMonthList = localStorage.getItem("minMonthList");
    let yearListString = localStorage.getItem("yearList");
    let yearList = JSON.parse(yearListString);

    let yearMaxMonthList = maxMonthList.split(",").slice(0,yearList.length);
    let yearminMonthList = minMonthList.split(",").slice(0,yearList.length);
    let check = 2

    if (!maxMonthList){
        var year = currentDate.getFullYear();
        yearList = [year]
        check = 1
    }

    for (let yy = 0; yy < yearList.length; yy++){
        if (isLeapYear((yearList[yy]))){
            monthsDays[1] = 29
        }

        let mmin = parseInt(yearminMonthList[yy])
        let mmax = parseInt(yearMaxMonthList[yy])

        if (check === 1){
            mmin = currentDate.getMonth() + 1;
            mmax = currentDate.getMonth() + 1;
        }
        
        for (let month = mmin; month < mmax+1; month++){
            for (let index = 0; index < indexTime.length; index++){
                for (let day = 1; day <= monthsDays[month-1]; day++){
                    data = {
                        "lecture_room_id":lecture_room_id,
                        "day":day,
                        "month":month,
                        "time":indexTime[index],
                        "year":yearList[yy]
                    }
                data_group.push(data);
                }
            }
        }
    }
    onDataLectureRoomGet();
    postData(data_group);
}


async function postData(dataList) {
    const apiUrl = '/api/schedule/';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataList), 
        });

        console.log(response);

        if (response.ok) {
            const responseData = await response.json();
            onDataCellGet();
        } else {
            console.error('데이터 전송 실패:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('에러 발생:', error);
    }
}

// 달 추가
function plusMonthCreateCell(){
    
    let maxMonth = parseInt(localStorage.getItem('maxMonth'));
    const yearListString = localStorage.getItem("yearList");
    let yearList = JSON.parse(yearListString);
    
  
    if (maxMonth==12){
        yearList.push(yearList[yearList.length-1]+1);
        maxMonth=0;
    }
   
    const lastYear = (yearList[yearList.length-1]);

    var monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const rooms = localStorage.getItem('roomIdNames');
    const splitRooms = rooms.split(',');

    data_group = []

    if (isLeapYear(lastYear)){
        monthsDays[1] = 29
    }

    for (let room_id = 0; room_id < splitRooms.length; room_id++){
        for (let month = maxMonth; month < maxMonth+2; month++){
            for (let index = 0; index < indexTime.length; index++){
                for (let day = 1; day <= monthsDays[month]; day++){
                    data = {
                        "lecture_room_id":parseInt(splitRooms[room_id]),
                        "day":day,
                        "month":month+1,
                        "time":indexTime[index],
                        "year":lastYear
                    }
                    data_group.push(data);
                }
            }
        }
    }

    postData(data_group);
}
// 윤년판단

function isLeapYear(year) {
    // 4로 나누어 떨어지는 연도 중에서
    // 100으로 나누어 떨어지지 않거나 400으로 나누어 떨어지는 경우 윤년
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function onDataCellGet(){
    const apiUrl = '/api/schedule/';

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType:'json',
        success: function (data){
        table.innerHTML = '';
        var monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        const rooms = localStorage.getItem('roomIdNames');
        const splitRooms = rooms.split(',');
        const years = data.map(item => item.year);
        const maxYear = Math.max(...years);
        const minYear = Math.min(...years);

        const yearList = [];
        const maxMonthList = [];
        const minMonthList = [];

        for (let yy = minYear; yy <= maxYear; yy++) {
            yearList.push(yy);
        }

        localStorage.setItem('yearList', JSON.stringify(yearList));

        const maxYeardata = data.filter(item => item.year == maxYear);
        const months = maxYeardata.map(item => item.month);
        const maxMonth = Math.max(...months);

        const minYeardata = data.filter(item => item.year == minYear);
        const months2 = minYeardata.map(item => item.month);
        const minMonth = Math.min(...months2);

        localStorage.setItem('maxMonth', maxMonth);
        localStorage.setItem('minMonth', minMonth);

        let thead;

        for (let i = 0; i < splitRooms.length; i++){
            const FilterData = data.filter(item => item.lecture_room_id == splitRooms[i]);
            
            if (FilterData.length > 0){ 
                if (i%2==0){
                    thead = document.createElement('thead');
                    
                    const FilterRowData = FilterData.filter(item => item.time == indexTime[0]);
                    const cols = FilterRowData.length;
    
                    const tr = document.createElement('tr');
                    const theadRowFragment = document.createDocumentFragment();

                    const tr2 = document.createElement('tr');
                    const theadRowFragment2 = document.createDocumentFragment();
                    let MonthCnt = 0;   
                    let maxMonth2 = 0;
                    let minMonth2 = 0;
                    
                    for (let year = 0; year < yearList.length; year++){
                        
                        if (year == yearList.length-1){
                            MonthCnt = maxMonth;
                        }else{
                            MonthCnt = 12
                        }

                        if (isLeapYear(yearList[year])){
                            monthsDays[1] = 29
                        }else{
                            monthsDays[1] = 28
                        }

                        const FilterYearData = FilterRowData.filter(item => item.year == yearList[year]);
                        const months = FilterYearData.map(item => item.month);
                        maxMonth2 = Math.max(...months);

                        const months2 = FilterYearData.map(item => item.month);
                        minMonth2 = Math.min(...months2);
                        maxMonthList.push(JSON.stringify(maxMonth2));
                        minMonthList.push(JSON.stringify(minMonth2));
                        let monthRange = 0;

                        if (maxMonth2 == minMonth2){
                            monthRange = maxMonth2;
                        }else{
                            monthRange = maxMonth2;
                        }
                        
                        for (let mm = minMonth2; mm < monthRange+1; mm++){
                            const monthIndex = mm > 12 ? mm - 12 : mm;
                            
                            const FilteMonthData = FilterYearData.filter(item => item.month == monthIndex)
                            
                            for (let j = 0; j < monthsDays[monthIndex-1]; j++){
                                const td = document.createElement('td');

                                const year = FilteMonthData[j].year;
                                const month = FilteMonthData[j].month;
                                const day = FilteMonthData[j].day;
                                const weekendCheck = isWeekend(year, month, day);

                                let back_color = "white"
        
                                if (weekendCheck == 6){
                                    back_color = "rgb(0, 176, 240)"
                                }else if (weekendCheck == 0){
                                    back_color = "rgb(255, 0, 0)"
                                }

                                td.textContent = FilteMonthData[j].day;
                                td.style.backgroundColor = back_color;
                                theadRowFragment.appendChild(td);
                            }
                        }
                        
                        for (let m = minMonth2; m < monthRange+1; m++){
                            const monthIndex = m > 12 ? m - 12 : m;

                            const td2 = document.createElement('td');
                            td2.textContent = monthIndex+"월";
                            td2.setAttribute('colspan', monthsDays[monthIndex-1]);
                            theadRowFragment2.appendChild(td2);
                            td2.style.backgroundColor = bgcolor[monthIndex-1];
                        }
                    }
                    tr.appendChild(theadRowFragment);
                    thead.appendChild(tr)
                    tr2.appendChild(theadRowFragment2);
                    thead.appendChild(tr2);
                    table.appendChild(thead);
                }
                
                const tbody = document.createElement('tbody');
                tbody.setAttribute('id', rooms[i]+"tbody");

                for (let i = 0; i < 10; i++){
                    const tr = document.createElement('tr');
                    if (i == 5){
                        tr.setAttribute('class', "row-block");
                    }

                    const rowfragment = document.createDocumentFragment();
                    const FilterRowData = FilterData.filter(item => item.time == indexTime[i]);

                    const cols = FilterRowData.length;

                    for (let j = 0; j < cols; j++){
                        const td = document.createElement('td');
                        td.setAttribute('id', FilterRowData[j].schedule_cell+"td");
                        const cellContent = FilterRowData[j].cell_content;
                        const border = FilterRowData[j].border;
                        const boder_list = border.split(';');
                     
                        let backgroundColor = FilterRowData[j].background_color;
                      
                        td.textContent = cellContent;
                        td.style.borderTop = boder_list[0];
                        td.style.borderRight = boder_list[1];
                        td.style.borderBottom = boder_list[2];
                        td.style.borderLeft = boder_list[3];
                        
                        if (backgroundColor != 'white'){
                            td.style.backgroundColor = backgroundColor;
                        }
                    
                        rowfragment.appendChild(td);
                    }
                    tr.appendChild(rowfragment);
                    tbody.appendChild(tr);
                }
                table.appendChild(tbody);
            }
        }

        localStorage.setItem('maxMonthList', maxMonthList);
        localStorage.setItem('minMonthList', minMonthList);

        },
        error: function (xhr, status, error){
            console.error('데이터 가져오기 실패:', status, error);
        }
    });
}
// 주말체크
function isWeekend(year, month, day) {
    // js에서 월은 0부터 시작
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0 (일요일)부터 6 (토요일)까지의 값을 반환
    let result = null
    if (dayOfWeek == 0){
        result = 0
    }else if (dayOfWeek == 6){
        result = 6
    }

    return result; // 0 또는 6인 경우에 주말
}
   
// update cells
function onUpdateCell(){
    const data_group = []

    editCells.forEach((td) => {
        const computedStyle = window.getComputedStyle(td);

        let combinedBorder = null
        const borderValue = computedStyle.border;
        
        const borderTop = computedStyle.borderTop;
        const borderBottom = computedStyle.borderBottom;
        const borderRight = computedStyle.borderRight;
        const borderLeft = computedStyle.borderLeft;

        combinedBorder = `${borderTop};${borderRight};${borderBottom};${borderLeft}`;

        const pk = td.id;
        const textContent = td.textContent;
        const backgroundColor = computedStyle.backgroundColor;
        const modiPk = pk.replace("td", "");
       
        data = {
            "pk":modiPk,
            "cell_content":textContent,
            "border":combinedBorder,
            "background_color":backgroundColor
        }
        data_group.push(data);
    });
    console.log(data_group);
    postUpdateData(data_group);
}

async function postUpdateData(dataList) {
    const apiUrl = '/api/schedule/';

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataList), 
        });

        console.log(response.message);

        if (response.ok) {
            const responseData = await response.json();
            
            if (responseData.message == 0){
                const regex = /Duplicate entry '([^']*)-([0-9]+)'/;
                const matches = responseData.error.match(regex);
                const dates = matches[1].split("-");
                const datesmessage = dates[0]+"년 "+dates[2]+"월 "+dates[1]+"일 "+dates[3].split(":")[0]+"시";

                const info = localStorage.getItem("teacherInfo");
                const teacherInfo = JSON.parse(info);
                const matchingTeacher = teacherInfo.find(teacher => teacher.id == matches[2]);
         
                error_message.innerHTML = matchingTeacher['name'] + "님의 " + datesmessage
                error_popup.classList.toggle("hidden");
            }else{
                editCells = []
            }
        } else {
            console.error('데이터 전송 실패:', response.status, response.statusText);
        }
    } catch (error) {
       
    }
}
        
 
