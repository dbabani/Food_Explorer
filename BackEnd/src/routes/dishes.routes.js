const { Router} = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const ensureAdminAuthenticated = require("../middlewares/ensureAdminAuthenticated")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const upload = multer(uploadConfig.MULTER);
const dishesRoutes = Router()

const dishesController = new  DishesController()

dishesRoutes.use(ensureAuthenticated);


dishesRoutes.post("/", ensureAdminAuthenticated, upload.single("image"), dishesController.create);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id",ensureAdminAuthenticated, dishesController.delete);
dishesRoutes.put("/:id",ensureAdminAuthenticated, upload.single("image"), dishesController.update);


module.exports = dishesRoutes;