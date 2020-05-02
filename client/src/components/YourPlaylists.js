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
        var name = 'defaultname'
        var picUrl = 'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1-744x744.jpg'
        
        fetch('http://localhost:8081/spotify/getPlaylists?apikey=' + this.props.apikey).then(response => response.json()).then((data) => {
          console.log(data)
          
        }).finally(() => {
          this.setState({
            name: name
          });
        });

      }

      render() {    
        return (
          <div className="yourPlaylists">
    
            <PageNavbar active="yourPlaylists" apikey={this.props.apikey}/>
    
            <br></br>
        
        </div>
        )};
}