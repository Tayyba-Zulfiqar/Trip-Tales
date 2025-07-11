import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Users from "./src/Users/Pages/Users";
import NewPlaces from "./src/Places/Pages/NewPlaces";
import MainNavigation from "./src/Shared/Components/Navigations/MainNavigation";
import UserPlaces from "./src/Places/Pages/UserPlaces";
import UpdatePlace from "./src/Places/Pages/UpdatePlace";
import Auth from "./src/Users/Pages/Auth";

export default function App() {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact>
            <Users />
          </Route>
          <Route path="/:userId/places" exact>
            <UserPlaces />
          </Route>
          <Route path="/places/new" exact>
            <NewPlaces />
          </Route>
          <Route path="/places/:placeId">
            <UpdatePlace />
          </Route>
          <Route path="/auth">
            <Auth />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
}
