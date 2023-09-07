import Reactotron from "reactotron-react-native";

Reactotron.configure() // Configuration par défaut
  .useReactNative() // Ajoutez cette ligne pour React Native
  .connect();

export default Reactotron;
