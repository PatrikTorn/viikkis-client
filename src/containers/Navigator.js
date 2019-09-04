import React from 'react';
import {connector} from '../actions';
import { Container } from 'reactstrap';
import { SCREENS } from '../constants';
import Article from './Article';
import Header from './Header';
import NavBar from './NavBar';
import Summary from './Summary';
import WeekContainer from './WeekContainer';
import ConfigSettings from './ConfigSettings';

const connect = connector(
    state => ({
        screen:state.config.screen
    })
);

class MainContainer extends React.Component {

    navigation() {
        switch (this.props.screen) {
            case SCREENS.SUMMARY:
                return <Summary />
            case SCREENS.ARTICLE:
                return <Article getText={this.props.getText}/>
            case SCREENS.CONFIG_SETTINGS:
                return <ConfigSettings/>
            default:
                return <WeekContainer />
        }
    }

    render() {
        return (
            <div>
                <Header />
                <NavBar />
                <Container style={{ marginBottom: 20 }}>
                    {this.navigation()}
                </Container>
            </div>
        );
    }
}

export default connect(MainContainer)