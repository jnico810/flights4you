import React from 'react';
import $ from 'jquery';

class Root extends React.Component {

  constructor(props){
    super(props);
    this.state = {originCode:"", desintationCode:"", searchMessage:""};
    this.getAirportCode = this.getAirportCode.bind(this);
  }

  getAirportCode(position) {
    this.setState({searchMessage:"Searching for closest airport..."});
    $.ajax({
      method: "GET",
      url: `/api/closestAirport?lat=${position.coords.latitude}&lng=${ position.coords.longitude}`,
      success: (response) => {this.setState({searchMessage:"Searching current location..."});
        this.setState({originCode: response.IATA, searchMessage:"Your closest airport has been found!"});
      },
      error: function (err){
        this.setState({searchMessage:"There was an error finding your closest airport!"});
      }
    });
  }

  updateOrigin(e){
    this.setState({originCode: e.currentTarget.value });
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(this.getAirportCode);
  }

  render() {
    return(
      <div>
        <p>{ this.state.searchMessage }</p>
        <label htmlFor="origin">Origin:</label>
        <input name="origin" id="origin" onChange={ this.updateOrigin } value={ this.state.originCode }/>
        <label htmlFor="destination">Destination:</label>
        <input name="destination" id="destination"/>
      </div>
    );
  }

}



export default Root;
