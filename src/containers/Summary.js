import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import Editor from '../editor';
import { Connect } from '../actions';
import { createMarkdownTOC, convertMarkdownToHtml } from '../tools/articleTools';
class Summary extends Component {
    constructor(props) {
        super(props);
        this.year = this.props.config.year;
        this.week = this.props.config.week;
        this.state = {
            value: '',
            config: `
otsikon_ylle: Tuotantotalouden kilta Indecs
otsikon_alle: Viikko 1
sposti_aihe: Indecsin Viikkotiedote 1 — Indecs' Newsletter 1
url: http://www.google.fi
nimi: Leevi Törnblom
titteli: Sihteeri / Secretary
kilta: Tuotantotalouden kilta Indecs Ry
guild: Guild of Industrial Engineering and Management Indecs
yliopisto: Tampereen teknillinen yliopisto
university: Tampere University of Technology
puhelin: 0408431989
sposti: sihteeri@indecs.fi
internet: www.indecs.fi
`,
toc:`

# Sisällysluettelo - Table of Contents

[TOC]

`,
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
        const topValue = `
<font class="margin"></font>
<font class="top-kilta">Tuotantotalouden kilta Indecs</font>
<font class="top-viikkotiedote">Viikkotiedote</font>
<font class="top-numero">Numero ${this.week - 1} - Viikko ${this.week}</font>
<font class="margin"></font>
<font class="top-toc"> Sisällysluettelo - Table of contents</font>
${tableOfContents}
    `;

        const bottomValue = `
<font class="margin"></font>
<font class="top-kilta">Terveisin - Regards</font>
<font class="top-viikkotiedote">Leevi Törnblom</font>
<font class="top-numero">Sihteeri / Secretary</font>
<font class="bottom-default">Tuotantotalouden kilta Indecs ry</font>
<font class="bottom-default">Guild of Industrial Engineering and Management Indecs</font>
<font class="bottom-default">Tampereen yliopisto</font>
<font class="bottom-default">Tampere University</font>
<font class="bottom-default">0408431989</font>
<font class="bottom-default">sihteeri@indecs.fi</font>
<font class="bottom-default">[www.indecs.fi]www.indecs.fi</font>
<font class="margin"></font>
`;

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
