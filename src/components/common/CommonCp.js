// src/components/CommonCp.js

import React from "react";

import { View, Text, StyleSheet, TouchableOpacity, } from "react-native";

import { colors, spacing, radius, fontSize, fontWeight, dimensions, shadow, } from "../constants/theme";

/*
  ==========================================================
  1. ScreenHeader
  ==========================================================
  Header ด้านบนที่ใช้ร่วมกันหลายหน้า
*/

export function ScreenHeader({ title, subtitle, rightText, children,}) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.headerSubtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.headerRight}>
        {rightText ? (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {rightText}
            </Text>
          </View>
        ) : null}

        {children}
      </View>
    </View>
  );
}


/*
  ==========================================================
  2. SectionCard
  ==========================================================
  กล่อง Card สีขาวที่ใช้เป็นพื้นฐานของข้อมูล
*/

export function SectionCard({ children, style, }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}


/*
  ==========================================================
  3. PrimaryButton
  ==========================================================
  ปุ่มหลักสีน้ำเงินของระบบ
*/

export function PrimaryButton({ title, onPress, disabled = false, style, }) {
  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        disabled && styles.primaryButtonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.primaryButtonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}


/*
  ==========================================================
  4. StatusBadge
  ==========================================================
  Badge สำหรับสถานะของ Order / Bill / Table
*/

export function StatusBadge({ status, label, }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor: config.background,
        },
      ]}
    >
      <Text
        style={[
          styles.statusBadgeText,
          {
            color: config.color,
          },
        ]}
      >
        {label || config.label}
      </Text>
    </View>
  );
}


/*
  ==========================================================
  5. InfoRow
  ==========================================================
  แถวข้อมูลแบบ Label / Value
*/

export function InfoRow({ label, value, style, }) {
  return (
    <View style={[styles.infoRow, style]}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}


/*
  ==========================================================
  Status Configuration
  ==========================================================
*/

const STATUS_CONFIG = {
  waiting: {
    label: "รอรับออเดอร์",
    color: colors.warning,
    background: colors.warningBg,
  },

  cooking: {
    label: "กำลังทำ",
    color: colors.info,
    background: colors.infoBg,
  },

  served: {
    label: "เสิร์ฟแล้ว",
    color: colors.success,
    background: colors.successBg,
  },

  open: {
    label: "เปิด",
    color: colors.info,
    background: colors.infoBg,
  },

  closed: {
    label: "ปิด",
    color: colors.textMuted,
    background: colors.border,
  },

  available: {
    label: "ว่าง",
    color: colors.success,
    background: colors.successBg,
  },

  occupied: {
    label: "ไม่ว่าง",
    color: colors.danger,
    background: colors.dangerBg,
  },

  default: {
    label: "",
    color: colors.textSecondary,
    background: colors.border,
  },
};


/*
  ==========================================================
  Styles
  ==========================================================
*/

const styles = StyleSheet.create({
  // =========================
  // Header
  // =========================

  header: {
    height: dimensions.headerHeight,

    backgroundColor: colors.primaryDark,

    paddingHorizontal: spacing.xxl,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  headerTitle: {
    color: colors.textWhite,

    fontSize: fontSize.title,

    fontWeight: fontWeight.bold,
  },

  headerSubtitle: {
    color: colors.textLight,

    fontSize: fontSize.sm,

    marginTop: spacing.xs,
  },

  headerRight: {
    flexDirection: "row",

    alignItems: "center",

    gap: spacing.md,
  },

  headerBadge: {
    backgroundColor: "#334155",

    paddingHorizontal: spacing.lg,

    paddingVertical: spacing.sm,

    borderRadius: radius.lg,
  },

  headerBadgeText: {
    color: colors.textWhite,

    fontSize: fontSize.md,

    fontWeight: fontWeight.semibold,
  },


  // =========================
  // Card
  // =========================

  card: {
    backgroundColor: colors.surface,

    borderRadius: radius.card,

    padding: dimensions.cardPadding,

    ...shadow.card,
  },


  // =========================
  // Primary Button
  // =========================

  primaryButton: {
    backgroundColor: colors.primary,

    minHeight: dimensions.buttonHeight,

    borderRadius: radius.xl,

    paddingHorizontal: spacing.xl,

    paddingVertical: spacing.md,

    justifyContent: "center",

    alignItems: "center",
  },

  primaryButtonDisabled: {
    backgroundColor: colors.disabled,
  },

  primaryButtonText: {
    color: colors.textWhite,

    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,
  },


  // =========================
  // Status Badge
  // =========================

  statusBadge: {
    borderRadius: radius.md,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm,

    alignSelf: "flex-start",
  },

  statusBadgeText: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.bold,
  },


  // =========================
  // Info Row
  // =========================

  infoRow: {
    minHeight: 44,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    borderBottomWidth: 1,

    borderBottomColor: colors.border,

    paddingVertical: spacing.md,
  },

  infoLabel: {
    color: colors.textMuted,

    fontSize: fontSize.md,
  },

  infoValue: {
    color: colors.textPrimary,

    fontSize: fontSize.md,

    fontWeight: fontWeight.semibold,
  },
});
