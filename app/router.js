const { Router } = require('express');

const userController = require('./controllers/userController');
const applicationController = require('./controllers/applicationController');

//require token middleware
const authenticateToken = require('./middleware/authenticateToken');

//require schemas
const { validateBody } = require('./services/validator');
const { validateParams } = require('./services/validator');
const signupSchema = require('./schemas/signup');
const loginSchema = require('./schemas/login');
const applicationIdSchema = require('./schemas/applicationId');
const createApplicationSchema = require('./schemas/createApplication');
const modifyApplicationSchema = require('./schemas/modifyApplication');


const router = Router();


router.get('/', (req, res) => {res.json('Hello World')})

//user login and signup
router.post('/login', validateBody(loginSchema), userController.connectUser);
router.post('/signup', validateBody(signupSchema), userController.createUser);


//With token

router.get('/applications', authenticateToken.verifyToken, applicationController.findAll);
router.post('/applications/create',authenticateToken.verifyToken, validateBody(createApplicationSchema) ,applicationController.create); 
router.get('/applications/:applicationId', authenticateToken.verifyToken, validateParams(applicationIdSchema), applicationController.findOne);

//modifications

//router.put('/applications/:applicationId/modify/notes', authenticateToken.verifyToken, /* Insert JOI */ applicationController.modifyNotes);
//router.put('/applications/:applicationId/modify/offer_content', authenticateToken.verifyToken, /* Insert JOI */ applicationController.modifyOfferContent);
//router.put('/applications/:applicationId/modify/cover_letter', authenticateToken.verifyToken, /* Insert JOI */ applicationController.modifyCoverLetter);
//router.put('/applications/:applicationId/modify/info', authenticateToken.verifyToken, /* Insert JOI */ applicationController.modifyInfo);
router.put('/applications/:applicationId/modify' , authenticateToken.verifyToken, validateBody(modifyApplicationSchema), applicationController.modifyAll);

module.exports = router;