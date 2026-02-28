let passwordHistory = [];

function estimateCrackTime(entropy) {

    const guessesPerSecond = 1e9;
    let seconds = Math.pow(2, entropy) / guessesPerSecond;

    if (seconds < 1) return "Instantly";

    const year = 31536000;
    if (seconds < year)
        return Math.floor(seconds / 86400) + " days";

    return Math.floor(seconds / year) + " years";
}

async function analyze() {

    let password = document.getElementById("password").value;

    if (!password) {
        resetUI();
        return;
    }

    let response = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password })
    });

    let data = await response.json();

    let entropy = parseFloat(data.entropy) || 0;
    let crackTime = estimateCrackTime(entropy);

    document.getElementById("entropy").innerText = entropy.toFixed(2) + " bits";
    document.getElementById("leak").innerText = data.leaked ? "Leaked ❌" : "Safe ✅";
    document.getElementById("ai").innerText = data.ai;
    document.getElementById("crackTime").innerText = crackTime;

    updateStrengthBar(entropy);
    generateSuggestions(password);

    addToHistory(password, entropy);
}

function updateStrengthBar(entropy) {

    let bar = document.getElementById("bar");
    let label = document.getElementById("strengthLabel");

    let percentage = Math.min(entropy, 100);

    bar.style.width = percentage + "%";
    bar.innerText = Math.floor(percentage) + "%";

    if (entropy < 36) {
        bar.className = "progress-bar bg-danger";
        label.innerText = "Weak";
    } else if (entropy < 60) {
        bar.className = "progress-bar bg-warning";
        label.innerText = "Moderate";
    } else {
        bar.className = "progress-bar bg-success";
        label.innerText = "Strong";
    }
}

function generateSuggestions(password) {

    let list = document.getElementById("suggestions");
    list.innerHTML = "";

    if (password.length < 12)
        list.innerHTML += "<li>Increase length to 12+ characters</li>";

    if (!/[A-Z]/.test(password))
        list.innerHTML += "<li>Add uppercase letters</li>";

    if (!/[a-z]/.test(password))
        list.innerHTML += "<li>Add lowercase letters</li>";

    if (!/[0-9]/.test(password))
        list.innerHTML += "<li>Add numbers</li>";

    if (!/[^A-Za-z0-9]/.test(password))
        list.innerHTML += "<li>Add special symbols (!@#$%^&*)</li>";
}

function addToHistory(password, entropy) {

    let strength = entropy < 36 ? "Weak" :
                   entropy < 60 ? "Moderate" : "Strong";

    passwordHistory.unshift({
        password: password,
        strength: strength
    });

    if (passwordHistory.length > 5) {
        passwordHistory.pop();
    }

    updateHistoryUI();
}

function updateHistoryUI() {

    let historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    passwordHistory.forEach(item => {

        let li = document.createElement("li");

        li.innerHTML = `
            <span>🔑 ${item.password}</span>
            <span>${item.strength}</span>
        `;

        historyList.appendChild(li);
    });
}

function resetUI() {

    document.getElementById("entropy").innerText = "-";
    document.getElementById("leak").innerText = "-";
    document.getElementById("ai").innerText = "-";
    document.getElementById("crackTime").innerText = "-";
    document.getElementById("bar").style.width = "0%";
    document.getElementById("bar").innerText = "";
    document.getElementById("strengthLabel").innerText = "";
    document.getElementById("suggestions").innerHTML = "";
}

async function generate() {

    let response = await fetch("/generate");
    let data = await response.json();

    document.getElementById("password").value = data.password;
    analyze();
}

function togglePassword() {
    let input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
}