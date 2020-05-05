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
        statsReady: false
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
        // for (var ind in data.items) {
        //   var curr = data.items[ind];
        //   console.log(curr)
        //   console.log(curr.images)
        //   playlists.push(<PlaylistThumbnail id={curr.id} name={curr.name} image={curr.images[0].url} owner={curr.owner.display_name} key={ind}/>)
        // }
      }).finally(() => {
        this.setState({
          playlistObj: newObj,
          songThumbnails: songThumbs,
          id: id
        });
        this.checkQueue()
      });
    }

    checkQueue() {
      if (!this.state.statsReady) {
        fetch('http://localhost:8081/checkQueue?id=' + this.state.id).then(response => response.json()).then((data) => {
          if (data.status == 'done') {
            console.log('done')
            this.setState({
              statsReady: true
            })
            this.checkQueue()
          } else {
            console.log('uploading')
            setTimeout(this.checkQueue, 2500)
          }
        })
      } else {
        console.log('she ready')
      }
      
    }
    
    //Nathan serves up the third edition of J&amp;G&#x27;s quarantunes with
    //don&#x27;t mind me, i&#x27;m just patiently waiting for this band to blow up and take over the world nbd
    utf8_to_str(a) {
      // if (a.search('&#x') != -1) {
      //   console.log('found some decode')
      // }
      // while (a.search('&#xlkfj') ==  -1) {
      //   var loc = a.search('&#x') + 1
      //   a.replace('&#x', '%')
      //   var loc2 = a.search(';')
      //   var numstr = a.substring(loc, loc2)
      //   var strnumstr = Number(numstr).toString(16)
      //   console.log(strnumstr)
      // }
      
      // for(var i=0, s=''; i<a.length; i++) {
      //   var h = a[i].toString(16)
      //   if(h.length < 2) h = '0' + h
      //   s += '%' + h
      // }
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
                  {this.state.stats}
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