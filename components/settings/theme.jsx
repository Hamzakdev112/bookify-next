import {
    Box,
    DatePicker,
    Icon,
    LegacyCard,
    Select,
    Text,
    TextField,
    Tooltip,
    VerticalStack,
  } from "@shopify/polaris";
  import React, { useCallback, useEffect, useRef, useState } from "react";
  import { QuestionMarkMajor } from "@shopify/polaris-icons";
  import { useDispatch, useSelector } from "react-redux";
import { updateSetting } from "@/store/slices/shopSlice";
  
  const Theme = () => {
    const dispatch = useDispatch()
    const {settings} = useSelector((state)=>state.shop)
    const handleSelectedThemeChange = useCallback(
      (value) =>
        dispatch(updateSetting({ key: "theme", value })),
      [dispatch]
    );
  
    const handleAddToCartBtnChange = useCallback(
      (value) =>
        dispatch(updateSetting({ key: "elementSelectors.addToCart", value })),
      [dispatch]
    );
    const handleCheckoutBtnChange = useCallback(
      (value) =>
        dispatch(updateSetting({ key: "elementSelectors.checkout", value })),
      [dispatch]
    );
    const handleDatePickerLabelChange = useCallback(
      (value) =>
        dispatch(updateSetting({ key: "datePickerLabel", value })),
      [dispatch]
    );
    const handleThemePlaceHolderChange = useCallback(
      (value) =>
        dispatch(updateSetting({ key: "themePlaceholder", value })),
      [dispatch]
    );
    const handleThemeDurationLabelChange = useCallback(
      (value) =>
        dispatch(updateSetting({ key: "themeDurationLabel", value })),
      [dispatch]
    );
    const handleThemeTimeLabelChange = useCallback(
      (value) =>
        dispatch(updateSetting({ key: "themeTimeLabel", value })),
      [dispatch]
    );
  
    const themeOptions = [
      { label: "Material Light", value: "light" },
      { label: "Material Dark", value: "dark" },
      { label: "Material Blue", value: "material_blue" },
      { label: "Material Green", value: "material_green" },
      { label: "Material Red", value: "material_red" },
      { label: "Material Orange", value: "material_orange" },
      { label: "Material Confetti", value: "material_confetti" },
    ];
  
    return (
      <LegacyCard title="Theme" sectioned>
        <link
          rel="stylesheet"
          type="text/css"
          href={`https://npmcdn.com/flatpickr/dist/themes/${settings?.theme}.css`}
        />
        <VerticalStack gap={3} as="div">
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Text as="h4" variant="headingSm">
              Element Selectors
            </Text>
            <Tooltip
              width="wide"
              content={`If the default selectors do not function as expected, you have the flexibility to specify custom CSS selectors. For instance, the 'Add To Cart' button selector could be 'button[name="add"]' or '.add-to-cart-btn' depending on the structure of your theme`}
            >
              <Icon source={QuestionMarkMajor} color="base" />
            </Tooltip>
          </Box>
          <Text as="p" variant="bodySm">
              Add to cart
            </Text>
          <TextField onChange={handleAddToCartBtnChange} value={settings?.elementSelectors?.addToCart} placeholder="Add To Cart" />
          <Text as="p" variant="bodySm">
              Checkout
            </Text>
          <TextField onChange={handleCheckoutBtnChange} value={settings?.elementSelectors?.checkout} placeholder="Checkout" />
          <Text as="h4" variant="headingSm">
            Date Picker
          </Text>
          <Text as="p" variant="bodySm">
              Theme
            </Text>
          <Select value={settings?.theme} onChange={handleSelectedThemeChange} options={themeOptions} />
          <Text as="p" variant="bodySm">
              Label
            </Text>
          <TextField onChange={handleDatePickerLabelChange}  value={settings?.datePickerLabel} />
          <Text as="p" variant="bodySm">
              Placeholder
            </Text>
          <TextField onChange={handleThemePlaceHolderChange}  value={settings?.themePlaceholder} />
  
  
          <Text as="h4" variant="headingSm">
            Duration
          </Text>
          <Text as="p" variant="bodySm">
              Label
            </Text>
          <TextField onChange={handleThemeDurationLabelChange}  value={settings?.themeDurationLabel} />
          <Text as="h4" variant="headingSm">
            Time
          </Text>
          <Text as="p" variant="bodySm">
              Label
            </Text>
          <TextField onChange={handleThemeTimeLabelChange}  value={settings?.themeTimeLabel} />
        </VerticalStack>
      </LegacyCard>
    );
  };
  
  export default Theme;
  