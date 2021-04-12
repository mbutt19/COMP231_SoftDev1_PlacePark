import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              TabOneScreen: 'Home',
            },
          },
          Map: {
            screens: {
              TabTwoScreen: 'Map',
            },
          },
          Search: {
            screens: {
              TabThreeScreen: 'Search',
            },
          },
          Account: {
            screens: {
              TabFourScreen: 'Account',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
