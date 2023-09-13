import { Modal, Spinner } from '@shopify/polaris'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchavailableTimesOfOrder } from '@/apiCalls/ordersApis';
import useFetch from '../hooks/useFetch';

const EditBooking = ({order,setOrder}) => {
    const [updating, setUpdating] = useState(false)
    const [checkBookingLoading, setCheckBookingLoading] = useState(false)
    const [times, setTimes] = useState(null)
    const [error, setError] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [bookingDate, setBookingDate] = useState(order.bookingDate)
    const [notification, setNotification] = useState(false)
    const {settings} = useSelector(state=>state.shop)
    const fetch = useFetch()
    console.log(times)
    const dispatch = useDispatch()
    const handleClose = ()=>{
        setOrder(null)
    }

    async function getSlots(){
        try{

            setCheckBookingLoading(true)
            const slots = await fetchavailableTimesOfOrder(fetch, {
            duration:order?.duration,
            zone:settings?.timeZone?.offset,
            productId:order?.productId,
            bookingDate,
        })
        console.log(slots)
        setTimes(slots)
        setCheckBookingLoading(false)
    }
    catch(err){
        setCheckBookingLoading(false)
        setError(err.message ? err.message : "Error Occured" )
    }
    }
    useEffect(()=>{
        getSlots()
    },[bookingDate])

  return (
    <div>
            <Modal
            open={order !== null}
        onClose={handleClose}
        primaryAction={{
            content:"Change",
            onAction:()=>changeOrder(setOrder,setUpdating,fetch,dispatch,{
                orderId:order._id,
                selectedTime,
                bookingDate,
                duration:order.duration,
                notification
            }),
            loading:updating,
            disabled:selectedTime === null
        }}
        >
         <Modal.Section>
                <div className='date-picker-container' >
                {/* <span>Booking Date: {moment(bookingDate).format("DD-MM-YYYY")}</span> */}
                <span>Change booking date</span>
            </div>
            <div className='available-times-container'>
        {
            checkBookingLoading ? <div className='available-times-loading' ><Spinner /></div> :
        error ? <span style={{color:'red'}}>{error}</span>
        :
        times?.map((time)=>(
            <button
            onClick={()=>(setSelectedTime(time))}
            className={`edit-order-time-button ${selectedTime === time && "selected-time"}`}
             key={time}
             >{time}</button>
        ))
        }
        </div>
        <div style={{display:'flex', alignItems:'center', marginTop:'20px'}}>
        <span>Notify Customer</span>
        <input onChange={(e)=>setNotification(e.target.checked)} type="checkbox" />
        </div>
         </Modal.Section>
        </Modal>
    </div>
  )
}

export default EditBooking
