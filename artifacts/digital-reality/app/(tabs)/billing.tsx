import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/StatusBadge";

function BillingStatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colors = useColors();
  return (
    <View style={[bStyles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[bStyles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[bStyles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

export default function BillingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { invoices, expenses } = useApp();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const poValue = 5000000;
  const raised = invoices.filter((i) => i.status !== "Not Raised").reduce((s, i) => s + i.amount, 0);
  const received = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const pending = raised - received;

  const fmt = (n: number) => `₹${(n / 100000).toFixed(2)}L`;

  return (
    <View style={[bStyles.root, { backgroundColor: colors.background }]}>
      <View style={[bStyles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[bStyles.title, { color: colors.text }]}>Billing</Text>
        <TouchableOpacity style={[bStyles.iconBtn, { borderColor: colors.border }]}>
          <Feather name="more-vertical" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[bStyles.list, { paddingBottom: insets.bottom + 100 }]}
        ListHeaderComponent={
          <>
            {/* Stats */}
            <View style={bStyles.statsGrid}>
              <BillingStatCard label="PO Value" value={fmt(poValue)} color={colors.text} />
              <BillingStatCard label="Raised" value={fmt(raised)} color={colors.success} />
              <BillingStatCard label="Received" value={fmt(received)} color={colors.info} />
              <BillingStatCard label="Pending" value={fmt(pending)} color={colors.orange} />
            </View>

            <View style={bStyles.sectionHeader}>
              <Text style={[bStyles.sectionTitle, { color: colors.text }]}>Invoice List</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={[bStyles.invoiceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[bStyles.invoiceIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="file-text" size={18} color={colors.primary} />
            </View>
            <View style={bStyles.invoiceInfo}>
              <Text style={[bStyles.invNum, { color: colors.text }]}>{item.number}</Text>
              <Text style={[bStyles.invDesc, { color: colors.mutedForeground }]}>{item.description}</Text>
              <Text style={[bStyles.invDate, { color: colors.mutedForeground }]}>{item.date}</Text>
            </View>
            <View style={bStyles.invoiceRight}>
              <Text style={[bStyles.invAmount, { color: colors.text }]}>₹{(item.amount / 100000).toFixed(2)}L</Text>
              <StatusBadge status={item.status} small />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={bStyles.empty}>
            <Feather name="file-text" size={40} color={colors.mutedForeground} />
            <Text style={[bStyles.emptyText, { color: colors.mutedForeground }]}>No invoices yet</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[bStyles.fab, { backgroundColor: colors.primary, bottom: insets.bottom + 90 }]}
        onPress={() => router.push("/expenses/add")}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const bStyles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: "44%",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 4,
  },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  sectionHeader: { marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  invoiceCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  invoiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  invoiceInfo: { flex: 1, gap: 2 },
  invNum: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  invDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  invDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  invoiceRight: { alignItems: "flex-end", gap: 6 },
  invAmount: { fontSize: 15, fontFamily: "Inter_700Bold" },
  empty: { alignItems: "center", paddingTop: 40, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  fab: {
    position: "absolute",
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
