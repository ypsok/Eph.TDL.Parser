function caesarShift(str, shift) {
    return str.split("").map(c => {

        const code = c.charCodeAt(0);

        // A-Z
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(
                ((code - 65 + shift + 26) % 26) + 65
            );
        }

        // a-z
        if (code >= 97 && code <= 122) {
            return String.fromCharCode(
                ((code - 97 + shift + 26) % 26) + 97
            );
        }

        // números y símbolos quedan igual
        return c;

    }).join("");
}

function statusColor(status) {
    switch (status) {
        case "En proceso": return "gold";
        case "Pendiente": return "teal";
        case "En producción": return "mediumpurple";
        case "Listo": return "limegreen";
        case "Atrasado": return "orange";
        case "Error": return "red";
        default: return "gray";
    }
}

document.getElementById("status").addEventListener("change", e => {
    e.target.style.color = statusColor(e.target.value);
});

async function createTask() {

    const title = document.getElementById("title").value.trim();
    if (!title) return;

    const status = document.getElementById("status").value;
    const description = document.getElementById("description").value.replace(/\n/g, "<>");
    const notes = document.getElementById("notes").value.replace(/\n/g, "<>");

    const id = crypto.randomUUID();

    const newLine = `${id},${escapeCsv(title)},${escapeCsv(status)},${escapeCsv(notes)},${escapeCsv(description)}\n`;

    const fileData = await fetchFile();
    const updated = fileData + newLine;

    await pushFile(updated);

    document.getElementById("msg").innerText = "✔ Task creada";

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("notes").value = "";
}

function escapeCsv(text) {
    if (text.includes(",") || text.includes('"')) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

async function fetchFile() {

    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.path}?ref=${CONFIG.branch}`;

    const res = await fetch(url, {
        headers: {
            Authorization: `token ${REAL_TOKEN}`

        }
    });

    if (res.status === 404) return "";

    const data = await res.json();
    const decoded = atob(data.content.replace(/\n/g, ""));
    window.currentSha = data.sha;

    return decoded;
}

async function pushFile(content) {

    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.path}`;

    const body = {
        message: "Add task from Web",
        content: btoa(unescape(encodeURIComponent(content))),
        branch: CONFIG.branch,
        sha: window.currentSha
    };

    await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `token ${REAL_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
}

