import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import Navigation from "./navigation";
import LinkingConfiguration from "./navigation/LinkingConfiguration";
import { useState } from "react";

const Stack = createNativeStackNavigator();

export default function App(props) {
	const [user, setUser] = useState();

	return (
		<SafeAreaProvider>
			<NavigationContainer linking={LinkingConfiguration}>
				<Stack.Navigator>
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="Home" options={{ headerShown: false }}>
						{(props) => <Navigation {...props} fullName={"TEST"} />}
					</Stack.Screen>
				</Stack.Navigator>
			</NavigationContainer>
			<StatusBar />
		</SafeAreaProvider>
	);
}
