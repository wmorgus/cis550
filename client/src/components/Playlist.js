import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SongThumbnail from './SongThumbnail';
import PageNavbar from './PageNavbar';

export default class Playlist extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        id: '',
        playlistObj: {images: [{url: ''}], name: 'Playlist loading...', owner: {display_name: ''}, description: ''},
        songThumbnails: <h5>Songs loading...</h5>,
        stats: <h5>Statistics loading...</h5>,
        statsReady: false,
        count: "Loading data.",
        hours: "One Moment Please.",
        avg_min: "",
      }
      this.checkQueue = this.checkQueue.bind(this)
    }

    componentDidMount() {
      fetch('http://localhost:8081/testAudioFeatures?apikey=' + this.props.apikey).then((data) => {console.log('nada')})

      //the react gods hate me right now.
      var id = window.location.href.split('/')[window.location.href.split('/').length - 1]
      // console.log(this.props.apikey)
      var playlists = []
      var newObj = {}
      var songThumbs = []
      // console.log(id)
      

      fetch('http://localhost:8081/spotify/getPlaylist?apikey=' + this.props.apikey + '&id=' + id).then(response => response.json()).then((data) => {
        // console.log('dataobj')
        // console.log(data)
        newObj = data
        songThumbs = data.allSongs.map((songObj, i) =>
          <SongThumbnail songObj={songObj}/>
        )
      }).finally(() => {
        this.setState({
          playlistObj: newObj,
          songThumbnails: songThumbs,
          id: id
        });
        this.checkQueue()
        fetch('http://localhost:8081/duration/' + this.state.id).then(response => response.json()).then((data) => {
          var result = data.rows[0];
          if (data.rows[1] > 0) {
            this.setState({
              count:  "Song Count: " + result[0],
              hours:  "Total Length: " + result[1] + " Hours, " + result[2] + " Minutes, " + result[3] + " Seconds.",
              avg_min: "Average Song Length: " + result[4] + " Minutes, " + result[5] + " Seconds."
            });
          } else {
            this.setState({
              count:  "Song Count: " + result[0],
              hours:  "Total Length: " + result[2] + " Minutes, " + result[3] + " Seconds.",
              avg_min: "Average Song Length: " + result[4] + " Minutes, " + result[5] + " Seconds."
            });
          }
        }).finally(() => {
          this.checkQueue()
        });
        setTimeout(this.checkQueue, 2500)
      });
    }

    checkQueue() {
      if (!this.state.statsReady) {
        fetch('http://localhost:8081/checkQueue?id=' + this.state.id).then(response => response.json()).then((data) => {
          console.log(data)
          if (data.status == 'done') {
            console.log('done')
            this.setState({
              statsReady: true
            })
            this.checkQueue()
          } else {
            console.log('uploading')
            setTimeout(this.checkQueue, 5000)
          }
        })
      } else { //here make requests for length, time, arguably avg stats
        console.log('she ready')
      }
      
    }
    
    utf8_to_str(a) {
      return(a)
      // return decodeURIComponent(s)
    }


    render() {    
      return (
        <div className="playlist">
          <PageNavbar active="yourPlaylists" apikey={this.props.apikey} />
          <div className="playlistHeader" style={{backgroundColor: "#e9e9e9"}}>
            <div className="container" style={{display: "flex", padding:"10px 10px"}}>
              <img src={this.state.playlistObj.images[0].url} className="imgThumbnail" style={{height: "300px", width: "300px", objectFit: "cover", overflow: "none"}}/>
              <div className="namediv" style={{marginLeft: "10px", width: "80%"}}>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <h4>{this.state.playlistObj.name}</h4>
                  <h5>{this.state.playlistObj.owner.display_name}</h5>
                </div>
                <p>{this.utf8_to_str(this.state.playlistObj.description)}</p>
                <div className="statdiv">
                  {this.state.count}
                </div>
                <div className="statdiv">
                 {this.state.hours}
                </div>
                <div className="statdiv">
                {this.state.avg_min}
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            {this.state.songThumbnails}
          </div>
        </div>
    )};
}