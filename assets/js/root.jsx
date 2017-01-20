import React from 'react';
import $ from 'jquery';

import FacebookLogin from 'react-facebook-login';

class Root extends React.Component {

  constructor(props) {
    super(props);
    const rightNow = new Date();
    const formattedDate = rightNow.toISOString().slice(0,10);
    this.state = {originCode:"", destinationCode:"LAX", searchMessage:"", searchDate:formattedDate, flights:[], facebook:null};
    this.getAirportCode = this.getAirportCode.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.updateOrigin = this.updateOrigin.bind(this);
    this.updateDestination = this.updateDestination.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateDate = this.updateDate.bind(this);
  }

  getLocation() {
    this.setState({searchMessage:"Searching for closest airport..."});
    navigator.geolocation.getCurrentPosition(this.getAirportCode);
  }

  getAirportCode(position) {
    $.ajax({
      method: "GET",
      url: `/api/closestAirport?lat=${position.coords.latitude}&lng=${ position.coords.longitude}`,
      success: (response) => {
        this.setState({originCode: response.IATA, searchMessage:"Your closest airport has been found!"});
      },
      error: function (err){
        this.setState({searchMessage:"There was an error finding your closest airport!"});
      }
    });
  }

  updateOrigin(e) {
    e.preventDefault();
    this.setState({originCode: e.currentTarget.value });
  }

  updateDestination(e) {
    e.preventDefault();
    this.setState({destinationCode: e.currentTarget.value });
  }

  updateDate(e) {
    e.preventDefault();
    this.setState({searchDate: e.currentTarget.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const url = `/api/flights?origin=${this.state.originCode}&dest=${this.state.destinationCode}&date=${this.state.searchDate}`;

    if (this.state.facebook) {
      this.setState({searchMessage: "Searching for flights..."});
      $.ajax({
        method: "GET",
        url: url,
        success: (response) => {
          this.setState({flights: response, searchMessage: "Your flights have been found!"});
        },
        error: (err) => {
          this.setState({searchMessage:err.responseText, flights:[]});
        }
      });
    } else {
      this.setState({searchMessage:"Please login to facebook to search!"});
    }
  }

  componentWillMount() {
    this.getLocation();
  }

  responseFacebook(response) {
    this.setState({facebook:response});
  }

  render() {
    const flightList = this.state.flights.map((flight, idx)=> {
      let flightLegs = [];
      for (let i = 0; i <= flight.connections; i++){
        flightLegs.push(<li key={i}><strong>{flight.origins[i].flight.carrier}{flight.origins[i].flight.number}</strong>: { flight.origins[i].iata }:{ flight.departureTimes[i] } --{">"} { flight.destinations[i].iata }:{ flight.arrivalTimes[i] } </li>);
      }
      return (
        <div key={idx} className="flight">
          <h3>Price: { flight.totalPrice }</h3>
          <ul>{ flightLegs }</ul>
        </div>
      );
    });

    let facebookButton;
    let greeting;

    if (!this.state.facebook || this.state.facebook.status == "unknown") {
      facebookButton = (
        <FacebookLogin
          appId="1147962611987399"
          autoLoad={false}
          fields="name, picture"
          cssClass="facebook-login"
          callback={this.responseFacebook.bind(this)} />
      );
    } else{
      greeting = (
        <div className="greeting">
          <span>Welcome { this.state.facebook.name }!</span>
          <img src={this.state.facebook.picture.data.url}></img>
        </div>
      );
    }

    return(
      <main>
        { greeting }
        <p>{ this.state.searchMessage }</p>
        <form onSubmit={ this.handleSubmit}>
          <label htmlFor="origin">Origin:</label>
          <input name="origin" id="origin" onChange={ this.updateOrigin } value={ this.state.originCode }/>
          <label htmlFor="destination">Destination:</label>
          <input name="destination" id="destination" onChange={ this.updateDestination } value={ this.state.destinationCode }/>
          <input type="date" onChange={ this.updateDate } value={ this.state.searchDate }></input>
          <button type="submit">Find Flights</button>
        </form>
        <div className="flights">
          { facebookButton }
          { flightList }
        </div>
      </main>
    );
  }

}

export default Root;
