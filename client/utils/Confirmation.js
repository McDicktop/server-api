export function Confirmation(title, message, apply_text, cancel_text) {
    return new Promise((resolve, reject) => {
        if (
            typeof title !== "undefined" &&
            typeof message !== "undefined" &&
            typeof cancel_text !== "undefined" &&
            typeof apply_text !== "undefined"
        ) {
            if (
                title !== "" &&
                message !== "" &&
                apply_text !== "" &&
                cancel_text !== ""
            ) {
                const confirm_view = document.createElement("div");
                confirm_view.classList.add("confirm_view");

                const confirm_block = document.createElement("div");
                confirm_block.classList.add("confirm_block");

                // Create element
                const confirm_block_title = document.createElement("h1"),
                    confirm_block_message = document.createElement("p"),
                    confirm_block_apply = document.createElement("button"),
                    confirm_block_cancel = document.createElement("button"),
                    confirm_block_close = document.createElement("button"),
                    confirm_block_buttons = document.createElement("div");

                // Texting
                confirm_block_title.innerHTML = title;
                confirm_block_message.innerHTML = message;
                confirm_block_apply.innerHTML = apply_text;
                confirm_block_cancel.innerHTML = cancel_text;

                // Classing element
                confirm_block_title.classList.add("confirm_block_title");
                confirm_block_message.classList.add("confirm_block_message");
                confirm_block_apply.className =
                    "confirm_block_button confirm_block_apply";
                confirm_block_cancel.className =
                    "confirm_block_button confirm_block_cancel";
                confirm_block_close.classList.add("confirm_block_close");
                confirm_block_buttons.classList.add("confirm_block_buttons");

                // Add buttons to flex container
                confirm_block_buttons.appendChild(confirm_block_apply);
                confirm_block_buttons.appendChild(confirm_block_cancel);

                // Add element to parent node
                confirm_block.appendChild(confirm_block_title);
                confirm_block.appendChild(confirm_block_message);
                confirm_block.appendChild(confirm_block_close);
                confirm_block.appendChild(confirm_block_buttons);

                // Event listener for apply button
                confirm_block_apply.addEventListener("click", (e) => {
                    e.preventDefault();

                    confirm_view.remove();

                    resolve(true);
                });

                // Event listener for cancel and close button
                [confirm_block_cancel, confirm_block_close].forEach((el) =>
                    el.addEventListener("click", (e) => {
                        e.preventDefault();

                        confirm_view.remove();

                        resolve(false);
                    })
                );

                confirm_view.addEventListener("click", (e) => {
                    e.preventDefault();

                    if (e.target === confirm_view) {
                        e.target.remove();
                        resolve(false);
                    }
                });

                if (title !== "Delete") {
                    setTimeout(() => {
                        confirm_view.remove();
                        resolve(false);
                    }, 3000);
                }

                // Add container to view screen
                confirm_view.appendChild(confirm_block);

                // Event view screen to body element
                const body = document.querySelector("body");
                body.appendChild(confirm_view);

                return;
            }

            reject("bad arguments");

            return;
        }

        reject("bad arguments");
    });
}
