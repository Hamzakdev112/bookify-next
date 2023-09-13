import {  FormLayout, LegacyCard, Toast, VerticalStack} from '@shopify/polaris'
import React, { useState } from 'react'
import OpenCloseTime from './OpenCloseTime'
import Gap from './Gap'
import MaintenanceTime from './MaintenanceTime'
import Duration from './Duration'
import { useDispatch, useSelector } from 'react-redux'
import { addPreset, updatePreset } from '@/apiCalls/setupApis'
import useFetch from '../hooks/useFetch'
import { resetState } from '@/store/slices/customBookingSlice'
import { setLoading } from '@/store/slices/presetSlice'

const Setup = ({fetchPresets}) => {
    const currentPage = window.location.pathname
    console.log(currentPage)


    const dispatch = useDispatch()
    const { loading } = useSelector(state=>state.preset)
    const {selectedProducts,id, openingTime, closingTime, gap, maintenanceTime, duration, name} = useSelector(state=>state.preset)
    const fetch = useFetch();
    const {shop} = useSelector(state=>state.shop)
  const [success, setSuccess] = useState(null)
    const handleAddPreset = async ()=>{
      const productIds = selectedProducts && selectedProducts
      .map(product=>product.node.id.split('Product/')[1])
      const payload = {
        shop:shop.myshopifyDomain,
        name:name,
        productIds,
        timing:{openingTime,closingTime},
        gap,
        maintenanceTime,
        duration,
      }
      dispatch(setLoading(true))
      addPreset(fetch, payload)
      .then((res)=>console.log(res))
      .catch((err)=>setError(err))
      .finally(()=>dispatch(setLoading(false)))
    }
    const handleUpdatePreset = async ()=>{
      const productIds = selectedProducts && selectedProducts
      .map(product=>product.node.id.split('Product/')[1])
      console.log(productIds)
      const payload = {
        shop:shop.myshopifyDomain,
        name:name,
        productIds,
        timing:{openingTime,closingTime},
        gap,
        maintenanceTime,
        duration,
        id
      }
      dispatch(setLoading(true))
      updatePreset(fetch,payload)
      .then((res)=>{
        setSuccess('Successfully updated')
        fetchPresets()
        setTimeout(()=>{
          dispatch(resetState())
        },1000)
      })
      .catch((err)=>setError(err))
      .finally(()=>dispatch(setLoading(false)))
    }

  return (
    <LegacyCard
             primaryFooterAction={{
              content:currentPage == '/presets' ? 'Update' :  'Add',
              onAction:currentPage == '/presets' ? handleUpdatePreset : handleAddPreset,
              loading,
             }}
             title="Setup"
              sectioned>
            <FormLayout >
                  <VerticalStack gap='5'>
                  <OpenCloseTime />
                        <Duration />
                        <Gap />
                        <MaintenanceTime />
                        {
                          success && 
                          <Toast content={success} duration={2000} onDismiss={()=>setSuccess(null)} />
                        }
                  </VerticalStack>
        </FormLayout>
            </LegacyCard>
  )
}

export default Setup
