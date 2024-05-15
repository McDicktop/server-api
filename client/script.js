const table = document.getElementById("tbody"),
    addBtn = document.getElementById("addBtn"),
    addUserForm = document.getElementById("addUserForm"),
    editUserForm = document.getElementById("editUserForm"),
    deleteUserForm = document.getElementById("deleteUserForm"),
    addUserFormSaveBtn = document.getElementById("addUserSave"),
    addUserFormCancelBtn = document.getElementById("addUserCancel"),
    editUserFormCancelBtn = document.getElementById("editUserCancel"),
    deleteUserFormCancelBtn = document.getElementById("deleteUserCancel"),
    nameInput = document.getElementById("POST-name"),
    surnameInput = document.getElementById("POST-surname"),
    emailInput = document.getElementById("POST-email"),
    editNameInput = document.getElementById("PUT-name"),
    editSurnameInput = document.getElementById("PUT-surname"),
    editEmailInput = document.getElementById("PUT-email"),
    deleteNameInput = document.getElementById("DELETE-name"),
    deleteSurnameInput = document.getElementById("DELETE-surname"),
    deleteEmailInput = document.getElementById("DELETE-email"),
    sortBtns = Array.from(document.querySelectorAll(".sortBtn")),
    phrase = document.getElementById('searchInput');

const BASE_URL = "http://127.0.0.1:8080";
let currentId;

function StorageConstructor() {
    this.data = [];
    this.storageSync = (dataArg) => {
        localStorage.setItem("dbLocal", JSON.stringify(dataArg));
        this.data = JSON.parse(localStorage.getItem("dbLocal")) ?? [];
    };
    this.addToStorage = (dataArg) => this.data.push(dataArg);
    this.clearStorage = () => (this.data = []);
    this.deleteFromStorage = (idArg) => {
        const index = this.data.findIndex((el) => el._id === idArg);
        if (index >= 0) this.data.splice(index, 1);
    };
    this.editStorage = (objArg) => {                    // Сюда нужно передать обновленный объект!!!
        const item = this.getById(objArg._id)
        if (item) {
            item.name = objArg.name;
            item.surname = objArg.surname;
            item.email = objArg.email;
        }
    };
    this.getById = (idArg) =>
        this.data[this.data.findIndex((el) => el._id === idArg)];
}

const storage = new StorageConstructor();

document.addEventListener("DOMContentLoaded", async (e) => {
    const res = await axios.get(BASE_URL + "/api/users");
    res.data.forEach(item => renderTableRow(item));
    storage.storageSync(res.data);
});

phrase.addEventListener('keyup', tableSearch);

addBtn.addEventListener('click', () => {
    closeAllForms();
    removeStyle('selectedRow');
    addUserForm.style.display = 'block';
});

addUserForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const res = await axios.post(BASE_URL + "/api/users", {
        name: nameInput.value,
        surname: surnameInput.value,
        email: emailInput.value,
    });

    renderTableRow(res.data);
    closeAllForms();
    Array.from(addUserForm.querySelectorAll('input')).forEach(el => el.value = '');

    storage.addToStorage(res.data);
});

deleteUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const res = await axios.delete(BASE_URL + "/api/users", {
        params: { id: currentId },
    });

    const tr = table.querySelector('.selectedRow');
    table.removeChild(tr);
    closeAllForms();

    storage.deleteFromStorage(currentId);
})

editUserForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const res = await axios.put(BASE_URL + "/api/users", {
        name: editNameInput.value,
        surname: editSurnameInput.value,
        email: editEmailInput.value,
        _id: currentId,
    });

    renderEdited(res.data);
    closeAllForms();
    removeStyle("selectedRow");

    storage.editStorage(res.data);
});

addUserFormCancelBtn.addEventListener('click', cancelBtn);
editUserFormCancelBtn.addEventListener('click', cancelBtn);
deleteUserFormCancelBtn.addEventListener('click', cancelBtn);

sortBtns.forEach((el) => el.addEventListener('click', sort));


function cancelBtn(event) {
    const form = document.getElementById(event.target.closest('.form').id);
    Array.from(form.querySelectorAll('input')).forEach((el) => (el.value = ''));
    form.style.display = 'none';
    removeStyle('selectedRow');
}

function sort(event) {
    phrase.value = '';
    removeStyle('sortselected');
    clearTable(table);
    closeAllForms();

    event.target.classList.add('sortselected');
    let func;
    const sortType = event.target.classList[1],
        colName = event.target.closest("th").getAttribute("data-name");
    if (colName === "name" || colName === "surname" || colName === "email") {
        if (sortType === "decSort") {
            func = (a, b) => b[colName].localeCompare(a[colName]);
        } else {
            func = (a, b) => a[colName].localeCompare(b[colName]);
        }
    } else {
        if (sortType === "decSort") {
            func = (a, b) => new Date(b[colName]) - new Date(a[colName]);
        } else func = (a, b) => new Date(a[colName]) - new Date(b[colName]);
    }

    storage.data.sort(func);
    storage.data.forEach((el) => renderTableRow(el));
}

function renderTableRow(dataArg) {
    const tr = document.createElement("tr"),
        name = document.createElement("td"),
        surName = document.createElement("td"),
        eMail = document.createElement("td"),
        actions = document.createElement("td"),
        date = document.createElement("td"),
        editBtn = document.createElement("button"),
        delBtn = document.createElement("button");

    name.innerHTML = dataArg.name;
    surName.innerHTML = dataArg.surname;
    eMail.innerHTML = dataArg.email;
    date.innerHTML = moment(dataArg.date).format("DD.MM.YYYY HH-mm-ss");
    editBtn.innerHTML = "Edit";
    delBtn.innerHTML = "Delete";

    editBtn.classList.add("button", "actionButtons");
    delBtn.classList.add("button", "actionButtons");

    tr.classList.add("tr");
    tr.setAttribute("_id", dataArg._id);

    table.appendChild(tr);
    tr.appendChild(name);
    tr.appendChild(surName);
    tr.appendChild(eMail);
    tr.appendChild(date);
    tr.appendChild(actions);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    editBtn.addEventListener("click", openForm);
    delBtn.addEventListener("click", openForm);
    return tr;
}

function renderEdited(objArg) {
    const tr = document.querySelector(`[_id='${objArg._id}']`),
        tds = Array.from(tr.querySelectorAll('td'));
    tds[0].textContent = objArg.name;
    tds[1].textContent = objArg.surname;
    tds[2].textContent = objArg.email;
}

function clearTable(tableArg) {
    Array.from(tableArg.querySelectorAll('.tr')).forEach((item) =>
        tableArg.removeChild(item)
    );
}

function removeStyle(styleArg) {
    const elem = document.querySelector(`.${styleArg}`);
    if (elem) elem.classList.remove(styleArg);
    return elem;
}

function openForm(event) {
    closeAllForms();
    removeStyle('selectedRow');
    let inputs;
    if (event.target.textContent === 'Edit') {
        inputs = Array.from(editUserForm.querySelectorAll('input'));
        editUserForm.style.display = 'block';
    } else {
        inputs = Array.from(deleteUserForm.querySelectorAll('input'));
        deleteUserForm.style.display = 'block';
    }

    const tr = event.target.closest('[_id]');
    tr.classList.add('selectedRow');
    currentId = tr.getAttribute('_id');
    const obj = storage.getById(currentId);

    inputs[0].value = obj.name;
    inputs[1].value = obj.surname;
    inputs[2].value = obj.email;
}

function closeAllForms() {
    addUserForm.style.display = 'none';
    editUserForm.style.display = 'none';
    deleteUserForm.style.display = 'none';
}

function tableSearch() {
    const rows = Array.from(table.querySelectorAll('tr'))
    rows.forEach(el => {
        let cells = Array.from(el.childNodes);
        for (let i = 0; i < 4; i++) {
            if (cells[i].textContent.toLowerCase().includes(phrase.value.toLowerCase())) {
                el.style.display = '';
                break;
            } else
                el.style.display = 'none';
        }
    })
}


// function tableSearch() {
//     const table = document.querySelector('.table');
//     let flag = false;
//     for (var i = 1; i < table.rows.length; i++) {
//         flag = false;
//         for (var j = table.rows[i].cells.length - 2; j >= 0; j--) {
//             if (table.rows[i].cells[j].innerHTML.toUpperCase().includes(phrase.value.toUpperCase())) flag = true;
//             if (flag) break;
//         }
//         if (flag) {
//             table.rows[i].style.display = "";
//         } else {
//             table.rows[i].style.display = "none";
//         }
//     }
// }

// axios.patch(BASE_URL + '/api/users', {
//     params: {
//         id: '1210391930193019031'
//     }
// });

// axios.delete(BASE_URL + '/api/users', {
//     params: {
//         id: '1210391930193019031'
//     }
// });

// const res = await axios.get(BASE_URL + '/api/users', {config});
// const res = await axios.post(url, {body object})

// const res = await axios.put(url, {body object})
