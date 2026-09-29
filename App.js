import { useEffect, useState } from "react";

import {
  View,
  Text
} from "react-native";

import {
  SQLiteProvider,
  useSQLiteContext
} from "expo-sqlite";

import {
  DATABASE_NAME,
  initDb
} from "./src/db/restaurantDb";

import { STables } from "./src/db/seed/STables";
import { SCategories } from "./src/db/seed/SCategories";
import { SMenus } from "./src/db/seed/SMenus";
import { SMenuPrices } from "./src/db/seed/SMenuPrices";
import { SBills } from "./src/db/seed/SBills";
import { SOrderRounds } from "./src/db/seed/SOrderRounds";
import { SOrderItems } from "./src/db/seed/SOrderItems";
import { SPayments } from "./src/db/seed/SPayments";
import { STableTransfers } from "./src/db/seed/STableTransfers";


function AppContent() {

  const db = useSQLiteContext();

  const [message, setMessage] =
    useState("กำลังเริ่มต้น...");

  useEffect(() => {

    async function seedAll() {

      try {

        await db.withTransactionAsync(
          async () => {

            // D1
            await STables(db);

            // D2
            await SCategories(db);

            // D3
            await SMenus(db);

            // D4
            await SMenuPrices(db);

            // D5
            await SBills(db);

            // D6
            await SOrderRounds(db);

            // D7
            await SOrderItems(db);

            // D8
            await SPayments(db);

            // D9
            await STableTransfers(db);

          }
        );

        setMessage(
          "Seed D1-D9 สำเร็จ"
        );

      } catch (error) {

        console.error(
          "Seed failed:",
          error
        );

        setMessage(
          "Seed ไม่สำเร็จ"
        );
      }
    }

    seedAll();

  }, []);


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Text style={{ textAlign: 'center' }}>
    {message}
  </Text>
</View>
  );
}


export default function App() {

  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      onInit={initDb}
    >
      <AppContent />
    </SQLiteProvider>
  );
}