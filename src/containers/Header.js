import React, { Component } from 'react';
import headerImage from '../images/viikkis.png';
import {SCREENS} from '../constants';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { connector, actions } from '../actions';

const connect = connector(
    state => ({
        email:state.app.user.email,
        logged:state.app.logged,
        socketsLength:state.app.sockets.length,
        isAdmin: state.app.user.admin
    }), 
    {
        logout:actions.app.logout,
        navigate: actions.config.navigate
    }
);

class Header extends Component {
    state = {
        dropdownOpen:false
    };

    logout(){
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        this.props.logout();
    }

    render() {
        const MenuButton = () => (
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={() => this.setState({dropdownOpen:!this.state.dropdownOpen})} direction={'left'}>
                <DropdownToggle>
                <i className="fa fa-bars" style={{ fontSize: 30, color: 'white' }}></i>
                </DropdownToggle>
                <DropdownMenu>
                <DropdownItem header>{this.props.email}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem disabled><i className="fa fa-users" style={{marginRight:5}}></i> {this.props.socketsLength} paikalla</DropdownItem>
                <DropdownItem divider />
                <DropdownItem disabled={this.props.isAdmin ? false : true}onClick={() => this.props.navigate(SCREENS.CONFIG_SETTINGS)}><i className="fa fa-cog" style={{marginRight:5}}></i> Asetukset</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => this.logout()}><i className="fa fa-sign-out-alt" style={{marginRight:5}}></i>Kirjaudu ulos</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        );
        return (
            <div>

                <div style={styles.top}>
                    <div style={styles.left}>
                        <img src={headerImage} alt="Viikkis Indecs" style={{ height: 60 }} />
                    </div>
                    {this.props.logged && <div style={styles.right}>
                        <MenuButton />
                    </div>}
                </div>
            </div>
        )
    }
}

export default connect(Header)

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
    users: {
        position:'absolute',
        top:5,
        right:5,
        fontSize: 15, 
        color: 'white'
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 10,
        cursor: 'pointer'
    },
}