const express = require('express');
const Pedido = require('../models/pedido');
const router = express.Router();

router.get('/ventas-por-producto', async (req, res) => {
  try {
    const informe = await Pedido.aggregate([
      { $unwind: "$productos" },
      {
        $group: {
          _id: "$productos.nombre",
          totalVendidas: { $sum: "$productos.cantidad" },
          totalRecaudado: { $sum: { $multiply: ["$productos.precio_unitario", "$productos.cantidad"] } }
        }
      },
      { $sort: { totalVendidas: -1 } }
    ]);

    res.render('informeVentasProducto', { informe }); // 👈 muestra en vista EJS
  } catch (err) {
    console.error("Error al generar informe:", err);
    res.status(500).send('Error al generar informe de ventas por producto');
  }
});

// Informe de ventas por mes
router.get('/ventas-por-mes', async (req, res) => {
  try {
    const informe = await Pedido.aggregate([
      {
        $group: {
          _id: { 
            mes: { $month: "$fecha" }, // agrupa por mes de la fecha
            anio: { $year: "$fecha" }  // agrupa por año de la fecha
          },
          totalRecaudado: { $sum: "$total" },
          cantidadPedidos: { $sum: 1 }
        }
      },
      { $sort: { "_id.anio": -1, "_id.mes": -1 } } // orden descendente (últimos meses primero)
    ]);

    res.render('informeVentasPorMes', { informe }); // ✅ nombre de la vista
  } catch (err) {
    console.error("Error al generar informe por mes:", err);
    res.status(500).send('Error al generar informe de ventas por mes');
  }
});


module.exports = router;