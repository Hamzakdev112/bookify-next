import BookingModel from "@/models/BookingModel";
import withMiddleware from "@/utils/middleware/withMiddleware.js";
import { DateTime } from "luxon";

export default withMiddleware("verifyProxy")(checkAvailableBookings);

async function checkAvailableBookings(req, res){
  if (req.method === "POST") {
    try {
        // initialize variables
        const TIME_FORMAT = 'hh:mm a';
        const DATE_FORMAT = 'yyyy-MM-dd';
        const END_TIME = "2050-04-28";
        const { productId, duration, gap, bookingDate, zone } = req.body;
        const {shop} = res;   
        console.log(req.body)
        let openingTime = req.body.openingTime;
        let closingTime = req.body.closingTime;
        let currentTime;
        let currentDate;
        // Initalize Luxon Objects
        const now = DateTime.now().setZone(zone);
        currentTime = now;
        currentDate = now.toFormat(DATE_FORMAT);
        if (currentTime >
         DateTime.fromFormat(openingTime, TIME_FORMAT) && currentDate === bookingDate) {
          openingTime = currentTime.plus({ hours: 1 }).startOf("hour").toFormat(TIME_FORMAT);
        }
        openingTime = DateTime.fromFormat(openingTime, TIME_FORMAT);
        closingTime = DateTime.fromFormat(closingTime, TIME_FORMAT).minus({hours:duration});
        console.log('closing ', closingTime.toFormat(TIME_FORMAT))
        const endMoment = DateTime.fromFormat(END_TIME, DATE_FORMAT);
        // Generate Available Bookings
        const availableSlots = await filterAvailableTimeSlots({
          openingTime,
          closingTime,
          endMoment,
          gap,
          productId,
          bookingDate,
          duration,
          shop
        });
        res.status(200).json(availableSlots);
      } catch (err) {
        console.log(err.message);
        return res.status(500).json(err)
      }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
};



async function filterAvailableTimeSlots (options){
    const TIME_FORMAT = 'hh:mm a'
    const { openingTime, closingTime, endMoment, gap, productId, bookingDate,duration, shop } = options;
    const gapTime = gap?.value
    const gapFormat = gap?.format
    // Retrieve existing bookings 
    const overlappingBookings = await BookingModel.find({
      productId: productId,
      shop,
      bookingDate: bookingDate,
    }).select('startTime endTime')
    // Filter for available time slots
    const availableSlots = [];
    let CURRENT = openingTime;
    while (CURRENT < closingTime) {
      const overlappingBooking = overlappingBookings.find((booking) => {
        const bookingStartTime = DateTime.fromFormat(booking.startTime, TIME_FORMAT);
        const bookingEndTime = DateTime.fromFormat(booking.endTime, TIME_FORMAT);
        // Calculate the difference between CURRENT moment and booking start time in minutes
        const durationDiff = bookingStartTime.diff(CURRENT, "minutes").as('minutes')
        return (
          CURRENT >= bookingStartTime && CURRENT < bookingEndTime || // Check for overlapping bookings
          (durationDiff >= 0 && durationDiff < duration * 60) // Check for potential conflicts
        );
      });
      if (!overlappingBooking && CURRENT < endMoment) {
        // If no overlapping booking and CURRENT moment is before end moment, add to available slots
        availableSlots.push(CURRENT.toFormat(TIME_FORMAT));
      }
      CURRENT = CURRENT.plus({[gapFormat]: gapTime }); // Move to next time slot
    }
    return availableSlots;
  };
