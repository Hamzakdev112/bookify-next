import { getAllOrdersFailure, getAllOrdersStart, getAllOrdersSuccess } from "@/store/slices/ordersSlice"
import { resetState, setSelectedTime, setTimes } from "@/store/slices/customBookingSlice"

export const fetchAllOrders = async (fetch,dispatch)=>{
    try{
        dispatch(getAllOrdersStart())
        const response = await fetch("/api/bookings")
        const data = await response.json()
       dispatch(getAllOrdersSuccess(data))
    }catch(err){
        dispatch(getAllOrdersFailure(err))
    }
}
export const changeOrder = async (setOrder,setUpdating, setEditOpen,fetch,dispatch, data)=>{
    try{
        setUpdating(true)
        const payload = {
            orderId:data.orderId,
            time:data.selectedTime,
            bookingDate:data.bookingDate,
            duration:data.duration,
            notification:data.notification,
        }
        const response = await fetch('/booking/change',{
            method:'PUT',
            headers:{
            'Content-Type':'application/json'
            },
            body:JSON.stringify(payload)
        })
        console.log(response)
        if(response.status === 200){
            setUpdating(false)
            setOrder(null)
            setEditOpen(false)
            fetchAllOrders(fetch,dispatch)
        }
    }catch(err){
        setUpdating(false)
        console.log(err)
    }
}

export const fetchavailableTimesOfOrder = async(fetch, payload)=>{
        try{
            const response = await fetch('/booking/check-booking-admin',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(payload)
            } )
            if(response.ok){
                return await response.json();
            }
            else return Promise.reject(await response.json())
        }catch(err){
            console.log(err)
        }
}
export const fetchavailableTimesForCustomOrder = async(setCheckBookingLoading,dispatch, productId,variantTitle,bookingDate,openingTime,closingTime,gap)=>{
        const payload = {
            product_id:productId,
            variant_title:variantTitle,
            date:bookingDate,
            open_time:openingTime,
            close_time:closingTime,
            gap_time:parseInt(gap)
        }
        try{
            setCheckBookingLoading(true)
            dispatch(setSelectedTime(null))
            const {data} = await axios.post('/booking/checkbooking',payload )
            dispatch(setTimes(data))
            setCheckBookingLoading(false)
        }catch(err){
            setCheckBookingLoading(false)
            console.log(err)
        }
}


export const handleCreateOrder =async (body, setCreateOrderLoading, navigate,fetch,dispatch)=>{
    try{
        setCreateOrderLoading(true)
        const response  = await fetch("/orders/create",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body)
        })
        const res = await response.json()
        setCreateOrderLoading(false)
        const orderId = res.body.order.name.split('#')[1]
        if(response.status === 200){
            navigate(`/order-success?orderId=${orderId}`);
            dispatch(resetState());
        }

    }catch(err){
        setCreateOrderLoading(false)
        console.log(err)
    }

}
