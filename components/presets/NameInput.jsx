import { setName } from '@/store/slices/presetSlice'
import { LegacyCard, TextField } from '@shopify/polaris'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const NameInput = ({value}) => {
    const dispatch = useDispatch()
  const handleChange = useCallback((newValue) => dispatch(setName(newValue)), []);
  return (
    <LegacyCard title="Name" sectioned>
        <TextField value={value} onChange={handleChange} placeholder='Rooms Schedule' />
    </LegacyCard>
  )
}

export default NameInput