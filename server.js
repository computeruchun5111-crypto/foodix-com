
require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error("ERROR: BOT_TOKEN yoki CHAT_ID topilmadi!");
  process.exit(1);
}

app.post("/send-message", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        ok: false,
        description: "Message is required"
      });
    }

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("Telegram error:", data);

      return res.status(502).json({
        ok: false,
        description: data.description || "Telegram error"
      });
    }

    console.log("FOODIX ORDER SENT!");

    res.json({
      ok: true,
      message: "Order sent successfully!"
    });

  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      ok: false,
      description: "Server error"
    });
  }
});

app.listen(3000, () => {
  console.log("FOODIX SERVER RUNNING!");
  console.log("http://localhost:3000");
});
