import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import { formatTitle } from '../tools/articleTools';
import { TITLES } from '../constants';
import { connector, actions } from '../actions';
import {toast} from 'react-toastify';
import * as httpService from '../services/httpService'

const connect = connector(
    state => ({
        year:state.config.year,
        week:state.config.week
    }), 
    {
        createWeek:actions.app.createWeek
    }
);

class CreateWeek extends Component {

    state = {
        articles: TITLES.map((title, i) => ({
            year: this.props.year,
            week: this.props.week,
            title: title.fi,
            title_en: title.en,
            text: `# ${formatTitle(title.fi, title.en)} \n\n`,
            text_en: ``
        })),
        config:{
            year:this.props.year,
            week:this.props.week,
            number:this.props.week-1,
            guild:'Tuotantotalouden kilta Indecs',
            guild_en: 'Guild of Industrial Engineering and Management Indecs',
            subject:"Indecsin Viikkotiedote 1 — Indecs' Newsletter 1",
            url: 'www.indecs.fi',
            name:'Leevi Törnblom',
            job: 'Sihteeri',
            job_en: 'Secretary',
            university: 'Tampereen teknillinen yliopisto',
            university_en: 'Tampere University of Technology',
            phone: '0408431989',
            email: 'sihteeri@indecs.fi'    
        }
    }
    createWeek() {
        if (this.state.articles.find(article => article.title.trim() === "")) {
            toast.error("Kaikki suomenkieliset kentät ovat pakollisia!");
            return;
        }
        const {config} = this.state;
        const articles = this.state.articles.map((a, i) => ({
            ...a, 
            position:i+1,
            text:a.text || `# ${formatTitle(a.title, a.title_en)} \n\n`,
        }));

        this.props.createWeek({articles, config})
    }

    deleteTitle(i) {
        this.setState({
            articles: this.state.articles.reduce((acc, obj, ind) => ind === i ? acc : [...acc, obj], [])
        });
    }

    changeArticle(e, i) {
        this.setState({
            articles: this.state.articles.map(
                (article, index) => i === index ? ({ ...article, [e.target.name]: e.target.value }) : article
            )
        });
    }

    changeConfig(e) {
        this.setState({
            config:{...this.state.config, [e.target.name]:e.target.value}
        });
    }

    async copyPrevWeek() {
        try {
            const response = await httpService.getWeekArticles({week:this.props.week-1, year:this.props.year});
            const data = response.data;
            if(data.length === 0)
                throw new Error("Ei viime viikon tuloksia");
            this.setState({
                articles:data.map(a => ({
                    ...a, 
                    year:this.props.year, 
                    week:this.props.week,
                    text_en:""
                })
            )
            })
        }catch(e) {
            toast.error("Virhe ladatessa viime viikkoa")
        }
    }

    addTitle() {
        this.setState({ articles: [...this.state.articles, { fi: '', en: '' }] })
    }

    render() {
        const { articles } = this.state;
        const ArticleForm = ({article, i}) => {
            return (
                <div style={styles.box}>
                    <Button style={styles.button}color="danger" onClick={() => this.deleteTitle(i)}>X</Button>
                    <FormGroup key={i} row >
                        <div style={styles.index}><h2>{i+1}.</h2></div>
                        <Label for={`fi`} sm={2}>Otsikko (fi)</Label>
                        <Col sm={10}>
                            <Input 
                                type="text" 
                                name="title"
                                required 
                                placeholder="Otsikko suomeksi (pakollinen)" 
                                value={article.title} 
                                onChange={(e) => this.changeArticle(e,i)} 
                            />
                        </Col>
                        <Label for={`en`} sm={2}>Otsikko (en)</Label>
                        <Col sm={10}>
                            <Input 
                                type="text" 
                                name="title_en"
                                placeholder="Otsikko englanniksi (ei pakollinen)" 
                                value={article.title_en} 
                                onChange={(e) => this.changeArticle(e,i)} 
                            />
                        </Col>
                    </FormGroup>

                    <Input
                        style={{height:200}}
                        type="textarea" 
                        name="text" 
                        placeholder="Teksti" 
                        value={article.text}
                        onChange={(e) => this.changeArticle(e,i)} 
                    />
                </div>
            )
        }

        const ConfigForm = ({item:[key, value]}) => {
            return (
                <Col xs="6" sm="4" key={key}>
                    {key}: 
                    <Input
                        type="text"
                        name={key}
                        placeholder={key}
                        value={value}
                        onChange={(e) => this.changeConfig(e)} 
                    />
                </Col>
            )
        }

        return (
            <div style={{ backgroundColor: 'white', padding: 20 }}>
                    <Button 
                        color="warning" 
                        block 
                        onClick={() => this.copyPrevWeek()}
                    >Kopioi viime viikko</Button>
                <Form>
                    <Row>
                    {
                        Object.entries(this.state.config).map(item => (
                            <ConfigForm item={item} />
                        ))
                    }
                    </Row>
                    
                    {
                        articles.map((article, i) => (
                            <ArticleForm article={article} i={i} />
                        ))
                    }
                    <Button 
                        color="info" 
                        block 
                        onClick={() => this.addTitle()}
                    >Lisää uusi otsikko</Button>

                    <Button 
                        color="success" 
                        size="lg" 
                        block 
                        onClick={() => this.createWeek()}
                    >Luo viikkis!</Button>

                </Form>
            </div>

        )
    }
}

export default connect(CreateWeek)

const styles = {
    box:{
        position:'relative',
        marginTop:10,
        backgroundColor:'rgba(0,0,0,0.07)',
        borderRadius:3,
        boxShadow: '#999 0 0 7px',
        border:'1px solid darkgray',
        padding:`60px 10px 10px 10px`
    },
    button:{
        position:'absolute', top:0, right:0, zIndex:999
    },
    index:{
        position:'absolute', top:5, left:5, zIndex:999
    }
}