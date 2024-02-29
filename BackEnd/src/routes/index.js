const { Router } = require("express")

const userRoutes = require("./user.routes")
const dishesRoutes = require("./dishes.routes")
const sessionRoutes = require("./session.routes")
const orderRoutes = require("./order.routes")

const routes = Router()

routes.use("/users",userRoutes)
routes.use("/dishes",dishesRoutes)
routes.use("/sessions",sessionRoutes)
routes.use("/orders",orderRoutes)

module.exports = routes;