import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SongThumbnail from './SongThumbnail';
import PageNavbar from './PageNavbar';
import {Button, Table} from 'react-bootstrap';

export default class DatabasePlaylist extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        pid: '',
        resultSongs: [],
        tableHeader: ''
      }
    }

    componentDidMount() {
      //the react gods hate me right now.
      var id = window.location.href.split('/')[window.location.href.split('/').length - 1]
      var songThumbs = []
       fetch("http://localhost:8081/recommendations/tracks/" + id,
         {
           method: "GET"
         }).then(res => {
           return res.json();
         }, err => {
           console.log(err);
         }).then(data => {
           console.log('tracks found')
           //console.log('first val' + data.rows[0][0])
           console.log(data); //displays your JSON object in the console

           songThumbs = data.rows.map((songObj, i) =>
           <tr key = {i}>
             <td>{songObj[0]}</td>
             <td>{songObj[1]}</td>
           </tr> )
   
           var header = <thead><tr><th>Song Title</th><th>Artists</th></tr></thead>


           this.setState({
              pid: id,
              resultSongs: songThumbs,
              tableHeader: header
           });
          
         });
    
 
    }

   

    render() {    
      document.body.style = 'background: linear-gradient(120deg,#EC8BDA,#22C3DD);'
      return (
        <div className="playlist" style={{
        background: 'linear-gradient(120deg,#EC8BDA,#22C3DD)',
      }}>
          <PageNavbar active="recommendations" apikey={this.props.apikey} />
          <h2>Track List for Recommended Playlist {this.state.pid}</h2> 
          <div className="container">

         <br></br>
         <Table bordered striped hover style={{
        backgroundColor: 'white',
      }}>
                 {this.state.tableHeader}
               <tbody>
               {this.state.resultSongs}
               </tbody>
           </Table>
     
       </div>
        </div>
         
    
    )};
}