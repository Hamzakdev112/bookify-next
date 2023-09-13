import {  useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import {
  Button,
  Card,
  HorizontalGrid,
  HorizontalStack,
  Layout,
  LegacyCard,
  Page,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { useSelector } from "react-redux";
import useFetch from "@/components/hooks/useFetch";
import { useRouter } from "next/router";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: 0,
    features: ["Multiple Zones","Multiple themes", "3 Presets", "Free 30 Bookings", ],
  },
  {
    name: "Basic",
    price: 10.0,
    features: ["Multiple Zones","Multiple themes", "10 Presets", "100 Bookings / month", ],
  },
  {
    name: "Business",
    price: 30.0,
    features: ["Multiple Zones","Multiple themes", "50 Presets", "500 Bookings / per month", ],
  },
];


const PlanCard = ({ name, features, selected, price, activeSubscription }) => {
  const [loading, setLoading] = useState(false);
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const fetch = useFetch();
  async function subscribeToPlan(plan) {
    setLoading(true)
    const res = await fetch(`/api/subscription/subscribe`, {
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({plan})
    }); 
    const data = await res.json();
    if (data.error) {
    } else if (data.confirmationUrl) {
      const { confirmationUrl } = data;
      redirect.dispatch(Redirect.Action.REMOTE, confirmationUrl);
    }
    setLoading(false)
  }
  
  async function cancelSubscription(id) {
    setLoading(true)
    const res = await fetch(`/subscription/cancel?id=${id}`)
    const data = await res.json();
    if (data.error) {
    } else if (data.returnUrl) {
      const { returnUrl } = data;
      redirect.dispatch(Redirect.Action.REMOTE, returnUrl);
    }
    setLoading(false)
  }

  return (
    <Card
      minHeight="300px"
      padding={4}
      as="div"
      background="bg-interactive-subdued"
    >
      <VerticalStack gap={10}>
        <HorizontalStack align="space-between">
          <Text alignment="center" variant="headingLg">
            {name}
          </Text>
          <Text alignment="center" variant="headingLg">
            ${price}
          </Text>
        </HorizontalStack>
        <VerticalStack gap={2}>
          {features?.map((feature) => (
            <Text key={feature} variant="bodyMd">{feature}</Text>
          ))}
        </VerticalStack>
        <Button
          loading={loading}
          onClick={() => {
            if(selected) return;
            if (name == "Free") {
              cancelSubscription(activeSubscription?.id);
            } else {
              subscribeToPlan(name);
            }
          }}
          primary={selected}
        >
          {selected ? "Active" : "Select"}
        </Button>
      </VerticalStack>
    </Card>
  );
};

const Plans = () => {
  const app = useAppBridge();
  const {currentPlan: activeSubscription} = useSelector(state=>state.shop)
  const router = useRouter()
  const redirect = Redirect.create(app);

  return (
    <Page
      title="Plans"
      backAction={{ content: "Home", onAction: () => router.push("/") }}
    >
        <Layout>
        <Layout.Section>
          <LegacyCard title="Available plans" sectioned>
            <HorizontalGrid columns={3} gap={4}>
              {plans?.map(({ name, features, price }) => (
                <PlanCard
                  key={name}
                  activeSubscription={activeSubscription}
                  name={name}
                  selected={
                    name === activeSubscription?.name &&
                    activeSubscription?.status == "ACTIVE"
                  }
                  price={price}
                  features={features}
                />
              ))}
            </HorizontalGrid>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Plans;
