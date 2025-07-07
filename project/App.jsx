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
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
}
