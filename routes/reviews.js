const express =require ('express');
const {getReviews, getReview,addReview,updateReview, deleteReview}=require('./controllers/reviews');
const Review=require('../models/Review');
const advancedResults=require('../middleware/advancedResults');
const router=express.Router({mergeParams:true});
const {protect,authorize}=require('../middleware/auth');

router.route('/').get(advancedResults(Review,{
    path:'bootcamp',
    select:'name description'
}), getReviews);

router.route('/:id').get(getReview).put(protect,authorize('user','admin'),updateReview).delete(protect,authorize('user','admin'),deleteReview);
router.route('/').post(protect,authorize('user','admin'), addReview);
 
module.exports=router;
