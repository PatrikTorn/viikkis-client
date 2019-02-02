import React, { Component } from 'react';
import { Connect } from '../actions';
import headerImage from '../images/viikkis.png';
class Header extends Component {
    logout(){
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        this.props.logout();
    }
    render() {
        return (
            <div>
                <div style={styles.top}>
                    <div style={styles.left}>
                        <img src={headerImage} alt="Viikkis Indecs" style={{ height: 60 }} />
                    </div>
                    <div style={styles.nav}>
                    </div>
                    {this.props.app.logged && <div style={styles.right}>
                        <i className="fa fa-sign-out-alt" style={{ fontSize: 30, color: 'white' }} onClick={() => this.logout()}></i>
                    </div>}
                </div>
            </div>
        )
    }
}

export default Connect(Header)

const styles = {
    top: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: 60,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        color: 'white',
        justifyContent:'space-between'
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        cursor:'pointer'
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 20,
        cursor: 'pointer'
    },
}