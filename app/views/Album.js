import React, { Component } from "react";
import { Image, ImageBackground, View, StyleSheet, Text, TouchableHighlight, FlatList } from "react-native";
import { List, ListItem } from "react-native-elements";
import Config from 'react-native-config'

class Album extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = Config.API_URL + `/api/sucol/artist/albums`;
    console.log(url)

    this.setState({ loading: true });

    fetch(url, {
      method: 'POST',
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        // data: page === 1 ? res.results : [...this.state.data, ...res.results],
        data : res,
        error: res.error || null,
        loading: false,
        refreshing: false
      });
    })
    .catch(error => {
      this.setState({ error, loading: false });
    });
  };

  playAlbum = () => {
    console.log('playAlbum')

    //this.props.navigation('Player');
  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View>
      <FlatList
      data={this.state.data}
      renderItem={({ item }) => (
        <TouchableHighlight onPress={() => navigate('Player', {songs: item.songs})} activeOpacity={ 100 }>
          <ImageBackground
          style={ styles.albumBackgroundImage }
          resizeMode='cover'
          source={{uri: item.cover_image }}
          >
            <View style={ styles.container }>
              <Text style={ styles.artistName }>{ item.name }</Text>
            </View>
          </ImageBackground>
        </TouchableHighlight>
      )}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingTop: 20,
    paddingBottom: 60,
    paddingLeft: 20,
    paddingRight: 20,
    height: 200,
  },
  albumBackgroundImage: {
    flex: 1,
    height: 200,
  },
  artistName: {
    color: "#FFF",
    backgroundColor: 'transparent',
    fontWeight: "500",
    fontSize: 18,
    marginBottom: 5
  },
  artistSongs: {
    color: "#CCC",
    backgroundColor: 'transparent',
    fontWeight: "300",
    fontSize: 14
  },
});

export default Album;
