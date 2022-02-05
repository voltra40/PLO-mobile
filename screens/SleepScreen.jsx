import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SleepScreen = () => {
	return (
		<View style={styles.container}>
			<Text> Sleep </Text>
		</View>
	);
};

export default SleepScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
