import React, { Component } from 'react';

import './App.css';

class App extends Component {
  state = {
    data: [],
    searchQuery: '',
    loading: true
  };

  componentDidMount() {
    this.fetchEmployees('/api/employees')
      .then(({ data }) => this.setState({ data, loading: false }))
      .catch(err => console.log(err));
  }

  fetchEmployees = async (endPoint) => {
    const response = await fetch(endPoint);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { searchQuery } = this.state;
    const query = searchQuery !== '' ? `?name=${searchQuery}` : '';
    this.setState({ loading: true })

    this.fetchEmployees(`/api/employees${query}`)
      .then(({ data }) => this.setState({ data, loading: false }))
      .catch(err => console.log(err));
  }

  handleChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };


  render() {

    const { data, searcyQuery, loading } = this.state;

    const employees = data.map((employee) => {
      return (
        <div className="card" key={employee.name}>
          <img src={employee.image} alt={employee.name} />
          <div className="text">
            <p>{employee.name}</p>
            <p>{employee.job}</p>
          </div>
        </div>
      )
    });

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Search by employee..."
            value={searcyQuery}
            onChange={(e) => this.handleChange(e)}
          />
          <button type="submit">Submit</button>
        </form>
        <div className="container">
          {data.length !== 0 ? employees : <p>{loading ? 'Loading' : 'No'} Data...</p>}
        </div>
      </div>
    );
  }
}

export default App;
