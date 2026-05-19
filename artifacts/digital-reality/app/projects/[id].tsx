import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";

const TABS = ["Field Work", "Processing", "Deliverables", "Billing", "Documents"];

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { projects, activities, invoices } = useApp();
  const [activeTab, setActiveTab] = useState("Field Work");
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const project = projects.find((p) => p.id === id);
  if (!project) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedForeground }}>Project not found</Text>
      </View>
    );
  }

  const projectActivities = activities.filter((a) => a.projectId === id);
  const projectInvoices = invoices.filter((i) => i.projectId === id);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Field Work":
        return projectActivities.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="clipboard" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No field activities yet</Text>
          </View>
        ) : (
          projectActivities.map((a) => (
            <View key={a.id} style={[styles.actCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.actType, { color: colors.text }]}>{a.activityType}</Text>
              <Text style={[styles.actDate, { color: colors.mutedForeground }]}>{a.date} · {a.location}</Text>
              <ProgressBar progress={a.progress} showLabel height={6} />
            </View>
          ))
        );
      case "Billing":
        return projectInvoices.map((inv) => (
          <View key={inv.id} style={[styles.actCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.invRow}>
              <View>
                <Text style={[styles.actType, { color: colors.text }]}>{inv.number} — {inv.description}</Text>
                <Text style={[styles.actDate, { color: colors.mutedForeground }]}>{inv.date}</Text>
              </View>
              <View style={styles.invRight}>
                <Text style={[styles.invAmt, { color: colors.text }]}>₹{(inv.amount / 100000).toFixed(2)}L</Text>
                <StatusBadge status={inv.status} small />
              </View>
            </View>
          </View>
        ));
      default:
        return (
          <View style={styles.empty}>
            <Feather name="folder" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No data for {activeTab}</Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Custom Header */}
      <View style={[styles.topBar, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border }]}>
          <Feather name="chevron-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.text }]}>Project Detail</Text>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.border }]}>
          <Feather name="more-vertical" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image placeholder */}
        <View style={[styles.heroImg, { backgroundColor: colors.secondary }]}>
          <Feather name="map" size={48} color={colors.primary} />
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.projName, { color: colors.text }]}>{project.name}</Text>
              <View style={styles.locRow}>
                <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                <Text style={[styles.locText, { color: colors.mutedForeground }]}>{project.location}, {project.state}</Text>
              </View>
            </View>
            <StatusBadge status={project.status} />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Project ID</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{project.projectId}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Client</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{project.client}</Text>
            </View>
            {project.poValue > 0 && (
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>PO Value</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>₹{(project.poValue / 100000).toFixed(0)}L</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Start Date</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{project.startDate || "TBD"}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>End Date</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{project.endDate || "TBD"}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Project Manager</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{project.projectManager}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.overallLabel, { color: colors.mutedForeground }]}>Overall Progress</Text>
          <ProgressBar progress={project.progress} showLabel height={10} />

          {/* Quick action tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
            <View style={styles.quickTabs}>
              {[
                { icon: "activity", label: "Field Work" },
                { icon: "cpu", label: "Processing" },
                { icon: "package", label: "Deliverables" },
                { icon: "credit-card", label: "Billing" },
                { icon: "file", label: "Documents" },
              ].map((t) => (
                <TouchableOpacity
                  key={t.label}
                  style={[styles.quickTab, { backgroundColor: activeTab === t.label ? colors.secondary : colors.muted }]}
                  onPress={() => setActiveTab(t.label)}
                >
                  <Feather name={t.icon as any} size={16} color={activeTab === t.label ? colors.primary : colors.mutedForeground} />
                  <Text style={[styles.quickTabLabel, { color: activeTab === t.label ? colors.primary : colors.mutedForeground }]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Team */}
        <View style={[styles.teamCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.teamHeader}>
            <Text style={[styles.teamTitle, { color: colors.text }]}>Project Team</Text>
            <TouchableOpacity><Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text></TouchableOpacity>
          </View>
          <View style={styles.memberRow}>
            <View style={[styles.memberAvatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.memberInitials}>AK</Text>
            </View>
            <View>
              <Text style={[styles.memberName, { color: colors.text }]}>{project.projectManager}</Text>
              <Text style={[styles.memberRole, { color: colors.mutedForeground }]}>Project Manager</Text>
            </View>
          </View>
        </View>

        {/* Tab content */}
        <View style={styles.tabContent}>
          <Text style={[styles.contentTitle, { color: colors.text }]}>{activeTab}</Text>
          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  container: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  heroImg: {
    height: 160,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: { borderRadius: 14, padding: 16, borderWidth: 1, gap: 12 },
  infoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  projName: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 4 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  divider: { height: 1, marginVertical: 2 },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metaItem: { minWidth: "44%", gap: 2 },
  metaLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  metaValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  overallLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 8 },
  quickTabs: { flexDirection: "row", gap: 8 },
  quickTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  quickTabLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  teamCard: { borderRadius: 14, padding: 16, borderWidth: 1, gap: 12 },
  teamHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  teamTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  viewAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  memberRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  memberInitials: { color: "#fff", fontSize: 14, fontFamily: "Inter_700Bold" },
  memberName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  memberRole: { fontSize: 12, fontFamily: "Inter_400Regular" },
  tabContent: { gap: 10, paddingBottom: 8 },
  contentTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  actCard: { borderRadius: 12, padding: 14, borderWidth: 1, gap: 8 },
  actType: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  actDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  invRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  invRight: { alignItems: "flex-end", gap: 6 },
  invAmt: { fontSize: 15, fontFamily: "Inter_700Bold" },
  empty: { alignItems: "center", paddingVertical: 32, gap: 10 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
