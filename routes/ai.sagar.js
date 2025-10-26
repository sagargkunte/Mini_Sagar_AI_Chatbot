import { Router } from "express";
import { AI } from "../services/ai.js";

const router = Router();

router.post("/aiSagar", async (req, res) => {
  try {
    // console.log('working in phase 1');
    const response = await AI(req.body.text);
    return res.send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;
