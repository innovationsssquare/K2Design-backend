const OrderModel = require("../Model/Orderschema");
const AppErr = require("../Services/AppErr");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const cloudinary = require("../Services/cloudinary");
const upload = require("../Services/multer"); // Multer setup for image uploads
const puppeteer = require("puppeteer");
const pdf = require('html-pdf-node');
const { getSocketIO } = require("../Services/Socket");


// Create a new order
const createOrder = async (req, res, next) => {
  try {
    const { products, admin, branch, status, details, user } = req.body;
    
    const generateOrderId = () => {
      const timestamp = Date.now(); // Current time in milliseconds
      const randomNum = Math.floor(Math.random() * 1000000); // A random 6-digit number
      return `#ORD-${timestamp}-${randomNum}`;
    };

    const orderId = generateOrderId();


    // Create the new order
    const newOrder = new OrderModel({
      orderId,
      products,
      admin,
      branch,
      status,
      details,
      user,
      isRead: false,
    });

    const savedOrder = await newOrder.save();

    // Generate the invoice as a PDF
    const pdfBuffer = await generateInvoicePDF(savedOrder);

    // Upload the PDF to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "invoices",
          resource_type: "raw",
          format: "pdf",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(new AppErr("Failed to upload invoice to Cloudinary", 500));
          }
          resolve(result);
        }
      ).end(pdfBuffer);
    });

    // Save the Cloudinary URL to the order for reference
    savedOrder.invoiceUrl = uploadResponse.secure_url;
    await savedOrder.save();

    // Emit order creation event via Socket.IO (if using)
    const io = getSocketIO();
    io.emit("orderCreated", {
      message: "A new order has been created!",
      order: savedOrder
    });

    // Respond with the created order
    res.status(201).json({
      status: true,
      statuscode: 201,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Function to generate an invoice PDF using html-pdf-node
const generateInvoicePDF = async (order) => {
  // Define HTML content for the invoice using your custom template
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

            body {
                font-family: 'Poppins', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f0f0f0;
            }
            .invoice-container {
                background-color: #ffffff;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }
            .invoice-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #3498db;
                padding-bottom: 20px;
            }
            .logo {
                width: 80px;
                height: 80px;
            }
            .invoice-title {
                font-size: 36px;
                color: #3498db;
                margin: 0;
            }
            .invoice-to {
                margin-bottom: 30px;
                background-color: #ecf0f1;
                padding: 20px;
                border-radius: 5px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }
            th, td {
                border: 1px solid #bdc3c7;
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #3498db;
                color: #ffffff;
            }
            .total {
                text-align: right;
                font-size: 18px;
            }
            .total .grand-total {
                font-size: 24px;
                color: #e74c3c;
                font-weight: bold;
            }
            .payment-info, .terms {
                margin-top: 10px;
                background-color: #ecf0f1;
                padding: 20px;
                border-radius: 5px;
            }
            h2, h3 {
                color: #2c3e50;
            }
            footer {
                margin-top: 20px;
                text-align: center;
                color: #7f8c8d;
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="invoice-header">
                <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="#3498db" />
                    <text x="50" y="50" font-family="Arial" font-size="45" fill="white" text-anchor="middle" dominant-baseline="central">BA</text>
                </svg>
                <h1 class="invoice-title">K2-PRINT</h1>
                <div>
                    <p><strong>Invoice No:</strong> ${order?._id}</p>
                    <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div class="invoice-to">
                <h2>Invoice To:</h2>
                <p>${order.user?.UserName || 'Customer Name'}</p>
                <p>${order.user?.UserNumber || 'Customer Contact'}</p>
                <p>${order.user?.Address || 'Customer Address'}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order?.products?.map(item => `
                        <tr>
                            <td>${item.customization || 'N/A'}</td>
                            <td>${item.quantity}</td>
                            <td>${item.rates.unitPrice}</td>
                            <td>${item.rates.totalPrice}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total">
                <p><strong>Sub-total:</strong> ${order?.products?.reduce((acc, item) => acc + item.rates.totalPrice, 0)}</p>
                <p><strong>Tax:</strong> $10</p>
                <p class="grand-total"><strong>Total Due:</strong> $${order?.products?.reduce((acc, item) => acc + item.rates.totalPrice, 0) + 10}</p>
            </div>
            <div class="terms">
                <h3>Terms and Conditions</h3>
                <p>Please send payment within 30 days of receiving this invoice. There will be 10% interest charge per month on late invoices.</p>
            </div>

            <footer>
                <p>K2-SIGN PRINT</p>
                <p>Administrator</p>
            </footer>
        </div>
    </body>
    </html>
  `;

  // Create a buffer from the HTML content
  const pdfOptions = { format: 'A4' };
  const pdfBuffer = await pdf.generatePdf({ content: htmlContent }, pdfOptions);
  
  return pdfBuffer;
};



// Function to calculate the total price of the products
const calculateTotalPrice = (products) => {
  return products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
};

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find()
      .populate("user")
      .populate("products")
      .populate("admin")
      .populate("branch");
    res.status(200).json(orders);
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get a specific order by ID
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id)
      .populate("products")
      .populate("admin")
      .populate("branch");

    if (!order) return next(new AppErr("Order not found", 404));

    res.status(200).json(order);
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update an order by ID
const updateOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { products, status, details } = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { products, status, details },
      { new: true }
    );

    if (!updatedOrder) return next(new AppErr("Order not found", 404));

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete an order by ID
const deleteOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrder = await OrderModel.findByIdAndDelete(id);

    if (!deletedOrder) return next(new AppErr("Order not found", 404));

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};



// Mark an order as read
const markOrderAsRead = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { isRead: true },
      { new: true }
    );

    if (!order) {
      return next(new AppErr("Order not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Order marked as read",
      data: order,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get unread orders count
const getUnreadOrdersCount = async (req, res, next) => {
  try {
    const unreadOrdersCount = await OrderModel.countDocuments({ isRead: false });
    res.status(200).json({
      status: true,
      data: unreadOrdersCount,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};


// Mark all orders as read
const markAllOrdersAsRead = async (req, res, next) => {
  try {
    // Update all orders to set isRead to true
    await OrderModel.updateMany({}, { isRead: true });

    res.status(200).json({
      status: true,
      message: "All orders have been marked as read.",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  markOrderAsRead,
  getUnreadOrdersCount,
  markAllOrdersAsRead
};
