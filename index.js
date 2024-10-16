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
const {CategoryRouter}=require("./Route/Category")
const {ProductRouter}=require("./Route/Product")
const {SubcategoryRouter}=require("./Route/Subcategory")
const {BranchRouter}=require("./Route/Branch")
const {UserRouter}=require("./Route/Users")
const {OrderRouter}=require("./Route/Order")
const { createServer } = require("http");
const { Server }= require("socket.io");
const {initSocket}=require("./Services/Socket")

const app = express();
const httpServer = createServer(app);
initSocket(httpServer)

app.use(cors());

// io.on("connection", (socket) => {
//   console.log("User Connected", socket.id);

//   socket.on("message", ({ room, message }) => {
//     console.log({ room, message });
//     socket.to(room).emit("receive-message", message);
//   });

//   socket.on("join-room", (room) => {
//     socket.join(room);
//     console.log(`User joined room ${room}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
// });


//------IN Build Middleware----------//
app.use(morgan("combined"));
app.use(helmet());
// app.use(cors());
app.use(mongosantize());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//--------------- Route Middleware ------------------//
app.use("/api/v1/SuperAdmin", SuperAdminRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/category", CategoryRouter);
app.use("/api/v1/Subcategory", SubcategoryRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/branch", BranchRouter);
app.use("/api/v1/Order", OrderRouter);


//--------------Not Found Route-------------------//
app.get("*", (req, res, next) => {
  return next(new AppErr("Route not found", 404));
});




//----------Global Error -----------//
app.use(globalErrHandler);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  DbConnection();
  console.log(`Server is running on http://localhost:${PORT}`);
});
