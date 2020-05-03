import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import RecPlaylistThumbnail from './RecPlaylistThumbnail';

export default class RecPlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }

      }

      componentDidMount() {
       
    };

      render() { 
        console.log('test');   
        return (
          <div className="Recommendations">
    
            <PageNavbar active="recommendations" apikey={this.props.apikey}/>
    
            <br></br>
            <h2>Basing Recommendations On: </h2>
            <div className="container">

          </div>

        </div>

        )};
}