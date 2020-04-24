import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class Time extends React.Component {
    constructor(props) {
        super(props);
      }

      componentDidMount() {
      }

      render() {    
        return (
          <div className="Time">
    
            <PageNavbar active="time" />
    
            <br></br>
        
        </div>
        )};
}