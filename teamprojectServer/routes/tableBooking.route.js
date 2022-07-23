const router = require('express').Router();
const moment = require('moment');
const tableBookingSchema = require('../model/tableBooking.model');
// const { authVerify, isAdmin, isUser } = require("../middleware/auth");
const userModel = require('../model/user.model');


const Patio = () => {
    const patioArr = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10']
    const random = Math.floor(Math.random() * patioArr.length);
    // console.log(random, patioArr[random]);
    return patioArr[random]
}
const Inside = () => {
    const InsideArr = ['t11', 't12', 't13', 't14', 't15', 't16', 't17', 't18', 't19', 't20']
    const random = Math.floor(Math.random() * InsideArr.length);
    // console.log(random, InsideArr[random]);
    return InsideArr[random]
}
const Bar = () => {
    const BarArr = ['t21', 't22', 't23', 't24', 't25', 't26', 't27', 't28', 't29', 't30']
    const random = Math.floor(Math.random() * BarArr.length);
    // console.log(random, BarArr[random]);
    return BarArr[random]
}
const Any = () => {
    const AnyArr = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15', 't16', 't17', 't18', 't19', 't20', 't21', 't22', 't23', 't24', 't25', 't26', 't27', 't28', 't29', 't30']
    const random = Math.floor(Math.random() * AnyArr.length);
    // console.log(random, AnyArr[random]);
    return AnyArr[random]
}


router.post('/table-book', async (req, res) => {
    try {

        const { date, time, location, person,emailid } = req.body;
        let table = '';
        if (location == 'Patio') {
            for (let i = 0; i <= 10; i++) {
                let patioTable = Patio();
                const findData = await tableBookingSchema.find({ date, time, location, table: patioTable })
                if (findData.length != 0) {
                    if (i == 10) {
                        console.log(i)
                        return res.status(200).json({ status: true, message: "All tables are booked in this slot, Please choose different Time,Date or Location" })
                    }
                    continue;
                } else {
                    table = patioTable;
                    break;
                }
            }

        } else if (location == 'Inside') {
            for (let i = 0; i <= 10; i++) {
                let insideTable = Inside();
                const findData = await tableBookingSchema.find({ date, time, location, table: insideTable, i })

                if (findData.length != 0) {
                    if (i == 10) {
                        console.log(i)
                        return res.status(200).json({ status: true, message: "All tables are booked in this slot, Please choose different Time,Date or Location" })
                    }
                    continue;
                } else {
                    table = insideTable;
                    break;
                }
            }


        } else if (location == 'Bar') {

            for (let i = 0; i <= 10; i++) {
                let BarTable = Bar();
                const findData = await tableBookingSchema.find({ date, time, location, table: BarTable })
                if (findData.length != 0) {
                    if (i == 10) {
                        console.log(i)
                        return res.status(200).json({ status: true, message: "All tables are booked in this slot, Please choose different Time,Date or Location" })
                    }
                    continue;
                } else {
                    table = BarTable;
                    break;
                }
            }


        } else if (location == 'Any Location') {

            for (let i = 0; i <= 30; i++) {
                let AnyTable = Any();
                const findData = await tableBookingSchema.find({ date, time, location })
                if (findData.length != 0) {
                    if (i == 30) {
                        console.log(i)
                        return res.status(200).json({ status: true, message: "All tables are booked in this slot, Please choose different Time,Date or Location" })
                    }
                    continue;
                } else {
                    table = AnyTable;
                    break;
                }
            }

        }
        const userDetail = await userModel.findOne({ email: emailid }).exec()

        const data = new tableBookingSchema({ date, time, location, person, table, userDetails: userDetail });
        const result = await data.save();
        if (result) {
            console.log(result)
            return res.status(200).json({ status: true, message: "Table Booked Successfully", tableNumber: table })
        } else {
            return res.status(200).json({ status: false, message: "Somthing went wrong!" })
        }





        // tableBookingSchema.aggregate([
        //     {
        //         "$project": {
        //             "passengerId": 1
        //         }
        //     }
        // ]).pretty();



    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
});





module.exports = router;