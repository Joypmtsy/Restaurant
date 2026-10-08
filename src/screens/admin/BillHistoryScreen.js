import React, { useState } from "react";
import { TextInput } from "react-native";
import { useScreenNavigation } from "../../context/NavigationContext";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import { useRestaurantQuery } from "../../hooks/useRestaurantQuery";
import { appStyles } from "../../styles/appStyles";
import { tableNumber, today, dateRange, displayTime } from "../../utils/format";
import { BillRow } from "../../components/admin/AdminCp";
import { reportForScreen } from "../../db/screenDb";

export default function BillHistoryScreen() {
  const navigation = useScreenNavigation();
  const db = useSQLiteContext();
  const [day, setDay] = useState(today());
  const query = useRestaurantQuery(
    () => reportForScreen(db, ...dateRange(day)),
    day,
  );
  const bills = query.data?.bills || [];

  return (
    <ScreenContent
      title="ประวัติบิล"
      rightText="ผู้ดูแล"
    >
      <TextInput
        style={appStyles.input}
        value={day}
        onChangeText={setDay}
        placeholder="วันที่ YYYY-MM-DD"
        autoCapitalize="none"
      />
      <QueryState query={query}>
        {bills.map((bill) => (
          <BillRow
            key={bill.bill_id}
            billId={bill.bill_id}
            tableNumber={tableNumber(bill.table_number)}
            openedAt={displayTime(bill.opened_at)}
            closedAt={displayTime(bill.closed_at)}
            total={bill.total}
            onPress={() =>
              navigation.open({
                screen: "ABillScreen",
                params: {
                  billId: bill.bill_id,
                },
              })
            }
          />
        ))}
        {!bills.length && <EmptyState title="ไม่มีบิลที่ปิดในวันที่เลือก" />}
      </QueryState>
    </ScreenContent>
  );
}
