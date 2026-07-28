// Scroll to Analyzer Section
function scrollToAnalyzer() {
    document.getElementById("analyzer").scrollIntoView({
        behavior: "smooth"
    });
}

const analyzeBtn = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const userInput = document.getElementById("userInput");

analyzeBtn.addEventListener("click", analyzeMessage);

async function analyzeMessage() {

    const text = userInput.value.trim();

    if (text === "") {
        alert("Please enter a message to analyze.");
        return;
    }

    loading.style.display = "block";
    result.style.display = "none";
    result.innerHTML = "";

    try {

        const response = await fetch("http://localhost:3000/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })

        });

        const data = await response.json();

        loading.style.display = "none";
        result.style.display = "block";

        if (data.error) {

            result.innerHTML = `
                <h3>❌ Error</h3>
                <p>${data.error}</p>
            `;

            return;
        }

        result.innerHTML = `

            <h3>🛡 AI Analysis Result</h3>

            <p><strong>Risk Level:</strong> ${data.risk}</p>

            <p><strong>Scam Probability:</strong> ${data.probability}%</p>

            <p><strong>Reasons:</strong></p>

            <ul>
                ${data.reasons.map(reason => `<li>${reason}</li>`).join("")}
            </ul>

            <br>

            <p><strong>Safety Advice:</strong></p>

            <ul>
                ${data.advice.map(item => `<li>${item}</li>`).join("")}
            </ul>

        `;

    }

    catch (error) {

        loading.style.display = "none";
        result.style.display = "block";

        result.innerHTML = `

            <h3>⚠ Server Error</h3>

            <p>${error.message}</p>

        `;

    }

}