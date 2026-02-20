const CONFIG = {
    owner: "ypsok",
    repo: "Eph.TDL.Parser",
    branch: "main",
    path: "online-tasks.csv",
    token: "bck_BcfPNmVzSLjYPga7bUuJaKJMDV7kgB0esXtU"
};

function caesarShift(str, shift) {
    return str.split("").map(c => {

        const code = c.charCodeAt(0);

        if (code >= 65 && code <= 90)
            return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);

        if (code >= 97 && code <= 122)
            return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);

        return c;

    }).join("");
}

// 🔥 Sobrescribe el token directamente
CONFIG.token = caesarShift(CONFIG.token, 5);
