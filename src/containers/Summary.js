import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import Editor from '../editor';
import { Connect } from '../actions';
import { createMarkdownTOC, convertMarkdownToHtml } from '../tools/articleTools';
import { MD_CONFIG, MD_CONFIG_TOC, SUMMARY_BOTTOM, SUMMARY_TOP } from '../constants';
class Summary extends Component {
    constructor(props) {
        super(props);
        this.year = this.props.config.year;
        this.week = this.props.config.week;
        this.state = {
            value: '',
            config: MD_CONFIG,
            toc:MD_CONFIG_TOC,
            showModal: false
        }
    }

    componentDidMount() {
        this.props.getSummary({ year: this.year, week: this.week })
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }

    exportHtml(html){
        let element = document.createElement("a");
        let file = new Blob([html], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${this.year}-${this.week}-viikkis.html`;
        element.click();
    }

    exportFile() {
        let element = document.createElement("a");
        let text = (this.state.config + this.state.toc + this.props.app.summary).replace(/\n/g, "\r\n");
        let file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${this.year}-${this.week}-viikkis.md`;
        element.click();
    }




    render() {
        const value = this.props.app.summary;
        const tableOfContents = createMarkdownTOC(this.props.app.summary);
        const topValue = SUMMARY_TOP(this.week, tableOfContents);
        const bottomValue = SUMMARY_BOTTOM;
        const editorStyle = {
            boxShadow: '#999 0 0 12px',
            borderRadius: '4px'
        }

        return (
            <React.Fragment>

                <Modal open={this.state.showModal} onClose={() => this.toggleModal()} center>
                    <div style={{ minHeight: 300, width: 600 }}>
                        <Form>
                            <FormGroup>
                                <Label for="config">Määritä sihteerin asetukset</Label>
                                <Input type="textarea" style={{ height: 200 }} id="config" value={this.state.config} onChange={e => this.setState({ config: e.target.value })} />
                                <Button color="success" block onClick={() => this.exportFile()}>Lataa .md -muodossa</Button>
                                <Button color="primary" block onClick={() => this.exportHtml(convertMarkdownToHtml(value, topValue, bottomValue))}>Lataa .html -muodossa</Button>
                            </FormGroup>
                        </Form>
                    </div>
                </Modal>

                <Button color="success" block onClick={() => this.toggleModal()}>Lataa viikkis</Button>

                <div style={editorStyle}>
                    <Editor
                        topValue={topValue}
                        bottomValue={bottomValue}
                        value={value}
                        onChange={() => { }}
                        onSave={() => { }}
                    />
                </div>
            </React.Fragment>
        )
    }
}

export default Connect(Summary)
