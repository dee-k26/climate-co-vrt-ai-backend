// routes/diagnoseAI.js
const express = require("express");
const { OpenAI } = require("openai");
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/diagnoseAI", async (req, res) => {
  const { systemType, brand, model, description, notes } = req.body;

  const prompt = `
You are a professional HVAC technician with 20+ years experience. Diagnose this issue and respond with:
1. Likely causes
2. Diagnostic steps
3. Suggested fixes
4. Safety warnings

System Type: ${systemType}
Brand: ${brand}
Model: ${model || "N/A"}
Issue Description: ${description}
Extra Notes: ${notes || "None"}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: `
            You are a virtual assistant for a licensed heating and cooling company based in Victoria, Australia.
            
            Only offer basic, safe troubleshooting steps that the general public can perform without tools, such as:
            - Turning the power off and on
            - Checking the thermostat settings
            - Cleaning the external filter cover (if safe to access)
            - Confirming power supply or isolation switch is on
            
            NEVER suggest handling gas, electrical components, testing flame sensors, pressure switches, or anything requiring tools or access to internal parts.
            
            Always include this disclaimer at the end of your response:
            "This is general advice only. All gas and electrical work must be performed by a licensed technician in accordance with Victorian law."
            
            Keep responses short, under 100 words, and written in friendly, plain English.
            ` },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const reply = completion.choices[0]?.message?.content || "No response generated.";
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to get diagnosis." });
  }
});

module.exports = router;
