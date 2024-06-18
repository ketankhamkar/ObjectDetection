import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import RNFS from 'react-native-fs';

const apiKey = 'AIzaSyDCqZtjTYvcEyv3OSWBotqAyGEg6v5MBMg';
const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

const Page = () => {
  const [imageUri, setImageUri] = useState('');
  const [data, setData] = useState([]);
  const pickImage = async () => {
    console.log('pick');
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });

    console.log('kk==', result.assets[0].uri);
    setImageUri(result.assets[0].uri);
  };
  const analizeImage = async () => {
    console.log('analize');
    const base64Data = await RNFS.readFile(imageUri, 'base64');
    console.log('base==', base64Data);
    try {
      const reqestDate = {
        requests: [
          {
            image: {
              content: base64Data,
            },
            features: [{type: 'LABEL_DETECTION', maxResults: 8}],
          },
        ],
      };
      const responce = await axios.post(apiUrl, reqestDate);
      // const axv = responce;
      // console.log('sadsa==', axv.data.responses[0].labelAnnotations);
      setData(responce.data.responses[0].labelAnnotations);
    } catch (err) {
      console.log('error', err);
    }
  };
  return (
    <View style={{flex: 1, alignItems: 'center', padding: 5}}>
      <Text style={{color: '#000', fontSize: 17}}>Cloud vision Api Demo</Text>
      {imageUri ? (
        <Image
          style={{height: 100, width: 100, padding: 10}}
          source={{uri: imageUri}}
        />
      ) : null}
      <TouchableOpacity
        onPress={pickImage}
        style={{backgroundColor: '#e3e2e1', padding: 8, margin: 10}}>
        <Text style={{color: '#000'}}>Choose An Image....</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={analizeImage}
        style={{backgroundColor: '#e3e2e1', padding: 8, margin: 10}}>
        <Text style={{color: '#000'}}>Analize Image</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        renderItem={({item}) => {
          return (
            <View>
              <Text style={{color: '#000'}}>{item.description}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Page;
