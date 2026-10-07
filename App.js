import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SQLiteProvider } from "expo-sqlite";

import { DATABASE_NAME, initDb } from "./src/db/restaurantDb";
import { seedData } from "./src/db/seed/seedData";

async function initializeDatabase(db) {
  const initResult = await initDb(db);

  if (!initResult.ok) {
    throw new Error(initResult.message);
  }

  const seedResult = await seedData(db);

  if (!seedResult.ok) {
    throw new Error(seedResult.message);
  }
}

function DatabaseReady() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Order System</Text>
      <Text style={styles.subtitle}>Database พร้อมใช้งาน</Text>
    </View>
  );
}


export default function App() {
  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      onInit={initializeDatabase}
    >
      <DatabaseReady />
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F1F5F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
  },
});
