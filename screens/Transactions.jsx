import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Transactions = () => {
	const navigation = useNavigation();

	useEffect(() => {}, []);

	const back = () => {
		navigation.navigate("Root", { screen: "TabFour" });
	};

	return (
		<View style={styles.container}>
			<Text>hello world</Text>
			<TouchableOpacity onPress={back} style={styles.backButton}>
				<Text style={styles.buttonText}>Back</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Transactions;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	backButton: {
		alignSelf: "flex-start",
		position: "absolute",
		bottom: "5%",
		backgroundColor: "black",
		padding: 5,
		borderRadius: 5,
		marginLeft: "5%",
	},
	buttonText: {
		textAlign: "center",
		fontSize: 20,
		color: "white",
	},
});
