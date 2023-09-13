import {
    Button,
      IndexTable,
      LegacyCard,
      useIndexResourceState,
    } from '@shopify/polaris';
    import React, { useState } from 'react';
import EditBooking from './EditBooking';
import { DateTime } from 'luxon';

    const BookingsTable = ({orders})=> {
      const [order, setOrder] = useState(null)
      const handleModalOpen = (order)=>{
        setOrder(order)
      }
      console.log(order)
      const resourceName = {
        singular: 'order',
        plural: 'orders',
      };
  
      const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(orders);
      const rowMarkup = Array.isArray(orders) && orders.map((o,index) => {
        const {productTitle,_id, orderNumber, bookingDate, startTime, endTime,isWaiverFormFilled} = o
        return(
          <IndexTable.Row
          id={_id}
            key={_id}
          >
            <IndexTable.Cell>{orderNumber}</IndexTable.Cell>
            <IndexTable.Cell>{productTitle}</IndexTable.Cell>
            <IndexTable.Cell>{bookingDate}</IndexTable.Cell>
            <IndexTable.Cell>{startTime} - {endTime}</IndexTable.Cell>
            <IndexTable.Cell>
             </IndexTable.Cell>
            <IndexTable.Cell>
              <Button size='slim' primary={order?.orderNumber == orderNumber} onClick={()=>handleModalOpen(o)}>Edit</Button>
              </IndexTable.Cell>
          </IndexTable.Row>
          )
      },
      );
  
      return (
        <LegacyCard>
          <IndexTable
            selectable={false}
            resourceName={resourceName}
            itemCount={orders.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              {title: 'Order'},
              {title: 'Product Title'},
              {title: 'Date'},
              {title: 'Time',},
              {title: 'Form Filled',},
              {title: 'Actions',},
            ]}
          >
            {rowMarkup}
          </IndexTable>
          {
            order != null &&
            <EditBooking setOrder={setOrder} order={order}  />
          }
        </LegacyCard>
      );
    }
  
    export default BookingsTable
  