import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Editor from '../editor';
import {Alert} from 'reactstrap'
import Beforeunload from 'react-beforeunload';
import { connector, actions } from '../actions';

const connect = connector(
    state => ({
        socket:state.socket,
        rooms:state.app.rooms,
        id:state.config.articleId
    }), 
    {
        getArticle:actions.app.getArticle,
        navigate:actions.config.navigate,
        updateArticle:actions.app.updateArticle
    }
);

class Main extends Component {
    constructor(props) {
        super(props);
        this.props.getText(value => this.setState({ value }));
        this.state = {
            value: '',
            autoSave: true,
            previousValue: ''
        }
    }

    componentDidMount() {
        this.initialize();
    }

    initialize() {
        this.props.getArticle(this.props.id)
            .then(({ action: { payload: { data } } }) => {
                this.setState({
                    value: data.text,
                    previousValue:data.text
                });

                this.props.socket.emit('join room', data);
                this.interval = setInterval(() => {
                    if (this.isEdited()) {
                        this.setState({previousValue:this.state.value});
                        this.handleSave()
                    }
                }, 60000);
            })
            .catch(e => {
                this.props.navigate('HOME');
            })
    }

    isEdited(){
        return this.state.value !== this.state.previousValue
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    reconnect() {
        this.props.getArticle(this.props.id)
        .then(({ action: { payload: { data } } }) => {
            this.setState({
                value: data.text,
                previousValue:data.text,
                disconnected:false
            });
            this.props.socket.emit('join room', data);
        })
        .catch(e => {
            this.props.navigate('HOME');
        })
    }

    handleChange = value => {
        if(this.props.socket.disconnected) {
            this.reconnect();
        }else {
            this.setState({
                value,
            });
            this.props.socket.emit('set text', value);
        }

    }

    handleSave() {
        this.props.updateArticle({ id: this.props.id, text: this.state.value })
            .then(() => toast.success("Artikkeli tallennettu"))
            .catch(() => toast.error("Virhe tallennettaessa artikkelia"))
    }

    socketsOnline(){
        const {rooms} = this.props;
        const sockets = rooms[this.props.id] ? rooms[this.props.id].sockets : [];
        return sockets.length > 1;
    }

    render() {
        return (
            <div style={{height:'100%'}}>
                {this.isEdited() && <Beforeunload onBeforeunload={() => "Haluatko varmasti poistua? Viimeisempiä muutoksia ei ole tallennettu."} />}
                {this.socketsOnline() && <Alert color="warning">
                    Toinen käyttäjä on muokkaamassa tiedostoa!
                </Alert>}
                <div style={editorStyle}>
                    <Editor
                        value={this.state.value}
                        onChange={this.handleChange}
                        onSave={() => this.handleSave()}
                    />
                </div>
            </div>
        )
    }
}

export default connect(Main)

const editorStyle = {
    boxShadow: '#999 0 0 12px',
    borderRadius: '4px'
}