import { Button, Text, View } from "react-native"

const Home = ({navigation}) => { 
    return (
        <View>
            <Text>Welcome</Text>
            <Button title="Profile"  onPress={() => navigation.navigate('Profile')}>
                
            </Button>
        </View>
    )
}
export default Home