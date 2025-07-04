// Ensure user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please log in to view that resource');
    res.redirect('/auth/login');
};

// Ensure user is guest (not authenticated)
exports.ensureGuest = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/dashboard');
};

// Ensure user is admin
exports.ensureAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    req.flash('error', 'Unauthorized access');
    res.redirect('/');
};
