const express = require("express");
const DbConnection = require("./Services/Db/Connection");
const morgan = require("morgan");
const helmet = require("helmet");
const mongosantize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const cors = require("cors");
const globalErrHandler = require("./MiddleWare/GlobalError");
const AppErr = require("./Services/AppErr");
const SuperAdminRouter = require("./Route/SuperAdminAndAdmin/SuperAdmin");
const { AdminRouter } = require("./Route/SuperAdminAndAdmin/Admin");
const cloudinary = require("cloudinary");
const UserRouter = require("./Route/Users");


const app = express();



//------IN Build Middleware----------//
app.use(morgan("combined"));
app.use(helmet());
app.use(cors());
app.use(mongosantize());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//-------------Cloudinary---------------//
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUDNARY_API_KEY,
  api_secret:process.env.CLOUDNARY_API_SECRET,
});

//--------------- Route Middleware ------------------//
app.use("/api/v1/SuperAdmin", SuperAdminRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/users", UserRouter);


//--------------Not Found Route-------------------//
app.get("*", (req, res, next) => {
  return next(new AppErr("Route not found", 404));
});

//----------Global Error -----------//
app.use(globalErrHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  DbConnection();
  console.log(`listening on ${PORT}`);
});
