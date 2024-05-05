const table = document.getElementById("tbody"),
    addBtn = document.getElementById("addBtn");

const BASE_URL = "http://127.0.0.1:8080";

document.addEventListener("DOMContentLoaded", async (e) => {
    const res = await axios.get(BASE_URL + "/api/users");

    for (let item of res.data.data) renderData(item);

    const addBtn = document.getElementById("addBtn"),
        editBtns = Array.from(document.querySelectorAll(".editBtn")),
        delBtns = Array.from(document.querySelectorAll(".delBtn"));

    addBtn.addEventListener("click", (el) => {
        console.log(el.target);
    });

    editBtns.forEach(btn=> {
        btn.addEventListener('click', el => {
            const id = el.target.parentNode.parentNode.getAttribute('_id');
        })
    })

    delBtns.forEach(btn=> {
        btn.addEventListener('click', async el => {
            const id = el.target.parentNode.parentNode.getAttribute('_id');

            const res = await axios.delete(BASE_URL + '/api/users', {
                params: {id}
            });

            table.removeChild(el.target.parentNode.parentNode);
        })
    })

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
});

function renderData(dataArg) {
    const tr = document.createElement("tr"),
        name = document.createElement("td"),
        surName = document.createElement("td"),
        eMail = document.createElement("td"),
        actions = document.createElement("td");

    name.innerHTML = dataArg.name;
    surName.innerHTML = dataArg.surname;
    eMail.innerHTML = dataArg.email;
    actions.innerHTML = `<button class="editBtn">Edit</button>
    <button class="delBtn">Delete</button>`;

    tr.setAttribute("_id", dataArg._id);

    table.appendChild(tr);

    tr.appendChild(name);
    tr.appendChild(surName);
    tr.appendChild(eMail);
    tr.appendChild(actions);
}
