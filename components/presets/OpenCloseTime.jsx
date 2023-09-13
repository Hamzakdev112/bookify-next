import { setClosingTime, setOpeningTime } from "@/store/slices/presetSlice";
import { Box, Label, Select } from "@shopify/polaris";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const OpenCloseTime = () => {
  const { openingTime, closingTime } = useSelector((state) => state.preset);

  const options = [
    { label: "00:00", value: "00:00" },
    { label: "01:00", value: "01:00" },
    { label: "02:00", value: "02:00" },
    { label: "03:00", value: "03:00" },
    { label: "04:00", value: "04:00" },
    { label: "05:00", value: "05:00" },
    { label: "06:00", value: "06:00" },
    { label: "07:00", value: "07:00" },
    { label: "08:00", value: "08:00" },
    { label: "09:00", value: "09:00" },
    { label: "10:00", value: "10:00" },
    { label: "11:00", value: "11:00" },
    { label: "12:00", value: "12:00" },
  ];
  const dispatch = useDispatch();

  return (
    <Box style={{ display: "flex", gap: "20px" }}>
      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Label>Opening Time</Label>
        <Box style={{ display: "flex", gap: "10px" }}>
          <Select
            onChange={(value) => {
              dispatch(
                setOpeningTime({ time: value, format: openingTime.format })
              );
            }}
            value={openingTime.time}
            options={options}
          />
          <Select
            onChange={(value) =>
              dispatch(
                setOpeningTime({ time: openingTime.time, format: value })
              )
            }
            value={openingTime.format}
            options={[
              { label: "AM", value: "AM" },
              { label: "PM", value: "PM" },
            ]}
          />
        </Box>
      </Box>
      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Label>Closing Time</Label>
        <Box style={{ display: "flex", gap: "10px" }}>
          <Select
            onChange={(value) => {
              dispatch(
                setClosingTime({ time: value, format: closingTime.format })
              );
            }}
            value={closingTime.time}
            options={options}
          />
          <Select
            onChange={(value) =>
              dispatch(
                setClosingTime({ time: closingTime.time, format: value })
              )
            }
            value={closingTime.format}
            options={[
              { label: "AM", value: "AM" },
              { label: "PM", value: "PM" },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default OpenCloseTime;
