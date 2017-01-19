import React from 'react';
import $ from 'jquery';

class Root extends React.Component {

  constructor(props){
    super(props);
    const rightNow = new Date();
    const formattedDate = rightNow.toISOString().slice(0,10);
    this.state = {originCode:"", destinationCode:"", searchMessage:"", searchDate:formattedDate, flights:null};
    this.getAirportCode = this.getAirportCode.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.updateOrigin = this.updateOrigin.bind(this);
    this.updateDestination = this.updateDestination.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateDate = this.updateDate.bind(this);

  }

  getLocation(){
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

  updateOrigin(e){
    this.setState({originCode: e.currentTarget.value });
  }

  updateDestination(e){
    this.setState({destinationCode: e.currentTarget.value });
  }

  updateDate(e){
    e.preventDefault();
    this.setState({searchDate: e.currentTarget.value });
  }

  handleSubmit(e){
    e.preventDefault();
    $.ajax({
      method: "GET",
      url: `/api/flights?origin=${this.state.originCode}&dest=${this.state.destinationCode}&date=${this.state.searchDate}`,
      success: (response) => {
        console.log('good response');
        this.parseFlights(response);
      },
      error: (err) => {
        console.log(err);
        this.setState({searchMessage:err.responseText});
      }
    });
  }

  parseFlights(flights){
    let flightList = [];
    this.setState({flights:flights});
    debugger
    flights.trips.tripOption.forEach((trip) => {
      console.log(trip);
      let string = "";
      trip.slice.forEach((slice) => {
        slice.segment.forEach((segment) => {
            segment.leg[0]
            const departureTime = new Date(segment[0].departureTime).toLocaleTimeString().slice(0,-6);

            string = string + ` ${departureTime}  ${leg.origin}`;
        });
      });
    });
  }

  render() {
    window.state = this.state;
    console.log(this.state);
    return(
      <div>
        <button onClick={ this.getLocation }>Use current location</button>
        <p>{ this.state.searchMessage }</p>
        <form onSubmit={ this.handleSubmit} >
          <label htmlFor="origin">Origin:</label>
          <input name="origin" id="origin" onChange={ this.updateOrigin } value={ this.state.originCode }/>
          <label htmlFor="destination">Destination:</label>
          <input name="destination" id="destination" onChange={ this.updateDestination }/>
          <input type="date" onChange={ this.updateDate } value= { this.state.searchDate }></input>
          <button type="submit">Find Flights</button>
        </form>
      </div>
    );
  }

}



export default Root;
