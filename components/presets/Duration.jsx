import { addDuration, editDuration, removeDuration } from "@/store/slices/presetSlice";
import {
  Box,
  Button,
  Divider,
  HorizontalStack,
  Icon,
  Label,
  Select,
  TextField,
  Tooltip,
  VerticalStack,
} from "@shopify/polaris";
import { QuestionMarkMajor } from "@shopify/polaris-icons";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

const Duration = () => {
  const options = [
    { label: "minutes", value: "minutes" },
    { label: "hours", value: "hours" },
  ];

  const dispatch = useDispatch();

  const { duration } = useSelector((state) => state.preset);

  const handleAddDuration = () => {
    dispatch(addDuration());
  };

  const handleRemoveDuration = (index) => {
    dispatch(removeDuration(index));
  };
  return (
    <Box>
      <Box style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        <p>Duration</p>
        <Tooltip content="Allow users to book for different durations and provide pricing accordingly">
          <Icon source={QuestionMarkMajor}  color="base" />
        </Tooltip>
      </Box>
      <Box
        style={{
          border: "1px solid #dcdcdc",
          borderRadius: "5px",
          padding: "15px",
        }}
      > 
        <VerticalStack gap="5">
          {duration?.map((d, index) => (
            <Fragment key={index}>
              <HorizontalStack gap="5">
                <TextField
                  label="Hours"
                  onChange={(value) =>{
                    if(value < 1) return;
                  dispatch(editDuration({ value, index, target:'hours' }))
                        }
                  }
                  type="number"
                  value={d.hours}
                />
                <TextField
                  label={
                    <HorizontalStack gap="1">
                  <Label >Price</Label>
                  <Tooltip content="Increase the price by a percentage. For instance, if the price is $100 and the desired increase is 5%, the new price would be $105.">
          <Icon source={QuestionMarkMajor}  color="base" />
        </Tooltip> 
                    </HorizontalStack>
                }
                  helpText="0% for actual price"
                  suffix="%"
                  onChange={(value) =>{
                    if(value < 0) return;
                    dispatch(editDuration({ value, index, target:'price' }))
                        }
                  }
                  type="number"
                  value={d.price}
                />
                <Button
                  onClick={() => handleRemoveDuration(index)}
                  plain
                  destructive
                >
                  Remove
                </Button>
                <Button onClick={handleAddDuration} plain size="micro">
                  Add
                </Button>
              </HorizontalStack>
              <Divider />
            </Fragment>
          ))}
        </VerticalStack>
      </Box>
    </Box>
  );
};

export default Duration;
