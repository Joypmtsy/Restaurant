import { useEffect  } from "react";
import { Text,View } from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

import { initDb } from "./src/db/database";

function DatabaseTest() {
  const db = useSQLiteContext();
  
  useEffect(() => {
    async function setupDatabase() {
      const result = await initDb(db);

    console.log(result);
    }

    setupDatabase();
  }, [db]
);
return (
  <View 
  style={{flex: 1, 
  justifyContent: "center", 
  alignItems: "center"}}>
    <Text style={{ fontSize: 24 }}>Database Test</Text>
  </View>
)
}

export default function App() {
  return (
    <SQLiteProvider databaseName="restaurant.db">
      <DatabaseTest />
    </SQLiteProvider>
  );
}