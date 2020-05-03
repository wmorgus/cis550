import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import {Redirect} from 'react-router-dom'
import PlaylistThumbnail from './PlaylistThumbnail';
import { Next } from 'react-bootstrap/PageItem';

export default class YourPlaylists extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        playlists: [],
        next: '',
        uid: '',
        count: 0,
        loading: false
      }
      this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {
      window.addEventListener('scroll', this.onScroll);
      var nxt = '';
      var uid = '';
      var ct = 0;
      console.log(this)
      console.log(this.props.apikey)
      var playlists = []
      fetch('http://localhost:8081/spotify/getPlaylists?apikey=' + this.props.apikey).then(response => response.json()).then((data) => {
        console.log(data)
        if (data.next) {
          nxt = data.next
        }
        uid = data.href.split('/')[5]
        ct = data.limit
        for (var ind in data.items) {
          var curr = data.items[ind];
          playlists.push(<PlaylistThumbnail id={curr.id} name={curr.name} image={curr.images[0].url} owner={curr.owner.display_name} key={ind}/>)
        }
      }).finally(() => {
        
        this.setState({
          playlists: playlists,
          uid: uid,
          count: ct,
          next: nxt
        });
      });
    }

    onScroll() {
      console.log(this.state)
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) && !this.state.loading && this.state.nxt != '') {
        this.setState({loading: true});
        var nxt = '';
        var ct = this.state.count;
        var playlists = this.state.playlists
        // console.log(this.state.next)
        fetch('http://localhost:8081/spotify/getUserPlaylists?apikey=' + this.props.apikey + '&offset=' + this.state.count + '&user=' + this.state.uid).then(response => response.json()).then((data) => {
          console.log(data)
          if (data.next) {
            nxt = data.next
          }
          ct += data.limit
          for (var ind in data.items) {
            var curr = data.items[ind];
            playlists.push(<PlaylistThumbnail id={curr.id} name={curr.name} image={curr.images[0].url} owner={curr.owner.display_name} key={ind}/>)
          }
        }).finally(() => {
          this.setState({
            playlists: playlists,
            next: nxt,
            count: ct,
            loading: false
          });
        });
      }
      
    }
 
    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll);
    }

    render() {    
      return (
        <div className="yourPlaylists">
          <PageNavbar active="yourPlaylists" apikey={this.props.apikey}/>
          <div className="container">
            {this.state.playlists}
          </div>
        </div>
    )};
}