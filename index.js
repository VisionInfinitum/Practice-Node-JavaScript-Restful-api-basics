// Bring in the express server and create application
/*
    The require function resolves libraries and modules in the Node search path (usually\node_modules)
*/
let express = require('express');

// The express function creates an express application. Many other objects are created from this application object.
let app = express();
let studentRepo = require('./repository/student-repository');
let errorHelpers = require('./helpers/error-helpers');
let cors = require("cors");

// Use the express Router object
let router = express.Router();

// Configure middleware to support JSON data parsing in request object
// This will support passing json data in the request body
app.use(express.json());


// Configure CORS
// By deafult it allows everything to configure options go to
// https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());

// Create GET to return a list of some data you want
/*
    next is used for the middleware purpose
    / states, if someone comes to this end point execute the function in the
    second parameter of the get function
*/
router.get('/', function(req, res, next) {
    studentRepo.get(function(data){
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "All students retrieved.",
            "data": data
        });
    },function(error){
        next(error);
    });
});

// We need to add the search before the get that has the id
// Hence we are adding the search here
// Create GET/search?id=n&name=str to search for students by id or name
router.get('/search', function (req,res,next) {
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };

    studentRepo.search(searchObject, function(data){
        if(data.length) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "All students retrieved.",
                "data": data
            });
        } else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found"
            });
        }
    },
    function(error){
        next(error)
    });
})


// Create get id route to get a single student
router.get('/:id', function(req, res, next) {
    studentRepo.getById(req.params.id, function(data){
        if(data) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "Single student retrieved.",
                "data": data
            });
        } else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": " The student " + req.params.id + " could not be found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": " The student " + req.params.id + " could not be found"
                }
            });
        }
    }, function(error){
        next(error);
    })
})


router.post('/', function(req, res, next) {
    studentRepo.insert(req.body, function(data) {
        res.status(201).json({
            "status": 201,
            "statusText": "Created",
            "message": "New student added",
            "data": data
        });
    }, function(error) {
        next(error);
    })
})


router.put('/:id', function(req, res, next) {
    studentRepo.getById(req.params.id, function(data) {
        if(data) {
            studentRepo.update(req.body, req.params.id, function(data) {
                res.status(200).json({
                    "status": 201,
                    "statusText": "OK",
                    "message": "Student with " + req.params.id + " has been updated",
                    "data": data
                })
            }, function(error) {
                next(error);
            })
        } else {
            res.status(400).json({
                "status": 400,
                "statusText": "Not Found",
                "message": " The student " + req.params.id + " could not be found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": " The student " + req.params.id + " could not be found"
                }
            })
        }
    }, function(error) {
        next(error);
    })
})


router.delete('/:id', function(req, res, next) {
    studentRepo.getById(req.params.id, function(data) {
        if(data) {
            studentRepo.delete(req.params.id, function(data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "Student with " + req.params.id + " has been deleted",
                    "data": "Pie " + req.params.id + " deleted"
                })
            }, function(error) {
                next(error);
            })
        } else {
            res.status(400).json({
                "status": 400,
                "statusText": "Not Found",
                "message": " The student " + req.params.id + " could not be found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": " The student " + req.params.id + " could not be found"
                }
            })
        }
    }, function(error) {
        next(error);
    })
})

router.patch('/:id', function(req, res, next) {
    studentRepo.getById(req.params.id, function(data) {
        if(data) {
            studentRepo.update(req.body, req.params.id, function(data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "Student with " + req.params.id + " has been updated",
                    "data": data
                })
            }, function(error) {
                next(error);
            })
        } else {
            res.status(400).json({
                "status": 400,
                "statusText": "Not Found",
                "message": " The student " + req.params.id + " could not be found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": " The student " + req.params.id + " could not be found"
                }
            })
        }
    }, function(error) {
        next(error);
    })
})

// Configure router so all routes are prefixed with /api/v1
app.use('/api/', router);

// configure exception logger, use next to pass it to next custom exception handling middleware
app.use(errorHelpers.logErrors);
app.use(errorHelpers.clientErrorHandler);
// Configure custom exception handling middleware last
// the express server knows this is the middleware for exception handling
// through the function(error, req, res, next) parameters (4 parameters)
app.use(errorHelpers.errorHandler);


// Create a server to listen on port 5000
var server = app.listen(5000, function() {
    console.log('Node server is running on http://localhost:5000');
});