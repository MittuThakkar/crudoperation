import React from "react";
import {
  Container,
  Row,
  Form,
  FormControl,
  FormLabel,
  Button,
  FormGroup,
  Alert,
  Table,
  Card,
} from "react-bootstrap";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      usernameReg:"",
      passwordReg:"",
      records: [],
      showAlert: false,
      alertMessage: "",
      alertType: "success",
      id: "",
      update: false,
    };
  }
  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  componentWillMount() {
    this.fetchAllRecords();
  }

  //register

  // register = () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   var body = JSON.stringify({
  //     username: this.state.usernameReg,
  //     password: this.state.passwordReg,
  //   });
  //   fetch("http://localhost:8000/api/register", {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: body,
  //   }).then((Response) => {
  //     Response.json().then((result) => {
  //       console.log(result);
  //       this.setState({
  //         usernameReg:"",
  //         passwordReg:"",
  //         showAlert: true,
  //         alertMessage: result.response,
  //         alertType: "success",
  //       });
  //       this.fetchAllRecords();
  //     });
  //   });
  // };

  //Add Record
  addRecord = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var body = JSON.stringify({
      username: this.state.username,
      password: this.state.password,
    });
    // if(!body.username ){
    //   alert('Please Enter UserName and Password..!!')
    //   return;
    // }
    // const url = "http://localhost:8000/api/create"
    fetch("http://localhost:8000/api/create", {
      method: "POST",
      headers: myHeaders,
      body: body,
    }).then((Response) => {
      Response.json().then((result) => {
        console.log(result);
        this.setState({
          username: "",
          password: "",
          showAlert: true,
          alertMessage: result.response,
          alertType: "success",
        });
        this.fetchAllRecords();
      });
    });
  };

  //fetch all records from users table
  fetchAllRecords = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    fetch("http://localhost:8000/api/view", {
      method: "GET",
      headers: myHeaders,
    }).then((Response) => {
      Response.json()
        .then((result) => {
          console.log("result", result);
          this.setState({
            records: result.response,
          });
        })
        .catch((err) => {
          console.log("error", err);
        });
    });
  };

  //view single data to record
  editRecord = (id) => {
    fetch("http://localhost:8000/api/view/" + id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          id: id,
          update: true,
          username: result.response[0].username,
          password: result.response[0].password,
        });
      })
      .catch((error) => console.log("error", error));
  };

  //update a record
  updateRecord = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var body = JSON.stringify({
      id: this.state.id,
      username: this.state.username,
      password: this.state.password,
    });
    fetch("http://localhost:8000/api/update/", {
      method: "PUT",
      headers: myHeaders,
      body: body,
    }).then((Response) => {
      Response.json()
        .then((result) => {
          console.log("result", result);
          this.setState({
            showAlert: true,
            alertMessage: result.response,
            alertType: "success",
            update: false,
            id: "",
            username: "",
            password: "",
          });
          this.fetchAllRecords();
        })
        .catch((err) => {
          console.log("error", err);
        });
    });
  };

  //delete a record
  deleteRecord = (id) => {
    fetch("http://localhost:8000/api/delete/" + id, {
      method: "DELETE",
    }).then((Response) => {
      Response.json()
        .then((result) => {
          console.log("result", result);
          this.setState({
            showAlert: true,
            alertMessage: result.response,
            alertType: "danger",
          });
          this.fetchAllRecords();
        })
        .catch((err) => {
          console.log("error", err);
        });
    });
  };
  render() {
    return (
      <div>
        <Container>
          {this.state.showAlert === true ? (
            <Alert
              variant={this.state.alertType}
              onClose={() => {
                this.setState({
                  showAlert: false,
                });
              }}
              dismissible
            >
              <Alert.Heading>{this.state.alertMessage}</Alert.Heading>
            </Alert>
          ) : null}

          {/* All records */}
          <Row>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th colSpan="2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.records.map((record) => {
                  return (
                    <tr>
                      <td>{record.id}</td>
                      <td>{record.username}</td>
                      <td>{record.password}</td>

                      <td>
                        <Button
                          variant="info"
                          onClick={() => {
                            this.editRecord(record.id);
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => {
                            this.deleteRecord(record.id);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Row>

          {/*insert form */}
          {/* <Card.Title>Registartion</Card.Title>
          <Row>
            <Form>
              <FormGroup>
                <FormLabel>Username</FormLabel>
                <FormControl
                  type="text"
                  name="username"
                  placeholder="Enetr Username"
                  value={this.state.usernameReg}
                  onChange={this.handleChange}
                ></FormControl>
              </FormGroup>
              <FormGroup>
                <FormLabel>Password</FormLabel>
                <FormControl
                  type="password"
                  name="password"
                  placeholder="Enetr Password"
                  value={this.state.passwordReg}
                  onChange={this.handleChange}
                ></FormControl>
              </FormGroup>
              <Button onClick={this.register}>Register</Button>
            </Form>
          </Row> */}

          <Card.Title>Login</Card.Title>
          <Row>
            <Form>
              <FormGroup>
                <FormLabel>Username</FormLabel>
                <FormControl
                  type="text"
                  name="username"
                  placeholder="Enetr Username"
                  value={this.state.username}
                  onChange={this.handleChange}
                ></FormControl>
              </FormGroup>
              <FormGroup>
                <FormLabel>Password</FormLabel>
                <FormControl
                  type="password"
                  name="password"
                  placeholder="Enetr Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                ></FormControl>
              </FormGroup>
              {this.state.update === true ? (
                <Button onClick={this.updateRecord}>update</Button>
              ) : (
                <Button onClick={this.addRecord}>Login</Button>
              )}
            </Form>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
