import React from "react";
import { useScreenNavigation } from "../../context/NavigationContext";
import { View } from "react-native";
import { PrimaryButton } from "../common/CommonCp";
import { screenStyles } from "../../styles/screenStyles";

export function CustomerNavigation({ billId }) {
  const navigation = useScreenNavigation();
  return (
    <View style={screenStyles.wrap}>
      {[
        {
          title: "เมนู",
          open: () =>
            navigation.open({ screen: "CMenuScreen", params: { billId } }),
        },
        {
          title: "ตะกร้า",
          open: () =>
            navigation.open({ screen: "CartScreen", params: { billId } }),
        },
        {
          title: "สถานะ",
          open: () =>
            navigation.open({
              screen: "COrderScreen",
              params: { billId },
            }),
        },
        {
          title: "บิล",
          open: () =>
            navigation.open({ screen: "CBillScreen", params: { billId } }),
        },
      ].map(({ title, open }) => (
        <PrimaryButton
          key={title}
          title={title}
          onPress={open}
        />
      ))}
    </View>
  );
}
