import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Container } from 'reactstrap';
import { Connect } from '../actions';
import Header from './Header';
import Login from './Login';
import Main from './Article';
import Nav from './NavBar';
import Summary from './Summary';
import Year from './WeekContainer';
import { LoadingComponent } from '../components'
import {SCREENS} from '../constants'


const MainContainer = ({ navigation }) => {
    return (
        <div>
            <Header />
            <Nav/>
            <Container style={{ marginBottom: 20 }}>
                {
                    navigation()
                }
            </Container>
        </div>
    );
}

const AuthContainer = () => {
    return (
        <div>
            <Header />
            <Login />
        </div>
    );
}

class ScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.props.socket.on('get rooms', (rooms) => this.props.setState({ rooms }));
        this.props.socket.on('get sockets', (sockets) => this.props.setState({ sockets }));
        this.getText = (cb) => this.props.socket.on('get text', cb);
        this.onDisconnect = (cb) => this.props.socket.on('disconnect', cb);
        // connect reconnect disconnect (methods)
    }

    componentDidMount() {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        console.log({ email, password })
        if (email && password) {
            this.props.login({ email, password })
                .catch(() => {
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                })
        }
    }

    navigation() {
        switch (this.props.config.screen) {
            case SCREENS.SUMMARY:
                return <Summary />
            case SCREENS.ARTICLE:
                return <Main getText={this.getText} onDisconnect={this.onDisconnect} />
            default:
                return <Year />
        }
    }

    render() {
        return (
            <div>
                <ToastContainer
                    style={{ zIndex: 100000 }}
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover={false}
                />
                {
                    this.props.app.loading && <LoadingComponent />
                }
                {
                    this.props.app.logged ? <MainContainer navigation={() => this.navigation()} /> : <AuthContainer />
                }
            </div>
        );
    }
}

export default Connect(ScreenContainer)
