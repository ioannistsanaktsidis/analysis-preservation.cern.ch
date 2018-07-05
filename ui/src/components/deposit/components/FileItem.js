import React from 'react';
import {connect} from 'react-redux';

import {
  Box,
  Label,
  Menu,
  Anchor,
  ListItem
} from 'grommet';

import Status from 'grommet/components/icons/Status';

import ArchiveIcon from 'grommet/components/icons/base/Archive';
import DocumentConfigIcon from 'grommet/components/icons/base/DocumentConfig';
import PieChartIcon from 'grommet/components/icons/base/PieChart';
import BookIcon from 'grommet/components/icons/base/Book';
import NoteIcon from 'grommet/components/icons/base/Note';
import MoreIcon from 'grommet/components/icons/base/More';
import DownloadIcon from 'grommet/components/icons/base/Download';

import prettyBytes from 'pretty-bytes';

const uploadStatusMap = {
  "uploading": "disabled",
  "error": "critical",
  "done": "ok"
};

class FileItem extends React.Component {
  constructor(props) {
    super(props);
  }

  _getIcon(type) {
    const catToIcon = {
      default: <ArchiveIcon type="status" size="xsmall"/>,
      archive: <ArchiveIcon type="status" size="xsmall"/>,
      configuration: <DocumentConfigIcon type="status" size="xsmall"/>,
      dataset: <PieChartIcon type="status" size="xsmall"/>,
      publication: <BookIcon type="status" size="xsmall"/>,
      plot: <PieChartIcon type="status" size="xsmall"/>,
    };

    return catToIcon[type] ? catToIcon[type] : <NoteIcon type="status" size="xsmall" />;
  }

  render() {
    let {file} = this.props;
    let bucket_url = this.props.links ? this.props.links.get('bucket'):null;
    return (
      <ListItem
        key={file.key}
        onClick={this.props.action ? this.props.action(file.key) : null}
        justify="between"
        pad="none"
        flex={true}>
        <Box direction="row" flex={true} justify="between" wrap={false}>
          <Box  direction="row" flex={true}>
            <Box justify="center" margin={{horizontal: "small"}}>
              {this._getIcon(file.type)}
            </Box>
            <Box justify="center" flex={true} width="100" size="small" margin={{right: "small"}}>
              <Label justify="center" margin="none" size="small" truncate={true}>{file.key}<strong> ({file.size ? prettyBytes(parseInt(file.size)) : "No size"})</strong></Label>
            </Box>
            {
              file.status ?
              <Box justify="center" margin={{right: "small"}}>
                <Status size="small" value={uploadStatusMap[file.status]} />
              </Box> : null
            }
            <Box justify="end">
              <Anchor icon={<DownloadIcon />}
                  href={`${bucket_url}/${file.key}`} />
            </Box>
          </Box>
        </Box>
      </ListItem>
    );
  }
}

function mapStateToProps(state) {
  return {
    links: state.drafts.getIn(['current_item','links'])
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileItem);

