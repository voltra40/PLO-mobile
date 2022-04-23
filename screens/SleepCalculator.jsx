import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const SleepCalculator = () => {
	const navigation = useNavigation();

	const back = () => {
		navigation.navigate("Root", { screen: "Sleep" });
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.heading}>
					<Text style={styles.headerText}>Sleep Calculator</Text>
				</View>
				<TouchableOpacity onPress={back} style={styles.close}>
					<Ionicons name="close-sharp" size={32} color="white" />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default SleepCalculator;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "white",
	},
	header: {
		alignSelf: "stretch",
		justifyContent: "center",
		flexDirection: "row",
		borderBottomWidth: 1,
		paddingVertical: "1%",
		backgroundColor: "black",
	},
	heading: {
		alignSelf: "center",
	},
	headerText: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
	},
	close: {
		position: "absolute",
		right: 0,
		top: "-1%",
	},
});
