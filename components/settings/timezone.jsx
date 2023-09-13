import {
    Button,
    HorizontalStack,
    Icon,
    LegacyCard,
    Select,
    Text,
    VerticalStack,
  } from "@shopify/polaris";
  import React, { useCallback, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import timeZones from "@/utils/timeZones.json";
import { updateSetting } from "@/store/slices/shopSlice";
  
  const TimeZone = () => {
    const { settings } = useSelector((state) => state.shop);
    const [selectedTimeZone, setSelectedTimeZone] = useState(
      settings?.timeZone?.offset
    );
    console.log(settings);
    const dispatch = useDispatch();
    const handleTimeZoneChange = useCallback(
      (value) =>
        dispatch(updateSetting({ key: "timeZone.offset", value })),
      [dispatch]
    );
  
    const handleTimeFormatChange = useCallback(
      (value) =>
        dispatch(updateSetting({ key: "timeZone.format", value })),
      [dispatch]
    );
  
    return (
      <LegacyCard sectioned title="Time">
        <VerticalStack as="div" gap={5}>
          <Select
            options={timeZones}
            value={settings?.timeZone?.offset}
            onChange={handleTimeZoneChange}
          />
          <Text as="h4" variant="headingMd">
            Format
          </Text>
          <HorizontalStack gap={1}>
            <Button
              onClick={() => handleTimeFormatChange("12")}
              primary={settings?.timeZone?.format == "12"}
            >
              12
            </Button>
            <Button
              onClick={() => handleTimeFormatChange("24")}
              primary={settings?.timeZone?.format == "24"}
            >
              24
            </Button>
          </HorizontalStack>
        </VerticalStack>
      </LegacyCard>
    );
  };
  
  export default TimeZone;
  