import React from "react";
import { StyleSheet, Text, View } from "react-native";

const HabitScreen = () => {
	return (
		<View style={styles.container}>
			<Text> Habits </Text>
		</View>
	);
};

export default HabitScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
