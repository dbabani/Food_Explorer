require("express-async-errors")
require("dotenv/config")
const express = require("express")
const app = express()
const cors = require("cors")
const AppError = require("./utils/AppError")
const database = require("./database/sqlite")
const uploadConfig = require("./configs/upload")
const routes = require("./routes")



app.use(cors())
app.use(express.json())
database()
app.use("/files",express.static(uploadConfig.UPLOADS_FOLDER))
app.use(routes)



app.use((error, request, response, next) => {
    if(error instanceof AppError){
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
    }
  
    console.error(error);
  
    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  });
  

const PORT = 3001 ;
app.listen(PORT,() => console.log(`Server is running on PORT:${PORT}`));

