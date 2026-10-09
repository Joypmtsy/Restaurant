import React, { useState } from "react";
import { Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

import { useScreenNavigation } from "../../context/NavigationContext";
import { ScreenContent, FilterBar, EmptyState, QueryState } from "../../components/common/ScreenContent";
import { PrimaryButton } from "../../components/common/CommonCp";
import { useRestaurantQuery } from "../../hooks/useRestaurantQuery";
import { screenStyles } from "../../styles/screenStyles";
import { tableNumber } from "../../utils/format";
import { MenuCard } from "../../components/customer/CustomerCp";
import { CustomerNavigation } from "../../components/customer/CustomerNavigation";
import { menusForScreen, billForScreen } from "../../db/screenDb";
import { useCart } from "../../context/CartContext";

export default function CMenuScreen() {
  const navigation = useScreenNavigation();
  const { billId } = navigation.params;
  const db = useSQLiteContext();
  const cart = useCart(String(billId));
  const [category, setCategory] = useState("all");
  const query = useRestaurantQuery(
    async () => {
      const [menuData, bill] = await Promise.all([
        menusForScreen(db, true),
        billForScreen(db, billId)
      ]);
      return {
        ...menuData,
        bill
      };
    },
    String(billId),
    true
  );
  const data = query.data;
  const filtered =
    data?.menus.filter(
      (menu) => category === "all" || menu.categoryId === category
    ) || [];

  return (
    <ScreenContent
      title="เมนูอาหาร"
      rightText={data ? "โต๊ะ " + tableNumber(data.bill.tableNumber) : "ลูกค้า"}
    >
      <CustomerNavigation billId={billId} />
      <QueryState query={query}>
        {data?.bill.status !== "open" && (
          <Text style={screenStyles.note}>
            บิลนี้ปิดแล้ว เลือกโต๊ะเพื่อเริ่มบิลใหม่
          </Text>
        )}
        <FilterBar
          options={[
            {
              key: "all",
              label: "ทั้งหมด"
            },
            ...(data?.categories || []).map((item) => ({
              key: item.id,
              label: item.name
            }))
          ]}
          value={category}
          onChange={setCategory}
        />
        <View style={screenStyles.wrap}>
          {filtered.map((menu) => (
            <View
              key={menu.id}
              style={screenStyles.menu}
            >
              <MenuCard
                menu={menu}
                disabled={data?.bill.status !== "open"}
                onAdd={cart.add}
              />
            </View>
          ))}
        </View>
        {!filtered.length && (
          <EmptyState title="ไม่มีเมนูที่เปิดขายในหมวดนี้" />
        )}
        <PrimaryButton
          title={
            "ตะกร้า (" +
            cart.items.reduce((sum, item) => sum + item.qty, 0) +
            " รายการ)"
          }
          onPress={() =>
            navigation.open({
              screen: "CartScreen",
              params: {
                billId
              }
            })
          }
        />
      </QueryState>
    </ScreenContent>
  );
}