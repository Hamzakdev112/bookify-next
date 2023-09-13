import { setMaintenanceTime } from "@/store/slices/presetSlice";
import { Box, Icon, Select, TextField, Tooltip } from "@shopify/polaris";
import { QuestionMarkMajor } from "@shopify/polaris-icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const MaintenanceTime = () => {
  const options = [
    { label: "minutes", value: "minutes" },
    { label: "hours", value: "hours" },
  ];

  const dispatch = useDispatch();

  const { maintenanceTime } = useSelector((state) => state.preset);

  return (
    <Box>
      <TextField
        value={maintenanceTime.value}
        onChange={(value) => {
          if(value < 0) {
            dispatch(setMaintenanceTime({ value:0, format: maintenanceTime.format }))
            return;
          }
          dispatch(setMaintenanceTime({ value:value, format: maintenanceTime.format }))
        }
        }
        connectedRight={
        <Select
        value={maintenanceTime.format}
         options={options}
         onChange={(value)=>dispatch(setMaintenanceTime({value:maintenanceTime.format, format:value}))}
          />
      }
        label={
          <Box style={{ display: "flex", gap: "5px" }}>
            <p>Maintenance Time</p>
            <Tooltip content="Extend the duration of each booking by incorporating maintenance time. This will have no impact on the customer's scheduled timings.">
              <Icon source={QuestionMarkMajor} color="base" />
            </Tooltip>
          </Box>
        }
        type="number"
      />
    </Box>
  );
};

export default MaintenanceTime;
