import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AnnotatedMeter from "grommet-addons/components/AnnotatedMeter";
import MoreIcon from "grommet/components/icons/base/More";

import {
  Box,
  Heading,
  Header,
  Tiles,
  Tile,
  List,
  ListItem,
  Anchor
} from "grommet";

import { withRouter } from "react-router-dom";
import { fetchDashboard } from "../../actions/dashboard";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

function DashboardList(props) {
  return (
    <Box>
      <Heading tag="h5" uppercase={true} align="center" justify="center">
        {props.header}
      </Heading>
      <List>
        {props.items.length > 0 ? (
          props.items.map((item, index) => {
            let metadata = item.metadata;
            let id = item.id;

            return (
              <ListItem justify="center" key={`${item.id}-${index}`}>
                <Anchor
                  path={`${props.url}/${id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  {metadata.general_title || id}
                </Anchor>
              </ListItem>
            );
          })
        ) : (
          <Box textAlign="center">
            <ListPlaceholder
              unfilteredTotal={0}
              pad="large"
              emptyMessage={props.emptyMessage || "No analysis."}
            />
          </Box>
        )}
      </List>
      {props.items.length > 0 ? (
        <Box align="center" margin={{ horizontal: "medium" }}>
          <Anchor
            path="/search"
            style={{ textDecoration: "none", color: "black" }}
          >
            <MoreIcon />
          </Anchor>
        </Box>
      ) : null}
    </Box>
  );
}

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchDashboard();
  }

  render() {
    return (
      <Box full={true} colorIndex="light-2">
        <Header
          size="small"
          colorIndex="neutral-1-a"
          pad="none"
          wrap={true}
          justify="center"
        />
        <Tiles full={true}>
          <Tile pad="large" basis="1/3">
            <DashboardList
              items={this.props.results.published_by_collab}
              header="published in collaboration"
              url="/published"
              emptyMessage="All analyses published on CAP by members of your collaboration."
            />
          </Tile>
          <Tile pad="large" basis="1/3">
            <DashboardList
              items={this.props.results.shared_with_user}
              header="shared with you"
              url="/drafts"
              emptyMessage="Draft analyses that your collaborators have given you read/write access to."
            />
          </Tile>
          <Tile pad="large" basis="1/3">
            <DashboardList
              items={this.props.results.published_by_collab}
              header="latest from your group"
              url="/published"
              emptyMessage="All analyses published on CAP by members of your working group."
            />
          </Tile>
          <Tile pad="large" basis="1/3">
            <DashboardList
              items={this.props.results.user_drafts}
              header="your drafts"
              url="/drafts"
              emptyMessage="Your draft analyses. By default, only you can access them, but it is possible to give read/write access to other collaborators."
            />
          </Tile>
          <Tile pad="medium" basis="1/3">
            <AnnotatedMeter
              legend={true}
              type="circle"
              defaultMessage="Your"
              max={this.props.results.user_count}
              series={[
                {
                  label: "Your Drafts",
                  value: this.props.results.user_drafts_count,
                  colorIndex: "graph-1"
                },
                {
                  label: "Published",
                  value: this.props.results.user_published_count,
                  colorIndex: "graph-2"
                }
              ]}
            />
          </Tile>
          <Tile pad="large" basis="1/3">
            <DashboardList
              items={this.props.results.user_published}
              header="published by you"
              url="/published"
              emptyMessage="Your published analyses. Once published on CAP, all members of your collaboration will have read access."
            />
          </Tile>
        </Tiles>
      </Box>
    );
  }
}

Dashboard.propTypes = {
  fetchDashboard: PropTypes.func,
  currentUser: PropTypes.object,
  results: PropTypes.object,
  history: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUser: state.auth.getIn(["currentUser"]),
    results: state.dashboard.getIn(["results"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDashboard: () => dispatch(fetchDashboard())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
