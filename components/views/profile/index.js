import React from 'react'
import { View } from "react-native"
import { Avatar, Button, TextInput } from 'react-native-paper';

const Profile = ({navigation}) => { 
    const [formData, setFormData] = React.useState({
        email: '',
        firstName: '',
        lastName: '',
    });
    return (
        <View style={{alignItems: "center", paddingTop: 16}}>
            <Avatar.Image size={100} source={require('../../../assets/adaptive-icon.png')} />
            <View style={{ padding: 16, flexDirection: "row"}}>
                <TextInput
                label="First Name"
                value={formData.firstName}
                style={{ flex: 1}}
                onChangeText={text => setFormData({...formData, email: text})}
                />
                
            </View>
            <View style={{ padding: 16, flexDirection: "row"}}>
                <TextInput
                label="Last Name"
                value={formData.lastName}
                style={{ flex: 1}}
                onChangeText={text => setFormData({...formData, email: text})}
                />
                
            </View>
            <View style={{ padding: 16, flexDirection: "row"}}>
                <TextInput
                label="Email"
                value={formData.email}
                style={{ flex: 1}}
                onChangeText={text => setFormData({...formData, email: text})}
                />
                
            </View>
            <View style={{ padding: 16, flexDirection: "row"}}>
                <Button icon="floppy" mode="contained" onPress={() => {}}>Save</Button>
          </View>
        </View>
    )
}
export default Profile