import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import Login from './Login';
import Navigator from './Navigator';
import { LoadingComponent } from '../components'
import { connector, actions } from '../actions';

const connect = connector(
    state => ({
        loading:state.app.loading,
        socket:state.socket,
        logged:state.app.logged
    }), 
    {
        login:actions.app.login,
        setState:actions.app.setState
    }
);

class ScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.props.socket.on('get rooms', (rooms) => this.props.setState({ rooms }));
        this.props.socket.on('get sockets', (sockets) => this.props.setState({ sockets }));
        this.getText = (cb) => this.props.socket.on('get text', cb);
    }

    componentDidMount() {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        if (email && password) {
            this.props.login({ email, password })
                .catch(() => {
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                })
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
                    this.props.loading && <LoadingComponent />
                }
                {
                    this.props.logged ? <Navigator getText={this.getText} /> : <Login />
                }
            </div>
        );
    }
}

export default connect(ScreenContainer)
