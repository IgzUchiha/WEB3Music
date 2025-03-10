const express = require("express");
const router = express.Router();
const { Song } = require("../models");

// GET /
router.get("/", async (req, res, next) => {
  try {
    const products = await Song.findAll();
    res.send(products);
  } catch (error) {
    next(error);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Song.findByPk(req.params.id);
    res.send(product);
  } catch (error) {
    next(error);
  }
});
router.put("/:id", async (req,res, next) => {
  await Song.update(
    req.body,
    {where: {id: req.params.id}}
    );
    const products1 = await Song.findByPk(req.params.id);
    res.json(products1)  
});
router.post("/" , async (req, res) => {
  const products1 = await Song.create(req.body);
  res.json(products1);
})
router.delete("/:id", async (req,res) => {
  let products1 = await Song.findByPk(req.params.id);
  await products1.destroy()
  res.json(products1)
})

module.exports = router;