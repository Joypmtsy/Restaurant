// src/screens/TableSelectScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';

// ข้อมูลจำลอง 15 โต๊ะ (โต๊ะ 1-9 มี 4 ที่นั่ง, โต๊ะ 10-15 มี 2 ที่นั่ง)
const INITIAL_TABLES = Array.from({ length: 15 }, (_, i) => {
  const id = i + 1;
  const isOccupied = id === 2 || id === 3 || id === 8; // จำลองให้โต๊ะ 2, 3, 8 ไม่ว่าง
  return {
    id,
    seat_count: id <= 9 ? 4 : 2,
    bill_status: isOccupied ? 'open' : 'closed',
    current_bill_id: isOccupied ? 1000 + id : null,
    opened_at: isOccupied ? '12:30' : null,
    round_count: isOccupied ? 2 : 0,
  };
});

export default function TableSelectScreen() {
  const [tables] = useState(INITIAL_TABLES);
  const [selectedTable, setSelectedTable] = useState(INITIAL_TABLES[0]);
  const [assignedTableId, setAssignedTableId] = useState('03'); // จำลองว่าเครื่องนี้ผูกกับโต๊ะ 3

  const isCurrentOccupied = selectedTable?.bill_status === 'open';

  // การ์ดแสดงผลแต่ละโต๊ะใน Grid
  const renderTableCard = ({ item }) => {
    const isOccupied = item.bill_status === 'open';
    const isSelected = selectedTable?.id === item.id;
    const isThisDevice = assignedTableId === (item.id < 10 ? `0${item.id}` : `${item.id}`);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.tableCard,
          isOccupied ? styles.occupiedCard : styles.vacantCard,
          isSelected && styles.selectedBorder,
        ]}
        onPress={() => setSelectedTable(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.tableNumberText}>
            โต๊ะ {item.id < 10 ? `0${item.id}` : item.id}
          </Text>
          {isThisDevice && <Text style={styles.deviceBadge}>เครื่องนี้</Text>}
        </View>

        <Text style={styles.seatText}>{item.seat_count} ที่นั่ง</Text>

        <View style={[styles.statusTag, isOccupied ? styles.occupiedTag : styles.vacantTag]}>
          <Text style={[styles.statusText, isOccupied ? styles.occupiedText : styles.vacantText]}>
            ● {isOccupied ? 'ไม่ว่าง' : 'ว่าง'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header Bar ด้านบน */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>ระบบสั่งอาหารแท็บเล็ต (UI Preview)</Text>
          <Text style={styles.brandSubtitle}>
            แท็บเล็ตนี้ผูกกับ: โต๊ะ {assignedTableId}
          </Text>
        </View>

        <View style={styles.roleSwitchGroup}>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => Alert.alert('โหมดครัว', 'สลับไปหน้าจอครัว')}
          >
            <Text style={styles.switchButtonText}>หน้าจอครัว</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchButton, styles.adminButton]}
            onPress={() => Alert.alert('โหมดผู้จัดการ', 'สลับไปหน้าจอ Admin')}
          >
            <Text style={styles.switchButtonText}>ผู้จัดการ (Admin)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. ผังแบ่ง 2 ฝั่ง (Split Screen 70 : 30) */}
      <View style={styles.mainContent}>
        {/* ฝั่งซ้าย: ผัง 15 โต๊ะ (5 คอลัมน์ x 3 แถว) */}
        <View style={styles.gridSection}>
          <FlatList
            data={tables}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTableCard}
            numColumns={5}
            contentContainerStyle={styles.gridList}
          />
        </View>

        {/* ฝั่งขวา: แผงควบคุมและรายละเอียดโต๊ะที่แตะเลือก */}
        <View style={styles.actionPanel}>
          {selectedTable ? (
            <>
              <View style={styles.panelCard}>
                <Text style={styles.panelTitle}>
                  โต๊ะ {selectedTable.id < 10 ? `0${selectedTable.id}` : selectedTable.id}
                </Text>
                <Text style={styles.panelSubtitle}>{selectedTable.seat_count} ที่นั่ง</Text>

                <View style={styles.divider} />

                <Text style={styles.infoLabel}>สถานะปัจจุบัน:</Text>
                <Text style={[styles.infoValue, isCurrentOccupied ? styles.occupiedText : styles.vacantText]}>
                  {isCurrentOccupied ? 'มีลูกค้ากำลังใช้งาน (บิลเปิดอยู่)' : 'โต๊ะว่าง (พร้อมรับลูกค้า)'}
                </Text>

                {isCurrentOccupied && (
                  <View style={styles.billDetails}>
                    <Text style={styles.detailText}>เลขที่บิล: #{selectedTable.current_bill_id}</Text>
                    <Text style={styles.detailText}>เวลาเปิด: {selectedTable.opened_at} น.</Text>
                    <Text style={styles.detailText}>สั่งไปแล้ว: {selectedTable.round_count} รอบ</Text>
                  </View>
                )}
              </View>

              {/* ปุ่ม Action แสดงตามสถานะโต๊ะ (ข้อ ก1) */}
              <View style={styles.actionButtonGroup}>
                {!isCurrentOccupied ? (
                  <TouchableOpacity
                    style={styles.primaryOpenBtn}
                    onPress={() => Alert.alert('เปิดบิลใหม่', `เปิดบิลใหม่ของโต๊ะ ${selectedTable.id}`)}
                  >
                    <Text style={styles.btnText}>+ เปิดบิลใหม่ และเริ่มสั่งอาหาร</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.primaryResumeBtn}
                    onPress={() => Alert.alert('เข้าบิลเดิม', `เข้าสู่บิล #${selectedTable.current_bill_id}`)}
                  >
                    <Text style={styles.btnText}>เข้าสู่บิลปัจจุบัน (สั่งต่อ / สรุปบิล)</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => {
                    const formatted = selectedTable.id < 10 ? `0${selectedTable.id}` : `${selectedTable.id}`;
                    setAssignedTableId(formatted);
                    Alert.alert('สำเร็จ', `จำลองแท็บเล็ตนี้เป็น โต๊ะ ${formatted} แล้ว`);
                  }}
                >
                  <Text style={styles.secondaryBtnText}>ตั้งเป็นโต๊ะประจำเครื่องนี้</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>กรุณาเลือกโต๊ะจากผังด้านซ้าย</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E9ECEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  brandTitle: { fontSize: 20, fontWeight: 'bold', color: '#212529' },
  brandSubtitle: { fontSize: 13, color: '#6C757D', marginTop: 2 },
  roleSwitchGroup: { flexDirection: 'row', gap: 12 },
  switchButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0D6EFD',
  },
  adminButton: { backgroundColor: '#495057' },
  switchButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },

  mainContent: { flex: 1, flexDirection: 'row' },
  gridSection: { flex: 7, padding: 16 },
  gridList: { justifyContent: 'center' },

  tableCard: {
    flex: 1,
    margin: 8,
    height: 120,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vacantCard: { backgroundColor: '#EBFBEE' },
  occupiedCard: { backgroundColor: '#FFF4E6' },
  selectedBorder: { borderColor: '#0D6EFD' },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tableNumberText: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  deviceBadge: {
    backgroundColor: '#0D6EFD',
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  seatText: { fontSize: 13, color: '#6C757D' },
  statusTag: { alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
  vacantTag: { backgroundColor: '#D3F9D8' },
  occupiedTag: { backgroundColor: '#FFE8CC' },
  statusText: { fontSize: 12, fontWeight: '600' },
  vacantText: { color: '#2B8A3E' },
  occupiedText: { color: '#E8590C' },

  actionPanel: {
    flex: 3,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderColor: '#E9ECEF',
    padding: 24,
    justifyContent: 'space-between',
  },
  panelCard: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 20 },
  panelTitle: { fontSize: 28, fontWeight: 'bold', color: '#212529' },
  panelSubtitle: { fontSize: 16, color: '#6C757D', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#DEE2E6', marginVertical: 16 },
  infoLabel: { fontSize: 14, color: '#6C757D' },
  infoValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  billDetails: { marginTop: 16, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8 },
  detailText: { fontSize: 14, color: '#495057', marginVertical: 2 },

  actionButtonGroup: { gap: 12 },
  primaryOpenBtn: {
    backgroundColor: '#2B8A3E',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryResumeBtn: {
    backgroundColor: '#E8590C',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CED4DA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryBtnText: { color: '#495057', fontSize: 14, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#ADB5BD', marginTop: 40, fontSize: 16 },
});