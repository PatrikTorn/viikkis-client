import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Input
} from "reactstrap";
import Editor from "../editor";
import { createMarkdownTOC, mdToHtml } from "../tools/articleTools";
import {
  MD_CONFIG,
  MD_CONFIG_TOC,
  SUMMARY_BOTTOM,
  SUMMARY_TOP,
  EMAIL_SUBJECT
} from "../constants";
import { connector, actions } from "../actions";
import { mjml2html, sendEmail } from "../services/httpService";
import { createMjml } from "../tools/articleTools";
import { toast } from "react-toastify";


const connect = connector(
  state => ({
    year: state.config.year,
    week: state.config.week,
    now: state.config.now,
    socket: state.socket,
    config: state.config.config,
    isAdmin: state.app.user.admin,
    summary: state.app.articles
      .sort((a, b) => a.position - b.position)
      .reduce((acc, a) => acc + "\n \n" + a.text, ``)
  }),
  {
    getWeekArticles: actions.app.getWeekArticles,
    setPrevWeek: actions.config.setPrevWeek,
    setNextWeek: actions.config.setNextWeek
  }
);

class Summary extends Component {
  state = {
    showModal: false,
    password:'',
    recipient:this.props.config.recipient,
    sender:this.props.config.sender,
    attachments:[]
  };

  componentDidMount() {
    this.props.getWeekArticles({
      year: this.props.year,
      week: this.props.week
    });
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
      this.props.week
    );
    mjml2html(mjml)
      .then(res => res.json())
      .then(res => this.createBlob("html", res.html))
      .catch(e => toast.error("virhe"));
  }

  sendEmail(){
      const tableOfContents = createMarkdownTOC(this.props.summary);
      const mjml = createMjml([tableOfContents, this.props.summary], this.props.config, this.props.week);
      const {sender, recipient, password, attachments} = this.state;
      const subject = EMAIL_SUBJECT(this.props.config);
      sendEmail(mjml, sender, recipient, password, subject, attachments)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Sähköposti lähetetty")
        } else {
          toast.error("Ongelma sähköpostin lähetyksessä")
        }
      })
      .catch(e => toast.error("Ongelma sähköpostin lähetyksessä"));
  }

  exportMd() {
    let content = (
      MD_CONFIG(this.props.config, this.props.week) +
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
      this.props.week
    ).replace(/\n/g, "\r\n");
    this.createBlob("txt", mjml);
  }

  render() {
    const tableOfContents = createMarkdownTOC(this.props.summary);
    const topValue = SUMMARY_TOP(
      this.props.week,
      tableOfContents,
      this.props.config
    );
    const bottomValue = SUMMARY_BOTTOM(this.props.config);
    const editorStyle = {
      boxShadow: "#999 0 0 12px",
      borderRadius: "4px"
    };

    return (
      <React.Fragment>
        <Modal isOpen={this.state.showModal} toggle={() => this.toggleModal()}>
          <ModalHeader>Lataa tai lähetä viikkis</ModalHeader>
          <ModalBody>
              <h5>Lähetä viikkis sähköpostilla</h5>
              Vastaanottajan sähköposti:
              <Input
                  name="recipient"
                  type="email"
                  value={this.state.recipient}
                  onChange={e => this.setState({ recipient: e.target.value })}
              />
              Liitteet:
              <Input type="file" multiple name="file" onChange={e => this.setState({attachments:Array.from(e.target.files)})}/>
              <hr />
              Lähettäjän sähköposti:
              <Input
                  name="sender"
                  type="email"
                  value={this.state.sender}
                  onChange={e => this.setState({ sender: e.target.value })}
              />
              Lähettäjän salasana:
              <Input
                  name="email_password"
                  type="password"
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
              />
              <Button block className="mt-2" color="success" onClick={() => this.sendEmail()}>
                <i className="fa fa-envelope" /> Lähetä
              </Button>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button color="info" onClick={() => this.exportMd()}>
                <i className="fa fa-download" /> MD
              </Button>
              <Button color="primary" onClick={() => this.exportHtml()}>
                <i className="fa fa-download" /> HTML
              </Button>
              <Button color="warning" onClick={() => this.exportMjml()}>
                <i className="fa fa-download" /> MJML
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Modal>

        {this.props.isAdmin && <Button color="success" block onClick={() => this.toggleModal()}>
          Lataa tai lähetä viikkis
        </Button>}

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
