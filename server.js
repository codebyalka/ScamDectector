const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/analyze", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const prompt = `
You are a Cyber Security Expert.

Analyze the following text.

Return ONLY valid JSON.

Format:

{
"risk":"Low/Medium/High",
"probability":80,
"reasons":[
"...",
"..."
],
"advice":[
"...",
"..."
]
}

Message:

${message}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let text = response.text.trim();

        // Remove markdown if Gemini wraps JSON
        text = text.replace(/```json/g, "")
                   .replace(/```/g, "")
                   .trim();

        const result = JSON.parse(text);

        res.json(result);

    } catch (err) {

    console.log("========= GEMINI ERROR =========");
    console.error(err);
    console.log("================================");

    res.status(500).json({
        error: err.message || "AI analysis failed."
    });

}

});

app.listen(3000, () => {

    console.log("✅ Server running on http://localhost:3000");

});