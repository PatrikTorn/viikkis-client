import React, { Component } from 'react';
import { Badge, Button, ListGroup, ListGroupItem } from 'reactstrap';
import CreateWeek from './CreateWeek';
import { formatTitle, lastEdited } from '../tools/articleTools';
import { connector, actions } from '../actions';

const connect = connector(
    state => ({
        articles:state.app.articles.sort((a, b) => a.position - b.position),
        socket:state.socket,
        rooms:state.app.rooms,
        year:state.config.year,
        week:state.config.week,
        isAdmin: state.app.user.admin
    }), 
    {
        deleteArticle:actions.app.deleteArticle,
        setConfigState:actions.config.setConfigState,
        navigate:actions.config.navigate
    }
);

class WeekList extends Component {

    socketsOnline(id) {
        const { rooms } = this.props;
        const sockets = rooms[id] ? rooms[id].sockets : [];
        return sockets.length > 0;
    }

    deleteArticle(id) {
        const bool = window.confirm('Haluatko varmasti poistaa artikkelin?');
        if (bool) {
            this.props.deleteArticle(id)
        }
    }

    render() {
        const {articles} = this.props;

        const NoArticles = () => {
            return (
                <div style={{textAlign:'center', paddingTop:20, paddingBottom:20}}>
                    <i className="fa fa-database" style={{fontSize:60}} />
                    <h2>Ei artikkeleja</h2>
                    <h5>Sihteeri ei ole vielä luonut tämän viikon artikkeleja</h5>
                </div>
            )
        }

        return articles.length === 0 ? (
            this.props.isAdmin ? <CreateWeek /> : <NoArticles />
        ) : (
                <React.Fragment>
                    <Button block color="success" onClick={() => this.props.navigate('SUMMARY')}>Näytä kooste viikkotiedotteesta</Button>
                    <ListGroup flush>
                        {
                            articles.map(article => (

                                <ListGroupItem key={article.id} >
                                    <a href="javascript:void(0)" onClick={() => this.props.setConfigState({ articleId: article.id, screen: 'ARTICLE' })}>
                                        {article.position}. {formatTitle(article.title, article.title_en)}
                                    </a>
                                    <br />

                                    <Badge color="success">{article.text.length} merkkiä</Badge> {' '}
                                    <Badge color="warning">{lastEdited(article.edited_at)}</Badge> {' '}
                                    {this.socketsOnline(article.id) && <Badge color="info">joku muokkaamassa</Badge>}
                                    
                                    {this.props.isAdmin && <Button color="danger" outline size="sm" style={{ float: 'right' }} onClick={() => this.deleteArticle(article.id)}>X</Button>}

                                </ListGroupItem>
                            ))
                        }
                    </ListGroup>
                </React.Fragment>
            )
    }
}

export default connect(WeekList)