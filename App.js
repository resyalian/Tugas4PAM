import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Button,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Audio } from 'expo-av';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const today = new Date();
  const [sound, setSound] = React.useState();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [date, setDate] = useState(new Date(today));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('./assets/adzan.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }

    React.useEffect(() => {
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync(); }
        : undefined;
    }, [sound]);

  useEffect(() => {
    let today = new Date();
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <View style={{flex: 1}}>
      <View style={{margin: '10%', backgroundColor: 'cyan', height: '90%', marginTop: '15%'}}>
        <View style={{height: '15%', justifyContent: 'center', alignItems: 'center', marginTop: '10%'}}>
          <Text style={{fontSize: 70, fontWeight: 'bold', color: 'green'}}>Solat kuy</Text>
        </View>
        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '800'}}>Sekarang waktu :</Text>
        <View style={{height: '15%', justifyContent: 'center', alignItems: 'center', marginTop: '5%', marginBottom: '10%'}}>
          <Text style={{fontSize: 35, color: 'navy', textAlign: 'center'}}>{date.toLocaleString()}</Text>
        </View>
        <Button title="Push Notification" onPress={async () => {
              await schedulePushNotification();
            }} />
        <View style={{marginTop: '5%'}}>
            <Button title="Play Sound" onPress={playSound} /> 
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </View>
    </View>
  )
};

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Solat kuy",
      body: 'Sudah waktunya solat gan',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

}

export default App;