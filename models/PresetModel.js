import mongoose from 'mongoose'

const presetSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    productIds:{
        type:[String],
    },
    shop:{
        type:String,
        required:true,
    },
    timing: {
        type: {
          openingTime: {
            type: Object,
            required: true,
            time: {
              type: String,
              required: true
            },
            format: {
              type: String,
              required: true
            },
          },
          closingTime: {
            type: Object,
            required: true,
            time: {
              type: String,
              required: true
            },
            format: {
              type: String,
              required: true
            },
          }
        },
        required:[true, "Opening and closing time is required"]
      },
    duration:[{
            hours: Number,
            price: Number,
     }],
     gap:{
        value:Number,
        format:String,
     },
     maintenanceTime:{
        value:Number,
        format:String,
     },
     enabled:Boolean,
},{
    timestamps:true,
})

export default mongoose.models.Preset ||  mongoose.model('Preset', presetSchema)