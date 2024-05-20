export function Notification(title, message) {
    return new Promise((resolve, reject) => {
        if (typeof title !== "undefined" && typeof message !== "undefined") {
            if (title !== "" && message !== "") {
                const confirm_view = document.createElement("div");
                confirm_view.classList.add("confirm_view");

                const confirm_block = document.createElement("div");
                confirm_block.classList.add("confirm_block");

                // Create element
                const confirm_block_title = document.createElement("h1"),
                    confirm_block_message = document.createElement("p");

                // Texting
                confirm_block_title.innerHTML = title;
                confirm_block_message.innerHTML = message;

                // Classing element
                confirm_block_title.classList.add("confirm_block_title");
                confirm_block_message.classList.add("confirm_block_message");

                // Add element to parent node
                confirm_block.appendChild(confirm_block_title);
                confirm_block.appendChild(confirm_block_message);

                setTimeout(() => {
                    confirm_view.remove();
                    resolve(false);
                }, 2000);

                // Add container to view screen
                confirm_view.appendChild(confirm_block);

                // Event view screen to body element
                const body = document.querySelector("body");
                body.appendChild(confirm_view);

                confirm_view.addEventListener("click", (e) => {
                    e.preventDefault();

                    if (e.target === confirm_view) {
                        e.target.remove();
                        resolve(false);
                    }
                });


                return;
            }

            reject("bad arguments");

            return;
        }

        reject("bad arguments");
    });
}
