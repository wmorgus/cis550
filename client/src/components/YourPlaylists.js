import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class YourPlaylists extends React.Component {
    constructor(props) {
        super(props);
      }

      componentDidMount() {
        console.log(this.props.apikey)
      }

      render() {    
        return (
          <div className="yourPlaylists">
    
            <PageNavbar active="yourPlaylists" apikey={this.props.apikey}/>
    
            <br></br>
        
        </div>
        )};
}