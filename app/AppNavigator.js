import { createStackNavigator, createAppContainer } from 'react-navigation';
import Album from './views/Album';
import Player from './views/Player';

const AppNavigator = createStackNavigator(
  {
    Album: {
      screen: Album,
      navigationOptions: {
        headerTitle: "앨범"
      }
    },
    Player: {
      screen: Player,
      navigationOptions: {
        headerTitle: "재생"
      }
    },
  },
);

const App = createAppContainer(AppNavigator);

export default App;
