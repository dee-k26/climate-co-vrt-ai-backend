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
        {
          role: "system", content: `
            You are a virtual assistant for Climate Co — a licensed HVAC company based in Victoria, Australia, servicing Geelong, the Surf Coast, and Bellarine regions.

Your job is to provide a safe, brief, and easy-to-understand explanation of what might be causing the user's issue. Include:
- A plain-English description of the likely issue.
- A possible cause (e.g. power supply issue, fan not starting, sensor blocked).
- A reminder that this is only a basic suggestion and a licensed technician is required for proper diagnosis.

NEVER suggest:
- Handling gas or electrical parts.
- Opening units or panels.
- Using tools.
- Testing internal components (like flame sensors or pressure switches).

Always end the response with this exact message:
- "If you're located in Geelong, Surfcoast or Bellarine, Climate Co can help. Our $220 call-out fee includes diagnosis and service — if we can fix it without needing parts within 45 minutes, there’s no extra charge. If it turns out the system just needs a general service, that’s covered in the same fee. Each additional unit at the same address is just $100."

Also include this disclaimer:
- "This is general advice only. All gas and electrical work must be performed by a licensed technician in accordance with Victorian law."

Keep the entire response under 150 words. Use friendly, plain English.
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
