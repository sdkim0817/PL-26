document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // 로컬 스토리지에서 할 일 목록 가져오기
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    let editingId = null;

    // 초기 렌더링
    renderTodos();

    // 할 일 추가
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // 필터링 적용
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderTodos();
        });
    });

    function addTodo() {
        const text = todoInput.value.trim();
        const deadlineInput = document.getElementById('todo-deadline');
        const deadline = deadlineInput ? deadlineInput.value : '';

        if (text === '') return;

        const newTodo = {
            id: Date.now().toString(),
            text: text,
            deadline: deadline,
            completed: false
        };

        todos.unshift(newTodo); // 최신 항목이 위로 오도록 unshift 사용
        saveTodos();
        todoInput.value = '';
        if (deadlineInput) deadlineInput.value = '';
        renderTodos();
    }

    function toggleTodo(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
    }

    function deleteTodo(id) {
        const li = document.querySelector(`[data-id="${id}"]`);
        if (li) {
            li.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                todos = todos.filter(todo => todo.id !== id);
                saveTodos();
                renderTodos();
            }, 300);
        } else {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function startEdit(id) {
        editingId = id;
        renderTodos();
    }

    function cancelEdit() {
        editingId = null;
        renderTodos();
    }

    function saveEdit(id, newText, newDeadline) {
        if (newText.trim() === '') {
            alert('할 일 내용을 입력해주세요.');
            return;
        }
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, text: newText.trim(), deadline: newDeadline } : todo
        );
        editingId = null;
        saveTodos();
        renderTodos();
    }

    function renderTodos() {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = 'var(--text-secondary)';
            emptyMessage.style.padding = '2rem';
            emptyMessage.textContent = currentFilter === 'all' ? '할 일이 없습니다. 새로운 할 일을 추가해 보세요!' : '해당하는 할 일이 없습니다.';
            todoList.appendChild(emptyMessage);
            return;
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed-task' : ''}`;
            li.setAttribute('data-id', todo.id);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'todo-content';

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'todo-actions';

            if (editingId === todo.id) {
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.className = 'edit-input text-edit';
                textInput.value = todo.text;
                
                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.className = 'edit-input date-edit';
                dateInput.value = todo.deadline || '';

                contentDiv.appendChild(textInput);
                contentDiv.appendChild(dateInput);

                const saveBtn = document.createElement('button');
                saveBtn.className = 'icon-btn save-btn';
                saveBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                saveBtn.title = '저장';
                saveBtn.addEventListener('click', () => saveEdit(todo.id, textInput.value, dateInput.value));

                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'icon-btn cancel-btn';
                cancelBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                cancelBtn.title = '취소';
                cancelBtn.addEventListener('click', cancelEdit);

                actionsDiv.appendChild(saveBtn);
                actionsDiv.appendChild(cancelBtn);

                textInput.addEventListener('keypress', (e) => {
                    if(e.key === 'Enter') saveEdit(todo.id, textInput.value, dateInput.value);
                });
                
                // Focus text input on render
                setTimeout(() => textInput.focus(), 0);
            } else {
                const label = document.createElement('label');
                label.className = 'checkbox-container';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => toggleTodo(todo.id));

                const checkmark = document.createElement('span');
                checkmark.className = 'checkmark';

                label.appendChild(checkbox);
                label.appendChild(checkmark);

                const textSpan = document.createElement('span');
                textSpan.className = 'text';
                textSpan.textContent = todo.text;

                contentDiv.appendChild(label);
                contentDiv.appendChild(textSpan);

                if (todo.deadline) {
                    const deadlineSpan = document.createElement('span');
                    deadlineSpan.className = 'deadline-text';
                    deadlineSpan.innerHTML = `<i class="fa-regular fa-clock"></i> ${todo.deadline}`;
                    contentDiv.appendChild(deadlineSpan);
                }

                const editBtn = document.createElement('button');
                editBtn.className = 'icon-btn edit-btn';
                editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
                editBtn.title = '편집';
                editBtn.addEventListener('click', () => startEdit(todo.id));

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'icon-btn delete-btn';
                deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
                deleteBtn.title = '삭제';
                deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

                actionsDiv.appendChild(editBtn);
                actionsDiv.appendChild(deleteBtn);
            }

            li.appendChild(contentDiv);
            li.appendChild(actionsDiv);
            todoList.appendChild(li);
        });
    }
});
