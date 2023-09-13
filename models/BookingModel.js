import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    productId:{
        type:String,
    },
    orderNumber:{
        type:String,
    },
    variantId:{
        type:String,
    },
    productTitle:{
        type:String,
    },
    startTime:{
        type:String,
    },
    endTime:{
        type:String
    },
    duration:{
        type:String
    },
    bookingDate:{
        type:String
    },
    createdAt:{
        type:Date,
    },
    email:{
        type:Object,
    },
    price:{
        type:String,
    },
    shop:{
        type:String
    }
})

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema)
