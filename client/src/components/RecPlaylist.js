import React from 'react';
import '../style/RecPlaylist.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import {Button, Table, Dropdown} from 'react-bootstrap';

export default class RecPlaylist extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        playlistObj: {images: [{url: ''}], name: '', owner: {display_name: ''}, description: ''},
        playlistid: "", 
        playlistObjs: [],
        selectedRecType: "song",
        recTypes: ['song', 'playlist', 'popular'],
        recDescriptions: ['Find any similar songs', 'Find similar playlists', 'Find similar popular songs'],
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

    dropdownDivs(types, descriptions) {
      let typesDivs = types.map((typeStr, i) =>
        <Dropdown.Item onClick={this.submitRecType} id={typeStr}>{descriptions[i]}</Dropdown.Item>
      );
      return typesDivs; 
    }

    submitRecType(event) {
      if (event.target.id) {
        if (this.state.loaded) {
         this.exampleRecRoute(event.target.id)
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
              <td><Button variant="btn btn-info"  href={"http://localhost:3000/recommendations/results/" + songObj[0]}>Go to Tracklist</Button></td>
            </tr> 
          )

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
          
        });
      }


    render() {    
      document.body.style = 'background: linear-gradient(120deg,#EC8BDA,#22C3DD);'
      return (
        <div className="playlist" style={{
          background: 'linear-gradient(120deg,#EC8BDA,#22C3DD)',
        }}>
          <PageNavbar active="yourPlaylists" apikey={this.props.apikey} />

   
        <div className="container">
          <div className="header-container">
            <div style={{gridColumn: '1 / 2', gridRow: '1/4'}}>
              <img src={this.state.playlistObj.images[0].url}  style={{height: "300px", width: "300px", objectFit: "cover", overflow: "none"}}/>
            </div>
            <div style={{gridColumn: '2 / 4', gridRow: '1/2'}}>
              <h2> Basing recommendations on: <b>{this.state.playlistObj.name}</b></h2>
            </div>
            <div style={{gridColumn: '2 / 4', gridRow: '2/2'}}>
              <p>{this.utf8_to_str(this.state.playlistObj.description)}</p>
            </div>
            <div style={{gridColumn: '2 / 3', gridRow: '3/4'}}>
              <h4>Average attributes for this playlist: </h4>
              <div>energy: {Math.round(this.state.qualityObj.energy * 1000) / 1000}</div>
              <div>danceability: {Math.round(this.state.qualityObj.danceability * 1000) / 1000}</div>
              <div>loudness: {Math.round(this.state.qualityObj.loudness * 1000) / 1000}</div>
              <div>valence: {Math.round(this.state.qualityObj.valence * 1000) / 1000}</div>
              <div>acousticness: {Math.round(this.state.qualityObj.acousticness* 1000) / 1000}</div>
            </div>
            <div style={{gridColumn: '3 / 4', gridRow: '3/4'}}>
              {/* <select value={this.state.selectedRecType} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
                
              </select>
              <Button variant="btn btn-success" onClick={this.submitRecType} style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Submit</Button> */}

              <Dropdown style={{display: 'flex', justifyContent: 'center'}}>
                <Dropdown.Toggle variant="info" id="dropdown-basic" style={{borderColor: "#ffffff"}}>
                  Choose recommendation type
                </Dropdown.Toggle>
                <Dropdown.Menu style={{width: "75%"}}>
                  {this.dropdownDivs(this.state.recTypes, this.state.recDescriptions)}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
     
          <div className="container" style={{paddingBottom: '10px'}}>
            <br></br>
            <h5>{this.state.info}</h5>
            <br></br>
            <Table style={{backgroundColor:"white"}} bordered striped hover>
                    {this.state.tableHeader}
                <tbody>
                  {this.state.resultSongs}
                </tbody>
            </Table>
          </div>
        </div>
      </div>
    )};
}