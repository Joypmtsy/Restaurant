import React from "react";
import { Alert, Text } from "react-native";
import { useScreenNavigation } from "../../context/NavigationContext";
import { useSQLiteContext } from "expo-sqlite";
import { ScreenContent } from "../../components/common/ScreenContent";
import { SectionCard, PrimaryButton } from "../../components/common/CommonCp";
import { useRestaurantAction } from "../../hooks/useRestaurantQuery";
import { appStyles } from "../../styles/appStyles";
import { screenStyles } from "../../styles/screenStyles";
import { clearTransactions } from "../../db/screenDb";
import { useCart } from "../../context/CartContext";

export default function ResetTransactionsScreen() {
  const navigation = useScreenNavigation();
  const db = useSQLiteContext();
  const { run, busy } = useRestaurantAction();
  const cart = useCart("");
  const reset = () =>
    Alert.alert(
      "ยืนยันล้างรายการขายทั้งหมด",
      "ลบบิล ออเดอร์ การชำระเงิน และประวัติย้ายโต๊ะทั้งหมด ย้อนกลับไม่ได้",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ล้างข้อมูล",
          style: "destructive",
          onPress: () =>
            run(async () => {
              await clearTransactions(db);
              cart.clearAll();
              navigation.replace("ADashboardScreen");
            }),
        },
      ],
    );

  return (
    <ScreenContent
      title="ล้างรายการขาย"
      rightText="ผู้ดูแล"
    >
      <SectionCard>
        <Text style={appStyles.sectionTitle}>ข้อมูลที่จะถูกลบ</Text>
        <Text style={screenStyles.note}>
          บิล รอบออเดอร์ รายการอาหาร การชำระเงิน และประวัติย้ายโต๊ะทั้งหมด
        </Text>
        <Text style={screenStyles.note}>
          เก็บข้อมูลโต๊ะ หมวดหมู่ เมนู และประวัติราคาไว้ กดปุ่ม Reset
          แล้วกดยืนยันเพื่อล้างรายการขาย
        </Text>
        <PrimaryButton
          title={busy ? "กำลังล้างข้อมูล…" : "Reset"}
          disabled={busy}
          onPress={reset}
          style={appStyles.marginTopMd}
        />
      </SectionCard>
    </ScreenContent>
  );
}
