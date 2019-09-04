import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup
} from "reactstrap";
import Editor from "../editor";
import { createMarkdownTOC, mdToHtml } from "../tools/articleTools";
import {
  MD_CONFIG,
  MD_CONFIG_TOC,
  SUMMARY_BOTTOM,
  SUMMARY_TOP
} from "../constants";
import { connector, actions } from "../actions";
import { mjml2html } from "../services/httpService";
import { createMjml } from "../tools/articleTools";
import { toast } from "react-toastify";

const connect = connector(
  state => ({
    year: state.config.year,
    week: state.config.week,
    now: state.config.now,
    socket: state.socket,
    config: state.config.config,
    summary: state.app.articles
      .sort((a, b) => a.position - b.position)
      .reduce((acc, a) => acc + "\n \n" + a.text, ``)
  }),
  {
    getWeek: actions.app.getWeek,
    setPrevWeek: actions.config.setPrevWeek,
    setNextWeek: actions.config.setNextWeek
  }
);

class Summary extends Component {
  state = {
    number: 0,
    showModal: false
  };

  componentDidMount() {
    this.props.getWeek({ year: this.props.year, week: this.props.week });
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  createBlob(format, content) {
    const fileName = `${this.props.year}-${this.props.week}-viikkis.${format}`;
    let element = document.createElement("a");
    let file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    element.click();
  }

  exportHtml() {
    // md -> mjml -> html
    const tableOfContents = createMarkdownTOC(this.props.summary);
    const mjml = createMjml(
      [tableOfContents, this.props.summary],
      this.props.config,
      this.props.week,
      this.state.number
    );
    mjml2html(mjml)
      .then(res => res.json())
      .then(res => this.createBlob("html", res.html))
      .catch(e => toast.error("virhe"));
  }

  // sendEmail(){
  //     // NOT IN USE
  //     const tableOfContents = createMarkdownTOC(this.props.summary);
  //     const mjml = createMjml([tableOfContents, this.props.summary]);
  //     sendEmail(mjml)
  //     .then(() => toast.success("Sähköposti lähetetty"))
  //     .catch(e => toast.error("Ongelma sähköpostin lähetyksessä"))
  // }

  exportMd() {
    let content = (
      MD_CONFIG(this.props.config, this.props.week, this.state.number) +
      MD_CONFIG_TOC +
      this.props.summary
    ).replace(/\n/g, "\r\n");
    this.createBlob("md", content);
  }

  exportMjml() {
    const tableOfContents = createMarkdownTOC(this.props.summary);
    const mjml = createMjml(
      [tableOfContents, this.props.summary],
      this.props.config,
      this.props.week,
      this.state.number
    ).replace(/\n/g, "\r\n");
    this.createBlob("txt", mjml);
  }

  render() {
    const tableOfContents = createMarkdownTOC(this.props.summary);
    const topValue = SUMMARY_TOP(
      this.props.week,
      tableOfContents,
      this.props.config,
      this.state.number
    );
    const bottomValue = SUMMARY_BOTTOM(this.props.config);
    const editorStyle = {
      boxShadow: "#999 0 0 12px",
      borderRadius: "4px"
    };

    return (
      <React.Fragment>
        <Modal isOpen={this.state.showModal} toggle={() => this.toggleModal()}>
          <ModalHeader>Määritä viikkiksen numero</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Input
                  type="number"
                  id="number"
                  value={this.state.number}
                  onChange={e => this.setState({ number: e.target.value })}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button color="success" onClick={() => this.exportMd()}>
                Lataa md
              </Button>
              <Button color="primary" onClick={() => this.exportHtml()}>
                Lataa html
              </Button>
              <Button color="secondary" onClick={() => this.exportMjml()}>
                Lataa mjml
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Modal>

        <Button color="success" block onClick={() => this.toggleModal()}>
          Lataa viikkis
        </Button>

        <div style={editorStyle}>
          <Editor
            topValue={topValue}
            bottomValue={bottomValue}
            value={this.props.summary}
            onChange={() => {}}
            onSave={() => {}}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(Summary);
