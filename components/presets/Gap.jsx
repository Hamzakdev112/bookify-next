import { setGap } from "@/store/slices/presetSlice";
import { Box, Icon, Select, TextField, Tooltip } from "@shopify/polaris";
import { QuestionMarkMajor } from "@shopify/polaris-icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Gap = () => {
  const options = [
    { label: "minutes", value: "minutes" },
    { label: "hours", value: "hours" },
  ];

  const dispatch = useDispatch();

  const { gap } = useSelector((state) => state.preset);

  return (
    <Box>
      <TextField
        value={gap.value}
        onChange={(value) =>{
          if(value < 0){
            dispatch(setGap({ value:0, format: gap.format }))
            return;
          }
          dispatch(setGap({ value:value, format: gap.format }))
        }
      }
        connectedRight={
        <Select
        value={gap.format}
         options={options}
         onChange={(value)=>dispatch(setGap({value:gap.format, format:value}))}
          />
      }
        label={
          <Box style={{ display: "flex", gap: "5px" }}>
            <p>Gap</p>
            <Tooltip content="This will determine the gap between each slot">
              <Icon source={QuestionMarkMajor} color="base" />
            </Tooltip>
          </Box>
        }
        type="number"
      />
    </Box>
  );
};

export default Gap;
