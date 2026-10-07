// src/components/customer/CustomerCp.js

import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
} from "../../constants/theme";


// =====================================================
// 1. CustomerTableCard
// =====================================================
// ใช้ใน CustomerTableScreen
// แสดงโต๊ะ + สถานะโต๊ะ
//

export function CustomerTableCard({
  tableNumber,
  status = "available",
  onPress,
}) {
  const isAvailable = status === "available";

  return (
    <TouchableOpacity
      style={[
        styles.tableCard,
        isAvailable
          ? styles.tableAvailable
          : styles.tableOccupied,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tableNumber,
          !isAvailable && styles.tableNumberOccupied,
        ]}
      >
        {tableNumber}
      </Text>

      <Text
        style={[
          styles.tableStatus,
          isAvailable
            ? styles.availableText
            : styles.occupiedText,
        ]}
      >
        {isAvailable ? "ว่าง" : "ไม่ว่าง"}
      </Text>
    </TouchableOpacity>
  );
}


// =====================================================
// 2. MenuCard
// =====================================================
// ใช้ใน CustomerMenuScreen
// แสดงรูป/emoji + ชื่อเมนู + ราคา + ปุ่มเพิ่ม
//

export function MenuCard({
  menu,
  onAdd,
}) {
  return (
    <View style={styles.menuCard}>

      <View style={styles.foodImageBox}>
        <Text style={styles.foodEmoji}>
          {menu.emoji}
        </Text>
      </View>

      <Text
        style={styles.menuName}
        numberOfLines={2}
      >
        {menu.name}
      </Text>

      <View style={styles.menuBottomRow}>
        <Text style={styles.menuPrice}>
          {menu.price} บาท
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAdd(menu)}
        >
          <Text style={styles.addButtonText}>
            +
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}


// =====================================================
// 3. CartItem
// =====================================================
// ใช้ใน CustomerMenuScreen / Cart
// แสดงรายการในตะกร้า + ปุ่มเพิ่ม/ลดจำนวน
//

export function CartItem({
  item,
  onIncrease,
  onDecrease,
}) {
  return (
    <View style={styles.cartItem}>

      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>
          {item.emoji} {item.name}
        </Text>

        <View style={styles.quantityRow}>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onDecrease(item)}
          >
            <Text style={styles.quantityButtonText}>
              -
            </Text>
          </TouchableOpacity>

          <Text style={styles.quantityValue}>
            {item.qty}
          </Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onIncrease(item)}
          >
            <Text style={styles.quantityButtonText}>
              +
            </Text>
          </TouchableOpacity>

        </View>
      </View>

      <Text style={styles.cartItemPrice}>
        {item.price * item.qty} บาท
      </Text>

    </View>
  );
}


// =====================================================
// 4. OrderStatusCard
// =====================================================
// ใช้ใน CustomerOrderStatusScreen
// แสดงอาหาร + Round + จำนวน + สถานะ
//

export function OrderStatusCard({
  order,
  onPress,
}) {
  const status = getOrderStatus(order.status);

  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={onPress}
    >
      <View style={styles.orderTopRow}>

        <View style={styles.orderMain}>
          <Text style={styles.roundText}>
            Round {order.round}
          </Text>

          <Text style={styles.orderMenuName}>
            {order.menu}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: status.background,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: status.color,
              },
            ]}
          >
            {status.label}
          </Text>
        </View>

      </View>

      <View style={styles.orderBottomRow}>

        <Text style={styles.orderQuantity}>
          จำนวน {order.quantity}
        </Text>

        <Text style={styles.orderPrice}>
          {order.price * order.quantity} บาท
        </Text>

      </View>

      {order.note ? (
        <Text style={styles.orderNote}>
          หมายเหตุ: {order.note}
        </Text>
      ) : null}

    </TouchableOpacity>
  );
}


// =====================================================
// 5. BillItem
// =====================================================
// ใช้ใน CustomerBillScreen
// แสดงรายการอาหารใน Bill
//

export function BillItem({
  item,
}) {
  return (
    <View style={styles.billItem}>

      <View style={styles.billItemMain}>

        <Text style={styles.billItemName}>
          {item.name}
        </Text>

        <Text style={styles.billItemQuantity}>
          x {item.quantity}
        </Text>

        {item.note ? (
          <Text style={styles.billItemNote}>
            หมายเหตุ: {item.note}
          </Text>
        ) : null}

      </View>

      <Text style={styles.billItemPrice}>
        {item.quantity * item.priceAtOrder} บาท
      </Text>

    </View>
  );
}


// =====================================================
// Helper
// =====================================================

function getOrderStatus(status) {
  switch (status) {

    case "waiting":
      return {
        label: "รอรับออเดอร์",
        color: colors.warning,
        background: colors.warningBg,
      };

    case "cooking":
      return {
        label: "กำลังทำ",
        color: colors.info,
        background: colors.infoBg,
      };

    case "served":
      return {
        label: "เสิร์ฟแล้ว",
        color: colors.success,
        background: colors.successBg,
      };

    default:
      return {
        label: status,
        color: colors.textSecondary,
        background: colors.border,
      };
  }
}


// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({

  // ===================================================
  // Customer Table
  // ===================================================

  tableCard: {
    width: 150,
    height: 120,

    borderRadius: radius.card,

    borderWidth: 2,

    justifyContent: "center",
    alignItems: "center",
  },

  tableAvailable: {
    backgroundColor: colors.surface,

    borderColor: colors.successBg,
  },

  tableOccupied: {
    backgroundColor: colors.dangerBg,

    borderColor: colors.danger,
  },

  tableNumber: {
    fontSize: 28,

    fontWeight: fontWeight.bold,

    color: colors.success,
  },

  tableNumberOccupied: {
    color: colors.danger,
  },

  tableStatus: {
    marginTop: spacing.sm,

    fontSize: fontSize.sm,

    fontWeight: fontWeight.semibold,
  },

  availableText: {
    color: colors.success,
  },

  occupiedText: {
    color: colors.danger,
  },


  // ===================================================
  // Menu Card
  // ===================================================

  menuCard: {
    width: "31.5%",

    backgroundColor: colors.surface,

    borderRadius: radius.xl,

    padding: spacing.md,

    borderWidth: 1,

    borderColor: colors.border,
  },

  foodImageBox: {
    height: 80,

    backgroundColor: colors.background,

    borderRadius: radius.md,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: spacing.sm,
  },

  foodEmoji: {
    fontSize: 36,
  },

  menuName: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,

    marginBottom: spacing.sm,
  },

  menuBottomRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  menuPrice: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,
  },

  addButton: {
    width: 30,
    height: 30,

    borderRadius: 15,

    backgroundColor: colors.primary,

    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: colors.textWhite,

    fontSize: fontSize.lg,

    fontWeight: fontWeight.bold,
  },


  // ===================================================
  // Cart
  // ===================================================

  cartItem: {
    minHeight: 70,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingVertical: spacing.md,

    borderBottomWidth: 1,

    borderBottomColor: colors.border,
  },

  cartItemInfo: {
    flex: 1,
  },

  cartItemName: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.semibold,

    color: colors.textPrimary,

    marginBottom: spacing.sm,
  },

  quantityRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: spacing.sm,
  },

  quantityButton: {
    width: 24,
    height: 24,

    borderRadius: radius.sm,

    backgroundColor: colors.border,

    justifyContent: "center",
    alignItems: "center",
  },

  quantityButtonText: {
    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,

    color: colors.textSecondary,
  },

  quantityValue: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,

    minWidth: 18,

    textAlign: "center",
  },

  cartItemPrice: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,
  },


  // ===================================================
  // Order Status
  // ===================================================

  orderCard: {
    backgroundColor: colors.surface,

    borderRadius: radius.card,

    padding: spacing.xl,

    marginBottom: spacing.lg,

    borderWidth: 1,

    borderColor: colors.border,
  },

  orderTopRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-start",
  },

  orderMain: {
    flex: 1,
  },

  roundText: {
    fontSize: fontSize.xs,

    color: colors.textMuted,
  },

  orderMenuName: {
    fontSize: fontSize.xl,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,

    marginTop: spacing.xs,
  },

  statusBadge: {
    borderRadius: radius.md,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm,
  },

  statusText: {
    fontSize: fontSize.xs,

    fontWeight: fontWeight.bold,
  },

  orderBottomRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: spacing.lg,
  },

  orderQuantity: {
    fontSize: fontSize.sm,

    color: colors.textSecondary,
  },

  orderPrice: {
    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,
  },

  orderNote: {
    marginTop: spacing.md,

    paddingTop: spacing.md,

    borderTopWidth: 1,

    borderTopColor: colors.border,

    fontSize: fontSize.sm,

    color: colors.textMuted,
  },


  // ===================================================
  // Bill Item
  // ===================================================

  billItem: {
    minHeight: 64,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingVertical: spacing.md,

    borderBottomWidth: 1,

    borderBottomColor: colors.border,
  },

  billItemMain: {
    flex: 1,
  },

  billItemName: {
    fontSize: fontSize.md,

    fontWeight: fontWeight.semibold,

    color: colors.textPrimary,
  },

  billItemQuantity: {
    marginTop: spacing.xs,

    fontSize: fontSize.sm,

    color: colors.textMuted,
  },

  billItemNote: {
    marginTop: spacing.xs,

    fontSize: fontSize.xs,

    color: colors.textMuted,
  },

  billItemPrice: {
    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,

    marginLeft: spacing.lg,
  },
});
