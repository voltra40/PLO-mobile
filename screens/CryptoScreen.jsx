import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CryptoScreen = () => {
	return (
		<View style={styles.container}>
			<Text> Crypto </Text>
		</View>
	);
};

export default CryptoScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
