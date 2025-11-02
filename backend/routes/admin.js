const express = require('express');
const router = express.Router();
const isAdmin = require('../app/middlewares/isAdmin');
const ensureActive = require('../app/middlewares/ensureActive');
const adminController = require('../app/controllers/AdminController');
const isAuthenticated = require('../app/middlewares/isAuthenticated');



// Tours
router.get('/tours', isAuthenticated, isAdmin, ensureActive, adminController.getTours);
router.post('/tours', isAuthenticated, isAdmin, ensureActive, adminController.createTour);
router.put('/tours/:id', isAuthenticated, isAdmin, ensureActive, adminController.updateTour);
router.delete('/tours/:id', isAuthenticated, isAdmin, ensureActive, adminController.deleteTour);

// Users
router.get('/users', isAuthenticated, isAdmin, ensureActive, adminController.getUsers);
router.post('/users/:id/deactivate', isAuthenticated, isAdmin, ensureActive, adminController.deactivateUser);
router.post('/users/:id/activate', isAuthenticated, isAdmin, ensureActive, adminController.activateUser);
router.post('/users/:id/reset-password', isAuthenticated, isAdmin, ensureActive, adminController.resetPassword);

// Admin
router.post('/create-admin', isAuthenticated, isAdmin, ensureActive, adminController.createAdmin);
router.get('/overview', isAuthenticated, isAdmin, ensureActive, adminController.getOverview);
router.get('/revenue', isAuthenticated, isAdmin, ensureActive, adminController.getRevenueReport);

module.exports = router;