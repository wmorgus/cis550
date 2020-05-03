import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import TopSongRow from './TopSongRow';

export default class RecPlaylist extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        playlistObj: {images: [{url: ''}], name: '', owner: {display_name: ''}, description: ''},
        playlistid: "", 
        songThumbnails: [],
        selectedRecType: "",
        recTypes: ['song', 'playlist', 'popular'],
        resultSongs: [],
        info: ""
      }

      this.exampleRecRoute = this.exampleRecRoute.bind(this);
      this.dropdownDivs = this.dropdownDivs.bind(this);
      this.submitRecType = this.submitRecType.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      var id = window.location.href.split('/')[window.location.href.split('/').length - 1]
      console.log(this.props.apikey)
      var playlists = []
      var newObj = {}
      console.log(id)
      
      fetch('http://localhost:8081/spotify/getPlaylist?apikey=' + this.props.apikey + '&id=' + id).then(response => response.json()).then((data) => {

        newObj = data
        console.log(data)

      }).finally(() => {
        this.setState({
          playlistid: id, 
          playlistObj: newObj
        });
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
        this.exampleRecRoute(selectedType)
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

    switch(selectedType) {
      case "song":
       
        fetch("http://localhost:8081/recommendations/bysong/" + this.state.playlistid,
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(data => {
          console.log('data: ')
          console.log(data); //displays your JSON object in the console
          /*
          let recs = moviesList.map((movie, i) => 
           <TopSongRow  />
          );
    */
          //This saves our HTML representation of the data into the state, which we can call in our render function
          //this.state.movies = moviesList;
          this.setState({
            resultSongs: [],
            info : "Use Spotify audio features to generate a list of songs you might like by querying for songs that are similar to those in this playlist."
          });
        });
        break;

      case "playlist":   
        
        fetch("http://localhost:8081/recommendations/byplaylist/" + this.state.playlistid,
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(data => {
          console.log(data); //displays your JSON object in the console
          this.setState({
            resultSongs: [], 
            info : "Find existing playlists similar to this one made by other users."  
          });
        });

        break;

      case "popular":
     
        fetch("http://localhost:8081/recommendations/bypopular/" + this.state.playlistid,
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(data => {
          console.log(data); //displays your JSON object in the console
          this.setState({
            resultSongs: [],
            info : "Use Spotify audio features to generate a list of songs you might like by querying for songs that made the Top 100 and are similar to those in this playlist."
          });
        });

        break;
      default:
        console.log('selected type not recognized');
    } 
 
    }

    render() {    
      return (
        <div className="playlist">
          <PageNavbar active="recommendations" apikey={this.props.apikey} />
          <h2> Basing Recommendations On: </h2>
            <br></br>
          <div class="playlistHeader" style={{display: "flex"}}>
            
            <img src={this.state.playlistObj.images[0].url}  width="100" height="100"/>
            <div class="namediv">
              <h4>{this.state.playlistObj.name}</h4>
              <h5>By {this.state.playlistObj.owner.display_name}</h5>
              <p>{this.utf8_to_str(this.state.playlistObj.description)}</p>
            </div>
            <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedRecType} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	{this.dropdownDivs(this.state.recTypes)}
			            </select>
			            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitRecType}>Submit</button>
			          </div>
			  
            </div>
          </div>
          <div className="container">
            <h5>{this.state.info}</h5>
            {this.state.songThumbnails}
          </div>
        </div>
    )};
}