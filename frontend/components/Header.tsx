import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

export default function Header() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  return (
    <View style={[styles.header, isMobile && styles.headerMobile]}>
      {/* Logo */}
      <TouchableOpacity onPress={() => router.push("/")}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={[styles.logo, isMobile && styles.logoMobile]}
            resizeMode="contain"
          />
          <Text style={[styles.title, isMobile && styles.titleMobile]}>GameStore</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4A00E3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  headerMobile: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 14,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  logoMobile: {
    width: 35,
    height: 35,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  titleMobile: {
    fontSize: 18,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  navItem: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
