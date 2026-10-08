import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useScreenNavigation } from "../../context/NavigationContext";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import { SectionCard, InfoRow } from "../../components/common/CommonCp";
import { useRestaurantQuery } from "../../hooks/useRestaurantQuery";
import { appStyles } from "../../styles/appStyles";
import { screenStyles } from "../../styles/screenStyles";
import {
  baht,
  tableNumber,
  today,
  reportRange,
  displayTime,
} from "../../utils/format";
import { SummaryCard, BillRow } from "../../components/admin/AdminCp";
import { reportForScreen } from "../../db/screenDb";

export default function DailyReportScreen() {
  const navigation = useScreenNavigation();
  const db = useSQLiteContext();
  const [day, setDay] = useState(today());
  const [endDay, setEndDay] = useState(today());
  const query = useRestaurantQuery(
    () => reportForScreen(db, ...reportRange(day, endDay)),
    day + ":" + endDay,
    true,
  );
  const report = query.data;

  return (
    <ScreenContent
      title="รายงานยอดขาย"
      rightText="ผู้ดูแล"
    >
      <TextInput
        style={appStyles.input}
        value={day}
        onChangeText={setDay}
        placeholder="วันเริ่มต้น YYYY-MM-DD"
      />
      <TextInput
        style={appStyles.input}
        value={endDay}
        onChangeText={setEndDay}
        placeholder="วันสิ้นสุด YYYY-MM-DD"
      />
      <QueryState query={query}>
        {report && (
          <>
            <View style={screenStyles.wrap}>
              {[
                ["ยอดขาย", baht(report.total)],
                ["บิลปิดแล้ว", report.bills.length],
                ["เงินสด", baht(report.cash)],
                ["QR / โอน", baht(report.qr)],
              ].map(([title, value]) => (
                <View
                  key={title}
                  style={screenStyles.summary}
                >
                  <SummaryCard
                    title={title}
                    value={value}
                  />
                </View>
              ))}
            </View>
            <SectionCard>
              <Text style={appStyles.sectionTitle}>ยอดขายตามหมวดหมู่</Text>
              {report.categories.map((item) => (
                <InfoRow
                  key={item.category_id}
                  label={item.category_name + " × " + item.quantity}
                  value={baht(item.total)}
                />
              ))}
              {!report.categories.length && <EmptyState />}
            </SectionCard>
            <SectionCard>
              <Text style={appStyles.sectionTitle}>10 เมนูขายดี</Text>
              {report.topMenus.map((item, index) => (
                <InfoRow
                  key={item.menu_id}
                  label={
                    index + 1 + ". " + item.menu_name + " × " + item.quantity
                  }
                  value={baht(item.total)}
                />
              ))}
              {!report.topMenus.length && <EmptyState />}
            </SectionCard>
            {report.bills.map((bill) => (
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
          </>
        )}
      </QueryState>
    </ScreenContent>
  );
}
