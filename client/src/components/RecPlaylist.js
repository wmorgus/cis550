import React from 'react';
import '../style/RecPlaylist.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import {Button, Table} from 'react-bootstrap';

export default class RecPlaylist extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        playlistObj: {images: [{url: ''}], name: '', owner: {display_name: ''}, description: ''},
        playlistid: "", 
        playlistObjs: [],
        selectedRecType: "song",
        recTypes: ['song', 'playlist', 'popular'],
        resultSongs: [],
        qualityObj: {energy: 'loading...', danceability: 'loading...', loudness: 'loading...', acousticness: 'loading...', valence: 'loading...'},
        info: "",
        tableHeader : [],
        loaded: "false"
      }

      this.exampleRecRoute = this.exampleRecRoute.bind(this);
      this.dropdownDivs = this.dropdownDivs.bind(this);
      this.submitRecType = this.submitRecType.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.lookupPlaylist = this.lookupPlaylist.bind(this);
      this.playListRecWrapper = this.playListRecWrapper.bind(this);
    }

    componentDidMount() {
      var id = window.location.href.split('/')[window.location.href.split('/').length - 1]
      console.log(this.props.apikey)
      var playlists = []
      var newObj = {}
      console.log(id)
      
      //request info about the current playlist
      fetch('http://localhost:8081/spotify/getPlaylist?apikey=' + this.props.apikey + '&id=' + id).then(response => response.json()).then((data) => {

        newObj = data
      //  console.log(data)

      }).finally(() => {
        this.setState({
          playlistid: id, 
          playlistObj: newObj
        });
      });

      //calculate stats for the current playlist
      
      fetch("http://localhost:8081/recommendations/avg/" + id,
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(data => {
          if(data.rows[0]) {
          console.log('averages found')
          //console.log('first val' + data.rows[0][0])
          console.log(data); //displays your JSON object in the console
          this.setState({
            qualityObj : {energy: data.rows[0][0], danceability: data.rows[0][1], loudness: data.rows[0][2], acousticness: data.rows[0][3], valence: data.rows[0][4]},
            loaded: true
          });
          //console.log(this.state.qualityObj)
        } else {
          this.setState({
            info: 'Looks like this playlist is still being uploaded. Please check back later.',
            loaded: false
          });
        }
        });
    }

    utf8_to_str(a) {
      return(a)
    }

    dropdownDivs(types) {
		//	console.log(types);
      let typesDivs = types.map((typeStr, i) =>
      <option key={i} value={typeStr}>{typeStr}</option>
      );  
      return typesDivs; 
    }

    submitRecType() {
      var selectedType = this.state.selectedRecType;
      if(selectedType) {
        if(this.state.loaded) {
        this.exampleRecRoute(selectedType)
        }
      }
    }

    handleChange(e) {
      this.setState({
        selectedRecType: e.target.value
      });
      //console.log('changed state to: ' + this.state.selectedRecType)
    }

    exampleRecRoute(selectedType) {
    console.log('fetching data for selected type: ' + selectedType)
    var songThumbs = []

    switch(selectedType) {
      case "song":
  
      //build fetch url string here to allow for custom attribute inclusion
      var songThumbs = []
     
      fetch("http://localhost:8081/recommendations/bysong?pid=" + this.state.playlistid
      + "&energy=" + this.state.qualityObj.energy + "&danceability=" + this.state.qualityObj.danceability
      + "&loudness=" + this.state.qualityObj.loudness + "&acousticness=" + this.state.qualityObj.acousticness
      + "&valence=" + this.state.qualityObj.valence,

        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(data => {
          console.log('data: ')
          console.log(data); //displays your JSON object in the console
          
        songThumbs = data.rows.map((songObj, i) =>
        <tr key = {i}>
          <td>{songObj[0]}</td>
          <td>{songObj[1]}</td>
        </tr> )

        var header = <thead><tr><th>Song Title</th><th>Artists</th></tr></thead>

          //This saves our HTML representation of the data into the state, which we can call in our render function
          //this.state.movies = moviesList;
          this.setState({
         
            resultSongs: songThumbs,
            tableHeader: header,
            info : "Use Spotify audio features to generate a list of songs you might like by querying for songs that are similar to those in this playlist."
          });
        });
        break;

      
      case "popular":
 
        fetch("http://localhost:8081/recommendations/bypopular?pid=" + this.state.playlistid
        + "&energy=" + this.state.qualityObj.energy + "&danceability=" + this.state.qualityObj.danceability
        + "&loudness=" + this.state.qualityObj.loudness + "&acousticness=" + this.state.qualityObj.acousticness
        + "&valence=" + this.state.qualityObj.valence,
  
          {
            method: "GET"
          }).then(res => {
            return res.json();
          }, err => {
            console.log(err);
          }).then(data => {
            console.log('data: ')
            console.log(data); //displays your JSON object in the console
      
 
            //todo? for every song in the result, get the spotify info to display 
 
          
        songThumbs = data.rows.map((songObj, i) =>
        <tr key = {i}>
          <td>{songObj[0]}</td>
          <td>{songObj[1]}</td>
        </tr> )

        var header = <thead><tr><th>Song Title</th><th>Artists</th></tr></thead>
            //This saves our HTML representation of the data into the state, which we can call in our render function
            //this.state.movies = moviesList;
            this.setState({
              resultSongs: songThumbs, 
              tableHeader: header,
              info : "Use Spotify audio features to generate a list of top 100 songs you might like by querying for songs that are similar to those in this playlist."
            });
          });

        break;


        case "playlist":   
        

          var songThumbs = []
          var tempPlaylists = []
     
          fetch("http://localhost:8081/recommendations/byplaylist/" + this.state.playlistid,
          {
            method: "GET"
          }).then(res => {
            return res.json();
          }, err => {
            console.log(err);
          }).then(data => {
          
            tempPlaylists = data.rows
            console.log(tempPlaylists)

            var header = <thead><tr><th>Playlist ID</th><th>Track List</th></tr></thead>
            
            
            songThumbs = data.rows.map((songObj, i) =>
            <tr key = {i}>
              <td>{songObj[0]}</td>
              <td><Button variant="btn btn-success"  href={"http://localhost:3000/recommendations/results/" + songObj[0]}>Go to Tracklist</Button></td>
            </tr> )
            

            /*
            data.rows.forEach(row => {
              var linkAddress = "http://localhost:3000/results/" + row[0]
              songThumbs.push(null)
            })
*/

            this.setState({ 
              resultSongs: songThumbs, 
              tableHeader: header,
              info : "Find existing playlists similar to this one."  
            });
          });
            
       
         break;

      default:
        console.log('selected type not recognized');
    } 
 
    }

    async playListRecWrapper() {
      //need to make this first fetch async 
      var songThumbs = []
      var tempPlaylists = []
      const response = await fetch("http://localhost:8081/recommendations/byplaylist/" + this.state.playlistid,
      {
        method: "GET"
      })
      const data = await response.json();
      tempPlaylists = data.rows
        console.log(tempPlaylists)

        var header = <thead><tr><th>Playlist Title</th></tr></thead>



        this.setState({ 
          playlistObjs: tempPlaylists, 
          tableHeader: header,
          info : "Find existing playlists similar to this one."  
        });
      
      /*
      .then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(data => {
      
        tempPlaylists = data.rows
        console.log(tempPlaylists)

        var header = <thead><tr><th>Playlist Title</th></tr></thead>



        this.setState({ 
          playlistObjs: tempPlaylists, 
          tableHeader: header,
          info : "Find existing playlists similar to this one."  
        });
      });
*/

      this.state.playlistObjs.forEach(resultPlaylist =>  this.lookupPlaylist(resultPlaylist, songThumbs))
 
    }

    lookupPlaylist(results, output) {

      fetch('http://localhost:8081/spotify/getPlaylist?apikey=' + this.props.apikey + '&id=' + results[0],
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(data => {
          console.log('here in lookupPlaylist')
          console.log(data)
            /*
        songThumbs = data.rows.map((songObj, i) =>
        <tr key = {i}>
          <td>{songObj[0]}</td>
        </tr> )
        */
          
        });
      }


    render() {    
      return (
        <div className="playlist">
          <PageNavbar active="yourPlaylists" apikey={this.props.apikey} />

   
        <div class="pageHeader"  style={{margin: "30px", display: "flex"}}>
         
           
         
        
          <div class="namediv" >
      
            <br></br>
          <h2> Basing Recommendations On: </h2>
           
            <img src={this.state.playlistObj.images[0].url}  width="100" height="100"/>
              <div class = "descriptiondiv">
              <h4>{this.state.playlistObj.name}</h4>
              <h5>By {this.state.playlistObj.owner.display_name}</h5>
              <p>{this.utf8_to_str(this.state.playlistObj.description)}</p>
              </div>
        
         
          </div>
          <div class="header" style={{margin: "30px", display: "flex"}}>
          
          
    
            <div class="stat div">
              <h2>Average attributes for this playlist: </h2>
               <div>energy: {this.state.qualityObj.energy}</div>
              <div>danceability: {this.state.qualityObj.danceability}</div>
              <div>loudness: {this.state.qualityObj.loudness}</div>
              <div>valence: {this.state.qualityObj.valence}</div>
              <div>acousticness: {this.state.qualityObj.acousticness}</div>
            </div>
            </div>
            
            <div className="years-container">
			          <div className="dropdown-container">
                <br></br>
                <br></br>
			            <select value={this.state.selectedRecType} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	{this.dropdownDivs(this.state.recTypes)}
			            </select>
			            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitRecType}>Submit</button>
			          </div>
			  
            </div>
            </div>
     
          <div className="container">
            <br></br>
            <h5>{this.state.info}</h5>
            <br></br>
            <Table bordered striped hover>
                    {this.state.tableHeader}
                  <tbody>
                  {this.state.resultSongs}
                  </tbody>
              </Table>
        
          </div>
          </div>
      
    )};
}