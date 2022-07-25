const router = require('express').Router();
const moment = require('moment');
const userschema = require('../model/user.model');
const { authVerify, isAdmin, isUser } = require("../middleware/auth");
const { response, request } = require('express');
const foodCategory = require('../model/category.model')
const foodSchema = require('../model/food.model')
const TableSchema = require('../model/table.model')
const multer = require('multer');
const xlsx = require('xlsx');
const { findOneAndRemove } = require('../model/user.model');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
    return cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
    return cb(null,Date.now()+'_'+file.originalname)
    }
})




router.post('/add', isAdmin, async (req, res) => {
    try {
        const upload = multer({storage:storage}).single('file')

        upload(req, res, async function (err) {
            // console.log("files", req.file);
            if (!req.file) {
              return res.send("Please select an image to upload");
            } else if (err instanceof multer.MulterError) {
              return res.send(err);
            } else if (err) {
              return res.send(err);
            }
            console.log(JSON.stringify(req.body))

// sajnatech97@gmail.com
// Sajna@97
// aarifa@gmail.com



            reqData = {
                foodName:req.body.foodName,
                Price:req.body.Price,
                ingredients:req.body.ingredients,
                Offer:req.body.offer,
                OfferPrice:req.body.offerPrice,
                foodImage:req.file.filename,
                userUuid:req.body.userUuid,
                quantity:req.body.quantity,
                imgUrl:req.file.filename,
                categoryUuid:req.body.categoryUuid
            }
      console.log(req.body)
            const data = new foodSchema(reqData);
            const result = await data.save();
            if(result){
                return res.status(200).json({ 'status': 'success', "message": " successfully added", "result": result })
            }else{
                return res.status(200).json({ 'status': 'failed', "message": "somthing went wrong" })

            }
          
          });
       
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
});

// get all food item list 
router.get("/getallitem", async (req, res) => {
    try {
        const foodDetails = await foodSchema.find().exec();
        if (foodDetails.length > 0) {
            return res.status(200).json({ 'status': 'success', message: "Product details fetched successfully", 'result': foodDetails });
        } else {
            return res.status(404).json({ 'status': 'failure', message: "No Product details available", result: foodDetails })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
});

router.get('/get-categorybasedfooditem', async (req, res) => {
    try {
        console.log("test", req.query)
        const category_id = req.query.category_id
        const items = await foodSchema.find({ categoryUuid: category_id }).exec()
        console.log(items)
        if (items.length !== 0) {
            console.log("success");
            res.json({ status: true, 'result': items })
        } else {
            res.json({ status: false, message: 'This food not avalible!' })
        }

    } catch (err) {
        res.json({ "error": err.message })
    }
})

//get all food category list
router.get("/getfoodcategory", async (req, res) => {
    try {
        const itemCategoryDetails = await foodCategory.find().exec();
        if (itemCategoryDetails.length > 0) {
            return res.status(200).json({ 'status': 'success', message: "Product details fetched successfully", 'result': itemCategoryDetails });
        } else {
            return res.status(404).json({ 'status': 'failure', message: "No Product details available", result: itemCategoryDetails })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
});

//add food category
router.post('/addfoodcategory', isAdmin, async (req, res) => {
    try {
        const data = new foodCategory(req.body);
        const result = await data.save()
        return res.status(200).json({ status: "success", message: 'category added successfully', result: result })
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
})

//update food details
router.put("/updatefooditems", isAdmin, async (req, res) => {
    try {
        let condition = { "uuid": req.body.uuid }
        let updateData = req.body.updateData;
        let option = { new: true }
        const data = await foodSchema.findOneAndUpdate(condition, updateData, option).exec();
        return res.status(200).json({ 'status': 'success', message: "successfully updated", 'result': data });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
});


//delete food item
router.delete("/delete/:food_uuid", isAdmin, async (req, res) => {
    try {
        console.log(req.params.food_uuid)
        await foodSchema.findOneAndDelete({ uuid: req.params.food_uuid }).exec();
        return res.status(200).json({ 'status': 'success', message: "successfully deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
})
//delete foodcategory item
router.delete("/deletecategory/:foodCategory_uuid", isAdmin, async (req, res) => {
    try {
        console.log(req.params.foodCategory_uuid)
        await foodCategory.findOneAndDelete({ uuid: req.params.foodCategory_uuid }).exec();
        return res.status(200).json({ 'status': 'success', message: "successfully deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
})
router.get("/searchproduct/:key", async (req, res) => {
    console.log(JSON.stringify(req.params.key))
    try {
        let data = await foodSchema.find({
            "$or": [
                { foodName: { $regex: req.params.key, $options: "i" } }
            ]
        })
        // res.send(data)
        if (data.length > 0) {

            return res.status(200).json({ 'status': 'success', message: "food details fetched successfully", 'result': data });
        } else {
            return res.status(404).json({ 'status': 'failure', message: "No food details available" })
        }
    } catch (error) {
        return res.status(200).json({ "status": "failure", "message": error.message })
    }
})

router.put("/update", isAdmin, async (req, res) => {
    try {
        let condition = { "uuid": req.body.uuid }
        let updateData = req.body.updateData;
        let option = { new: true }
        const data = await foodSchema.findOneAndUpdate(condition, updateData, option).exec();
        return res.status(200).json({ 'status': 'success', message: "  successfully updated", 'result': data });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
});
// get individual product details
router.get("/getIndifooddetails", authVerify, async (req, res) => {
    try {
        const productDetails = await foodSchema.findOne({ "uuid": req.query.food_uuid }).exec();
        if (productDetails) {
            return res.status(200).json({ 'status': 'success', message: "Product details fetched successfully", 'result': productDetails });
        } else {
            return res.status(404).json({ 'status': 'failure', message: "No Product details available" })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
});

router.post("/book-table", async (req, res) => {
    try {
        const { bookingDate, tableData, bookingTime } = req.body
        console.log("table", req.body)

        const data = new TableSchema({
            name: tableData.name,
            email: tableData.email,
            phone: tableData.phone,
            bookingDate: bookingDate,
            bookingTime: bookingTime,
            peopleCount: tableData.peopleCount,
            message: tableData.message
        });
        const result = await data.save();
        console.log(result)
        if (result) {
            res.status(200).json({ status: true, message: 'Your Table Booked', table_number: 'A23' })
        }

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
});


 

module.exports = router;