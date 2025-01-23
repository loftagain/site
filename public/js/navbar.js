document.addEventListener("DOMContentLoaded", function () {
    // Load CSS dynamically
    loadCSS("https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css")
        .then(() => loadScript("https://code.jquery.com/jquery-3.5.1.min.js"))
        .then(() => loadScript("https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"))
        .then(() => loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"))
        .then(() => {
            // Check user authentication and load the appropriate navbar
            return fetch("/api/user/status")
                .then(response => response.json())
                .then(data => {
                    let navbarFile;
                    if (data.authenticated) {
                        if (data.username === "admin") {
                            navbarFile = "/navbar-admin.html";
                        } else if (data.suspended) {
                            navbarFile = "/navbar-suspended.html";
                        } else {
                            navbarFile = "/navbar-user.html";
                        }
                    } else {
                        navbarFile = "/public/navbar-guest.html";
                    }
                    return fetch(navbarFile)
                        .then(response => response.text())
                        .then(html => {
                            document.getElementById("navbar-container").innerHTML = html;

                            // Additional logic for the suspended navbar
                            if (data.suspended) {
                                fetch("/api/user/status/reason")
                                    .then(reasonResponse => reasonResponse.json())
                                    .then(reasonData => {
                                        const reasonElement = document.getElementById("suspension-reason");
                                        if (reasonElement && reasonData.reason) {
                                            reasonElement.textContent = reasonData.reason;
                                        }
                                    })
                                    .catch(error => console.error("Error fetching suspension reason:", error));
                            }
                        });
                });
        })
        .catch(error => console.error("Error loading dependencies or navbar:", error));
});

// Function to load CSS dynamically
function loadCSS(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Could not load CSS: ${href}`));
        document.head.appendChild(link);
    });
}


// Function to load scripts dynamically
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Could not load script: ${src}`));
        document.body.appendChild(script);
    });
}
