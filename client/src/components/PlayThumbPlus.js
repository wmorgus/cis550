import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';

export default class PlayThumbPlus extends React.Component {
	constructor(props) {
    // console.log(props)
    super(props);
    this.state = {
      image: '',
      name: ''
    }
  }

  componentDidMount() {
    var img = ''
    var nme = ''
    fetch('http://ec2-54-89-146-102.compute-1.amazonaws.com:8081/spotify/getJustPlaylist?apikey=' + this.props.apikey + '&id=' + this.props.id).then(response => response.json()).then((data) => {
      console.log('heres some data')
      console.log(data)
      if (!data.images[0]) {
        img = 'https://tidal.com/browse/assets/images/defaultImages/defaultPlaylistImage.png'
      } else {
        img = data.images[0].url
      }
      nme = data.name

    }).finally(() => {
      this.setState({
        image: img,
        name: nme
    })})
  }

	render() {
		var wrapper = {
      margin: "3px 0px", 
      padding: "7px 0px", 
      backgroundColor: "#f3f3f3"
		}
		
		return (
      <div className="row" id={this.props.id} style={wrapper}>
        <div className="col">
          <div>
            <img className="" src={this.state.image} style={{height: "175px", width: "175px", objectFit: "cover", overflow: "none"}}/>
          </div>
        </div>
        <div className="col-7" style={{display: "flex", alignItems: "center"}}>
          <div>
            <h2>{this.state.name}</h2>
            <h3>{this.props.score}</h3>
          </div>
        </div>
        <div className="col" style={{display: "flex", alignItems: "center"}}>
          <Button href={"/playlist/" + this.props.id} style={{height: "30%", display: "flex", alignItems: "center", backgroundColor: '#08a1b3', borderColor: '#08a1b3'}}>Go to playlist</Button>
        </div>
      </div>
		);
	}
}
