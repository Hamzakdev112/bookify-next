// If you have the recommended extension installed, create a new page and type `createapi` to generate api endpoint boilerplate

//TEMP

import { connectToDatabase } from "@/libs/mongo";
import withMiddleware from "@/utils/middleware/withMiddleware.js";
import BookingModel from "@/models/BookingModel";

const getBookings = async (req, res) => {
    if (req.method === "GET") {
        try {
        const {shop} = res;
        await connectToDatabase()
        const orders = await BookingModel.aggregate([
            {
              $match: { shop },
            },
            {
              $sort: {
                bookingDate: -1,
              },
            },
          ]);
          res.status(200).json(orders);

    } catch (e) {
      console.error(`---> An error occured`, e);
      return res.status(400).send({ message: "Bad request" });
    }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

export default withMiddleware("verifyRequest")(getBookings);
