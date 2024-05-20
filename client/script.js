import { Confirmation } from "./utils/Confirmation.js";
import { Notification } from "./utils/Notification.js";
import StorageConstructor from "./utils/StorageConstructor.js";

const storage = new StorageConstructor();

const body = document.querySelector("body"),
    table = document.getElementById("tbody"),
    addBtn = document.getElementById("addBtn"),
    addUserForm = document.getElementById("addUserForm"),
    editUserForm = document.getElementById("editUserForm"),
    addUserFormCancelBtn = document.getElementById("addUserCancel"),
    editUserFormCancelBtn = document.getElementById("editUserCancel"),
    nameInput = document.getElementById("POST-name"),
    surnameInput = document.getElementById("POST-surname"),
    emailInput = document.getElementById("POST-email"),
    editNameInput = document.getElementById("PUT-name"),
    editSurnameInput = document.getElementById("PUT-surname"),
    editEmailInput = document.getElementById("PUT-email"),
    sortBtns = Array.from(document.querySelectorAll(".sortBtn")),
    phrase = document.getElementById("searchInput"),
    confirm_view = document.createElement("div"),
    dropdown = document.querySelector(".dropdown_container"),
    filterBtn = document.getElementById("filterBtn"),
    filter1 = document.getElementById("filter1"),
    filter2 = document.getElementById("filter2"),
    filter3 = document.getElementById("filter3");

const BASE_URL = "http://127.0.0.1:8080";
let currentId;

document.addEventListener("DOMContentLoaded", async (e) => {
    const res = await axios.get(BASE_URL + "/api/users");
    res.data.forEach((item) => renderTableRow(item));
    storage.storageSync(res.data);
});

phrase.addEventListener("keyup", tableSearch);

function renderFormWrapper(form) {
    form.style.display = "block";
    confirm_view.classList.add("confirm_view");

    body.appendChild(confirm_view);
    if (form === addUserForm) {
        confirm_view.appendChild(addUserForm);
    } else {
        confirm_view.appendChild(editUserForm);
    }
}

addBtn.addEventListener("click", () => {
    removeStyle("selectedRow");
    renderFormWrapper(addUserForm);
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

    Array.from(addUserForm.querySelectorAll("input")).forEach(
        (el) => (el.value = "")
    );

    confirm_view.remove();
    storage.addToStorage(res.data);

    const res_del = await Notification("New user added", "Success");
});

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
    confirm_view.remove();
    removeStyle("selectedRow");

    storage.editStorage(res.data);
    const res_del = await Notification("Edited", "Success");
});

addUserFormCancelBtn.addEventListener("click", cancelBtn);
editUserFormCancelBtn.addEventListener("click", cancelBtn);

sortBtns.forEach((el) => el.addEventListener("click", sort));

function cancelBtn(event) {
    const form = document.getElementById(event.target.closest(".form").id);
    Array.from(form.querySelectorAll("input")).forEach((el) => (el.value = ""));
    confirm_view.remove();
    removeStyle("selectedRow");
}

function sort(event) {
    phrase.value = "";
    removeStyle("sortselected");
    clearTable(table);

    event.target.classList.add("sortselected");
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
    delBtn.addEventListener("click", delConfirmation);
    return tr;
}

async function delConfirmation(event) {
    event.preventDefault();

    const tr = event.target.closest("[_id]");
    tr.classList.add("selectedRow");
    currentId = tr.getAttribute("_id");

    const elem = storage.getById(currentId);

    const res_del = await Confirmation(
        "Delete",
        `${elem.name} ${elem.surname}`,
        "Delete",
        "Cancel"
    );

    if (res_del) {
        const res = await axios.delete(BASE_URL + "/api/users", {
            params: { id: currentId },
        });

        table.removeChild(tr);
        storage.deleteFromStorage(currentId);
        const res_del = await Notification("Deleted", "Success");
    } else {
        removeStyle("selectedRow");
    }
}

function renderEdited(objArg) {
    console.log(objArg);
    const tr = document.querySelector(`[_id='${objArg._id}']`),
        tds = Array.from(tr.querySelectorAll("td"));
    tds[0].textContent = objArg.name;
    tds[1].textContent = objArg.surname;
    tds[2].textContent = objArg.email;
}

function clearTable(tableArg) {
    Array.from(tableArg.querySelectorAll(".tr")).forEach((item) =>
        tableArg.removeChild(item)
    );
}

function removeStyle(styleArg) {
    const elem = document.querySelector(`.${styleArg}`);
    if (elem) elem.classList.remove(styleArg);
    return elem;
}

function openForm(event) {
    removeStyle("selectedRow");
    renderFormWrapper(editUserForm);

    const inputs = Array.from(editUserForm.querySelectorAll("input"));

    const tr = event.target.closest("[_id]");
    tr.classList.add("selectedRow");
    currentId = tr.getAttribute("_id");
    const obj = storage.getById(currentId);

    inputs[0].value = obj.name;
    inputs[1].value = obj.surname;
    inputs[2].value = obj.email;
}

function tableSearch() {
    const rows = Array.from(table.querySelectorAll("tr"));
    rows.forEach((el) => {
        let cells = Array.from(el.childNodes);
        for (let i = 0; i < 4; i++) {
            if (
                cells[i].textContent
                    .toLowerCase()
                    .includes(phrase.value.toLowerCase())
            ) {
                el.style.display = "";
                break;
            } else el.style.display = "none";
        }
    });
}

// const drop_btn = document.getElementById("drop_btn"),        filterBtn
// drop_list = document.getElementById("drop_list"),        dropdown
// drop_elements = document.querySelectorAll(".dropdown_elements");
const drop_elements = document.querySelectorAll(".dropdown");

filterBtn.addEventListener("click", (event) => {
    console.log(dropdown.classList);
    // console.log(event.target, "!!!!!!!!!!!!!!");
    dropdown.classList.toggle("open");
    console.log(dropdown.classList);
});

for (let item of Array.from(drop_elements)) {
    item.addEventListener("click", () => {
        dropdown.classList.remove("open");
        filterBtn.textContent = item.innerText;
    });
}

function OutsideClick(e, node_selector) {
    console.log(e.target);
    if (
        dropdown.classList.contains("open") &&
        !e.target.closest(node_selector)
        // !e.target.isSameNode(drop_btn)
    ) {
        dropdown.classList.remove("open");
    }
}

// Outside dropdown close handler
window.addEventListener("click", (e) => {
    e.stopPropagation();

    OutsideClick(e, ".dropdown_container");
});

// function dropdownAppearance(e) {
//     if (e.type === "mouseover") dropdown.style.display = "block";
//     else if (e.type === "mouseout") dropdown.style.display = "none";
// }

// filterBtn.addEventListener("mouseover", dropdownAppearance);
// filterBtn.addEventListener("mouseout", dropdownAppearance);

// dropdown.addEventListener("mouseover", dropdownAppearance);
// dropdown.addEventListener("mouseout", dropdownAppearance);

// document.addEventListener("click", (e) => {
//     if (e.target === filterBtn) {
//         dropdown.style.display = "block";
//     } else {
//         dropdown.style.display = "none";
//     }
// });

// filter1.addEventListener("click", (e) => {
//     clearTable(table);
//     let lim = storage.data.length - 10;
//     const filtered = storage.data.filter((el, ind) => ind >= lim);
//     filtered.forEach(el => renderTableRow(el));
// });
// filter2.addEventListener("click", (e) => {
//     console.log("Hi");
// });
// filter3.addEventListener("click", (e) => {
//     clearTable(table);
//     storage.data.forEach(el => renderTableRow(el));
// });

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
