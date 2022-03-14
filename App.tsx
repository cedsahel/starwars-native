import React, { useState, useEffect } from "react"
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

function Home({ navigation }: any) {
	return (
		<View style={styles.container}>
			<Text style={styles.logo}>Starwars API</Text>
			<Button
				title="Go to detail"
				onPress={() => navigation.navigate('characters')}
			/>
		</View>
	);
}


function Characters({ navigation }) {

	const [loading, setLoading] = useState(true)
	const [characters, setCharacters] = useState([])
	const [page, setPage] = useState(1)

	const next = (e: Event) => {
		e.preventDefault()
		if (page < 9)
			setPage(page => page + 1)
	}

	const prev = (e: Event) => {
		e.preventDefault()
		if (page > 1) {
			setPage(page => page - 1)
		}
	}

	const getCharacters = async () => {
		try {
			setLoading(true)
			const response = await fetch(`https://swapi.dev/api/people/?page=${page}`)
			const json = await response.json()
			setCharacters(json)
		} catch (error) {
			console.error(error)

		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getCharacters()

	}, [page])

	return (

		<View style={styles.container}>
			{
				loading ?
					<Text style={{color:"#FFF"}}>Chargement...</Text>
					:
					<>
						<FlatList
							data={characters?.results}
							renderItem={({ item }) => <View style={styles.item}><TouchableOpacity onPress={() => navigation.navigate('character', { params: item.url.slice(29, -1) })}><Text style={{ color: "#000", textAlign: "center" }} >{item.name}</Text></TouchableOpacity></View>}
							keyExtractor={item => item.url}
						/>

						<View style={{ marginBottom: 20, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
							<TouchableOpacity onPress={prev}>
								<Text style={{ color: "#FFF", fontSize: 40, marginHorizontal: 20, textAlign: "center" }}>{"<"}</Text>
							</TouchableOpacity>
							<Text style={{ color: "#FFF", fontSize: 30 }}>{page}</Text>
							<TouchableOpacity onPress={next}>
								<Text style={{ color: "#FFF", fontSize: 40, marginHorizontal: 20, textAlign: "center" }}>{">"}</Text>
							</TouchableOpacity>
						</View>

					</>
			}
		</View>

	);
}

function Character({ route }) {

	const { params } = route.params
	const [loading, setLoading] = useState(true)
	const [character, setCharacter] = useState()

	const getCharacter = async () => {
		try {
			const response = await fetch(`https://swapi.dev/api/people/${params}/`);
			const json = await response.json()
			setCharacter(json)
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getCharacter()
	}, [])


	return (

		<View style={styles.container}>
			{loading ?
				<Text style={{ color: "#FFF" }}>Chargement...</Text>
				:
				<Text style={{ color: "#FFF" }}>{JSON.stringify(character)}</Text>

			}
		</View>

	);
}




export default function App() {

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
				<Stack.Screen name="characters" component={Characters} />
				<Stack.Screen name="character" component={Character} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20

	},
	logo: {
		fontSize: 60,
		color: "yellow",
		textAlign: "center"
	},
	image: {
		flex: 1,
		justifyContent: "center",
		width: "100%"
	},
	item: {
		margin: 20,
		backgroundColor: "yellow",
		width: 200,
		height: 50,
		display: "flex",
		justifyContent: "center"

	}
});
