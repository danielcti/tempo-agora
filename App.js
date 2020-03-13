import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Keyboard } from 'react-native';
import axios from 'axios';

export default function App() {
  const [cityInput, setCityInput] = useState('');
  const [data, setData] = useState([]);

    async function fetchData() {
      const cityResponse = await axios.get(
        `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=UA5VVpQ6HNr1w5Cs1lkbzir95p6UBWoM&q=${cityInput}&language=pt-br`);
      const cityData = cityResponse.data[0];
      
      const weatherResponse = await axios.get(
        `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityData.Key}?apikey=UA5VVpQ6HNr1w5Cs1lkbzir95p6UBWoM&language=pt-br&metric=true`
      )
      setData(weatherResponse.data.DailyForecasts);
    }

    function parseDate(date) {
      const day = date.slice(8,10);
      const month = date.slice(5,7);

      return `${day}/${month}`;
    }

    function Item({ item }) {
      const date = item.Date;
      const parsedDate = parseDate(date);

      return (
        <View style={styles.item} id={1}>
          <Text style={styles.title}>{parsedDate}</Text>
          <Text style={styles.title}>Máx: {item.Temperature.Maximum.Value}ºC</Text>
          <Text style={styles.title}>Min: {item.Temperature.Minimum.Value}ºC</Text>
        </View>
      );
    }

    function onSubmitEdit() {
      Keyboard.dismiss();
      fetchData();
    }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text>Digite o nome da cidade desejada:</Text>
        <View style={styles.tInputView}>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setCityInput(text)}
          value={cityInput}
          onSubmitEditing={onSubmitEdit}
        />
        </View>
        <TouchableOpacity style={styles.btn} onPress={onSubmitEdit}>
          <Text style={styles.btnText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      { (data.length > 0) && 
      <FlatList
        style={styles.weathersList}
        data={data}
        renderItem={({item})  => <Item item={item} />}
        keyExtractor={item => item.EpochDate.toString()}
        horizontal={true}
      />
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 40,
    flex: 1,
  },
  formContainer: {
    alignItems: 'center',
  },
  tInputView: {
    width: 300
  },
  textInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    borderRadius: 6,
    padding: 8,
    marginTop: 10,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#7159c1',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 20,
  },
  btnText: {
    color: '#fff'
  },
  weathersList: {
    flexGrow: 0,
    alignSelf: 'stretch',
  },
  item: {
    marginHorizontal: 5,
    backgroundColor: '#5a5a5a',
    padding: 5
  },
  title: {
    color: '#fafafa',
  }
});
