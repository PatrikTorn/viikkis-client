import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Button, Col, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import Header from './Header';
import {connector, actions} from '../actions';
const connect = connector(
    state => null, 
    {
        login:actions.app.login
    }
);

class Login extends Component {
    state = {
        email: '',
        password: '',
        rememberMe: false
    }

    login() {
        this.props.login({ password: this.state.password, email: this.state.email })
            .then(() => {
                if (this.state.rememberMe) {
                    localStorage.setItem('email', this.state.email);
                    localStorage.setItem('password', this.state.password);
                }
            })
            .catch(() => toast.error('Väärä käyttäjätunnus tai salasana'))
    }

    render() {
        return (
            <div>
                <Header />
                <div style={styles.wrapper}>
                    <Container style={styles.container}>
                        <h2>Kirjaudu sisään</h2>
                        <Form className="form">
                            <Col>
                                <FormGroup>
                                    <Label>Sähköposti</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        id="exampleEmail"
                                        placeholder="sposti@sposti.com"
                                        value={this.state.email}
                                        onChange={e => this.setState({ email: e.target.value })}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="examplePassword">Salasana</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        id="examplePassword"
                                        placeholder="********"
                                        onChange={e => this.setState({ password: e.target.value })}
                                        value={this.state.password}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            id="rememberMe"
                                            type="checkbox"
                                            value={this.state.rememberMe}
                                            onChange={e => this.setState({ rememberMe: e.target.value })}
                                        />{' '} Muista minut
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Button onClick={() => this.login()}>Kirjaudu sisään</Button>
                        </Form>
                    </Container>
                </div >
            </div>
        );
    }
}

export default connect(Login);

const styles = {
    container: {
        boxShadow: '#999 0 0 12px',
        borderRadius: '4px',
        backgroundColor: 'white',
        padding: 20,
        margin: 10
    },
    wrapper: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
}