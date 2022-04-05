const express= require('express');
const {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp,getBootcampsInRadius, bootcampPhotoUpload}=require('./controllers/bootcamps')
const advancedResults=require('../middleware/advancedResults')
//include other resource routers
const Bootcamp=require('../models/Bootcamp');
const courseRouter=require('./courses');
const reviewRouter=require('./reviews');
const {protect,authorize}=require('../middleware/auth');
const router= express.Router();

//re-route into other resource routers 
router.use('/:bootcampId/courses',courseRouter);
router.use('/:bootcampId/reviews',reviewRouter);

router.route('/').get(advancedResults(Bootcamp,'courses'), getBootcamps).post(protect,authorize('publisher','admin'),createBootcamp);
router.route('/:id').put(protect,authorize('publisher','admin'),updateBootcamp).get(getBootcamp).delete(protect,authorize('publisher','admin'),deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id/photo').put(protect,authorize('publisher','admin'),bootcampPhotoUpload); 

      module.exports=router;