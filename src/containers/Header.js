import React, { Component } from 'react';
import { Connect } from '../actions';
import headerImage from '../images/viikkis.png';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
class Header extends Component {
    state = {
        dropdownOpen:false
    }
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
                    {this.props.app.logged && <div style={styles.right}>
                    <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={() => this.setState({dropdownOpen:!this.state.dropdownOpen})} direction={'left'}>
                        <DropdownToggle>
                        <i className="fa fa-bars" style={{ fontSize: 30, color: 'white' }}></i>
                        </DropdownToggle>
                        <DropdownMenu>
                        <DropdownItem header>{this.props.app.user.email}</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem disabled><i className="fa fa-users" style={{marginRight:5}}></i> {this.props.app.sockets.length} paikalla</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem disabled><i className="fa fa-cog" style={{marginRight:5}}></i> Asetukset</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => this.logout()}><i className="fa fa-sign-out-alt" style={{marginRight:5}}></i>Kirjaudu ulos</DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
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