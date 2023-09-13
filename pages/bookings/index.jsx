import { fetchAllOrders } from "@/apiCalls/ordersApis";
import BookingsTable from "@/components/bookings/BookingsTable";
import useFetch from "@/components/hooks/useFetch";
import { plans } from "@/utils/plans";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Frame, Layout, Loading, Page } from "@shopify/polaris";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const Bookings = () => {
  const fetch = useFetch()
  const app = useAppBridge();
  const dispatch = useDispatch()
  const router = useRouter()
  const { orders, isFetching: loading } = useSelector((state) => state.orders)
  useEffect(() => {
    fetchAllOrders(fetch, dispatch)
  }, [])
  const { currentPlan } = useSelector(state => state.shop)
  return (
    <Frame>
      {
        loading &&
        <Loading />
      }
      <Page
        title="Bookings"
        subtitle={`Max (${orders ? orders.length : 'loading'}/${plans[currentPlan?.name]?.bookingsLimit})`}
        backAction={{ content: "Home", onAction: () => router.push("/") }}
      >
        <Layout  >
          <Layout.Section>
            {
              orders &&
              <BookingsTable orders={orders} />
            }
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
};

export default Bookings;
