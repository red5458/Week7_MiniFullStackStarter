const message = document.getElementById("message");
const statusBadge = document.getElementById("statusBadge");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const sessionInfo = document.getElementById("sessionInfo");
const logoutBtn = document.getElementById("logoutBtn");
const profileBtn = document.getElementById("profileBtn");
const adminBtn = document.getElementById("adminBtn");
const secureDataBtn = document.getElementById("secureDataBtn");
const profileOutput = document.getElementById("profileOutput");
const adminOutput = document.getElementById("adminOutput");
const secureDataOutput = document.getElementById("secureDataOutput");
const refreshUsersBtn = document.getElementById("refreshUsersBtn");
const userList = document.getElementById("userList");

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

function showMessage(text, type = "success") {
    message.innerHTML = `<div class="alert alert-${type} rounded-0">${text}</div>`;
    setTimeout(() => {
        message.innerHTML = "";
    }, 3500);
}

function formToObject(form) {
    return Object.fromEntries(new FormData(form).entries());
}

async function requestJson(url, options = {}) {
    const res = await fetch(url, options);
    const text = await res.text();
    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch (error) {
            throw new Error("Server did not return JSON. Open the app through http://localhost:3000 instead of double-clicking index.html.");
        }
    }

    if (!res.ok) {
        if (Array.isArray(data.errors)) {
            throw new Error(data.errors.map(error => error.msg).join(", "));
        }

        throw new Error(data.message || data.error || "Request failed");
    }

    return data;
}

function authHeaders() {
    if (!currentUser) {
        return {};
    }

    return {
        role: currentUser.role,
        "user-id": currentUser.id
    };
}

function updateSession() {
    if (!currentUser) {
        sessionInfo.textContent = "Not logged in";
        logoutBtn.disabled = true;
        profileBtn.disabled = true;
        adminBtn.disabled = true;
        secureDataBtn.disabled = true;
        return;
    }

    sessionInfo.textContent = `${currentUser.email} (${currentUser.role})`;
    logoutBtn.disabled = false;
    profileBtn.disabled = false;
    adminBtn.disabled = false;
    secureDataBtn.disabled = false;
}

async function loadStatus() {
    try {
        const status = await requestJson("/status");
        statusBadge.className = "badge text-bg-success";
        statusBadge.textContent = `${status.status} | DB ${status.database}`;
    } catch (error) {
        statusBadge.className = "badge text-bg-danger";
        statusBadge.textContent = "Status unavailable";
    }
}

async function loadUsers() {
    try {
        const response = await requestJson("/api/users");
        const users = Array.isArray(response) ? response : response.data;

        userList.innerHTML = "";

        if (!users.length) {
            userList.innerHTML = `<div class="text-muted">No users yet.</div>`;
            return;
        }

        users.forEach(user => {
            const item = document.createElement("div");
            item.className = "list-group-item";
            item.innerHTML = `
                <div class="fw-semibold">${user.name || user.username}</div>
                <div class="text-muted">${user.email} | ${user.role || "user"}</div>
            `;
            userList.appendChild(item);
        });
    } catch (error) {
        userList.innerHTML = `<div class="text-danger">${error.message}</div>`;
    }
}

registerForm.addEventListener("submit", async event => {
    event.preventDefault();

    try {
        const payload = formToObject(registerForm);
        const data = await requestJson("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        registerForm.reset();
        showMessage(data.message);
        loadUsers();
    } catch (error) {
        showMessage(error.message, "danger");
    }
});

loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    try {
        const payload = formToObject(loginForm);
        const data = await requestJson("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        currentUser = data.user;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        loginForm.reset();
        updateSession();
        showMessage(data.message);
    } catch (error) {
        showMessage(error.message, "danger");
    }
});

logoutBtn.addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem("currentUser");
    profileOutput.textContent = "No profile request yet.";
    adminOutput.textContent = "No admin request yet.";
    secureDataOutput.textContent = "No secure request yet.";
    updateSession();
    showMessage("Logged out", "warning");
});

profileBtn.addEventListener("click", async () => {
    try {
        const data = await requestJson("/api/auth/profile", {
            headers: authHeaders()
        });
        profileOutput.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        profileOutput.textContent = error.message;
    }
});

adminBtn.addEventListener("click", async () => {
    try {
        const data = await requestJson("/api/auth/admin", {
            headers: authHeaders()
        });
        adminOutput.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        adminOutput.textContent = error.message;
    }
});

secureDataBtn.addEventListener("click", async () => {
    try {
        const data = await requestJson("/api/auth/secure-data", {
            headers: authHeaders()
        });
        secureDataOutput.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        secureDataOutput.textContent = error.message;
    }
});

refreshUsersBtn.addEventListener("click", loadUsers);

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js")
            .then(() => console.log("Service Worker Registered"))
            .catch(error => console.error("Service Worker registration failed:", error));
    });
}

updateSession();
loadStatus();
loadUsers();
