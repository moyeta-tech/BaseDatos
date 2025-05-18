router.get('/ventas-por-producto', async (req, res) => {
  const informe = await Pedido.aggregate([
    { $unwind: "$productos" },
    {
      $group: {
        _id: "$productos.nombre",
        totalVendidas: { $sum: "$productos.cantidad" }
      }
    }
  ]);
  res.json(informe);
});
