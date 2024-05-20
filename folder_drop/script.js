const drop_btn = document.getElementById("drop_btn"),
    drop_list = document.getElementById("drop_list"),
    drop_elements = document.querySelectorAll(".dropdown_elements");

drop_btn.addEventListener("click", (event) => {
    drop_list.classList.toggle("open");
});

for (let item of Array.from(drop_elements)) {
    item.addEventListener("click", () => {
        drop_list.classList.remove("open");
        drop_btn.textContent = item.innerText;
    });
}

function OutsideClick(e, node_selector) {
    if (
        drop_list.classList.contains("open") &&
        !e.target.closest(node_selector)
        // !e.target.isSameNode(drop_btn)
    ) {
        drop_list.classList.remove("open");
    }
}

// Outside dropdown close handler
window.addEventListener("click", (e) => {
    e.stopPropagation();

    OutsideClick(e, ".dropdown_wrapper");
});
