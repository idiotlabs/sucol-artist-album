'use strict';
import React from 'react';
import {
  AppRegistry,
  Component,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from 'react-native-slider';
import Video from 'react-native-video';

const window = Dimensions.get('window');

export default class Plyaer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      playing: true,
      muted: false,
      shuffle: false,
      currentTime: 0,
      songIndex: 0,
      sliding: false,
      songs: props.navigation.state.params.songs,
    };
  }

  onLoad(params){
    // 전체 시간 가져오기
    this.setState({ songDuration: params.duration });
    console.log(params.duration);
  }

  setTime(params){
    // 현재 시간 실시간 업데이트
    if( !this.state.sliding ){
      this.setState({ currentTime: params.currentTime });
    }
  }

  onEnd(){
    this.setState({ playing: false });
  }

  onSlidingStart(){
    this.setState({ sliding: true });
  }

  onSlidingComplete(){
    this.refs.audio.seek( this.state.currentTime );
    this.setState({ sliding: false });
  }

  onSlidingChange(value){
    let newPosition = value * this.state.songDuration;
    this.setState({ currentTime: newPosition });
  }

  togglePlay(){
    this.setState({ playing: !this.state.playing });
  }

  toggleVolume(){
    this.setState({ muted: !this.state.muted });
  }

  toggleShuffle(){
    this.setState({ shuffle: !this.state.shuffle });
  }

  goBackward(){
    if(this.state.currentTime < 3 && this.state.songIndex !== 0 ){
      this.setState({
        songIndex: this.state.songIndex - 1,
        currentTime: 0,
      });
    } else {
      this.refs.audio.seek(0);
      this.setState({
        currentTime: 0,
      });
    }
  }

  goForward(){
    this.setState({
      songIndex: this.state.shuffle ? this.randomSongIndex() : this.state.songIndex + 1,
      currentTime: 0,
    });
    this.refs.audio.seek(0);
  }

  render() {
    // console.log(this.props.navigation.state.params.songs)
    console.log(this.state.songs)

    let songPlaying = this.state.songs[this.state.songIndex];
    let songPlayingUrl = songPlaying.url;

    //let image = songPlaying.albumImage ? songPlaying.albumImage : this.props.artist.background;
    //let image = "https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg";
    let image = songPlaying.image;
    console.log(image)

    let songPercentage;
    if( this.state.songDuration !== undefined ) {
      songPercentage = this.state.currentTime / this.state.songDuration;
    } else {
      songPercentage = 0;
    }

    // button list
    let playButton;
    if( this.state.playing ){
      playButton = <Icon onPress={ this.togglePlay.bind(this) } style={ styles.play } name="ios-pause" size={70} color="#fff" />;
    } else {
      playButton = <Icon onPress={ this.togglePlay.bind(this) } style={ styles.play } name="ios-play" size={70} color="#fff" />;
    }

    let forwardButton;
    if( !this.state.shuffle && this.state.songIndex + 1 === this.state.songs.length ){
    // if (true) {
      forwardButton = <Icon style={ styles.forward } name="ios-skip-forward" size={25} color="#333" />;
    } else {
      forwardButton = <Icon onPress={ this.goForward.bind(this) } style={ styles.forward } name="ios-skip-forward" size={25} color="#fff" />;
    }

    let shuffleButton;
    if( this.state.shuffle ){
      shuffleButton = <Icon onPress={ this.toggleShuffle.bind(this) } style={ styles.shuffle } name="ios-shuffle" size={18} color="#f62976" />;
    } else {
      shuffleButton = <Icon onPress={ this.toggleShuffle.bind(this) } style={ styles.shuffle } name="ios-shuffle" size={18} color="#fff" />;
    }

    let volumeButton;
    if( this.state.muted ){
      volumeButton = <Icon onPress={ this.toggleVolume.bind(this) } style={ styles.volume } name="ios-volume-off" size={18} color="#fff" />;
    } else {
      volumeButton = <Icon onPress={ this.toggleVolume.bind(this) } style={ styles.volume } name="ios-volume-high" size={18} color="#fff" />;
    }

    return (
      <View style={styles.container}>
        <Video source={{uri: songPlayingUrl }}
          ref="audio"
          volume={ this.state.muted ? 0 : 1.0}
          muted={false}
          paused={!this.state.playing}
          onLoad={ this.onLoad.bind(this) }
          onProgress={ this.setTime.bind(this) }
          onEnd={ this.onEnd.bind(this) }
          resizeMode="cover"
          repeat={false}/>

        <View style={ styles.header }>
          <Text style={ styles.headerText }>
            {}
          </Text>
        </View>
        <View style={ styles.headerClose }>

        </View>
        <Image
          style={ styles.songImage }
          source={{uri: image,
                        width: window.width - 30,
                        height: 300}}/>
        <Text style={ styles.songTitle }>
          { songPlaying.title }
        </Text>
        <Text style={ styles.albumTitle }>
          { songPlaying.artist }
        </Text>

        <View style={ styles.sliderContainer }>
          <Slider
            onSlidingStart={ this.onSlidingStart.bind(this) }
            onSlidingComplete={ this.onSlidingComplete.bind(this) }
            onValueChange={ this.onSlidingChange.bind(this) }
            minimumTrackTintColor='#851c44'
            style={ styles.slider }
            trackStyle={ styles.sliderTrack }
            thumbStyle={ styles.sliderThumb }
            value={ songPercentage }/>

          <View style={ styles.timeInfo }>
            <Text style={ styles.time }>{ formattedTime(this.state.currentTime)  }</Text>
            <Text style={ styles.timeRight }>- { formattedTime( this.state.songDuration - this.state.currentTime ) }</Text>
          </View>
        </View>

        <View style={ styles.controls }>
          { shuffleButton }
          <Icon onPress={ this.goBackward.bind(this) } style={ styles.back } name="ios-skip-backward" size={25} color="#fff" />
          { playButton }
          { forwardButton }
          { volumeButton }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    marginTop: 17,
    marginBottom: 17,
    width: window.width,
  },
  headerClose: {
    position: 'absolute',
    top: 10,
    left: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    textAlign: 'center',
  },
  songImage: {
    marginBottom: 20,
  },
  songTitle: {
    color: "white",
    fontFamily: "Helvetica Neue",
    marginBottom: 10,
    marginTop: 13,
    fontSize: 19
  },
  albumTitle: {
    color: "#BBB",
    fontFamily: "Helvetica Neue",
    fontSize: 14,
    marginBottom: 20,
  },
  sliderContainer: {
    width: window.width - 40,
  },
  slider: {
    height: 20,
  },
  sliderTrack: {
    height: 2,
    backgroundColor: '#333',
  },
  sliderThumb: {
    width: 10,
    height: 10,
    backgroundColor: '#f62976',
    borderRadius: 10 / 2,
    shadowColor: 'red',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  timeInfo: {
    flexDirection: 'row',
  },
  time: {
    color: '#FFF',
    flex: 1,
    fontSize: 10,
  },
  timeRight: {
    color: '#FFF',
    textAlign: 'right',
    flex: 1,
    fontSize: 10,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 30,
  },
  back: {
    marginTop: 22,
    marginLeft: 45,
  },
  play: {
    marginLeft: 50,
    marginRight: 50,
  },
  forward: {
    marginTop: 22,
    marginRight: 45,
  },
  shuffle: {
    marginTop: 26,
  },
  volume: {
    marginTop: 26,
  },
});

function withLeadingZero(amount){
  if (amount < 10 ){
    return `0${ amount }`;
  } else {
    return `${ amount }`;
  }
}

function formattedTime( timeInSeconds ){
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;

  if( isNaN(minutes) || isNaN(seconds) ){
    return "";
  } else {
    return(`${ withLeadingZero( minutes ) }:${ withLeadingZero( seconds.toFixed(0) ) }`);
  }
}
