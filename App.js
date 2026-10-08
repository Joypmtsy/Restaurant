import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { CartProvider } from "./src/context/CartContext";
import { NavigationContext } from "./src/context/NavigationContext";
import { initializeRestaurant } from "./src/db/screenDb";
import { DATABASE_NAME } from "./src/db/restaurantDb";
import { ScreenContent } from "./src/components/common/ScreenContent";
import { PrimaryButton } from "./src/components/common/CommonCp";
import { QuickActionButton } from "./src/components/admin/AdminCp";
import { appStyles } from "./src/styles/appStyles";
import { screenStyles } from "./src/styles/screenStyles";
import CTableScreen from "./src/screens/customer/CTableScreen";
import CMenuScreen from "./src/screens/customer/CMenuScreen";
import CartScreen from "./src/screens/customer/CartScreen";
import COrderScreen from "./src/screens/customer/COrderScreen";
import CBillScreen from "./src/screens/customer/CBillScreen";
import KQueueScreen from "./src/screens/kitchen/KQueueScreen";
import KDetailScreen from "./src/screens/kitchen/KDetailScreen";
import ADashboardScreen from "./src/screens/admin/ADashboardScreen";
import ATableScreen from "./src/screens/admin/ATableScreen";
import AMenuScreen from "./src/screens/admin/AMenuScreen";
import ABillScreen from "./src/screens/admin/ABillScreen";
import BillHistoryScreen from "./src/screens/admin/BillHistoryScreen";
import DailyReportScreen from "./src/screens/admin/DailyReportScreen";
import ResetTransactionsScreen from "./src/screens/admin/ResetTransactionsScreen";

const screens = {
  CTableScreen,
  CMenuScreen,
  CartScreen,
  COrderScreen,
  CBillScreen,
  KQueueScreen,
  KDetailScreen,
  ADashboardScreen,
  ATableScreen,
  AMenuScreen,
  ABillScreen,
  BillHistoryScreen,
  DailyReportScreen,
  ResetTransactionsScreen,
};

const home = {
  screen: "Home",
  params: {},
};

function getScreen(target) {
  const next = typeof target === "string" ? { screen: target } : target;

  if (!screens[next.screen]) {
    throw new Error("ไม่พบหน้าจอ " + next.screen);
  }

  return {
    screen: next.screen,
    params: next.params || {},
  };
}

function RestaurantScreens() {
  const [history, setHistory] = useState([home]);
  const current = history[history.length - 1];
  const Screen = screens[current.screen];

  const open = (target) => {
    const next = getScreen(target);

    setHistory((previous) => {
      const last = previous[previous.length - 1];

      if (
        last.screen === next.screen &&
        JSON.stringify(last.params) === JSON.stringify(next.params)
      ) {
        return previous;
      }

      return [...previous, next];
    });
  };

  const replace = (target) => {
    const next = getScreen(target);

    setHistory((previous) => [...previous.slice(0, -1), next]);
  };

  const back = useCallback(() => {
    setHistory((previous) =>
      previous.length > 1 ? previous.slice(0, -1) : previous,
    );
  }, []);

  const goHome = () => {
    setHistory([home]);
  };

  useEffect(() => {
    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      if (history.length === 1) {
        return false;
      }

      back();
      return true;
    });

    return () => listener.remove();
  }, [history.length, back]);

  return (
    <NavigationContext.Provider
      value={{ open, replace, back, goHome, params: current.params }}
    >
      <SafeAreaView
        style={appStyles.container}
        edges={["top", "left", "right"]}
      >
        {current.screen !== "Home" && (
          <View style={[screenStyles.wrap, screenStyles.navigation]}>
            <PrimaryButton
              title="ย้อนกลับ"
              onPress={back}
            />
            <PrimaryButton
              title="หน้าแรก"
              onPress={goHome}
            />
          </View>
        )}
        {Screen ? (
          <Screen key={current.screen + JSON.stringify(current.params)} />
        ) : (
          <ScreenContent
            title="HONEY RESTAURANT"
            subtitle="ระบบสั่งอาหารและจัดการร้าน"
          >
            <Text style={appStyles.sectionTitle}>
              เลือกส่วนที่ต้องการใช้งาน
            </Text>
            <QuickActionButton
              title="ลูกค้า"
              subtitle="เลือกโต๊ะ สั่งอาหาร ดูสถานะและบิล"
              onPress={() => open("CTableScreen")}
            />
            <QuickActionButton
              title="ครัว"
              subtitle="คิวอาหารและเปลี่ยนสถานะการทำอาหาร"
              onPress={() => open("KQueueScreen")}
            />
            <QuickActionButton
              title="ผู้ดูแลร้าน"
              subtitle="โต๊ะ เมนู รับชำระเงิน และรายงาน"
              onPress={() => open("ADashboardScreen")}
            />
          </ScreenContent>
        )}
      </SafeAreaView>
    </NavigationContext.Provider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        onInit={initializeRestaurant}
      >
        <CartProvider>
          <RestaurantScreens />
        </CartProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
