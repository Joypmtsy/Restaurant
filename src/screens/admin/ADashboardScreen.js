import React from "react";
import { Text, View } from "react-native";
import { useScreenNavigation } from "../../context/NavigationContext";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import { SectionCard } from "../../components/common/CommonCp";
import { useRestaurantQuery } from "../../hooks/useRestaurantQuery";
import { appStyles } from "../../styles/appStyles";
import { screenStyles } from "../../styles/screenStyles";
import {
  baht,
  tableNumber,
  today,
  dateRange,
  displayTime,
} from "../../utils/format";
import {
  SummaryCard,
  TableCard,
  RecentOrderRow,
  QuickActionButton,
} from "../../components/admin/AdminCp";
import { dashboardForScreen } from "../../db/screenDb";

export default function ADashboardScreen() {
  const navigation = useScreenNavigation();
  const db = useSQLiteContext();
  const query = useRestaurantQuery(
    () => dashboardForScreen(db, ...dateRange(today())),
    "dashboard",
    true,
  );
  const data = query.data;

  return (
    <ScreenContent
      title="แดชบอร์ด"
      rightText="ผู้ดูแล"
    >
      <QueryState query={query}>
        {data && (
          <>
            <View style={screenStyles.wrap}>
              {[
                ["ยอดขายวันนี้", baht(data.report.total)],
                ["บิลเปิด", data.tables.filter((table) => table.billId).length],
                [
                  "โต๊ะว่าง",
                  data.tables.filter((table) => !table.billId).length,
                ],
                [
                  "รอทำอาหาร",
                  data.queue.filter((item) => item.status === "waiting").length,
                ],
                [
                  "กำลังทำ",
                  data.queue.filter((item) => item.status === "cooking").length,
                ],
                ["เมนูปิดขาย", data.unavailable],
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
            <Text style={appStyles.sectionTitle}>สถานะโต๊ะ</Text>
            <View style={screenStyles.wrap}>
              {data.tables.map((table) => (
                <View
                  key={table.id}
                  style={screenStyles.table}
                >
                  <TableCard
                    tableNumber={table.number}
                    status={table.status}
                    onPress={() =>
                      navigation.open(
                        table.billId
                          ? {
                              screen: "ABillScreen",
                              params: {
                                billId: table.billId,
                              },
                            }
                          : "ATableScreen",
                      )
                    }
                  />
                </View>
              ))}
            </View>
            <SectionCard>
              <Text style={appStyles.sectionTitle}>ออเดอร์ล่าสุด</Text>
              {data.recent.map((item) => (
                <RecentOrderRow
                  key={item.order_item_id}
                  orderId={item.order_item_id}
                  tableNumber={tableNumber(item.table_number)}
                  menuName={item.menu_name}
                  quantity={item.quantity}
                  status={item.status}
                  time={displayTime(item.created_at)}
                />
              ))}
              {!data.recent.length && <EmptyState title="ยังไม่มีออเดอร์" />}
            </SectionCard>
          </>
        )}
      </QueryState>
      {[
        ["ATableScreen", "จัดการโต๊ะ"],
        ["AMenuScreen", "จัดการเมนู"],
        ["DailyReportScreen", "รายงานยอดขาย"],
        ["BillHistoryScreen", "ประวัติบิล"],
        ["ResetTransactionsScreen", "ล้างข้อมูลรายการขาย"],
      ].map(([path, title]) => (
        <QuickActionButton
          key={path}
          title={title}
          onPress={() => navigation.open(path)}
        />
      ))}
    </ScreenContent>
  );
}
