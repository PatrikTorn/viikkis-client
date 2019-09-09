import React from "react";
import { connector, actions } from "../actions";
import { Col, Input, Row, Button } from "reactstrap";
import { toast } from "react-toastify";

const connect = connector(
  state => ({
    config: state.config.config
  }),
  {
    updateConfig: actions.config.updateConfig
  }
);

class ConfigSettings extends React.Component {
  state = this.props.config;

  changeConfig(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  updateConfig() {
    this.props.updateConfig(this.state)
      .then(() => toast.success("Asetukset päivitetty"))
      .catch(e => toast.error("Virhe asetuksien päivityksessä"));
  }

  render() {
    return (
      <div style={styles.box}>
        <h1>Sihteerin asetukset</h1>
        <Row>
          {Object.entries(this.state)
            .filter(i => i[0] !== "id")
            .map(([key, value]) => (
              <Col xs="6" sm="4">
                {key}:
                <Input
                  type="text"
                  name={key}
                  placeholder={key}
                  value={value}
                  onChange={e => this.changeConfig(e)}
                />
              </Col>
            ))}
        </Row>
        <Button
          color="success"
          size="lg"
          block
          onClick={() => this.updateConfig()}
        >
          Tallenna asetukset
        </Button>
      </div>
    );
  }
}

export default connect(ConfigSettings);

const styles = {
  box: {
    position: "relative",
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 3,
    boxShadow: "#999 0 0 7px",
    border: "1px solid darkgray",
    padding: `60px 10px 10px 10px`
  }
};
