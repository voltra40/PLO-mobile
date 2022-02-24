import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { auth, firebase } from "../firebase";

const BucketListScreen = () => {
	const [bucketList, setBucketList] = useState();
	const [item, setItem] = useState("");

	// firebase firestore collection
	const user = auth.currentUser;
	const bucketListRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("bucket list")
		.doc("my bucket list");

	useEffect(() => {
		// get current bucket list
		bucketListRef.onSnapshot((response) => {
			// check document exist
			if (response.exists) {
				const bucketList = response.data().items;
				setBucketList(bucketList);
				console.log(bucketList);
			} else {
				console.log("Document does not exist.");
			}
		});
	}, []);

	const addItem = () => {
		if (item === "") return;
		bucketListRef
			.update({
				items: firebase.firestore.FieldValue.arrayUnion(item),
			})
			.then(() => {
				// clear input
				setItem("");
				console.log("added to items");
			})
			.catch((error) => {
				alert(error);
			});
	};

	const deleteItem = (selectedItem) => {
		bucketListRef
			.update({
				items: firebase.firestore.FieldValue.arrayRemove(selectedItem),
			})
			.then(() => {
				console.log("deleted from items");
			})
			.catch((error) => {
				alert(error);
			});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Bucket List</Text>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder="add a bucket list item"
					value={item}
					onChangeText={(text) => setItem(text)}
					style={styles.input}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity onPress={addItem} style={styles.button}>
					<Text style={styles.buttonText}>Add</Text>
				</TouchableOpacity>
			</View>
			{bucketList ? (
				bucketList.map((item, index) => (
					<View stle={styles.bucketListContainer} key={index}>
						<Text>
							{index + 1}: {item}
						</Text>
						<View style={styles.buttonContainer}>
							<TouchableOpacity
								onPress={() => deleteItem(item)}
								style={styles.deleteButton}
							>
								<Text style={styles.buttonText}>Delete</Text>
							</TouchableOpacity>
						</View>
					</View>
				))
			) : (
				<Text> No items </Text>
			)}
		</View>
	);
};

export default BucketListScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {},
	bucketListContainer: {},
	deleteButton: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: "black",
	},
	inputContainer: {
		width: "80%",
	},
	input: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 5,
		margin: 5,
	},
	buttonContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: "black",
	},
	buttonText: {
		color: "white",
	},
});
