import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send({ title: "小白兔的开发之路" });
});
router.post("/echo", (req, res) => {
  res.status(201).send(req.body);
});

export default router;
