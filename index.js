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
const {BrochureRouter}=require("./Route/Allproductsroute/Brochure")
const {BookletRouter}=require("./Route/Allproductsroute/Booklet")
const {PrintProductRouter}=require("./Route/Allproductsroute/Posterdigitalprint")
const {FilesAndFoldersRouter}=require("./Route/Allproductsroute/Filesandfolders")
const { EnvelopeRouter } = require("./Route/Allproductsroute/Envolopes");
const { LetterheadRouter } = require("./Route/Allproductsroute/Letterhead");
const { VisitingCardRouter } = require("./Route/Allproductsroute/Visitingcard");
const { PaperbagsRouter } = require("./Route/Allproductsroute/Paperbags");
const { PavatiBooksRouter } = require("./Route/Allproductsroute/Pavtibook");
const { TagsRouter } = require("./Route/Allproductsroute/Tag");
const { StickerLabelsRouter } = require("./Route/Allproductsroute/Stickers");
const { StampRouter } = require("./Route/Allproductsroute/Stamps");
const { WeddingCardRouter } = require("./Route/Allproductsroute/Weddingcard");
const { WallCalendarRouter } = require("./Route/Allproductsroute/Calender");
const { BillBookRouter } = require("./Route/Allproductsroute/Billbooks");
const { PamphletRouter } = require("./Route/Allproductsroute/Pamphlets");
const { InvitationCardRouter } = require("./Route/Allproductsroute/Invitation");
const { VinylPrintRouter } = require("./Route/Allproductsroute/Mediaprinting/Vinylprint");
const { NightGlowPrintRouter } = require("./Route/Allproductsroute/Mediaprinting/Nightglow");
const { CanvasPrintRouter } = require("./Route/Allproductsroute/Mediaprinting/Canvasprint");
const { BacklitFlexPrintRouter } = require("./Route/Allproductsroute/Mediaprinting/Backlitflexprint");
const { TranslitPrintRouter } = require("./Route/Allproductsroute/Mediaprinting/TranslitPrint");
const { ThreeMReflectorPrintRouter } = require("./Route/Allproductsroute/Mediaprinting/3MReflectorPrint");
const { GlassFilmPrintRouter } = require("./Route/Allproductsroute/Glassfilms/GlassFilmPrint");
const { OneWayVisionRouter } = require("./Route/Allproductsroute/Glassfilms/Onewayvision");
const { FlexBannerPrintRouter } = require("./Route/Allproductsroute/Flexprinting/FlexBannerPrintadvertise");

const {UserRouter}=require("./Route/Users")
const {OrderRouter}=require("./Route/Order")
const { createServer } = require("http");
const { Server }= require("socket.io");
const {initSocket}=require("./Services/Socket")
const { TeamRouter } = require("./Route/Team");
const { TicketRouter } = require("./Route/Support");
DbConnection();

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
app.use("/api/v1/Team", TeamRouter);
app.use("/api/v1/Support", TicketRouter);
app.use("/api/v1/Brochure", BrochureRouter);
app.use("/api/v1/Booklet", BookletRouter);
app.use("/api/v1/Poster", PrintProductRouter);
app.use("/api/v1/Filesandfolders", FilesAndFoldersRouter);
app.use("/api/v1/Envolopes", EnvelopeRouter);
app.use("/api/v1/Letterhead", LetterheadRouter);
app.use("/api/v1/Visitingcard", VisitingCardRouter);
app.use("/api/v1/Paper", PaperbagsRouter);
app.use("/api/v1/Pavti", PavatiBooksRouter);
app.use("/api/v1/Tag",TagsRouter );
app.use("/api/v1/Stickers",StickerLabelsRouter );
app.use("/api/v1/Stamp",StampRouter );
app.use("/api/v1/Wedding",WeddingCardRouter );
app.use("/api/v1/Calender",WallCalendarRouter );
app.use("/api/v1/Billsbooks",BillBookRouter );
app.use("/api/v1/Pamphlets",PamphletRouter );
app.use("/api/v1/Invitation",InvitationCardRouter );
app.use("/api/v1/Vinylprint",VinylPrintRouter );
app.use("/api/v1/NightGlowPrint",NightGlowPrintRouter );
app.use("/api/v1/Canvasprint",CanvasPrintRouter );
app.use("/api/v1/BacklitPrint",BacklitFlexPrintRouter );
app.use("/api/v1/TranslitPrint",TranslitPrintRouter );
app.use("/api/v1/3MReflectorPrint",ThreeMReflectorPrintRouter );
app.use("/api/v1/Glassfilms",GlassFilmPrintRouter );
app.use("/api/v1/OnewayvisionGlassfilms",OneWayVisionRouter );
app.use("/api/v1/Flexbanner",FlexBannerPrintRouter );


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
