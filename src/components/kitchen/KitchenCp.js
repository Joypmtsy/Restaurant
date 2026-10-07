// src/components/kitchen/KitchenCp.js

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
// 1. KitchenOrderCard
// =====================================================
// ใช้ใน KitchenQueueScreen
// แสดง Order ที่อยู่ในคิว
//
// ข้อมูลที่แสดง:
// - Order ID
// - Table
// - Round
// - Menu
// - Quantity
// - Note
// - Status
//

export function KitchenOrderCard({
  order,
  onPress,
}) {
  const status = getStatusConfig(order.status);

  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={onPress}
    >
      {/* ส่วนบน */}
      <View style={styles.orderTopRow}>

        <View style={styles.orderMain}>
          <Text style={styles.orderId}>
            Order #{order.orderId}
          </Text>

          <Text style={styles.tableText}>
            โต๊ะ {order.tableNumber}
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


      {/* Round */}
      <Text style={styles.roundText}>
        Round {order.roundNumber}
      </Text>


      {/* Menu */}
      <Text style={styles.menuName}>
        {order.menuName}
      </Text>


      {/* Quantity */}
      <View style={styles.infoRow}>

        <Text style={styles.infoLabel}>
          จำนวน
        </Text>

        <Text style={styles.infoValue}>
          {order.quantity}
        </Text>

      </View>


      {/* Note */}
      {order.note ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>
            หมายเหตุ
          </Text>

          <Text style={styles.noteText}>
            {order.note}
          </Text>
        </View>
      ) : null}


      {/* เวลา */}
      {order.createdAt ? (
        <Text style={styles.timeText}>
          {order.createdAt}
        </Text>
      ) : null}

    </TouchableOpacity>
  );
}


// =====================================================
// 2. KitchenOrderItem
// =====================================================
// ใช้ใน KitchenDetailScreen
// แสดงรายละเอียดอาหารแต่ละรายการ
//

export function KitchenOrderItem({
  item,
}) {
  return (
    <View style={styles.orderItem}>

      <View style={styles.orderItemMain}>

        <Text style={styles.orderItemName}>
          {item.menuName}
        </Text>

        <Text style={styles.orderItemQuantity}>
          จำนวน {item.quantity}
        </Text>

        {item.note ? (
          <Text style={styles.orderItemNote}>
            หมายเหตุ: {item.note}
          </Text>
        ) : null}

      </View>

      <Text style={styles.orderItemStatus}>
        {getStatusConfig(item.status).label}
      </Text>

    </View>
  );
}


// =====================================================
// 3. KitchenStatusButton
// =====================================================
// ใช้ใน KitchenQueueScreen / KitchenDetailScreen
// เปลี่ยนสถานะ
//
// waiting → cooking → served
//

export function KitchenStatusButton({
  status,
  onPress,
  disabled = false,
}) {
  const button = getNextStatus(status);

  return (
    <TouchableOpacity
      style={[
        styles.statusButton,
        disabled && styles.statusButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.statusButtonText}>
        {button.label}
      </Text>
    </TouchableOpacity>
  );
}


// =====================================================
// Helper : Status
// =====================================================

function getStatusConfig(status) {
  switch (status) {

    case "waiting":
      return {
        label: "รอทำ",
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
        label: status || "-",
        color: colors.textSecondary,
        background: colors.border,
      };
  }
}


// =====================================================
// Helper : Next Status
// =====================================================

function getNextStatus(status) {

  switch (status) {

    case "waiting":
      return {
        label: "เริ่มทำอาหาร",
        nextStatus: "cooking",
      };

    case "cooking":
      return {
        label: "ทำเสร็จ / เสิร์ฟ",
        nextStatus: "served",
      };

    case "served":
      return {
        label: "เสิร์ฟแล้ว",
        nextStatus: "served",
      };

    default:
      return {
        label: "เปลี่ยนสถานะ",
        nextStatus: status,
      };
  }
}


// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({

  // ===================================================
  // Kitchen Order Card
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

  orderId: {
    fontSize: fontSize.sm,

    color: colors.textMuted,

    fontWeight: fontWeight.semibold,
  },

  tableText: {
    fontSize: fontSize.lg,

    color: colors.textPrimary,

    fontWeight: fontWeight.bold,

    marginTop: spacing.xs,
  },

  roundText: {
    fontSize: fontSize.sm,

    color: colors.textMuted,

    marginTop: spacing.md,
  },

  menuName: {
    fontSize: fontSize.xl,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,

    marginTop: spacing.xs,
  },


  // ===================================================
  // Status
  // ===================================================

  statusBadge: {
    borderRadius: radius.md,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm,
  },

  statusText: {
    fontSize: fontSize.xs,

    fontWeight: fontWeight.bold,
  },


  // ===================================================
  // Info Row
  // ===================================================

  infoRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: spacing.lg,

    paddingTop: spacing.md,

    borderTopWidth: 1,

    borderTopColor: colors.border,
  },

  infoLabel: {
    fontSize: fontSize.sm,

    color: colors.textMuted,
  },

  infoValue: {
    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,
  },


  // ===================================================
  // Note
  // ===================================================

  noteBox: {
    backgroundColor: colors.surfaceLight,

    borderRadius: radius.md,

    padding: spacing.md,

    marginTop: spacing.md,
  },

  noteLabel: {
    fontSize: fontSize.xs,

    color: colors.textMuted,

    marginBottom: spacing.xs,
  },

  noteText: {
    fontSize: fontSize.sm,

    color: colors.textSecondary,
  },


  // ===================================================
  // Time
  // ===================================================

  timeText: {
    fontSize: fontSize.xs,

    color: colors.textMuted,

    marginTop: spacing.md,

    textAlign: "right",
  },


  // ===================================================
  // Kitchen Order Item
  // ===================================================

  orderItem: {
    minHeight: 70,

    backgroundColor: colors.surface,

    paddingVertical: spacing.md,

    borderBottomWidth: 1,

    borderBottomColor: colors.border,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  orderItemMain: {
    flex: 1,
  },

  orderItemName: {
    fontSize: fontSize.lg,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,
  },

  orderItemQuantity: {
    fontSize: fontSize.sm,

    color: colors.textMuted,

    marginTop: spacing.xs,
  },

  orderItemNote: {
    fontSize: fontSize.xs,

    color: colors.textMuted,

    marginTop: spacing.xs,
  },

  orderItemStatus: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.semibold,

    color: colors.textSecondary,

    marginLeft: spacing.lg,
  },


  // ===================================================
  // Status Button
  // ===================================================

  statusButton: {
    minHeight: 44,

    backgroundColor: colors.primary,

    borderRadius: radius.xl,

    paddingHorizontal: spacing.xl,

    paddingVertical: spacing.md,

    justifyContent: "center",

    alignItems: "center",

  },

  statusButtonDisabled: {
    backgroundColor: colors.disabled,
  },

  statusButtonText: {
    color: colors.textWhite,

    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,
  },

});
