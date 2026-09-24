// src/screens/MenuScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';

// ข้อมูลจำลองหมวดหมู่
const CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด', icon: '🍽️' },
  { id: 'soup', name: 'ต้ม', icon: '🍲' },
  { id: 'stir', name: 'ผัด', icon: '🍳' },
  { id: 'curry', name: 'แกง', icon: '🥘' },
  { id: 'salad', name: 'ยำ', icon: '🥗' },
  { id: 'fried', name: 'ทอด', icon: '🍗' },
  { id: 'drink', name: 'เครื่องดื่ม', icon: '🥤' },
];

// ข้อมูลจำลองรายการอาหาร
const MENU_ITEMS = [
  { id: 1, name: 'ต้มยำกุ้ง', price: 150, category: 'soup', emoji: '🍲' },
  { id: 2, name: 'ผัดกะเพราหมูสับ', price: 100, category: 'stir', emoji: '🍛' },
  { id: 3, name: 'แกงเขียวหวานไก่', price: 120, category: 'curry', emoji: '🥘' },
  { id: 4, name: 'ปลาทอดสมุนไพร', price: 180, category: 'fried', emoji: '🐟' },
  { id: 5, name: 'ข้าวผัดกุ้ง', price: 90, category: 'stir', emoji: '🍚' },
  { id: 6, name: 'ส้มตำไทย', price: 80, category: 'salad', emoji: '🥗' },
  { id: 7, name: 'น้ำเปล่า', price: 15, category: 'drink', emoji: '🥛' },
  { id: 8, name: 'ชาเย็น', price: 45, category: 'drink', emoji: '🧋' },
  { id: 9, name: 'ไอศกรีม', price: 40, category: 'dessert', emoji: '🍨' },
];

export default function MenuScreen({ tableId = '05' }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [orderNote, setOrderNote] = useState('');
  const [cart, setCart] = useState([
    { id: 1, name: 'ต้มยำกุ้ง', price: 150, qty: 1, emoji: '🍲' },
    { id: 5, name: 'ข้าวผัดกุ้ง', price: 90, qty: 1, emoji: '🍚' },
  ]);

  // ฟังก์ชันเพิ่มลงตะกร้า
  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (found) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // ฟังก์ชันปรับจำนวนในตะกร้า (+ / -)
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  // รวมยอดเงินในตะกร้า
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header Bar ด้านบน */}
      <View style={styles.darkHeader}>
        <View style={styles.headerBrand}>
          <Text style={styles.brandIcon}></Text>
          <Text style={styles.brandTitleText}>HONEY RESTAURANT</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.tableBadge}>
            <Text style={styles.tableBadgeText}> โต๊ะที่ {tableId}</Text>
          </View>
          <Text style={styles.headerTime}>⌄   10:24 น.</Text>
        </View>
      </View>

      {/* 2. ส่วนเนื้อหาหลัก (Split 3 คอลัมน์) */}
      <View style={styles.mainLayout}>
        {/* ซ้าย: Sidebar เมนูนำทาง */}
        <View style={styles.customerSidebar}>
          <View style={styles.sideMenuGroup}>
            <TouchableOpacity style={styles.sideItem}>
              <Text style={styles.sideItemText}></Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sideItem, styles.sideItemActive]}>
              <Text style={[styles.sideItemText, styles.sideItemTextActive]}> เมนูอาหาร</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideItem}>
              <Text style={styles.sideItemText}> ตะกร้า</Text>
              {cart.length > 0 && (
                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideItem}>
              <Text style={styles.sideItemText}>รายการสั่งซื้อ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideItem}>
              <Text style={styles.sideItemText}>ประวัติการสั่งซื้อ</Text>
            </TouchableOpacity>
          </View>

          {/* ด้านล่าง Sidebar */}
          <View style={styles.sidebarFooter}>
            <Text style={styles.footerTableStatus}>โต๊ะที่ {tableId}  🟢 ว่าง</Text>
            <View style={styles.sidebarActionRow}>
              <TouchableOpacity style={styles.addOrderSmallBtn}>
                <Text style={styles.addOrderSmallText}>+ สั่งอาหารเพิ่ม</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bellBtn}>
                <Text>🔔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* กลาง: หน้ารายการอาหาร และเลือกหมวดหมู่ */}
        <View style={styles.centerMenuArea}>
          <Text style={styles.welcomeTitle}>ยินดีต้อนรับ </Text>
          <Text style={styles.welcomeSub}></Text>

          {/* แถบหมวดหมู่เลื่อนแนวนอน */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCat === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catCard, isActive && styles.catCardActive]}
                  onPress={() => setSelectedCat(cat.id)}
                >
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={[styles.catName, isActive && styles.catNameActive]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* การ์ดรายการอาหาร (Grid 3 คอลัมน์) */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuGrid}>
            {MENU_ITEMS.filter((m) => selectedCat === 'all' || m.category === selectedCat).map((menu) => (
              <View key={menu.id} style={styles.menuCard}>
                <View style={styles.foodImgBox}>
                  <Text style={styles.foodImgEmoji}>{menu.emoji}</Text>
                </View>
                <Text style={styles.foodName}>{menu.name}</Text>
                <View style={styles.foodBottomRow}>
                  <Text style={styles.foodPrice}>{menu.price} บาท</Text>
                  <TouchableOpacity style={styles.plusBtn} onPress={() => addToCart(menu)}>
                    <Text style={styles.plusBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ขวา: แผงตะกร้าสินค้า */}
        <View style={styles.cartPanel}>
          <View style={styles.cartHeaderRow}>
            <Text style={styles.cartTitle}>
              ตะกร้าสินค้า <Text style={styles.cartTitleCount}>({cart.length})</Text>
            </Text>
            <TouchableOpacity onPress={() => setCart([])}>
              <Text style={styles.trashIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>

          {/* รายการในตะกร้า */}
          <ScrollView style={styles.cartList}>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItemCard}>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>
                    {item.emoji} {item.name}
                  </Text>
                  <View style={styles.qtyControlRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyVal}>{item.qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.cartItemPrice}>{item.price * item.qty} บาท</Text>
              </View>
            ))}
          </ScrollView>

          {/* ช่องกรอกหมายเหตุ */}
          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>หมายเหตุ (ถ้ามี)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="เช่น ไม่ใส่ผักชี, เผ็ดน้อย"
              placeholderTextColor="#ADB5BD"
              value={orderNote}
              onChangeText={setOrderNote}
            />
          </View>

          {/* แถบสรุปยอดรวมและปุ่มยืนยันส่งครัว */}
          <View style={styles.cartSummarySection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>ยอดรวม</Text>
              <Text style={styles.totalValue}>{cartTotal} บาท</Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, cart.length === 0 && styles.checkoutDisabled]}
              disabled={cart.length === 0}
            >
              <Text style={styles.checkoutBtnText}>ยืนยันรายการ  ➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header Bar
  darkHeader: {
    height: 56,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandIcon: { fontSize: 22 },
  brandTitleText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  tableBadge: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  tableBadgeText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  headerTime: { color: '#CBD5E1', fontSize: 13 },

  // โครงสร้างหน้าหลัก
  mainLayout: { flex: 1, flexDirection: 'row' },

  // Sidebar ซ้าย
  customerSidebar: {
    width: 170,
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    justifyContent: 'space-between',
  },
  sideMenuGroup: { gap: 6 },
  sideItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideItemActive: { backgroundColor: '#1C7ED6' },
  sideItemText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  sideItemTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  miniBadge: { backgroundColor: '#E03131', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  miniBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  sidebarFooter: { borderTopWidth: 1, borderColor: '#E2E8F0', paddingTop: 10, gap: 8 },
  footerTableStatus: { fontSize: 12, color: '#475569', fontWeight: 'bold' },
  sidebarActionRow: { flexDirection: 'row', gap: 6 },
  addOrderSmallBtn: {
    flex: 1,
    backgroundColor: '#1C7ED6',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addOrderSmallText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  bellBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // พื้นที่เลือกอาหารตรงกลาง
  centerMenuArea: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  welcomeSub: { fontSize: 13, color: '#64748B', marginBottom: 12 },
  catScroll: { maxHeight: 58, marginBottom: 10 },
  catCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 64,
  },
  catCardActive: { backgroundColor: '#1C7ED6', borderColor: '#1C7ED6' },
  catIcon: { fontSize: 16 },
  catName: { fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '600' },
  catNameActive: { color: '#FFFFFF' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20 },
  menuCard: {
    width: '31.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  foodImgBox: {
    height: 80,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodImgEmoji: { fontSize: 36 },
  foodName: { fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginBottom: 6 },
  foodBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foodPrice: { fontSize: 12, fontWeight: 'bold', color: '#0F172A' },
  plusBtn: {
    backgroundColor: '#1C7ED6',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, lineHeight: 18 },

  // แผงตะกร้าขวา
  cartPanel: { width: 280, backgroundColor: '#FFFFFF', borderLeftWidth: 1, borderColor: '#E2E8F0', padding: 14 },
  cartHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cartTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  cartTitleCount: { color: '#E03131' },
  trashIcon: { fontSize: 16 },
  cartList: { flex: 1 },
  cartItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 12, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  qtyControlRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 12, fontWeight: 'bold', color: '#334155' },
  qtyVal: { fontSize: 12, fontWeight: 'bold' },
  cartItemPrice: { fontSize: 12, fontWeight: 'bold', color: '#0F172A', alignSelf: 'center' },
  noteBox: { marginVertical: 10 },
  noteLabel: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  noteInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
    fontSize: 11,
    color: '#1E293B',
  },
  cartSummarySection: { borderTopWidth: 1, borderColor: '#E2E8F0', paddingTop: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  totalLabel: { fontSize: 13, color: '#64748B' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#1C7ED6' },
  checkoutBtn: {
    backgroundColor: '#1C7ED6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkoutDisabled: { backgroundColor: '#94A3B8' },
  checkoutBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});