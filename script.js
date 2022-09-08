window.addEventListener('DOMContentLoaded', () => {
    let rowArr = [];
    let arrStart = [];
    const objStart = {};
    const appendBtn = document.querySelector('.append__btn');
    function getTitleDate() {
        const now = new Date(),
              title = document.querySelector('.title');

        title.innerHTML = `Сводка о простоях по техническим причинам плавмеханизации ВТПК ${now.getFullYear()} г. за ${now.getDate()}.0${now.getMonth() + 1}`;
    }


    

    function startPost(start, end) {
        fetch('http://localhost:3000/summary')
                .then(response => response.json())
                .then(json => {
                    Object.entries(json).forEach((item, i, arr) => {
                        const row = document.createElement('div');
                        const  numberMeh = document.createElement('div'),
                            meh = document.createElement('div');
                            start = document.createElement('div'),
                            end = document.createElement('div'),
                            reason = document.createElement('div'),
                            result = document.createElement('div'),
                            btn = document.createElement('button'),
                            delBtn = document.createElement('button'),
                            inputStart = document.createElement('input'),
                            inputEnd = document.createElement('input'),
                            inputReason = document.createElement('input');
                            reasonText = document.createElement('div');
                            reasonBtn = document.createElement('button');
                            wrap = document.querySelector('.summary__wrap');

                            row.classList.add('summary__row');
                            numberMeh.classList.add('summary__number');
                            meh.classList.add('summary__meh');
                            start.classList.add('summary__start');
                            end.classList.add('summary__end');
                            reason.classList.add('summary__reason');
                            inputStart.classList.add('summary__start-input');
                            inputEnd.classList.add('summary__end-input');
                            inputReason.classList.add('summary__reason-input');
                            reasonText.classList.add('summary__reason-text');
                            reasonBtn.classList.add('btn', 'btn__reason');
                            result.classList.add('summary__result');
                            btn.classList.add('btn', 'btn__enter');
                            btn.textContent = 'Внести';
                            delBtn.classList.add('btn', 'del__btn');
                            delBtn.textContent = 'Удалить механизм';
                            reasonBtn.textContent = 'Стереть';
                            arr.push(btn);


                           

                           if (item[0] == "character") {
                               document.querySelectorAll('.summary__generalise-charactervalue').forEach((value, j) => {
                                    setTimeout(function() {
                                        if (j == 0) {
                                            value.textContent = item[1].electro;
                                        } else if (j == 1) {
                                            value.textContent = item[1].diesel;
                                        } else if (j == 2) {
                                            value.textContent = item[1].technology;
                                        }
                                    }, 1000)
                               })
                           } else if (item[0] == "months") {
                                document.querySelectorAll('.summary__generalise-monthvalue').forEach((value, j) => {
                                    setTimeout(function() {
                                        if (j == 0) {
                                            value.textContent = item[1].april;
                                        } else if (j == 1) {
                                            value.textContent = item[1].may;
                                        } else if (j == 2) {
                                            value.textContent = item[1].june;
                                        } else if (j == 3) {
                                            value.textContent = item[1].jule;
                                        } else if (j == 4) {
                                            value.textContent = item[1].august;
                                        } else if (j == 5) {
                                            value.textContent = item[1].september;
                                        } else if (j == 6) {
                                            value.textContent = item[1].october;
                                        } else if (j == 7) {
                                            value.textContent = item[1].november;
                                        }
                                    }, 1000)
                                })
                           } else if (item[0] == 'allSum') {
                                document.querySelector('.summary__allhours-value').textContent = item[1];
                           } else {
                                numberMeh.textContent = +item[0] + 1;
                                meh.textContent = item[1].name;
                                result.textContent = item[1].sum;
                                if (item[1].reason == undefined) {
                                    reasonText.textContent = '';
                                } else if (item[1].reason == '') {
                                    
                                }
                                else {
                                    reasonText.textContent = `${item[1].reason} c ${start} до ${end}`;
                                }

                                start.append(inputStart);
                                end.append(inputEnd);
                                reason.append(inputReason);
                                reason.append(reasonText);
                                reason.append(reasonBtn);
                                row.append(numberMeh);
                                row.append(meh);
                                row.append(start);
                                row.append(end);
                                row.append(reason);
                                row.append(btn);
                                row.append(result);
                                row.append(delBtn);
                                
                                appendBtn.before(row);
                           }
                           rowArr.push(row);
                    });
                });
        
    }


    async function getDB(url) {
        let answer;
       await fetch (url)
        .then(response => answer = response);
        return answer;  
    }
    getDB ('http://localhost:3000/summary')
        .then(response => response.json())
        .then(json => Object.entries(json))
        .then(arr => arr.forEach(item => {
            arrStart.push(item);
        }));
    function createObj() {
        setTimeout(function() {
            console.log(arrStart);
            arrStart.forEach((item, i) => {
                if (item[0] == 'character') {
                    objStart.character = item[1]
                } else if(item[0] == 'months') {
                    objStart.months = item[1];
                } else if(item[0] == "allSum") {
                    objStart.allSum = item[1];
                } else {
                    objStart[i] = item[1];
                }
                
            })
            console.log(objStart);
        }, 1000);
    }    
    createObj();

// Append mechanizm row
    appendBtn.addEventListener('click', () => {
        const mehName = prompt('Введите название механизма:', " "),
              wrap = document.querySelector('.summary__wrap'),
              row = document.querySelectorAll('.summary__row');
        getDB ('http://localhost:3000/summary')
            .then(response => response.json())
            .then(json => Object.entries(json))
            .then(arr => {
                if (arrStart.length == 0) {
                    arr.forEach(item => {
                        arrStart.push(item);
                    });
                }
            }
            );
        createObj();
        objStart[arrStart.length - 3] = {name: `${mehName}`, sum: '0'};
        fetch('http://localhost:3000/summary', {
            method: "POST",
            body: JSON.stringify(objStart),
            headers: {'Content-type' : 'application/json'}
        });
        row.forEach(item => {
            item.remove();
        })
        setTimeout(() => {
            startPost();
            arrStart = [];
            location.reload();
        }, 300);  
    });

    function deleteMechanizmRow() {
        let arr;
        let newArr = [];
        setTimeout(function() {
            const wrap = document.querySelector('.summary__wrap');
            wrap.addEventListener('click', (e) => {
                    rowArr.forEach((item, i) => {
                        if(e.target == item.querySelector('.del__btn')) {
                            const question = confirm('Вы уверены, что хотите удалить механизм?');
                            if (question) {
                                getDB('http://localhost:3000/summary')
                                    .then(response => response.json())
                                    .then(json => Object.entries(json))
                                    .then(json => arr = json);
    
                                setTimeout(function(){
                                    arr.forEach((item, j) => {
                                        if (i == j) {
                                            
                                        }else {
                                            newArr.push(item);
                                        }
                                    });
                                    newArr.forEach((item, i) => {
                                        if (item[0] == 'character' || item[0] == 'months' || item[0] == 'allSum') {

                                        } else {
                                            item[0] = `${i}`;
                                        }
                                        
                                    });
                                    fetch('http://localhost:3000/summary', {
                                        method: 'POST',
                                        body: JSON.stringify(Object.fromEntries(newArr)),
                                        headers: {'Content-type' : 'application/json'}   
                                    });
                                    location.reload();
                                    startPost();  
                                }, 500);
                            }
                        }
                    });
            });
        },500);
        
    }

    function calculation() {
        const wrap = document.querySelector('.summary__wrap');
        let arr;
        let sum;
        let month = new Date().getMonth();
        wrap.addEventListener('click', (e) => {
            rowArr.forEach((item, i) => {
                if (e.target == item.querySelector('.btn__enter')) {
                    const start = +item.querySelector('.summary__start-input').value,
                          end = +item.querySelector('.summary__end-input').value,
                          reason = item.querySelector('.summary__reason-input').value;

                    if (start && end) {
                        if (confirm('Вы подтверждаете введенные данные?')) {
                            wrap.style.display = 'none';
                            document.querySelector('.summary__character').style.display = 'block';
                            getDB('http://localhost:3000/summary')
                                .then(response => response.json())
                                .then(json => Object.entries(json))
                                .then(json => arr = json);
                        }
                        setTimeout(function() {
                            arr.forEach((item, j) => {
                                if (item[0] == 'months') {
                                    if (end > start) {
                                        sum = end - start;
                                        if (month == 3) {
                                            item[1].april += sum;
                                        } else if (month == 4) {
                                            item[1].may += sum;
                                        } else if (month == 5) {
                                            item[1].june += sum;
                                        } else if (month == 6) {
                                            item[1].jule += sum;
                                        } else if (month == 7) {
                                            item[1].august += sum;
                                        } else if (month == 8) {
                                            item[1].september += sum;
                                        } else if (month == 9) {
                                            item[1].october += sum;
                                        } else if (month == 10) {
                                            item[1].november += sum;
                                        }
                                    } else {
                                        sum = 24 - start + end;
                                        if (month == 3) {
                                            item[1].april += sum;
                                        } else if (month == 4) {
                                            item[1].may += sum;
                                        } else if (month == 5) {
                                            item[1].june += sum;
                                        } else if (month == 6) {
                                            item[1].jule += sum;
                                        } else if (month == 7) {
                                            item[1].august += sum;
                                        } else if (month == 8) {
                                            item[1].september += sum;
                                        } else if (month == 9) {
                                            item[1].october += sum;
                                        } else if (month == 10) {
                                            item[1].november += sum;
                                        }
                                    }
                                }
                                if (item[0] == 'allSum') {
                                    if (end > start) {
                                        item[1] += end - start;
                                    } else {
                                        item[1] += 24 - start + end;
                                    }
                                }
                                if (i == j) {
                                    if (end > start) {
                                        item[1].sum = +item[1].sum + end - start;
                                        sum = end - start;
                                        if (reason == '') {
                                            
                                        }else {
                                            item[1].reason = reason;
                                        }
                                        
                                    } else {
                                        item[1].sum = +item[1].sum + (24 - start + end);
                                        sum = 24 - start + end;
                                        if (reason == '') {
                                            
                                        }else {
                                            item[1].reason = reason;
                                        }
                                    }
                                }

                            })
                            console.log(arr);
                            fetch('http://localhost:3000/summary', {
                                method: 'POST',
                                body: JSON.stringify(Object.fromEntries(arr)),
                                headers: {'Content-type' : 'application/json'}   
                            });
                            choiceCharacterOfCrush(sum);
                        }, 500)
                    } else {
                        alert('Введите правильный тип данных: в поля "Начало простоя" и "Завершение простоя" нужно вводить числа.');
                    }
                }
            });
        });
    }

    function deleteReason() {
        let arr;
        const wrap = document.querySelector('.summary__wrap');

        wrap.addEventListener('click', (e) => {
            rowArr.forEach((item, i) => {
                if (e.target == item.querySelector('.btn__reason')) {
                    if (confirm('Вы уверены, что хотите очистить поле?')) {
                        getDB('http://localhost:3000/summary')
                            .then(response => response.json())
                            .then(json => Object.entries(json))
                            .then(json => arr = json);

                        setTimeout(function() {
                            arr.forEach((item, j) => {
                                if (i == j) {
                                    console.log(item);
                                    item[1].reason = '';
                                }
                            })
                            fetch('http://localhost:3000/summary', {
                                method: 'POST',
                                body: JSON.stringify(Object.fromEntries(arr)),
                                headers: {'Content-type' : 'application/json'}   
                            });
                            location.reload();
                            startPost();
                        }, 500)
                    }
                }
            });
        });

    }

    function choiceCharacterOfCrush(sum) {
        let arr;
        const wrap = document.querySelector('.summary__character-block'),
              btns = document.querySelectorAll('.summary__character-btn');
        
        wrap.addEventListener('click', (e) => {
            btns.forEach((item, i) => {
                if (e.target == item) {
                    getDB('http://localhost:3000/summary')
                        .then(response => response.json())
                        .then(json => Object.entries(json))
                        .then(json => arr = json);

                    setTimeout(function() {
                        arr.forEach((item, j) => {
                            if (item[0] == 'character') {
                                if (i == 0) {
                                    item[1].electro += sum;
                                } else if (i == 1) {
                                    item[1].diesel += sum;
                                } else if (i == 2) {
                                    item[1].technology += sum;
                                }
                            }
                        })
                        fetch('http://localhost:3000/summary', {
                            method: 'POST',
                            body: JSON.stringify(Object.fromEntries(arr)),
                            headers: {'Content-type' : 'application/json'}
                        })
                        location.reload();
                        startPost(start, end);
                    }, 1000)
                }
            })
        })
    }


    
    
    
    
    // async function postDB(url) {
    //     let answer;
    //     let sendInf;
    //     await getDB(url)
    //         .then(response => response.json())
    //         .then(json => Object.entries(json))
    //         .then(arr => arr.forEach((item, i) => {
    //             item[1].sum
    //         })
    //         .then(arr => {
    //             fetch(url, {
    //                 method: "POST",
    //                 body: JSON.stringify(sendInf),
    //                 headers: {'Content-type' : 'application/json'}
    //             });
    //         });

    // }
    
    // postDB('http://localhost:3000/summary');
    

    // fetch('http://localhost:3000/summary', {
    //     method: 'POST',
    //     body: JSON.stringify(`[{name: 'КПЛ 39-91', sum: ${n}}]`),
    //     headers: {'Content-type': 'application/json'}
    // });
    // fetch('http://localhost:3000/summary', {
    //     method: 'POST',
    //     body: JSON.stringify({meh1: 'КПЛ 35-89'}),
    //     headers: {'Content-type': 'application/json'}
    // });
    
    getTitleDate();
    startPost();
    deleteMechanizmRow();
    calculation();
    deleteReason();
    
});

