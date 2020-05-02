import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import DashboardMovieRow from './DashboardMovieRow';

export default class Landing extends React.Component {

  render() {    
    return (
      <div className="Landing">
        <p>landing page</p>
        <a href="http://localhost:8081/login">login button</a><br></br>
        <a href="http://localhost:8081/totalRestart">nuke</a>
      </div>
    );
  }
}