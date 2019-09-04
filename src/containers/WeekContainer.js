import moment from "moment";
import React, { Component } from "react";
import { toast } from "react-toastify";
import WeekList from "./WeekList";
import { Button } from "reactstrap";
import { connector, actions } from "../actions";

const connect = connector(
  state => ({
    year: state.config.year,
    week: state.config.week,
    now: state.config.now,
    socket: state.socket
  }),
  {
    getWeekArticles: actions.app.getWeekArticles,
    setPrevWeek: actions.config.setPrevWeek,
    setNextWeek: actions.config.setNextWeek,
    getConfig: actions.config.getConfig
  }
);

class WeekContainer extends Component {
  state = {
    failed: true,
    loaded: false
  };
  componentDidMount() {
    this.init();
    this.props.socket.emit("leave room");
  }

  async init() {
    try {
      await this.props.getWeekArticles({
        year: this.props.year,
        week: this.props.week
      });
      this.props.getConfig();
      this.setState({ failed: false, loaded: true });
    } catch (e) {
      toast.error("Ei internet yhteyttä palvelimeen");
      this.setState({ failed: true, loaded: true });
    }
  }

  render() {
    const { year, week, now } = this.props;
    const startOfWeek = moment(now).startOf("isoWeek");
    const endOfWeek = moment(now).endOf("isoWeek");
    const { loaded, failed } = this.state;
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <Button
            onClick={() => this.props.setPrevWeek()}
            style={styles.left}
            color="link"
          >
            <h1>
              <i className="fa fa-angle-left"></i>
            </h1>
          </Button>
          <div style={styles.center}>
            <h1>Viikko {week}</h1>
            <h3>
              {startOfWeek.format("DD.MM.YYYY")} -{" "}
              {endOfWeek.format("DD.MM.YYYY")}
            </h3>
          </div>
          <Button
            onClick={() => this.props.setNextWeek()}
            style={styles.right}
            color="link"
          >
            <h1>
              <i className="fa fa-angle-right"></i>
            </h1>
          </Button>
        </div>
        {loaded && !failed && <WeekList />}
      </div>
    );
  }
}

export default connect(WeekContainer);

const styles = {
  wrapper: {
    backgroundColor: "white",
    boxShadow: "#999 0 0 12px",
    borderRadius: "4px"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    display: "flex"
  },
  left: {
    flex: 0.1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: 0
  },
  center: {
    flex: 0.8,
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  right: {
    flex: 0.1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  }
};
