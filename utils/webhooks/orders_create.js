import BookingModel from "@/models/BookingModel";
import clientProvider from "../clientProvider";
import { DateTime } from "luxon";


const createBookingHandler = async (topic, shop, webhookRequestBody) => {
    try {
        const webhookBody = JSON.parse(webhookRequestBody);
        const {client} =await  clientProvider.offline.graphqlClient({shop})
        const {body} = await client.query({
          data:`
          {
            appInstallation {
                activeSubscriptions {
                    name
                    id
                    status
                    createdAt
                    currentPeriodEnd
                    lineItems {
                        plan {
                            pricingDetails {
                                ... on AppRecurringPricing {
                                    price {
                                        amount
                                        currencyCode
                                    }
                                    interval
                                }
                            }
                        }
                    }
                }
            }
        }
          `
        })
        console.log(body)
        const { line_items, name: orderNumber, created_at: createdAt, customer } = webhookBody
        const TIME_FORMAT = 'hh:mm a';
        // plans
        const bookings = [];
        console.log('line_items', line_items);
        line_items
        .filter((item)=>{
          return item.properties.some(property=>property.name === 'Date') &&
          item.properties.some(property=>property.name === 'Duration')
        })
        .forEach(({properties, product_id, variant_title, title, variant_id})=>{
        const duration = properties?.find( p => p.name === 'Duration') //booking Duration Sent By User
        const date = properties?.find( p => p.name === 'Date') //booking Date Sent By User
        const time = properties?.find( p => p.name === 'Time')// booking Time Sent By User
        const [durationValue, durationFormat] = duration.value.split(' ')
        const startTime = DateTime.fromFormat( time.value, TIME_FORMAT)
        const endTime = startTime.plus({[durationFormat]: parseInt(durationValue)})
    
          bookings.push({
            productId: product_id,
            productTitle: title,
            variantId:variant_id,
            email:customer.email,
            bookingDate:date.value,
            startTime:startTime.toFormat(TIME_FORMAT),
            endTime:endTime.toFormat(TIME_FORMAT),
            duration: `${durationValue} ${durationFormat}`,
            orderNumber,
            createdAt,
            shop
          })
      })
      if(bookings.length > 0) await BookingModel.create(bookings)
      }
      catch (err) {
        console.log(err)
      }
};

export default createBookingHandler;
