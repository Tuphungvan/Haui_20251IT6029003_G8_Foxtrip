const siteRouter = require('./site');
const authRouter = require('./auth');
const profileRouter = require('./profile');
const adminRouter = require('./admin');
const cartRouter = require('./cart');
const checkoutRouter = require('./checkout');
const managerOrderRouter = require('./managerOrder');
const chatbotRouter = require("./chatbot");
const tourRouter = require("./tour");

function route(app) {
    app.use('/admin', adminRouter);
    app.use('/auth', authRouter);
    app.use('/profile', profileRouter);

    app.use('/checkout', checkoutRouter);
    app.use('/admin/manager-order', managerOrderRouter);
    app.use('/', siteRouter);
    app.use('/', cartRouter);
    app.use("/chatbot", chatbotRouter);
    app.use("/tour", tourRouter);
}

module.exports = route;
