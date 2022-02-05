import { StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Bucket List</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {},
});
