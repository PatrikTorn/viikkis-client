import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import {formatTitle} from '../tools/articleTools';
import {SCREENS} from '../constants';
import { connector, actions } from '../actions';

const connect = connector(
    state => ({
        year:state.config.year,
        week:state.config.week,
        articleId:state.config.articleId,
        screen:state.config.screen,
        articles:state.app.articles
    }), 
    {
        navigate:actions.config.navigate
    }
);

class Nav extends Component {

    render() {

        const { year, week, articleId, screen, articles } = this.props;
        const article = screen === SCREENS.ARTICLE && articles.find(a => a.id === articleId);
        const title = article ? `${article.position}. ${formatTitle(article.title, article.title_en)}` : `Viikkotiedote`;
        return (
            <Breadcrumb>
                <BreadcrumbItem onClick={() => this.props.navigate('HOME')}><a href="javascript:void(0)">Viikkis {week}/{year}</a></BreadcrumbItem>
                {(screen === SCREENS.ARTICLE || screen === SCREENS.SUMMARY) && <BreadcrumbItem active> {title}</BreadcrumbItem>}

            </Breadcrumb>
        )
    }
}

export default connect(Nav)
